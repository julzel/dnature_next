import { inventory } from "@/features/feeding/engine/catalog/avify/model";
import type { DoseAssessment } from "./dosing";
import type { PetResult, PackageResult } from "./model";
import type { FlowLine } from "./profile";
import { offerGrams, optimizePacks, saleableOffers, type QuoteLine } from "./purchasing";
import { offerAmount } from "./supplement-purchasing";
import { packagePrice } from "./pricing";

export type ProductAllocation = {
  familyId: string; petId: string; petName: string; name: string;
  required: number; unit: "g" | "ml" | "capsules"; subtotal: number;
  line: FlowLine; dose?: DoseAssessment;
};
export type FamilyProductPurchase = {
  id: string; name: string; unit: ProductAllocation["unit"];
  required: number; purchased: number; excess: number; subtotal: number;
  lines: FlowLine[]; allocations: ProductAllocation[];
};

/** Pool confirmed consumption before rounding to physical containers. Unmeasured
 * products and starter kits retain their explicit per-pet purchase quantities. */
export function allocateFamilyProducts(input: PetResult[], reservedLines: QuoteLine[] = []) {
  type Member = { pet: PetResult; pack: PackageResult; lines: FlowLine[]; required: number; unit: ProductAllocation["unit"] };
  const groups = new Map<string, Member[]>();
  for (const pet of input) {
    const pack = pet.result?.packages.find(pack => pack.id === pet.choice);
    if (!pack || pack.manual) continue;
    const byProduct = new Map<string, FlowLine[]>();
    for (const line of pack.lines) {
      if (!["supplement", "probiotic", "complement"].includes(line.component)) continue;
      byProduct.set(line.item.catalog.id, [...(byProduct.get(line.item.catalog.id) ?? []), line]);
    }
    for (const [id, lines] of byProduct) {
      const line = lines[0], dose = line.dose;
      const complement = line.component === "complement" ? pack.complementRotation.products.find(product => product.catalogId === id) : undefined;
      const required = complement?.targetGrams ?? (dose?.status === "calculated" && dose.purchaseMode === "period" ? dose.measure?.required ?? dose.requiredGrams : null);
      if (required == null || required <= 0) continue;
      const unit = dose?.measure?.unit ?? "g";
      const key = JSON.stringify([id, line.component, unit]);
      groups.set(key, [...(groups.get(key) ?? []), { pet, pack, lines, required, unit }]);
    }
  }
  const sharedGroups = [...groups].filter(([, members]) => members.length > 1);
  const pooledLines = new Set(sharedGroups.flatMap(([, members]) => members.flatMap(member => member.lines)));
  const reserved = new Map<string, number>();
  const reserve = (lines: QuoteLine[]) => {
    for (const line of lines) if (line.variant.sku) reserved.set(line.variant.sku, (reserved.get(line.variant.sku) ?? 0) + line.quantity);
  };
  reserve(reservedLines);
  for (const pet of input) {
    const pack = pet.result?.packages.find(pack => pack.id === pet.choice);
    if (pack) reserve([...pack.lines.filter(line => !pooledLines.has(line)), ...pet.extraResult.lines]);
  }
  const familyProducts: FamilyProductPurchase[] = [];
  for (const [id, unsorted] of sharedGroups) {
    const members = unsorted.toSorted((a, b) => a.pet.id.localeCompare(b.pet.id));
    const base = members[0].lines[0], item = base.item, unit = members[0].unit;
    const required = members.reduce((sum, member) => sum + member.required, 0);
    const offers = saleableOffers(item).flatMap(offer => {
      const amount = unit === "g" ? offerGrams(item, offer) : offerAmount(item, offer, unit);
      const available = inventory(offer).available;
      const stock = available === null ? offer : { ...offer, qty: Math.max(0, available - (reserved.get(offer.sku!) ?? 0)), reserved: 0 };
      return amount === null ? [] : [{ offer: stock, amount }];
    });
    const purchase = optimizePacks(offers, required);
    const oldCost = members.reduce((sum, member) => sum + member.lines.reduce((cost, line) => cost + line.quantity * line.unitPrice, 0), 0);
    const cost = purchase.reduce((sum, line) => sum + line.quantity * (line.offer.salePrice ?? line.offer.price ?? 0), 0);
    if (!purchase.length || cost > oldCost + .005) {
      reserve(members.flatMap(member => member.lines));
      continue;
    }
    const purchased = purchase.reduce((sum, line) => sum + line.quantity * line.amount, 0);
    const cents = Math.round(cost * 100);
    const shares = members.map(member => ({ member, raw: cents * member.required / required, cents: Math.floor(cents * member.required / required) }));
    let remaining = cents - shares.reduce((sum, share) => sum + share.cents, 0);
    for (const share of shares.toSorted((a, b) => (b.raw - b.cents) - (a.raw - a.cents) || a.member.pet.id.localeCompare(b.member.pet.id))) if (remaining-- > 0) share.cents++;
    const allocations = shares.map(({ member, cents }): ProductAllocation => {
      const dose = member.lines[0].dose;
      const message = `${member.required} ${unit} para ${member.pet.name} en el período. Envases compartidos en la compra familiar; el sobrante no aumenta la dosis.`;
      return { familyId: id, petId: member.pet.id, petName: member.pet.name, name: item.catalog.name, required: member.required, unit, subtotal: cents / 100,
        line: member.lines[0], ...(dose ? { dose: { ...dose, coverageConfirmed: true, purchasedGrams: undefined, excessGrams: undefined,
          ...(dose.measure ? { measure: { ...dose.measure, purchased: undefined, excess: undefined } } : {}), message: `${dose.source.quantity} ${message}` } } : {}) };
    });
    const lines = purchase.map(({ offer, quantity }): FlowLine => ({ ...base, variant: saleableOffers(item).find(original => original.sku === offer.sku)!, quantity,
      unitPrice: offer.salePrice ?? offer.price!, grams: offerGrams(item, offer), dose: undefined, reason: "Compra familiar según la necesidad total confirmada." }));
    reserve(lines);
    familyProducts.push({ id, name: item.catalog.name, unit, required, purchased, excess: purchased - required, subtotal: cents / 100, lines, allocations });
  }
  const pets = input.map(pet => {
    const allocations = familyProducts.flatMap(group => group.allocations).filter(allocation => allocation.petId === pet.id);
    if (!allocations.length || !pet.result) return pet;
    return { ...pet, result: { ...pet.result, packages: pet.result.packages.map(pack => {
      if (pack.id !== pet.choice) return pack;
      const ids = new Set(allocations.map(allocation => allocation.line.item.catalog.id));
      const lines = pack.lines.filter(line => !ids.has(line.item.catalog.id));
      const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
        + (pack.eggAllocation?.subtotal ?? 0) + (pack.mixAllocations ?? []).reduce((sum, allocation) => sum + allocation.subtotal, 0)
        + allocations.reduce((sum, allocation) => sum + allocation.subtotal, 0);
      const issues = pack.issues.filter(issue => !(issue.code === "INSUFFICIENT_STOCK" && allocations.some(allocation => allocation.line.variant.sku === issue.sku)));
      return { ...pack, lines, productAllocations: allocations, ...packagePrice(Math.round(subtotal * 100) / 100), issues,
        stockIssues: issues.filter(issue => issue.code === "INSUFFICIENT_STOCK").map(issue => issue.message),
        ready: !issues.some(issue => issue.severity === "blocking") };
    }) } };
  });
  return { pets, familyProducts };
}
