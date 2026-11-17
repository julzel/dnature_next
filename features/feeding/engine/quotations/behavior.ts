import { z } from "zod";

export const behaviorSchema=z.enum(["unknown","calm","anxious","training","destructive","energetic","other"]);
export type PetBehavior=z.infer<typeof behaviorSchema>;
export const behaviorLabels:Record<PetBehavior,string>={unknown:"No sabe / sin confirmar",calm:"Tranquilo",anxious:"Ansioso",training:"En entrenamiento",destructive:"Destructivo",energetic:"Alta energía",other:"Otro"};
