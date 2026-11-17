import { Pencil } from "lucide-react";
import type { PetProfile } from "../data/pet-profiles";
import { PetProfileCard } from "./pet-profile-card";
import styles from "./pet-questionnaire.module.css";

type SavedPetProfileProps = {
  pet: PetProfile;
  onEdit: (pet: PetProfile) => void;
};

export function SavedPetProfile({ pet, onEdit }: SavedPetProfileProps) {
  function handleEdit() { onEdit(pet); }

  return (
    <div className={styles.savedItem}>
      <PetProfileCard name={pet.name} species={pet.species} breed={pet.breed} animated={false} />
      <button type="button" className={styles.back} onClick={handleEdit} aria-label={`Editar a ${pet.name}`}>
        <Pencil size={20} aria-hidden="true" /><span>Editar</span>
      </button>
    </div>
  );
}
