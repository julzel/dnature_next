import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./logo.module.css";

type LogoProps = {
  shape?: "compact" | "full" | "responsive";
  color?: "brand" | "white" | "black";
  size?: number;
  compactSize?: number;
  height?: number;
  loading?: "eager" | "lazy";
  alt?: string;
};

export function Logo({
  shape = "full",
  color = "brand",
  size,
  compactSize = 56,
  height = 44,
  loading = "lazy",
  alt = "DNAture",
}: LogoProps) {
  const fullSrc = color === "white" ? "/brand/logo-white.svg" : "/brand/logo.svg";
  const compactSrc = color === "white" ? "/brand/logo-compact-white.svg" : "/icon.svg";
  const width = size ?? (shape === "compact" ? compactSize : 170);
  const style = { "--logo-width": `${width}px`, "--logo-compact-width": `${compactSize}px`, "--logo-height": `${height}px` } as CSSProperties;

  return (
    <picture className={styles.logo} data-shape={shape} data-color={color} style={style}>
      {shape === "responsive" && <source media="(min-width: 640px)" srcSet={fullSrc} />}
      <Image
        src={shape === "full" ? fullSrc : compactSrc}
        width={width}
        height={height}
        alt={alt}
        loading={loading}
        unoptimized
      />
    </picture>
  );
}
