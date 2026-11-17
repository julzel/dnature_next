import { isCookedBase, type FeedingMode } from "./feeding-mode";
import { isUnderweightComplement } from "../complement-portions";
import source from "@/features/feeding/engine/sandbox/data/product-catalog.json";
import { catalogValue, normalize, prepareProducts } from "@/features/feeding/engine/sandbox/catalog";
import { breedKey, breedRestriction, catalogBreedOptions, brachycephalicBreeds } from "../breeds";
import { formulaKind } from "../formula";
import { petSize, type CuratedItem, type PetProfile } from "../nutrition";
import { isKitProduct, musselFormAllowed, seniorKitStatus } from "./supplement-kit";
import { cellEvidence, policiesFor, type PolicyEvidence } from "./product-policies";
import { ruleReference, type RuleReference } from "./issues";
import { offerProblems, saleableOffers } from "./purchasing";
import { snackProductPolicy, snackSafetyNotes } from "./snack-policy";

export type EligibilityProfile=Pick<PetProfile,"species"> & Partial<Pick<PetProfile,"age"|"lifeStage"|"weight"|"breed"|"body">> & {brachycephaly?:"yes"|"no"|"unknown"};
export type EligibilityCode="SPECIES"|"STAGE"|"SIZE"|"EDITORIAL"|"CATALOG_REVIEW"|"HIGH_RISK"|"FORMULA_EXCLUDED"|"MUSSEL_FORM"|"POLICY_BINDING"|"PRODUCT_REVIEW"|"BRACHYCEPHALIC"|"BRACHYCEPHALY_UNKNOWN"|"BREED";
export type EligibilityReason={code:EligibilityCode;status:"excluded"|"review";message:string;rule:RuleReference;source?:PolicyEvidence[];policy?:{id:string;revision:number}};
export type ProductAssessment={item:CuratedItem;status:"allowed"|"excluded"|"review";reasons:EligibilityReason[];advisories:string[];needsBrachycephaly:boolean;canConfirmBrachycephaly:boolean;commercial:{selectable:boolean;offers:ReturnType<typeof saleableOffers>;problems:ReturnType<typeof offerProblems>}};
const recognizedBreeds=new Set(catalogBreedOptions(prepareProducts(source.records)).map(b=>b.value));
export function brachycephalyFor(pet:EligibilityProfile):"yes"|"no"|"unknown" {
  if(pet.species !== "dog")return "no";
  const breed=breedKey(pet.breed ?? "");
  if(brachycephalicBreeds.some(b=>b === breed) || pet.brachycephaly === "yes")return "yes";
  if(recognizedBreeds.has(breed))return "no";
  return pet.brachycephaly ?? "unknown";
}
export function assessProducts(items:CuratedItem[],pet:EligibilityProfile,feedingMode:FeedingMode="standard"):ProductAssessment[] {
  const species=pet.species === "dog" ? "perro":"gato";
  const stage=pet.lifeStage === "growing" || (pet.age !== undefined && pet.age < 1) ? "cachorro" : pet.age !== undefined ? pet.age >= 8 ? "senior":"adulto" : null;
  const size=pet.weight === undefined ? null:petSize({species:pet.species,weight:pet.weight});
  return items.map(item=>{
    const c=item.catalog;const reasons:EligibilityReason[]=[];
    const add=(code:EligibilityCode,status:EligibilityReason["status"],message:string,rule:RuleReference,source?:PolicyEvidence[],policy?:EligibilityReason["policy"])=>reasons.push({code,status,message,rule,...(source ? {source}:{}),...(policy ? {policy}:{})});
    if(!c.species.includes(species))add("SPECIES","excluded","No corresponde a esta especie.",ruleReference("CAT-003"),[cellEvidence(c,"F")]);
    if(isKitProduct(c,119) ? seniorKitStatus(pet) === "no" : stage && !c.stages.includes(stage))add("STAGE","excluded","No corresponde a esta etapa de vida.",ruleReference("CAT-003"),[cellEvidence(c,"G")]);
    if(size && !c.sizes.includes(size))add("SIZE","excluded","No corresponde al tamaño de esta mascota.",ruleReference("CAT-003"),[cellEvidence(c,"H")]);
    if(c.editorial !== "description")add("EDITORIAL","excluded","Producto retirado o pendiente de continuidad en el catálogo.",ruleReference("CAT-004"),[cellEvidence(c,"V")]);
    if(c.review)add("CATALOG_REVIEW","review",c.review,ruleReference("CAT-004"));
    const snackPolicy=snackProductPolicy(c);
    if(snackPolicy && !snackPolicy.valid)add("POLICY_BINDING","review","Cambió el nombre o la fila de un snack del kit confirmado; revisar su identidad.",ruleReference("SNK-005"));
    const supervised=pet.species === "dog" && snackPolicy?.supervised;
    if(normalize(c.risk).includes("alta") && !supervised)add("HIGH_RISK","excluded","El catálogo indica riesgo de atragantamiento alto.",ruleReference("CAT-004"),[cellEvidence(c,"S")]);
    if(formulaKind(c) === "excluded" && !isCookedBase(item,feedingMode,pet.species))add("FORMULA_EXCLUDED","excluded","El catálogo indica No considerar en el cotizador.",ruleReference("FOR-005"),[cellEvidence(c,"C")]);
    if(!musselFormAllowed(c,pet))add("MUSSEL_FORM","excluded","La forma de mejillón no corresponde al peso de esta mascota.",ruleReference("PRD-MUSSEL-001"));
    const matches=policiesFor(c);
    for(const {policy,valid,rule} of matches) {
      if(!valid)add("POLICY_BINDING","review","El nombre o la fila del producto cambió; revisar el vínculo de su política.",rule,policy.evidence,{id:policy.id,revision:policy.revision});
      // The underweight rule uses the calculated formula allowance, not either
      // conflicting standalone dose table. Source binding must still be valid.
      else if(policy.effect === "review" && !(policy.id === "testicle-dose-conflict" && isUnderweightComplement(c,pet)))add("PRODUCT_REVIEW","review",policy.message,rule,policy.evidence,{id:policy.id,revision:policy.revision});
    }
    const noteRestricted=matches.some(({policy,valid})=>valid && policy.effect === "exclude-brachycephalic");
    const fieldRestricted=/braquicefal/.test(normalize(catalogValue(c,12)));
    const brachyRestricted=pet.species === "dog" && (noteRestricted || fieldRestricted);
    const anatomy=brachycephalyFor(pet);
    if(brachyRestricted && anatomy !== "no") {
      const match=matches.find(({policy,valid})=>valid && policy.effect === "exclude-brachycephalic");
      add(anatomy === "yes" ? "BRACHYCEPHALIC":"BRACHYCEPHALY_UNKNOWN",anatomy === "yes" ? "excluded":"review",anatomy === "yes" ? "No recomendado para perros braquicéfalos.":"Confirma si es braquicéfalo antes de añadir este producto.",ruleReference("CAT-007"),[...(fieldRestricted ? [cellEvidence(c,"N")]:[]),...(match?.policy.evidence ?? [])],match ? {id:match.policy.id,revision:match.policy.revision}:undefined);
    }
    if(breedRestriction(c,pet) && !reasons.some(r=>r.code === "BRACHYCEPHALIC"))add("BREED","excluded","El catálogo no lo recomienda para esta raza.",ruleReference("CAT-005"),[cellEvidence(c,"N")]);
    const status=reasons.some(r=>r.status === "excluded") ? "excluded":reasons.length ? "review":"allowed";
    const offers=saleableOffers(item);
    const needsBrachycephaly=status === "review" && reasons.every(r=>r.code === "BRACHYCEPHALY_UNKNOWN");
    const canConfirmBrachycephaly=brachyRestricted && brachycephalyFor({...pet,brachycephaly:undefined}) === "unknown" && reasons.every(r=>r.code === "BRACHYCEPHALY_UNKNOWN" || r.code === "BRACHYCEPHALIC");
    return {item,status,reasons,advisories:pet.species === "dog" && snackPolicy?.valid ? snackSafetyNotes(c):[],needsBrachycephaly,canConfirmBrachycephaly,commercial:{selectable:status === "allowed" && offers.length > 0,offers,problems:offerProblems(item)}};
  });
}
export function eligibleItems(items:CuratedItem[],pet:EligibilityProfile) {
  return assessProducts(items,pet).filter(a=>a.status === "allowed").map(a=>a.item);
}
