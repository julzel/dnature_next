import { z } from "zod";
import { additionalOffers, buildExtras, extraSelectionsSchema } from "./extras";
import { avoidsRecordedAllergens } from "./allergens";
import { formulaKind, isFormulaComplement } from "../formula";
import { isCompleteRecipe, type CuratedItem } from "../nutrition";
import { issue } from "./issues";
import { packagePrice } from "./pricing";
import { stockIssuesFor } from "./stock";
import { offerGrams } from "./purchasing";
import type { PetResult, PackageResult } from "./model";
import type { ProductAssessment } from "./eligibility";
import type { Role } from "./profile";

export const manualPackageSchema=z.object({name:z.string().max(80).default("Paquete personalizado"),items:extraSelectionsSchema.default([])});
export type ManualPackage = z.infer<typeof manualPackageSchema>;

/** Prices, eligibility and stock come from the current catalog, never the draft. */
export function buildManualPackage(pet: PetResult, items: CuratedItem[], configuration: ManualPackage | undefined, assessments: ProductAssessment[]): PetResult {
  const profile=pet.profile!;
  const config=manualPackageSchema.parse(configuration ?? {});
  const offers=additionalOffers(items,profile,assessments).filter(offer=>avoidsRecordedAllergens(offer.item,profile));
  const result=buildExtras(config.items,offers,pet.id,assessments);
  const lines=result.lines.map(line=>{
    const component:Role=isCompleteRecipe(line.item) ? "mix":isFormulaComplement(line.item.catalog) ? "complement":formulaKind(line.item.catalog)==="egg" ? "egg":line.item.catalog.category==="supplement" ? "supplement":"snack";
    return {...line,component,grams:offerGrams(line.item,line.variant),role:"Paquete manual",reason:"Producto y cantidad definidos por el equipo para esta mascota.",pending:[],breedAffinity:false};
  });
  const issues=[...result.issues.map(entry=>({...entry,message:entry.message.replace(/^Adicional /,"Producto del paquete ")})),...stockIssuesFor(lines).map(entry=>({...entry,petId:pet.id,packageId:"manual"}))];
  if(!config.items.length)issues.push(issue("MISSING_COMPONENT","PKG-008","Agrega al menos un producto al paquete personalizado.",{petId:pet.id,packageId:"manual"}));
  const pack:PackageResult={
    id:"manual",name:config.name.trim() || "Paquete personalizado",manual:true,number:0,roles:[...new Set(lines.map(line=>line.component))],lines,
    ...packagePrice(result.subtotal),mixDailyGrams:0,complementDailyGrams:0,
    missing:[],pending:issues.filter(entry=>entry.severity==="blocking").map(entry=>entry.message),
    stockIssues:issues.filter(entry=>entry.code==="INSUFFICIENT_STOCK").map(entry=>entry.message),
    issues,warnings:issues.filter(entry=>entry.severity==="warning").map(entry=>entry.message),ready:!issues.some(entry=>entry.severity==="blocking"),
    mixRotation:{level:"none",requestedFlavors:0,flavors:[],note:"Productos y unidades definidos por el equipo.",averagePricePerKg:null},
    complementRotation:{level:"none",requestedProducts:0,products:[],note:""},varietyWarning:null,complementVarietyWarning:null,
  };
  const warning=issue("CR_REFERRAL","PKG-008","Paquete personalizado: productos y cantidades definidos manualmente por el equipo.",{petId:pet.id,severity:"warning"});
  return {...pet,choice:"manual",offers,productAssessments:assessments,issues:[...pet.issues,warning],warnings:[...pet.warnings,warning.message],
    status:"ready",result:{referral:null,naturalCoverage:null,rawDailyGrams:null,dailyGrams:null,split:null,packages:[pack],candidates:{mix:[],complement:[],egg:[],supplement:[],probiotic:[],snack:[]},notes:[],warnings:[warning.message]}};
}
