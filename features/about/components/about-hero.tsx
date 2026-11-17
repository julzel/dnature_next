import { ArrowDown } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";

export function AboutHero() {
  return (
    <PageHero
      title="Quiénes"
      accent="somos"
      titleId="about-title"
      description="Somos DNAture, una marca costarricense de nutrición fisiológica para perros y gatos. La ciencia nos guía. El cuidado nos conecta."
      navigation={<Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Nosotros", path: "/nosotros" }]} />}
      actions={<a href="#proposito">Descubrí nuestra esencia <ArrowDown size={20} aria-hidden="true" /></a>}
    />
  );
}
