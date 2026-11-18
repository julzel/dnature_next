import { Cat, CookingPot, HeartPulse, Leaf, ListFilter, Scale, Snowflake, Truck } from "lucide-react";

const icons = {
  all: ListFilter,
  "alimentacion-natural": Leaf,
  "dietas-dnature": CookingPot,
  "situaciones-especificas": HeartPulse,
  conservacion: Snowflake,
  "pedidos-entregas": Truck,
  "precios-planes": Scale,
  gatos: Cat,
};

export function FaqTopicIcon({ topic, size = 24 }: { topic: string; size?: number }) {
  const Icon = icons[topic as keyof typeof icons] ?? ListFilter;
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}
