import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getProductDetail } from "../server/product";
import { ProductDetail } from "./product-detail";
import { ProductFailure } from "./product-failure";

export async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  let product;
  try { product = await getProductDetail(slug); }
  catch { return <ProductFailure />; }
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
