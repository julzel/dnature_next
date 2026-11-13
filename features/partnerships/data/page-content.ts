import type { ConsultationMode } from "../types/partner";

export const partnershipsDescription = "Encontrá profesionales de salud y bienestar animal: servicios, atención online, a domicilio o presencial, contacto y enlaces para reservar citas.";

export const consultationModes: { value: ConsultationMode | "all"; label: string }[] = [
  { value: "all", label: "Todas las modalidades" },
  { value: "online", label: "En línea" },
  { value: "home_visit", label: "A domicilio" },
  { value: "in_person", label: "Presencial" },
];
