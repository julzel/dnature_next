"use client";

import { useId } from "react";
import { Select } from "@/components/select";
import { getBreeds, type PetSpecies } from "../data/pet-breeds";
import styles from "./breed-combobox.module.css";

type BreedComboboxProps = { species: PetSpecies; value: string; onChange: (value: string) => void; error?: string; revealed?: boolean };

/** Breed-specific copy and aliases; all selection behavior belongs to Select. */
export function BreedCombobox({ species, value, onChange, error, revealed = true }: BreedComboboxProps) {
  const id = useId();
  function handleSearch() { onChange(""); }
  return <div className={styles.combobox} data-revealed={revealed}>
    <Select id={id} label="Raza" name="breed" value={value} onValueChange={onChange} options={getBreeds(species).map((breed) => ({ value: breed.label, label: breed.label, aliases: breed.aliases }))} autocomplete allowCustom onSearchChange={handleSearch} maxLength={80} placeholder="Escribí para buscar" aria-invalid={Boolean(error)} aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`} />
    <p id={`${id}-help`} className={styles.help}>Podés elegir mestizo, indicar que no lo sabés o agregar una raza que no aparezca.</p>
    {error && <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>}
  </div>;
}
