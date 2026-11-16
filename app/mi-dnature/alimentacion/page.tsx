import { Header } from "@/features/header/components/header";
import { GuidedFeeding } from "@/features/feeding/components/guided-feeding";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({ path: "/mi-dnature/alimentacion", title: "Tu plan de alimentación", description: "Completá los datos de tus mascotas para estimar su porción diaria y comparar paquetes DNAture.", indexable: false });
export default function FeedingPage() {
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><Header solid /><main id="contenido"><GuidedFeeding /></main></>;
}
