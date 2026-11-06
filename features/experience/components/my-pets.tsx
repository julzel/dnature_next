"use client";

import Link from "next/link";
import { PawPrint, Pencil } from "lucide-react";
import { SectionEyebrow } from "@/components/section-eyebrow";
import { useStoredPets } from "../hooks/use-stored-pets";
import { PetProfileCard } from "./pet-profile-card";
import styles from "./my-pets.module.css";

export function MyPets() {
  const stored = useStoredPets();

  return (
    <main id="contenido" className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>
            <SectionEyebrow label="Tu familia DNAture" color="#092f39" lineColor="#092f39" />
            <h1>Mis mascotas</h1>
          </div>
          {stored.status === "ready" && stored.pets.length > 0 && (
            <Link href="/#experiencia-personalizada" className={styles.manage} aria-label="Gestionar mascotas">
              <Pencil size={20} aria-hidden="true" /><span>Gestionar mascotas</span>
            </Link>
          )}
        </div>

        {stored.status === "loading" && <p role="status">Cargando tus mascotas…</p>}
        {stored.status === "error" && (
          <div className={styles.notice}>
            <p role="alert">{stored.error}</p>
            <Link href="/#experiencia-personalizada">Volver a completar los perfiles</Link>
          </div>
        )}
        {stored.status === "ready" && stored.pets.length === 0 && (
          <div className={styles.empty}>
            <PawPrint size={48} strokeWidth={1.25} aria-hidden="true" />
            <h2>Todavía no agregaste mascotas.</h2>
            <p>Contanos sobre ellas para crear sus perfiles.</p>
            <Link href="/#experiencia-personalizada" className={styles.create}>Crear el primer perfil</Link>
          </div>
        )}
        {stored.status === "ready" && stored.pets.length > 0 && (
          <div className={styles.grid}>
            {stored.pets.map((pet) => <PetProfileCard key={pet.id} name={pet.name} species={pet.species} breed={pet.breed} animated={false} />)}
          </div>
        )}
      </div>
    </main>
  );
}
