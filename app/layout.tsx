import type { Metadata } from "next";
import localFont from "next/font/local";
import { brand, seoConfig } from "@/lib/seo/config";
import "./theme.css";
import "./globals.css";

const bodyFont = localFont({
  src: "./fonts/Manrope-Latin.woff2",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: false,
  variable: "--dn-font-body",
});

const currencyFont = localFont({
  src: "./fonts/Manrope-Latin-Extended.woff2",
  weight: "200 800",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--dn-font-currency",
});

const displayFont = localFont({
  src: "./fonts/Montserrat-Black-Latin.woff2",
  weight: "900",
  display: "swap",
  variable: "--dn-font-display",
});

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
      className={`${bodyFont.variable} ${currencyFont.variable} ${displayFont.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
