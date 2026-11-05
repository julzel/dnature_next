import { brand, canonicalUrl } from "./config";

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function siteIdentity() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": `${canonicalUrl("/")}#organization`,
        name: brand.name, url: canonicalUrl("/"), slogan: brand.tagline,
        // No unverified address, credentials, awards, logo rights, or social profiles.
      },
      {
        "@type": "WebSite", "@id": `${canonicalUrl("/")}#website`,
        name: brand.name, url: canonicalUrl("/"), inLanguage: brand.locale,
        publisher: { "@id": `${canonicalUrl("/")}#organization` },
      },
    ],
  };
}

export type Breadcrumb = { name: string; path: string };
export function breadcrumbData(items: readonly Breadcrumb[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: canonicalUrl(item.path),
    })),
  };
}

// Only verified live SKU records may be passed here. The source Markdown catalog is not one.
export type ProductRecord = {
  status: "draft" | "verified" | "excluded";
  approvedBy: string;
  reviewedAt: string;
  name: string;
  sku: string;
  path: string;
  description: string;
  image: string;
  priceCRC: number;
  availability: "InStock" | "OutOfStock" | "PreOrder";
  species: string;
  nutritionalRole: string;
  ingredients: string;
  guaranteedAnalysis: string;
  usageAndStorage: string;
};

export function productData(product: ProductRecord) {
  if (product.status !== "verified") return null;
  const required = [product.approvedBy, product.reviewedAt, product.name, product.sku,
    product.description, product.species, product.nutritionalRole, product.ingredients,
    product.guaranteedAnalysis, product.usageAndStorage];
  if (required.some((value) => !value.trim()) || !/^\d{4}-\d{2}-\d{2}$/.test(product.reviewedAt) ||
      !product.path.startsWith("/producto/") || !Number.isFinite(product.priceCRC) || product.priceCRC <= 0 ||
      !["InStock", "OutOfStock", "PreOrder"].includes(product.availability) ||
      new URL(product.image).protocol !== "https:") {
    throw new Error("Product schema requires a reviewed SKU, label data, HTTPS image, and valid live CRC offer.");
  }
  return {
    "@context": "https://schema.org", "@type": "Product",
    name: product.name, sku: product.sku, description: product.description, image: [product.image],
    brand: { "@type": "Brand", name: brand.name },
    offers: {
      "@type": "Offer", url: canonicalUrl(product.path), price: product.priceCRC,
      priceCurrency: "CRC", availability: `https://schema.org/${product.availability}`,
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
