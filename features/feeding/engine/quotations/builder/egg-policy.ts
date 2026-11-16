export const eggStorageWeeks = 5;
export const eggsPerBox = 10;
import type { QuotePeriod } from "../period";
export function eggBudgetWeeks(days:QuotePeriod):2|4 { return days === 14 ? 2 : 4; }
export function eggWeeklyOptions(weight:number):number[] {
  if(!Number.isFinite(weight) || weight < 1)return [];
  return weight <= 5 ? [2] : weight <= 10 ? [2,3,4] : weight <= 20 ? [5] : [6,7,8];
}
export type EggPlan={weekly:number[];weeklyTotal:number;requiredUnits:number;boxes:number;purchasedUnits:number;leftoverUnits:number;budgetWeeks:2|4};
/** Whole eggs within the catalog bands. Minimize boxes, then unused eggs. */
export function planEggs(options:readonly (readonly number[])[],weeks:2|4):EggPlan|null {
  if(!options.length || options.some(values=>!values.length))return null;
  let best:EggPlan|null=null;
  function visit(weekly:number[]) {
    if(weekly.length < options.length) {
      for(const value of options[weekly.length])visit([...weekly,value]);
      return;
    }
    const weeklyTotal=weekly.reduce((sum,value)=>sum+value,0);
    const requiredUnits=weeklyTotal*weeks;
    const boxes=Math.ceil(requiredUnits/eggsPerBox);
    const purchasedUnits=boxes*eggsPerBox;
    if(purchasedUnits > weeklyTotal*eggStorageWeeks)return;
    const plan={weekly,weeklyTotal,requiredUnits,boxes,purchasedUnits,leftoverUnits:purchasedUnits-requiredUnits,budgetWeeks:weeks};
    if(!best || plan.boxes < best.boxes || (plan.boxes === best.boxes && plan.leftoverUnits < best.leftoverUnits))best=plan;
  }
  visit([]);return best;
}
export function eggPeriodNote(weeks:2|4,days:QuotePeriod) {
  return weeks === 4 ? days === 30 ? "Huevos presupuestados para 4 semanas (28 días), aunque la cotización general sea de 30 días." : "Huevos presupuestados para 4 semanas (28 días)." : "Huevos presupuestados para 2 semanas (14 días).";
}
