import type { AvifyProduct, AvifyVariant } from "../types/avify";

export type ProductOffer = { price: number | null; inStock: boolean; fromPrice: boolean };

function currentPrice(product: AvifyVariant): number | null {
  const value = product.salePrice !== null && product.salePrice > 0 ? product.salePrice : product.price;
  return value !== null && value > 0 ? value : null;
}

export function productOffer(product: AvifyProduct): ProductOffer {
  if (product.children.length === 0) {
    return { price: currentPrice(product), inStock: product.qty !== null && product.qty > 0, fromPrice: false };
  }

  const active = product.children.filter((variant) => variant.status === "active");
  const stocked = active.filter((variant) => variant.qty !== null && variant.qty > 0);
  const prices = (stocked.length ? stocked : active)
    .map((variant) => currentPrice(variant) ?? currentPrice(product))
    .filter((price): price is number => price !== null);
  return {
    price: prices.length ? Math.min(...prices) : null,
    inStock: stocked.length > 0,
    fromPrice: true,
  };
}
