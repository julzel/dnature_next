import { ImageResponse } from "next/og";
import { brand } from "@/lib/seo/config";

export const alt = `${brand.name} · ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 80, background: "#f6faff", color: "#124563" }}>
      <div style={{ display: "flex", fontSize: 48, fontWeight: 700 }}>{brand.name}</div>
      <div style={{ display: "flex", fontSize: 84, lineHeight: 1.08, maxWidth: 900 }}>{brand.tagline}</div>
      <div style={{ display: "flex", fontSize: 26 }}>Nutrición · Educación · Acompañamiento</div>
    </div>, size,
  );
}
