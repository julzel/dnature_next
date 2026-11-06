import type { Metadata } from "next";
import { brand, seoConfig } from "@/lib/seo/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.origin),
  title: { default: `${brand.name} | ${brand.tagline}`, template: `%s | ${brand.name}` },
  description: brand.description,
  applicationName: brand.name,
  robots: { index: seoConfig.indexable, follow: seoConfig.indexable },
  verification: {
    google: seoConfig.googleVerification,
    other: seoConfig.bingVerification ? { "msvalidate.01": seoConfig.bingVerification } : undefined,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-CR"
      data-scroll-behavior="smooth"
    >
      <body>
        {children}
      </body>
    </html>
  );
}
