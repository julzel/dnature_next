import { useRef, useState } from "react";
import type { PetProfile } from "@/features/experience/data/pet-profiles";
import { readFeedingPlans, saveFeedingPlans, type SavedFeedingPlan } from "../lib/saved-feeding-plans";
import { FeedingWorkflow } from "./feeding-workflow";
import { SavedPetPlans } from "./saved-pet-plans";
import styles from "./feeding.module.css";

export function PetFeedingExperience({ pets }: { pets: PetProfile[] }) {
  const [stored] = useState(() => readFeedingPlans(pets));
  const [plans, setPlans] = useState(stored.plans);
  const [editing, setEditing] = useState<PetProfile[] | null>(() => stored.plans.length ? null : pets);
  const [unsaved, setUnsaved] = useState<SavedFeedingPlan[]>([]);
  const [storageError, setStorageError] = useState(stored.error);
  const workspace = useRef<HTMLDivElement>(null);

  function handleSave(updated: SavedFeedingPlan[]) {
    const pending = new Map(unsaved.map((plan) => [plan.pet.id, plan]));
    for (const plan of updated) pending.set(plan.pet.id, plan);
    const records = [...pending.values()];
    try {
      setPlans(saveFeedingPlans(pets, records));
      setUnsaved([]);
      setStorageError("");
    } catch {
      setPlans((current) => [...current.filter((plan) => !pending.has(plan.pet.id)), ...records]);
      setUnsaved(records);
      setStorageError("No pudimos guardar la propuesta en este navegador. Podés seguir consultándola aquí y volver a intentar guardarla.");
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

  function handleShowPets() { setEditing(null); }

  function handleEdit(pet: PetProfile) { setEditing([pet]); }

  return <>
    {storageError && <div className={styles.notice}>
      <p role="alert">{storageError}</p>
      {unsaved.length > 0 && <button type="button" className={styles.secondary} onClick={handleRetrySave}>Volver a intentar guardar</button>}
    </div>}
    {editing ? <div key="workflow" ref={focusWorkspace}>
      <FeedingWorkflow pets={editing} savedPlans={plans} onSave={handleSave} onShowPets={handleShowPets}
        fromDashboard={editing !== pets} />
    </div> : <div key="dashboard" ref={focusWorkspace}>
      <SavedPetPlans pets={pets} plans={plans} onEdit={handleEdit} />
    </div>}
  </>;
}
