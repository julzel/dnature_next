import { Cat } from "lucide-react";

export function CatAvatar({ size = 64 }: { size?: number }) {
  return <Cat size={size} strokeWidth={1.25} aria-hidden="true" />;
}
