import { z } from "zod";
import { flowProfileSchema } from "./profile";
import { gateProfile } from "./packages";
export const allergyStatusSchema=z.enum(["yes","no","unknown"]);
export const builderProfileSchema=z.object({...flowProfileSchema.shape,allergyStatus:allergyStatusSchema,allergyNotes:z.string().max(1000).default("")}).superRefine((pet,ctx)=>{
  if(pet.health === "condition" || pet.lifeStage === "growing" || pet.allergyStatus === "yes" || pet.allergies.length) return;
  if(!pet.lifeStage)ctx.addIssue({code:"custom",message:"Indica si es cachorro o gatito.",path:["lifeStage"]});
  for(const key of ["age","weight"] as const)if(pet[key] === undefined)ctx.addIssue({code:"custom",message:"Completa su edad y peso.",path:[key]});
});
export type BuilderProfile=z.infer<typeof builderProfileSchema>;
export const quoteProfileSchema=builderProfileSchema.superRefine((pet,ctx)=>{
  if(!pet.lifeStage)ctx.addIssue({code:"custom",message:"Confirma su etapa de vida.",path:["lifeStage"]});
  for(const key of ["age","weight"] as const)if(pet[key]===undefined)ctx.addIssue({code:"custom",message:"Completa su edad y peso para calcular cantidades.",path:[key]});
});
export function referralFor(profile:BuilderProfile) {
  return gateProfile(profile) ?? (profile.allergyStatus === "yes" || profile.allergies.length ? "Tiene una alergia o restricción registrada. Habla directamente con el equipo de Atención al Cliente para revisar este caso antes de cotizar.":null);
}
export const allergyWarning="El cliente no sabe si su mascota tiene alergias. Confirmar con Atención al Cliente; esta propuesta no certifica compatibilidad con alérgenos.";
export const dosingWarning="Estimación del piloto: los componentes sin pauta y cobertura calculadas se cotizan como un envase. Uso, frecuencia y dosis por confirmar; no se garantiza que ese envase cubra el período.";
