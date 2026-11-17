import { roundMoney } from "./pricing";

export type CustomerDiscountOptions={firstPurchase:boolean;referred?:boolean};
export type DiscountBenefit={id:"referral"|"first-purchase"|"volume";rate:number;label:string;minExclusiveCRC?:number};
export type OrderDiscountDetails={policy:"best-benefit";base:"merchandise-before-discounts";eligible:DiscountBenefit[];applied:DiscountBenefit|null;rate:number;message:string};

/** Confirmed rates. Combination is a separate order-pricing decision. */
export function availableOrderDiscounts(subtotal:number,options:CustomerDiscountOptions):DiscountBenefit[] {
  if(!Number.isFinite(subtotal) || subtotal < 0)throw new Error("El subtotal de la orden debe ser un importe válido no negativo.");
  const cents=Math.round(subtotal*100);
  if(cents === 0)return [];
  const benefits:DiscountBenefit[]=[];
  if(options.referred)benefits.push({id:"referral",rate:.10,label:"Cliente referido por aliado o cliente"});
  else if(options.firstPurchase)benefits.push({id:"first-purchase",rate:.05,label:"Primera compra sin referencia"});
  const band=[{minExclusiveCRC:150000,rate:.07},{minExclusiveCRC:100000,rate:.05},{minExclusiveCRC:60000,rate:.03}].find(b=>cents > b.minExclusiveCRC*100);
  if(band)benefits.push({id:"volume",label:"Monto de la orden",...band});
  return benefits;
}

/** Pilot default: one highest benefit, including all selected packages and extras. */
export function priceOrder(subtotal:number,options:CustomerDiscountOptions) {
  const eligible=availableOrderDiscounts(subtotal,options);
  // Equal percentages keep the customer benefit, which is listed before volume.
  const applied=eligible.toSorted((a,b)=>b.rate-a.rate)[0] ?? null;
  const cents=Math.round(subtotal*100);
  const discountCents=Math.round(cents*(applied?.rate ?? 0));
  const discountDetails:OrderDiscountDetails={
    policy:"best-benefit",base:"merchandise-before-discounts",eligible,applied,rate:applied?.rate ?? 0,
    message:applied ? `${applied.label}: ${Math.round(applied.rate*100)}%. Se aplica únicamente el beneficio más favorable, sin acumular descuentos.`:"Sin descuento aplicable. Se aplica únicamente el beneficio más favorable, sin acumular descuentos.",
  };
  return {subtotal:cents/100,discount:discountCents/100,total:(cents-discountCents)/100,discountDetails};
}

/** Cent-exact proportional allocation for consistent pet and household summaries. */
export function allocateOrderDiscount(discount:number,selections:{id:string;subtotal:number}[]):number[] {
  const amounts=selections.map(s=>Math.round(s.subtotal*100));
  const base=amounts.reduce((sum,cents)=>sum+cents,0);
  if(!base || !discount)return amounts.map(()=>0);
  const discountCents=Math.round(discount*100);
  const shares=amounts.map((cents,index)=>{
    const numerator=BigInt(discountCents)*BigInt(cents);
    return {index,cents:Number(numerator/BigInt(base)),remainder:numerator%BigInt(base)};
  });
  let left=discountCents-shares.reduce((sum,s)=>sum+s.cents,0);
  const ordered=shares.toSorted((a,b)=>a.remainder === b.remainder ? selections[a.index].id.localeCompare(selections[b.index].id):a.remainder > b.remainder ? -1:1);
  for(const share of ordered)if(left-- > 0)share.cents++;
  return shares.map(s=>roundMoney(s.cents/100));
}
