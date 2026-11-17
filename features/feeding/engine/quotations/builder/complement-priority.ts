import type { Product } from "@/features/feeding/engine/sandbox/catalog";
import { complementPortionRule } from "../complement-portions";

type ProductIdentity=Pick<Product,"row"|"name">;

/** Eligibility remains a separate decision. Above 200g, prefer trout, wings,
 * then one large-portion meat (horse first). After one meat is chosen, other
 * meats compete normally for any remaining rotation slots. */
export function complementPriority(product:ProductIdentity,dailyGrams:number,chosen:readonly ProductIdentity[]=[]):number {
  if(!Number.isFinite(dailyGrams) || dailyGrams <= 200)return 0;
  const rule=complementPortionRule(product);
  if(rule?.row === 135)return 0;
  if(rule?.row === 3)return 1;
  const hasLargeMeat=chosen.some(p=>complementPortionRule(p)?.minimumGrams === 200);
  if(!hasLargeMeat && rule?.minimumGrams === 200)return rule.row === 11 ? 2:3;
  return 4;
}
