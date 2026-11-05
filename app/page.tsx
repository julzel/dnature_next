import { brand } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { Header } from "@/features/header/components/header";

export const metadata = pageMetadata({
  path: "/",
  title: brand.tagline,
  description: brand.description,
  indexable: false,
});

export default function Home() {
  return <Header />;
}
