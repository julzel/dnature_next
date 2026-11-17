"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parsePetProfiles, PET_STORAGE_EVENT, PET_STORAGE_KEY } from "../data/pet-storage";
import type { PetProfile } from "../data/pet-profiles";

const UNAVAILABLE = Symbol("storage-unavailable");

type StoredPets = {
  status: "loading" | "ready" | "error";
  pets: PetProfile[];
  error?: string;
};

function subscribe(onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === PET_STORAGE_KEY || event.key === null) onChange();
  }
  window.addEventListener("storage", handleStorage);
  window.addEventListener(PET_STORAGE_EVENT, onChange);
  return function unsubscribe() {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(PET_STORAGE_EVENT, onChange);
  };
}

function getSnapshot() {
  try { return window.localStorage.getItem(PET_STORAGE_KEY); }
  catch { return UNAVAILABLE; }
}

function getServerSnapshot() { return undefined; }

export function useStoredPets(): StoredPets {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    if (snapshot === undefined) return { status: "loading", pets: [] };
    if (snapshot === UNAVAILABLE) return { status: "error", pets: [], error: "El navegador no permite acceder a tus mascotas guardadas. Revisá el almacenamiento del navegador e intentá de nuevo." };
    try { return { status: "ready", pets: parsePetProfiles(snapshot) }; }
    catch { return { status: "error", pets: [], error: "No pudimos leer los perfiles guardados. Podés volver a completar sus datos." }; }
  }, [snapshot]);
}
