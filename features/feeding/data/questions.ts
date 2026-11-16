export const feedingGroups = [
  { title: "Datos esenciales", description: "Empecemos con lo que hace único a tu compañero.", keys: ["age", "weight", "lifeStage", "neutered"] },
  { title: "Su día a día", description: "Su ritmo y sus hábitos también nos cuentan lo que necesita.", keys: ["body", "activity", "behavior", "brachycephaly"] },
  { title: "Últimos detalles", description: "Un poco más sobre su bienestar para acompañarlo mejor.", keys: ["health", "allergyStatus", "goal", "meals"] },
] as const;
export const feedingQuestions = {
  age: { label: "Edad en años", unit: "años", min: 0, max: 30, placeholder: "Ej. 3", help: "Si tiene menos de un año, podés usar decimales: 0,5 equivale a 6 meses." },
  weight: { label: "Peso actual en kg", unit: "kg", min: .1, max: 100, placeholder: "Ej. 12,5", help: "Usá su peso más reciente." },
  lifeStage: { label: "Etapa de vida", options: [["adult", "Adulto"], ["growing", "En crecimiento"]] },
  neutered: { label: "¿Está esterilizado?", options: [["yes", "Sí"], ["no", "No"]] },
  body: { label: "Condición corporal", options: [["thin", "Delgado"], ["ideal", "Peso ideal"], ["overweight", "Sobrepeso"]] },
  activity: { label: "Actividad diaria", options: [["calm", "Tranquila"], ["normal", "Moderada"], ["active", "Alta"]] },
  behavior: { label: "Comportamiento habitual", options: [["calm", "Tranquilo"], ["training", "En entrenamiento"], ["anxious", "Ansioso"], ["destructive", "Masticador intenso"], ["energetic", "Muy enérgico"], ["other", "Otro"], ["unknown", "No lo sé"]] },
  brachycephaly: { label: "¿Tiene el hocico achatado (braquicéfalo)?", options: [["no", "No"], ["yes", "Sí"], ["unknown", "No lo sé"]] },
  health: { label: "Estado de salud", options: [["healthy", "Sano, sin condiciones conocidas"], ["condition", "Tiene una condición o tratamiento"], ["reproductive", "Gestación o lactancia"], ["unsure", "No estoy seguro"]] },
  allergyStatus: { label: "¿Tiene alergias o restricciones alimentarias?", options: [["no", "No"], ["yes", "Sí"], ["unknown", "No lo sé"]] },
  goal: { label: "Objetivo de alimentación", options: [["wellness", "Bienestar diario"], ["digestion", "Digestión"], ["skin", "Piel y pelaje"], ["joints", "Movilidad"], ["energy", "Energía"], ["weight", "Control de peso"]] },
  meals: { label: "¿En cuántas comidas repartís su porción diaria?", options: [["1", "1 comida"], ["2", "2 comidas"], ["3", "3 comidas"], ["4", "4 comidas"]] },
} as const;
export type FeedingKey = keyof typeof feedingQuestions;
export type FeedingAnswers = Record<string, string>;

export function answerLabel(key: FeedingKey, value: string | undefined): string {
  if (!value) return key === "meals" ? "Sin definir (opcional)" : "Pendiente";
  const question = feedingQuestions[key];
  if ("options" in question) return question.options.find(([id]) => id === value)?.[1] ?? "Pendiente";
  return `${value} ${question.unit}`;
}
