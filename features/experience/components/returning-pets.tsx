import { ArrowCta } from "@/components/arrow-cta";
import { PetSpeciesImage } from "@/components/pet-species-image";
import { getBreedArtwork } from "../data/pet-breeds";
import type { PetProfile } from "../data/pet-profiles";
import type { VisitType } from "../data/visit-preference";
import { useVisitPreference } from "../hooks/use-visit-preference";
import styles from "./returning-pets.module.css";

export function ReturningPets({ pets, onManage }: { pets: PetProfile[]; onManage: () => void }) {
  const visit = useVisitPreference();
  const selected: VisitType = visit.preference ?? "guided";
  const single = pets.length === 1;
  function handleContinue() { visit.choose(selected); }
  return <div className={styles.welcome}>
    <div className={styles.intro}>
      <h2>{single ? <>¡Hola de nuevo, <span>{pets[0].name}!</span></> : <>¡Qué bueno <span>verlos de nuevo!</span></>}</h2>
      <p>{single ? `El perfil de ${pets[0].name} ya está aquí. Sigamos conociendo su esencia para acompañar su alimentación.` : "Tu manada ya es parte de DNAture. Sus perfiles están aquí para seguir acompañando a cada uno, a su manera."}</p>
      <div className={styles.actions}>
        <ArrowCta className={styles.continue} href={selected === "guided" ? "/mi-dnature/mis-mascotas" : "/productos"} label={selected === "guided" ? "Ver mis mascotas" : "Explorar productos"} onClick={handleContinue} />
        <button type="button" className={styles.manage} onClick={onManage}>Editar o agregar mascotas</button>
      </div>
      {visit.error && <p role="status" className={styles.error}>{visit.error}</p>}
    </div>
    <ul className={styles.pets} aria-label="Tus mascotas">{pets.map((pet) => <li key={pet.id}>
      <PetSpeciesImage species={pet.species} src={getBreedArtwork(pet.species, pet.breed)} alt="" size={240} />
      <h3>{pet.name}</h3><p>{pet.breed}</p>
    </li>)}</ul>
  </div>;
}
