import type { AvifyProduct, AvifyVariant } from "../types/avify";
import type { ProductOption } from "../types/product-option";

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

/** The same purchasable presentations for catalog, detail, and server validation. */
export function productOptions(product: AvifyProduct): ProductOption[] {
  if (!product.children.length) {
    const offer = productOffer(product);
    return [{ sku: product.sku, name: "Presentación única", price: offer.price, inStock: offer.inStock, quantityAvailable: product.qty }];
  }
  return product.children.filter((variant) => variant.status === "active").map((variant) => {
    const offer = productOffer({ ...product, children: [variant] });
    return { sku: variant.sku, name: variant.name, price: offer.price, inStock: offer.inStock, quantityAvailable: variant.qty };
  });
}
