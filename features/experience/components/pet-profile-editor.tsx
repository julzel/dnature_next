import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { Check } from "lucide-react";
import { PetSpeciesImage } from "@/components/pet-species-image";
import { getBreedArtwork, type PetSpecies } from "../data/pet-breeds";
import { MAX_PETS, upsertPet, type PetProfile } from "../data/pet-profiles";
import { parsePetProfiles, PET_STORAGE_KEY, savePetProfiles } from "../data/pet-storage";
import { BreedCombobox } from "./breed-combobox";
import styles from "./pet-profile-editor.module.css";

const speciesOptions = [{ id: "dog", label: "Perro" }, { id: "cat", label: "Gato" }] as const;

export function PetProfileEditor({ pet, hasPlan, onSave, onCancel }: {
  pet: PetProfile | undefined;
  hasPlan: boolean;
  onSave: (pet: PetProfile) => void;
  onCancel: () => void;
}) {
  const id = useId();
  const [name, setName] = useState(pet?.name ?? "");
  const [species, setSpecies] = useState<PetSpecies | "">(pet?.species ?? "");
  const [breed, setBreed] = useState(pet?.breed ?? "");
  const [error, setError] = useState("");
  const [breedError, setBreedError] = useState("");
  const changingIdentity = pet && (pet.species !== species || (breed && pet.breed !== breed));

  function handleName(event: ChangeEvent<HTMLInputElement>) { setName(event.currentTarget.value); setError(""); }

  function handleSpecies(event: ChangeEvent<HTMLInputElement>) {
    const value = event.currentTarget.value;
    if (value !== "dog" && value !== "cat") return;
    if (value !== species) setBreed("");
    setSpecies(value);
    setBreedError("");
    setError("");
  }

  function handleBreed(value: string) { setBreed(value); setBreedError(""); setError(""); }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !species) {
      setError("Ingresá el nombre y elegí la especie para guardar el perfil.");
      return;
    }
    if (!breed.trim()) {
      setBreedError("Elegí una raza, agregá la tuya o seleccioná «No lo sé».");
      event.currentTarget.querySelector<HTMLElement>('input[role="combobox"]')?.focus();
      return;
    }
    let profile: PetProfile;
    try {
      const profiles = parsePetProfiles(localStorage.getItem(PET_STORAGE_KEY));
      const current = pet && profiles.find(({ id }) => id === pet.id);
      if (pet && (!current || current.name !== pet.name || current.species !== pet.species || current.breed !== pet.breed)) {
        setError("El perfil cambió en otra pestaña. Cerrá este panel y volvé a abrirlo para editar los datos más recientes.");
        return;
      }
      if (!pet && profiles.length >= MAX_PETS) {
        setError(`Podés guardar hasta ${MAX_PETS} mascotas en este navegador.`);
        return;
      }
      let suffix = profiles.length + 1;
      while (!pet && profiles.some(({ id }) => id === `pet-${suffix}`)) suffix++;
      profile = { id: pet?.id ?? `pet-${suffix}`, name: trimmedName, species, breed: breed.trim() };
      savePetProfiles(upsertPet(profiles, profile));
    } catch {
      setError("No pudimos guardar el perfil en este navegador. Tus cambios siguen aquí. Intentá de nuevo.");
      return;
    }
    onSave(profile);
  }

  return <form className={styles.form} aria-label={pet ? `Datos de perfil de ${pet.name}` : "Datos de la nueva mascota"} onSubmit={handleSubmit}>
    <fieldset className={styles.species}>
      <legend>Especie</legend>
      <div className={styles.options}>
        {speciesOptions.map(({ id: value, label }) => <label key={value} className={styles.option}>
          <input type="radio" name={`${id}-species`} value={value} checked={species === value} onChange={handleSpecies} required />
          <PetSpeciesImage species={value} src={getBreedArtwork(value, "")} alt="" size={72} />
          <span>{label}</span>
        </label>)}
      </div>
    </fieldset>
    <div className={styles.field}>
      <label htmlFor={`${id}-name`}>Nombre de tu mascota</label>
      <input id={`${id}-name`} name="petName" value={name} onChange={handleName} maxLength={60} autoComplete="off" required />
    </div>
    {species && <BreedCombobox key={species} species={species} value={breed} onChange={handleBreed} error={breedError} />}
    {hasPlan && changingIdentity && <p className={styles.notice}>La especie o la raza cambiaron. Al guardar, podrás completar los datos de alimentación para obtener una nueva propuesta.</p>}
    {error && <p className={styles.notice} role="alert">{error}</p>}
    <div className={styles.actions}>
      <button className={styles.cancel} type="button" onClick={onCancel}>Cancelar</button>
      <button className={styles.save} type="submit"><Check size={20} aria-hidden="true" />Guardar perfil</button>
    </div>
  </form>;
}
