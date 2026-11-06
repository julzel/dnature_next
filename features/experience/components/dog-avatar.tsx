"use client";

import { useLayoutEffect, useRef } from "react";
import { Dog } from "lucide-react";
import styles from "./dog-avatar.module.css";

type DogAvatarProps = {
  size?: number;
  animated?: boolean;
  revealed?: boolean;
};

export function DogAvatar({ size = 64, animated = false, revealed = true }: DogAvatarProps) {
  const svg = useRef<SVGSVGElement>(null);

  useLayoutEffect(function normalizeDrawingLengths() {
    if (animated) {
      svg.current?.querySelectorAll("path").forEach(function normalizePath(path) {
        path.setAttribute("pathLength", "1");
      });
    }
  }, [animated]);

  return <Dog ref={svg} className={styles.avatar} data-animated={animated} data-revealed={revealed}
    size={size} strokeWidth={1.25} aria-hidden="true" />;
}
