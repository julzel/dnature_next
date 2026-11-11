import { Header } from "@/features/header/components/header";
import { Footer } from "@/features/footer/components/footer";
import { CartContent } from "@/features/cart/components/cart-content";
import { pageMetadata } from "@/lib/seo/metadata";
import { canonicalUrl } from "@/lib/seo/config";

export const metadata = pageMetadata({ path: "/carrito", title: "Tu carrito", description: "Revisá los productos y las cantidades de tu carrito DNAture.", indexable: false });

export default function CartPage() {
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><Header solid /><main id="contenido"><CartContent origin={canonicalUrl("/")} /></main><Footer /></>;
}
