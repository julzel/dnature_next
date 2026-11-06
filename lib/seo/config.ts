export const brand = {
  name: "DNAture",
  tagline: "Nutrición con esencia en el ADN",
  description:
    "Conocé DNAture y nuestro enfoque de nutrición fisiológica, educación y acompañamiento para tutores de mascotas.",
  locale: "es-CR",
  origin: "https://dnaturefood.com",
} as const;

export const privateRoots = [
  "carrito", "checkout", "mi-dnature", "mis-mascotas", "cuenta", "buscar", "pedidos",
] as const;

type Environment = Record<string, string | undefined>;

export function resolveSeoConfig(env: Environment) {
  const url = new URL(env.SITE_URL || brand.origin);
  if (
    url.protocol !== "https:" || url.username || url.password ||
    url.pathname !== "/" || url.search || url.hash || url.port ||
    !url.hostname.includes(".") || url.hostname.endsWith(".localhost") ||
    /^\d+(\.\d+){3}$/.test(url.hostname)
  ) {
    throw new Error("SITE_URL must be a public HTTPS origin without a path, port, credentials, query, or fragment.");
  }
  const trainingPolicy = env.GPTBOT_POLICY || "inherit";
  if (!["inherit", "allow", "disallow"].includes(trainingPolicy)) {
    throw new Error("GPTBOT_POLICY must be inherit, allow, or disallow.");
  }
  const preview =
    (env.VERCEL_ENV !== undefined && env.VERCEL_ENV !== "production") ||
    (env.CONTEXT !== undefined && env.CONTEXT !== "production");
  return {
    origin: url.origin,
    indexable:
      env.NODE_ENV === "production" &&
      env.SEO_INDEXING_ENABLED === "true" && !preview,
    trainingPolicy: trainingPolicy as "inherit" | "allow" | "disallow",
    googleVerification: env.GOOGLE_SITE_VERIFICATION,
    bingVerification: env.BING_SITE_VERIFICATION,
  };
}

export type SeoConfig = ReturnType<typeof resolveSeoConfig>;
export const seoConfig = resolveSeoConfig(process.env);

export function canonicalUrl(path: string, config: SeoConfig = seoConfig) {
  // One origin and one URL per intent; query parameters never enter canonicals.
  if (!path.startsWith("/") || path.startsWith("//") || /[?#\\]/.test(path)) {
    throw new Error("Canonical paths must be local absolute paths without queries or fragments.");
  }
  const url = new URL(path, config.origin);
  return `${url.origin}${url.pathname === "/" ? "" : url.pathname.replace(/\/+$/, "")}`;
}

export function isPrivatePath(path: string) {
  return privateRoots.some((root) => path === `/${root}` || path.startsWith(`/${root}/`));
}

export function indexingHeaders(config: SeoConfig = seoConfig) {
  const headers = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
  return config.indexable
    ? privateRoots.map((root) => ({ source: `/${root}/:path*`, headers }))
    : [{ source: "/:path*", headers }];
}
