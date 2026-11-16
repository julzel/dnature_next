"use client";

import { useState, useSyncExternalStore } from "react";
import { parseVisitPreference, saveVisitPreference, VISIT_STORAGE_EVENT, VISIT_STORAGE_KEY, type VisitType } from "../data/visit-preference";

const UNAVAILABLE = Symbol("storage-unavailable");
function subscribe(onChange: () => void) {
  function handleStorage(event: StorageEvent) { if (event.key === VISIT_STORAGE_KEY || event.key === null) onChange(); }
  window.addEventListener("storage", handleStorage);
  window.addEventListener(VISIT_STORAGE_EVENT, onChange);
  return function unsubscribe() {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(VISIT_STORAGE_EVENT, onChange);
  };
}
function getSnapshot() { try { return window.localStorage.getItem(VISIT_STORAGE_KEY); } catch { return UNAVAILABLE; } }
function getServerSnapshot() { return undefined; }

export function useVisitPreference() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [fallback, setFallback] = useState<VisitType | null>(null);
  const [error, setError] = useState("");
  function choose(visit: VisitType) {
    try { saveVisitPreference(visit); setFallback(null); setError(""); }
    catch { setFallback(visit); setError("Podés continuar, pero no pudimos guardar tu tipo de visita en este navegador. Revisá el almacenamiento para recordarlo la próxima vez."); }
  }
  return { ready: snapshot !== undefined, preference: fallback ?? (typeof snapshot === "string" ? parseVisitPreference(snapshot) : null), choose, error };
}
