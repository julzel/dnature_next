type HealthAnswers = {
  health: string;
  lifeStage?: string;
  age?: string | number;
  allergyStatus: string;
  allergyNotes?: string;
  allergies: readonly string[];
};

export function needsManualPackage(answers: Pick<HealthAnswers, "age" | "lifeStage">): boolean {
  const age = typeof answers.age === "string" ? answers.age.trim() ? Number(answers.age.replace(",", ".")) : undefined : answers.age;
  return answers.lifeStage === "growing" || (age !== undefined && age >= 0 && age < 1);
}

/** Recorded health context follows the pet, independently of package readiness. */
export function healthFactors(answers: HealthAnswers): string[] {
  return [
    ...(answers.health === "condition" ? ["Enfermedad declarada"] : answers.health === "" ? ["Enfermedades sin confirmar"] : []),
    ...(needsManualPackage(answers) ? ["Cachorro o gatito"] : !answers.lifeStage ? ["Etapa de vida sin confirmar"] : []),
    ...(answers.allergyStatus === "yes" ? ["Alergias declaradas"] : answers.allergyStatus !== "no" ? ["Alergias sin confirmar"] : []),
    ...(answers.allergies.length ? [`Restricciones registradas: ${answers.allergies.join(", ")}`] : []),
    ...(answers.allergyNotes?.trim() ? [`Notas de alergias: ${answers.allergyNotes.trim()}`] : []),
  ];
}
