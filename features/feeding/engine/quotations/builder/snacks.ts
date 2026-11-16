import { catalogValue, normalize, type Product } from "@/features/feeding/engine/sandbox/catalog";
import { behaviorLabels, type PetBehavior } from "../behavior";
import { formulaKind } from "../formula";
import type { SnackRole } from "./snack-policy";

type EvidenceField="Comportamiento ideal"|"Objetivos"|"Descripción Comercial";
export type SnackEvidence={field:EvidenceField;value:string};
export type SnackAssessment={behavior:PetBehavior;match:"behavior"|"training-goal"|"training-description"|"general";priority:number;reason:string;evidence:SnackEvidence[]};
export type SnackDecision=SnackAssessment & {selection:"automatic"|"manual";fallback:boolean;usageNotes:string[];kitRole?:SnackRole};

// Explicit aliases only. Notes and commercial health claims never become policies.
const behaviorAliases:Record<string,PetBehavior>={ansioso:"anxious",destructivo:"destructive","alta energia":"energetic",tranquilo:"calm","en entrenamiento":"training",entrenamiento:"training"};
function signals(product:Product) {
  const value=catalogValue(product,11).trim();
  const tags=value.split(/[,;/]/).map(tag=>behaviorAliases[normalize(tag)]).filter((tag):tag is PetBehavior=>Boolean(tag));
  const trainingGoal=/\bentrenamiento\b/.test(normalize(product.goal));
  const trainingSentence=product.description.split(/(?<=[.!?])\s+|\n+/).find(sentence=>/\bentrenamiento\b/.test(normalize(sentence)))?.trim();
  const legacy=/ligero|premio|recompensa|palatabilidad/.test(normalize(product.goal)) && /deshidratad|galleta/.test(normalize(product.name));
  return {value,tags,trainingGoal,trainingSentence,legacy};
}

// This classifies the snack role only. Shared eligibility and saleable offers run separately.
export function assessSnack(product:Product,behavior:PetBehavior="unknown"):SnackAssessment|null {
  if(product.category !== "chew" || /topping/.test(normalize(product.name)) || formulaKind(product) !== "unclassified")return null;
  const source=signals(product);
  if(!source.legacy && !source.tags.length && !source.trainingGoal && !source.trainingSentence)return null;
  if(source.tags.includes(behavior))return {behavior,match:"behavior",priority:3,reason:`El catálogo indica afinidad con comportamiento ${behaviorLabels[behavior].toLowerCase()}.`,evidence:[{field:"Comportamiento ideal",value:source.value}]};
  if(behavior === "training" && source.trainingGoal)return {behavior,match:"training-goal",priority:2,reason:"El objetivo del catálogo incluye entrenamiento.",evidence:[{field:"Objetivos",value:product.goal}]};
  if(behavior === "training" && source.trainingSentence)return {behavior,match:"training-description",priority:1,reason:"La descripción del catálogo menciona su uso como premio de entrenamiento.",evidence:[{field:"Descripción Comercial",value:source.trainingSentence}]};
  // Preserve the previous general preference when no relevant match exists.
  return {behavior,match:"general",priority:source.legacy ? 0:-1,reason:"Snack general compatible con los filtros del piloto; sin afinidad específica de comportamiento.",evidence:source.value ? [{field:"Comportamiento ideal",value:source.value}]:[]};
}

export function snackDecision(product:Product,assessment:SnackAssessment,manual:boolean):SnackDecision {
  const fallback=!manual && ["anxious","destructive","energetic","training"].includes(assessment.behavior) && assessment.match === "general";
  const reason=manual ? `Elegido manualmente por CR. ${assessment.reason}`:fallback ? `No hay un snack disponible con afinidad específica para ${behaviorLabels[assessment.behavior].toLowerCase()}; se usa una alternativa general compatible.`:assessment.reason;
  const usageNotes=[product.chewing && normalize(product.chewing) !== "n/a" ? `Masticación: ${product.chewing}.`:"",product.supervision ? `Supervisión indicada: ${product.supervision}.`:"",catalogValue(product,12) ? `No recomendado para: ${catalogValue(product,12)}.`:""].filter(Boolean);
  return {...assessment,reason,selection:manual ? "manual":"automatic",fallback,usageNotes};
}
