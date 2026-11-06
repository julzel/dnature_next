import { Dog } from "lucide-react";

export function DogAvatar({ size = 64 }: { size?: number }) {
  return <Dog size={size} strokeWidth={1.25} aria-hidden="true" />;
}
