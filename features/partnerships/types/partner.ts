export type ConsultationMode = "online" | "home_visit" | "in_person";
export type Partner = {
  id: string;
  name: string;
  group: "health" | "wellbeing";
  summary: string;
  services: string[];
  modalities: ConsultationMode[];
  organization?: string;
  location?: string;
  contactNote?: string;
  phones: { label: string; href: string }[];
  links: { kind: "booking" | "website" | "instagram"; href: string }[];
};
export type DirectoryEntry = Pick<Partner, "id" | "modalities"> & { searchText: string };
