import type { Metadata, MetadataRoute } from "next";
import {
  brand,
  canonicalUrl,
  isPrivatePath,
  seoConfig,
  type SeoConfig,
} from "./config";
import { publicPages } from "./pages";

export function pageMetadata(
  page: {
    path: string;
    title: string;
    description: string;
    indexable?: boolean;
  },
  config: SeoConfig = seoConfig,
): Metadata {
  const index =
    config.indexable && page.indexable !== false && !isPrivatePath(page.path);
  const title =
    page.path === "/"
      ? `${brand.name} | ${page.title}`
      : `${page.title} | ${brand.name}`;
  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: canonicalUrl(page.path, config) },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
        ...(index
          ? ({
              "max-image-preview": "large",
              "max-snippet": -1,
              "max-video-preview": -1,
            } as const)
          : {}),
      },
    },
    openGraph: {
      type: "website",
      locale: "es_CR",
      siteName: brand.name,
      title,
      description: page.description,
      url: canonicalUrl(page.path, config),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
    },
  };
}

export function sitemapEntries(
  config: SeoConfig = seoConfig,
): MetadataRoute.Sitemap {
  if (!config.indexable) return [];
  // No synthetic lastmod: add actual editorial revision dates when they are recorded.
  return publicPages.map((page) => ({ url: canonicalUrl(page.path, config) }));
}

export function robotsRules(
  config: SeoConfig = seoConfig,
): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/" },
    { userAgent: "OAI-SearchBot", allow: "/" },
  ];
  if (config.trainingPolicy !== "inherit") {
    rules.push({
      userAgent: "GPTBot",
      ...(config.trainingPolicy === "allow"
        ? { allow: "/" }
        : { disallow: "/" }),
    });
  }
  // Crawling stays allowed so bots can read noindex on private/preview responses.
  // Authentication must protect personal data independently of crawler directives.
  return {
    rules,
    ...(config.indexable
      ? { sitemap: canonicalUrl("/sitemap.xml", config) }
      : {}),
  };
}
