"use client";

import { Cat } from "lucide-react";
import { useStrokeDrawing } from "../hooks/use-stroke-drawing";
import styles from "./pet-avatar.module.css";

type CatAvatarProps = {
  size?: number;
  animated?: boolean;
  revealed?: boolean;
};

export function CatAvatar({ size = 64, animated = false, revealed = true }: CatAvatarProps) {
  const svg = useStrokeDrawing(animated);
  return (
    <Cat ref={svg} className={styles.avatar} data-species="cat" data-animated={animated} data-revealed={revealed}
      size={size} strokeWidth={1.25} aria-hidden="true">
      <path d="m1 15 5.5 1M1 18l5.5-.5m11-1.5 5.5-1m-5.5 2.5L23 18" />
    </Cat>
  );
}
