import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/features/header/components/header";
import { Footer } from "@/features/footer/components/footer";
import { ProductContent } from "@/features/product/components/product-content";
import { ProductLoading } from "@/features/product/components/product-loading";
import { getProductDetail } from "@/features/product/server/product";
import { productSummary } from "@/features/product/lib/product-detail";
import { pageMetadata } from "@/lib/seo/metadata";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  let product;
  try { product = await getProductDetail(slug); }
  catch { return pageMetadata({ path: `/producto/${encodeURIComponent(slug)}`, title: "Producto", description: "Consultá los productos DNAture.", indexable: false }); }
  if (!product) notFound();
  const metadata = pageMetadata({ path: product.path, title: product.name, description: productSummary(product) });
  if (product.images[0]) {
    metadata.openGraph = { ...metadata.openGraph, images: [{ url: product.images[0].url, alt: product.images[0].alt }] };
    metadata.twitter = { ...metadata.twitter, card: "summary_large_image", images: [product.images[0].url] };
  }
  return metadata;
}

export default function ProductPage({ params }: { params: Params }) {
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header solid />
    <main id="contenido"><Suspense fallback={<ProductLoading />}><ProductContent params={params} /></Suspense></main>
    <Footer />
  </>;
}
