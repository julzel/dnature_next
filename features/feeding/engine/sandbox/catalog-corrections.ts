import corrections from "./data/catalog-corrections.json";

export type CatalogCorrection = {
  id:string;revision:number;row:number;name:string;cell:string;source:string;
  original:string;approved:string;
};

// Confirmed customer corrections are separate from the unchanged workbook snapshot.
// Accept the old source or the corrected source on a future import; hold other edits.
export function correctedDescription(row:number,name:string,value:string) {
  const correction:CatalogCorrection|undefined=corrections.find(c=>c.row === row || c.name === name);
  if(!correction)return {description:value,correction:undefined,review:null};
  const valid=correction.row === row && correction.name === name && [correction.original,correction.approved].includes(value);
  return {
    description:valid ? correction.approved:value,
    correction:valid ? correction:undefined,
    review:valid ? null:"La identidad o descripción cambió respecto de la corrección confirmada; revisar antes de utilizar el producto.",
  };
}
