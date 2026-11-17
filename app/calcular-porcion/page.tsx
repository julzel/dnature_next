import { GuidedFeeding } from "@/features/feeding/components/guided-feeding";
import { Header } from "@/features/header/components/header";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  path: "/calcular-porcion",
  title: "Calculá su porción diaria",
  description: "Completá los datos de tus mascotas para estimar su porción diaria y conocer sus paquetes DNAture.",
  indexable: false,
});

export default function CalculatePortionPage() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header solid />
      <main id="contenido"><GuidedFeeding /></main>
    </>
  );
}
