export function contentfulImageUrl(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.startsWith("//") ? `https:${raw}` : raw);
    return url.protocol === "https:" && url.hostname === "images.ctfassets.net" ? url.href : null;
  } catch { return null; }
}
