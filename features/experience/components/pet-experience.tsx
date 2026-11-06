"use client";

import { useStoredPets } from "../hooks/use-stored-pets";
import { PetQuestionnaire } from "./pet-questionnaire";

export function PetExperience() {
  const stored = useStoredPets();
  if (stored.status === "loading") return <p role="status">Cargando tus mascotas…</p>;

  return (
    <>
      {stored.error && <p role="alert">{stored.error}</p>}
      <PetQuestionnaire initialPets={stored.pets} />
    </>
  );
}
