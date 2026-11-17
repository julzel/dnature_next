import type { ConsultationMode, DirectoryEntry, Partner } from "../types/partner";

export function normalizeSearch(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").replace(/\s+/g, " ").trim();
}

export function directoryEntry(partner: Partner): DirectoryEntry {
  return { id: partner.id, modalities: partner.modalities, searchText: normalizeSearch([partner.name, partner.organization, partner.summary, partner.location, ...partner.services].filter(Boolean).join(" ")) };
}

export function matchesPartner(entry: DirectoryEntry, query: string, mode: ConsultationMode | "all"): boolean {
  return (mode === "all" || entry.modalities.includes(mode)) && normalizeSearch(query).split(" ").every((word) => entry.searchText.includes(word));
}
