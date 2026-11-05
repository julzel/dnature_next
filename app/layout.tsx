import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { brand, seoConfig } from "@/lib/seo/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={geistSans.variable}
    >
      <body>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <header className="site-header shell">
          <Link href="/" className="wordmark" aria-label="DNAture, inicio">DNAture</Link>
          <nav aria-label="Navegación principal">
            <Link href="/nosotros">Nosotros</Link>
            <Link href="/ciencia">Ciencia</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer shell">
          <p>DNAture · {brand.tagline}.</p>
          <Link href="/ciencia/nuestros-criterios">Nuestros criterios de publicación</Link>
        </footer>
      </body>
    </html>
  );
}
