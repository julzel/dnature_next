import type { Ref } from "react";
import Link from "next/link";
import { ArrowCta } from "@/components/arrow-cta";
import { PetSpeciesImage } from "@/components/pet-species-image";
import { getBreedArtwork } from "@/features/experience/data/pet-breeds";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import styles from "./feeding.module.css";

export function FeedingWelcome({ pets, onStart, headingRef }: { pets: PetProfile[]; onStart: () => void; headingRef: Ref<HTMLHeadingElement> }) {
  return <section className={styles.welcome} aria-label="Bienvenida a tus mascotas">
    <div className={styles.welcomeCopy}>
      <p className={styles.kicker}>Una alimentación tan única como ellos</p>
      <h1 ref={headingRef} tabIndex={-1}>{pets.length === 1 ? <>Hola, <span>{pets[0].name}.</span></> : <>Su bienestar <span>empieza aquí.</span></>}</h1>
      <p>Ya son parte de nuestra manada. Ahora vamos a conocer un poco más de {pets.length === 1 ? pets[0].name : "cada uno"} para acompañar su alimentación.</p>
      <p>Tres pasos sencillos por perro. Podés volver, cambiar de mascota y revisar todo antes de ver sus paquetes.</p>
      <ArrowCta label="Conozcámoslos mejor" onClick={onStart} className={styles.startCta} />
      <Link href="/#experiencia-personalizada" className={styles.quietLink}>Editar o agregar mascotas</Link>
    </div>
    <ul className={styles.welcomePets}>{pets.map((pet) => <li key={pet.id}>
      <PetSpeciesImage species={pet.species} src={getBreedArtwork(pet.species, pet.breed)} alt="" size={240} />
      <h2>{pet.name}</h2><p>{pet.breed}</p>
    </li>)}</ul>
  </section>;
}
