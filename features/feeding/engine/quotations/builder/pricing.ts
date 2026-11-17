export function roundMoney(value:number) {return Math.round(value*100)/100;}
/** Package comparisons are before discounts; benefits apply once to the household order. */
export function packagePrice(subtotal:number) {
  const gross=roundMoney(subtotal);
  return {subtotal:gross,discount:0,total:gross};
}
