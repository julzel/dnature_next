export type VisitType = "guided" | "explore";
export const VISIT_STORAGE_KEY = "dnature.visit-preference.v1";
export const VISIT_STORAGE_EVENT = "dnature:visit-preference-updated";

export function parseVisitPreference(raw: string | null): VisitType | null {
  if (!raw || raw.length > 200) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const stored = value as Record<string, unknown>;
    return stored.version === 1 && (stored.visit === "guided" || stored.visit === "explore") ? stored.visit : null;
  } catch { return null; }
}

export function saveVisitPreference(visit: VisitType) {
  window.localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify({ version: 1, visit }));
  window.dispatchEvent(new Event(VISIT_STORAGE_EVENT));
}
