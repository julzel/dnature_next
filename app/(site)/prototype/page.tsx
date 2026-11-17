import { LandingPrototype } from "@/components/landing-prototype";
import { brand } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  path: "/prototype",
  title: "Prototipo de landing",
  description: brand.description,
  indexable: false,
});

export default function PrototypePage() {
  return <LandingPrototype />;
}
