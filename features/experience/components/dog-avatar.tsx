"use client";

import { Dog } from "lucide-react";
import { useStrokeDrawing } from "../hooks/use-stroke-drawing";
import styles from "./pet-avatar.module.css";

type DogAvatarProps = {
  size?: number;
  animated?: boolean;
  revealed?: boolean;
};

export function DogAvatar({ size = 64, animated = false, revealed = true }: DogAvatarProps) {
  const svg = useStrokeDrawing(animated);

  return <Dog ref={svg} className={styles.avatar} data-species="dog" data-animated={animated} data-revealed={revealed}
    size={size} strokeWidth={1.25} aria-hidden="true" />;
}
