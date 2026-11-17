import { JsonLd } from "@/components/json-ld";
import { Header } from "@/features/header/components/header";
import { Footer } from "@/features/footer/components/footer";
import { Partnerships } from "@/features/partnerships/components/partnerships";
import { partnershipsDescription } from "@/features/partnerships/data/page-content";
import partners from "@/features/partnerships/data/partners.json";
import { pageMetadata } from "@/lib/seo/metadata";
import { canonicalUrl } from "@/lib/seo/config";

export const metadata = pageMetadata({ path: "/alianzas", title: "Profesionales aliados", description: partnershipsDescription });

export default function PartnershipsPage() {
  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a><Header solid />
    <main id="contenido"><Partnerships /></main><Footer />
    <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Profesionales aliados | DNAture", description: partnershipsDescription, url: canonicalUrl("/alianzas"), inLanguage: "es-CR", mainEntity: { "@type": "ItemList", itemListElement: partners.map((partner, index) => ({ "@type": "ListItem", position: index + 1, name: partner.name, url: `${canonicalUrl("/alianzas")}#${partner.id}` })) } }} />
  </>;
}
