import { catalogValue, normalize, type Product } from "@/features/feeding/engine/sandbox/catalog";
import { ruleReference, type RuleReference } from "./issues";
import reviewedCells from "./product-policy-evidence.json";

export type PolicyEvidence={sheet:"BASE SIN MODIF";cell:string;value:string;source?:string};
export type ProductPolicy={
  id:string;revision:number;row:number;name:string;
  effect:"exclude-brachycephalic"|"review"|"confirmed-description";
  message:string;evidence:PolicyEvidence[];
};
const evidence=(row:number,column:string,value:string):PolicyEvidence=>({sheet:"BASE SIN MODIF",cell:`${column}${row}`,value});
export const productPolicies:readonly ProductPolicy[]=[
  {id:"bones-brachycephaly",revision:1,row:65,name:"Huesos",effect:"exclude-brachycephalic",message:"No recomendado para perros braquicéfalos.",evidence:[evidence(65,"U","No aptos para braquiocefálicos.")]},
  ...[
    [57,"Higado de cordero"],[58,"Higado de Caballo"],[59,"Higado de res"],[63,"Higado de ternero"],
  ].map(([row,name])=>({id:`raw-liver-${row}`,revision:1,row:Number(row),name:String(name),effect:"review" as const,message:"Requiere asesoría individual para balancear la dieta antes de incluir este hígado.",evidence:[evidence(Number(row),"O","Revisar con veterinario nutricionista de su mascota o con la asesora nutricional, según la necesidad específica para balancear la dieta actual de su mascota.")]})),
  {id:"potassium-review",revision:1,row:98,name:"Potasio",effect:"review",message:"Confirmar con asesoría profesional el uso y la pauta de potasio; la fuente contiene alternativas de administración.",evidence:[evidence(98,"O","Pauta por kilo de mezcla cocinada o por peso de la mascota."),evidence(98,"U","Recomendación veterinaria según necesidades individuales.")]},
  {id:"cheek-presentation",revision:1,row:73,name:"Mejilla deshidratada",effect:"review",message:"Confirmar presentación y supervisión: la fuente indica «f» y contiene instrucciones distintas de supervisión.",evidence:[evidence(73,"D","f"),evidence(73,"Q","primera vez"),evidence(73,"U","Ofrecer siempre bajo supervisión.")]},
  {id:"ear-identity",revision:2,row:85,name:"Oreja de res sin pelo deshidratada",effect:"confirmed-description",message:"Identidad sin pelo y descripción confirmadas por el usuario.",evidence:[evidence(85,"A","Oreja de res sin pelo deshidratada")]},
  {id:"horse-lung-identity",revision:2,row:140,name:"Pulmon deshidratado de caballo",effect:"confirmed-description",message:"Descripción de pulmón de caballo confirmada por el usuario.",evidence:[evidence(140,"A","Pulmon deshidratado de caballo")]},
  {id:"horse-trachea-identity",revision:2,row:142,name:"Traqueas de caballo deshidratadas",effect:"confirmed-description",message:"Descripción de tráquea de caballo confirmada por el usuario.",evidence:[evidence(142,"A","Traqueas de caballo deshidratadas")]},
  {id:"testicle-dose-conflict",revision:1,row:121,name:"Testiculo trozos crudos",effect:"review",message:"Confirmar cantidad: la fuente contiene dos pautas incompatibles para testículo en trozos.",evidence:[evidence(121,"O","100–150/200–300/400–600/700+ g y 20/40/80/120 g en la misma celda.")]},
];

export type PolicyMatch={policy:ProductPolicy;valid:boolean;rule:RuleReference};
// Match either half so a renamed or moved source cannot silently lose its restriction.
export function policiesFor(product:Product):PolicyMatch[] {
  return productPolicies.filter(policy=>policy.row === product.row || normalize(policy.name) === normalize(product.name)).map(policy=>{
    const cells=(reviewedCells as Record<string,Record<string,string>>)[policy.row];
    const valid=policy.row === product.row && normalize(policy.name) === normalize(product.name) && Object.entries(cells).every(([column,value])=>column === "V" && policy.effect === "confirmed-description" ? Boolean(product.descriptionCorrection && product.description === product.descriptionCorrection.approved && [product.descriptionCorrection.original,product.descriptionCorrection.approved].includes(catalogValue(product,20))):normalize(product.raw[column.charCodeAt(0)-65] ?? "") === normalize(value));
    return {policy:{...policy,evidence:Object.entries(cells).map(([column,value])=>column === "V" && policy.effect === "confirmed-description" && valid ? {...evidence(policy.row,column,product.description),source:product.descriptionCorrection!.source}:evidence(policy.row,column,value))},valid,rule:ruleReference(policy.effect === "exclude-brachycephalic" ? "CAT-007":"CAT-008")};
  });
}
export function cellEvidence(product:Product,column:"F"|"G"|"H"|"N"|"S"|"C"|"V"):PolicyEvidence {
  const indexes={F:4,G:5,H:6,N:12,S:17,C:0,V:20};
  return evidence(product.row,column,column === "C" ? product.complementType:catalogValue(product,indexes[column]));
}
