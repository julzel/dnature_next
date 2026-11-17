import type { DailyPortionOverride } from "./daily-portion";
import type { NaturalCoverage, NaturalCoveragePercent } from "./natural-coverage";
import type { FeedingMode } from "./feeding-mode";
import type { VarietyLevel, MixRotation, ComplementRotation } from "./variety";
import type { QuotePeriod } from "../period";
import { z } from "zod";
import type { CuratedItem } from "../nutrition";
import type { QuoteLine } from "./purchasing";
import { behaviorSchema } from "../behavior";
import type { SnackAssessment, SnackDecision } from "./snacks";
import type { DoseAssessment } from "./dosing";
import type { EggAllocation } from "./family-eggs";
import type { SupplementMode } from "./supplement-purchasing";
import type { RationSplit } from "./ration";
import type { SupplementKitDecision } from "./supplement-context";
import type { SnackKitDetails } from "./snack-kit";
import type { MixStoragePlan } from "./mix-storage";
import type { MixAllocation } from "./family-mixes";
import type { ProductAllocation } from "./family-products";

export const flowProfileSchema = z.object({
  id:z.string().min(1), name:z.string().trim().min(1).max(60), species:z.enum(["dog","cat"]),
  breed:z.string().trim().max(100).default("unknown"),
  brachycephaly:z.enum(["yes","no","unknown"]).optional(),
  behavior:behaviorSchema.optional(),
  health:z.enum(["healthy","condition"]), lifeStage:z.enum(["adult","growing"]).optional(),
  age:z.number().finite().min(0).max(30).optional(), weight:z.number().finite().min(.1).max(100).optional(),
  neutered:z.boolean(), body:z.enum(["thin","ideal","overweight"]), activity:z.enum(["calm","normal","active"]),
  goal:z.enum(["wellness","digestion","skin","joints","energy","weight"]),
  allergies:z.array(z.enum(["pollo","res","pescado","cordero","caballo","huevo","lacteos"])).max(7),
}).superRefine((pet,ctx) => {
  if (pet.health === "condition") return;
  if (!pet.lifeStage) ctx.addIssue({code:"custom",message:"Indica si es cachorro o gatito.",path:["lifeStage"]});
  if (pet.lifeStage === "growing") return;
  for (const key of ["age","weight"] as const) if (pet[key] === undefined) ctx.addIssue({code:"custom",message:"Completa su edad y peso.",path:[key]});
});
export type FlowProfile = z.infer<typeof flowProfileSchema>;
export const roles = ["mix","complement","egg","supplement","probiotic","snack"] as const;
export type Role = typeof roles[number];
export const roleLabels: Record<Role,string> = {mix:"Mezcla completa",complement:"Complementos de fórmula",egg:"Huevo",supplement:"Suplementos",probiotic:"Probióticos",snack:"Snacks"};
export const packageDefinitions = [
  {id:"base",number:1,name:"Base",roles:["mix","egg"]},
  {id:"functional",number:2,name:"Funcional",roles:["mix","egg","supplement","probiotic","snack"]},
  {id:"chewing",number:3,name:"Masticación",roles:["mix","complement","egg"]},
  {id:"premium",number:4,name:"Premium",roles:["mix","complement","supplement","probiotic","snack","egg"]},
] as const satisfies readonly {id:string;number:number;name:string;roles:readonly Role[]}[];
export type PackageId = typeof packageDefinitions[number]["id"] | "manual";
export type FlowOptions = {dailyPortionOverride?:DailyPortionOverride;naturalCoveragePercent?:NaturalCoveragePercent;feedingMode?:FeedingMode;healthPolicy?:"advisory";days:QuotePeriod;complementPercent:number;firstPurchase:boolean;referred?:boolean;supplementMode?:SupplementMode;selected:Partial<Record<Role,string>>;varietyLevel?:VarietyLevel;complementVarietyLevel?:VarietyLevel};
export type Candidate = {item:CuratedItem;pending:string[];breedAffinity:boolean;snackAssessment?:SnackAssessment};
export type FlowLine = QuoteLine & {component:Role;pending:string[];breedAffinity:boolean;snackDecision?:SnackDecision;dose?:DoseAssessment;kitDecision?:SupplementKitDecision};
export type FlowPackage = {naturalCoverage?:NaturalCoverage;feedingMode?:FeedingMode;manual?:true;id:PackageId;name:string;number:number;roles:readonly Role[];lines:FlowLine[];eggAllocation?:EggAllocation;mixStorage?:MixStoragePlan[];mixAllocations?:MixAllocation[];productAllocations?:ProductAllocation[];snackKit?:SnackKitDetails;missing:string[];pending:string[];stockIssues:string[];mixDailyGrams:number;complementDailyGrams:number;subtotal:number;discount:number;total:number;ready:boolean;mixRotation:MixRotation;complementRotation:ComplementRotation;complementVarietyWarning:string|null;varietyWarning:string|null;formulaNote?:string;portionPlan?:RationSplit};
