import { useRef, useState } from "react";
import { Drawer } from "@/components/drawer";
import { PetProfileEditor } from "@/features/experience/components/pet-profile-editor";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { readFeedingPlans, saveFeedingPlans, type SavedFeedingPlan } from "../lib/saved-feeding-plans";
import { FeedingWorkflow } from "./feeding-workflow";
import { SavedPetPlans } from "./saved-pet-plans";
import styles from "./feeding.module.css";

type Editor = { type: "profile"; pet?: PetProfile } | { type: "feeding"; pet: PetProfile };

export function PetFeedingExperience({ pets }: { pets: PetProfile[] }) {
  const [stored] = useState(() => readFeedingPlans(pets));
  const [plans, setPlans] = useState(stored.plans);
  const [showDashboard, setShowDashboard] = useState(stored.hasCompleted);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [unsaved, setUnsaved] = useState<SavedFeedingPlan[]>([]);
  const [storageError, setStorageError] = useState(stored.error);
  const workspace = useRef<HTMLDivElement>(null);
  const addedPet = useRef<string | null>(null);
  const savedNotice = useRef("");
  const currentPlans = plans.flatMap((plan) => {
    const pet = pets.find((profile) => profile.id === plan.pet.id && profile.species === plan.pet.species && profile.breed === plan.pet.breed);
    return pet ? [{ ...plan, pet: { ...plan.pet, name: pet.name }, result: { ...plan.result, name: pet.name } }] : [];
  });

  function handleSave(updated: SavedFeedingPlan[]) {
    const pending = new Map(unsaved.map((plan) => [plan.pet.id, plan]));
    for (const plan of updated) pending.set(plan.pet.id, plan);
    const records = [...pending.values()];
    try {
      setPlans(saveFeedingPlans(pets, records));
      setUnsaved([]);
      setStorageError("");
      return true;
    } catch {
      setPlans((current) => [...current.filter((plan) => !pending.has(plan.pet.id)), ...records]);
      setUnsaved(records);
      setStorageError("No pudimos guardar la propuesta en este navegador. Podés seguir consultándola aquí y volver a intentar guardarla.");
      return false;
    }
  }

  function handleRetrySave() { handleSave([]); }

  function focusWorkspace(node: HTMLDivElement | null) {
    if (node && workspace.current && workspace.current !== node) {
      const heading = node.querySelector("h1");
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: "start", behavior: "instant" });
    }
    if (node) workspace.current = node;
  }

  function handleShowPets() { setShowDashboard(true); }

  function handleAddPet() { openEditor({ type: "profile" }); }
  function handleEditProfile(pet: PetProfile) { openEditor({ type: "profile", pet }); }
  function handleEditFeeding(pet: PetProfile) { openEditor({ type: "feeding", pet }); }

  function openEditor(next: Editor) {
    setNotice("");
    setEditor(next);
    setDrawerOpen(true);
  }

  function handleRequestClose() { setDrawerOpen(false); }

  function handleDrawerClosed() {
    setDrawerOpen(false);
    setEditor(null);
    if (savedNotice.current) {
      setNotice(savedNotice.current);
      savedNotice.current = "";
    }
    const petId = addedPet.current;
    if (petId) {
      addedPet.current = null;
      const row = document.getElementById(`saved-pet-${petId}`);
      row?.focus({ preventScroll: true });
      row?.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }

  function handleProfileSave(pet: PetProfile) {
    if (!editor?.pet) addedPet.current = pet.id;
    savedNotice.current = `Perfil de ${pet.name} guardado.`;
    handleRequestClose();
  }

  function handleFeedingSave(updated: SavedFeedingPlan[]) {
    if (handleSave(updated)) savedNotice.current = "Datos de alimentación guardados.";
    handleRequestClose();
  }

  const editingPet = editor?.pet;
  const title = editor?.type === "feeding" ? `Alimentación de ${editor.pet.name}` : editingPet ? `Editar perfil de ${editingPet.name}` : "Agregar mascota";

  return <>
    {storageError && <div className={styles.notice}>
      <p role="alert">{storageError}</p>
      {unsaved.length > 0 && <button type="button" className={styles.secondary} onClick={handleRetrySave}>Volver a intentar guardar</button>}
    </div>}
    {!showDashboard ? <div key="workflow" ref={focusWorkspace}>
      <FeedingWorkflow key={JSON.stringify(pets)} pets={pets} savedPlans={currentPlans} onSave={handleSave} onShowPets={handleShowPets}
        fromDashboard={false} />
    </div> : <div key="dashboard" ref={focusWorkspace}>
      <p className="sr-only" role="status">{notice}</p>
      <SavedPetPlans pets={pets} plans={currentPlans} onAdd={handleAddPet} onEditProfile={handleEditProfile} onEditFeeding={handleEditFeeding} />
      <Drawer open={drawerOpen} title={title} eyebrow="Mis mascotas" onClose={handleDrawerClosed}>
        {editor?.type === "profile" && <PetProfileEditor pet={editor.pet}
          hasPlan={currentPlans.some(({ pet }) => pet.id === editor.pet?.id)} onSave={handleProfileSave} onCancel={handleRequestClose} />}
        {editor?.type === "feeding" && <FeedingWorkflow pets={[editor.pet]} savedPlans={currentPlans}
          onSave={handleFeedingSave} onShowPets={handleRequestClose} fromDashboard />}
      </Drawer>
    </div>}
  </>;
}
