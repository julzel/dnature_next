import { ruleReference, type RuleReference } from "./issues";
import { isKitProduct, kitRequirements } from "./supplement-kit";
import type { Candidate, FlowLine, FlowProfile } from "./profile";

export type SupplementKitDecision = {
  purpose:string;
  selectionReason:string;
  source:{catalogRow:number;cells:string[];instruction:"USER-BASIC-SUPPLEMENT-KIT";rule:RuleReference};
};

const purposes:Record<number,string> = {
  67:"Probiótico del kit: apoyo digestivo y microbiota intestinal.",
  72:"Apetito y palatabilidad; apoyo digestivo y acompañamiento durante la transición alimentaria.",
  95:"Cuidado de la piel y el pelaje.",
  74:"Apoyo articular y movilidad.",
  75:"Apoyo articular y movilidad.",
  15:"Hidratación y aporte de colágeno.",
  119:"Apoyo nutricional integral durante la etapa senior.",
};

/** Explanatory content only: eligibility, doses and purchasing remain separate policies. */
export function supplementKitDecision(candidate:Candidate,profile:FlowProfile):SupplementKitDecision|undefined {
  if(profile.species !== "dog")return undefined;
  const requirement=kitRequirements(profile).products.find(p=>isKitProduct(candidate.item.catalog,p.row));
  if(!requirement)return undefined;
  const row=requirement.row;
  const context=row === 67 ? "Kéfir es la primera opción de probiótico del kit según la preferencia comercial confirmada. Su aceptación y tolerancia pueden variar entre mascotas.":
    row === 119 ? "Senior Active sustituye el producto individual de mejillón según su edad y tamaño. Su fórmula también contiene mejillón según el catálogo; la sustitución no significa que sea libre de este ingrediente.":
    row === 74 || row === 75 ? `Se elige mejillón ${row === 75 ? "en polvo":"en cápsulas"} según su peso de ${profile.weight} kg.`:
    "Forma parte del kit básico de Funcional y Premium; su porción se calcula según el peso, no por el número de envases.";
  const goalMatch=(row === 67 && profile.goal === "digestion") || (row === 95 && profile.goal === "skin") || ([74,75,119].includes(row) && profile.goal === "joints");
  return {purpose:purposes[row],selectionReason:[context,...(goalMatch ? ["Coincide con el objetivo registrado para esta mascota."]:[]),...(candidate.breedAffinity ? ["El catálogo también registra afinidad con su raza; esto no aumenta la dosis."]:[])].join(" "),
    source:{catalogRow:row,cells:[`K${row}`,`V${row}`],instruction:"USER-BASIC-SUPPLEMENT-KIT",rule:ruleReference("SUP-002")}};
}

export function supplementSelectionSummaries(lines:readonly FlowLine[]) {
  return [...new Map(lines.filter(line=>line.kitDecision).map(line=>[line.item.catalog.id,{id:line.item.catalog.id,name:line.item.catalog.name,decision:line.kitDecision!}])).values()];
}
