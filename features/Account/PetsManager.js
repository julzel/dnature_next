'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../../components/Button';
import {
  MAX_PET_WEIGHT_KG,
  MIN_PET_WEIGHT_KG,
  calculatePortionSizeInGrams,
  valueKeys,
} from '../../util/portion-size';
import AccountShell from './components/AccountShell';
import { useAccount } from './state';
import styles from './Account.module.scss';

const emptyPet = {
  id: '',
  name: '',
  age: 'adult',
  puppyStage: 'stage1',
  size: 'medium',
  castrated: 'castrated',
  bodyContexture: 'ideal',
  dailyActivity: 'active',
  weight: '',
};

const petFacts = (pet) =>
  pet.age === 'puppy'
    ? [
        ['Etapa', valueKeys[pet.puppyStage]],
        ['Peso', `${pet.weight} kg`],
      ]
    : [
        ['Edad', valueKeys[pet.age]],
        ['Tamaño', valueKeys[pet.size]],
        ['Contextura', valueKeys[pet.bodyContexture]],
        ['Actividad', valueKeys[pet.dailyActivity]],
        ['Peso', `${pet.weight} kg`],
      ];

const PetsManager = () => {
  const { deletePet, featureFlags, maxPets, pets, savePet } = useAccount();
  const [formPet, setFormPet] = useState(emptyPet);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const portionPreview = useMemo(
    () =>
      featureFlags.portionPlanning
        ? calculatePortionSizeInGrams(formPet)
        : null,
    [featureFlags.portionPlanning, formPet]
  );

  const setField = (field) => (event) => {
    const value = event.target.value;
    setFormPet((current) => {
      const next = { ...current, [field]: value };

      if (
        field === 'bodyContexture' &&
        value === 'overWeight' &&
        current.dailyActivity === 'veryActive'
      ) {
        next.dailyActivity = 'active';
      }

      return next;
    });
    setMessage(null);
  };

  const startNew = () => {
    setFormPet(emptyPet);
    setIsFormOpen(true);
    setMessage(null);
    setPendingDeleteId(null);
  };

  const startEdit = (pet) => {
    setFormPet({ ...pet, weight: String(pet.weight) });
    setIsFormOpen(true);
    setMessage(null);
    setPendingDeleteId(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const closeForm = () => {
    setFormPet(emptyPet);
    setIsFormOpen(false);
    setMessage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanName = formPet.name.trim();

    if (!cleanName) {
      setMessage({ error: true, text: 'Escribí el nombre de tu mascota.' });
      return;
    }

    const weight = Number(formPet.weight);
    if (
      !Number.isFinite(weight) ||
      weight < MIN_PET_WEIGHT_KG ||
      weight > MAX_PET_WEIGHT_KG
    ) {
      setMessage({
        error: true,
        text: `Ingresá un peso entre ${MIN_PET_WEIGHT_KG} kg y ${MAX_PET_WEIGHT_KG} kg.`,
      });
      return;
    }

    setIsSaving(true);
    const result = await savePet({
      ...formPet,
      name: cleanName,
      weight,
    });
    setIsSaving(false);
    setMessage({ error: !result.ok, text: result.message });
    if (result.ok) {
      setFormPet(emptyPet);
      setIsFormOpen(false);
    }
  };

  const confirmDelete = async (petId) => {
    const result = await deletePet(petId);
    if (result.ok) setPendingDeleteId(null);
    setMessage({ error: !result.ok, text: result.message });
  };

  return (
    <AccountShell
      eyebrow='Perfiles personalizados'
      title='Mis mascotas'
      description={
        featureFlags.portionPlanning
          ? 'Guardá sus datos esenciales y consultá una porción diaria de referencia.'
          : 'Guardá los datos esenciales de tus mascotas en un solo lugar.'
      }
      action={
        pets.length > 0 && pets.length < maxPets && !isFormOpen ? (
          <Button iconStart={<Plus aria-hidden='true' size={18} />} onClick={startNew}>
            Agregar mascota
          </Button>
        ) : null
      }
    >
      <div className={styles.contentStack}>
        {isFormOpen ? (
          <section className={styles.formCard} aria-labelledby='pet-form-title'>
            <div className={styles.cardHeader}>
              <div>
                <h2 id='pet-form-title'>
                  {formPet.id ? `Editar a ${formPet.name}` : 'Nueva mascota'}
                </h2>
                <p>Completá los datos esenciales para mantener su perfil al día.</p>
              </div>
              {portionPreview ? (
                <span className={styles.statusBadge}>Datos listos</span>
              ) : null}
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <label htmlFor='pet-name'>Nombre</label>
                  <input
                    id='pet-name'
                    value={formPet.name}
                    onChange={setField('name')}
                    maxLength={40}
                    autoComplete='off'
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor='pet-age'>Etapa de vida</label>
                  <select id='pet-age' value={formPet.age} onChange={setField('age')}>
                    <option value='adult'>Adulto</option>
                    <option value='puppy'>Cachorro</option>
                  </select>
                </div>

                {formPet.age === 'puppy' ? (
                  <div className={styles.field}>
                    <label htmlFor='pet-stage'>Etapa del cachorro</label>
                    <select
                      id='pet-stage'
                      value={formPet.puppyStage}
                      onChange={setField('puppyStage')}
                    >
                      <option value='stage1'>Menor de 7 meses</option>
                      <option value='stage2'>De 7 meses a 1 año</option>
                      <option value='stage3'>De 1 año hasta adulto</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <div className={styles.field}>
                      <label htmlFor='pet-size'>Tamaño</label>
                      <select id='pet-size' value={formPet.size} onChange={setField('size')}>
                        <option value='small'>Mini — menos de 4 kg</option>
                        <option value='medium'>Pequeño o mediano — 5 a 25 kg</option>
                        <option value='large'>Grande o gigante — más de 25 kg</option>
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor='pet-castrated'>Castración</label>
                      <select
                        id='pet-castrated'
                        value={formPet.castrated}
                        onChange={setField('castrated')}
                      >
                        <option value='castrated'>Castrado</option>
                        <option value='notCastrated'>Sin castrar</option>
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor='pet-contexture'>Contextura física</label>
                      <select
                        id='pet-contexture'
                        value={formPet.bodyContexture}
                        onChange={setField('bodyContexture')}
                      >
                        <option value='underWeight'>Bajo peso</option>
                        <option value='ideal'>Peso ideal</option>
                        <option value='overWeight'>Sobrepeso</option>
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label htmlFor='pet-activity'>Actividad diaria</label>
                      <select
                        id='pet-activity'
                        value={formPet.dailyActivity}
                        onChange={setField('dailyActivity')}
                      >
                        <option value='sedentary'>Sedentario</option>
                        <option value='active'>Activo</option>
                        {formPet.bodyContexture !== 'overWeight' ? (
                          <option value='veryActive'>Deportista</option>
                        ) : null}
                      </select>
                    </div>
                  </>
                )}

                <div className={styles.field}>
                  <label htmlFor='pet-weight'>Peso en kilogramos</label>
                  <input
                    id='pet-weight'
                    type='number'
                    inputMode='decimal'
                    min={MIN_PET_WEIGHT_KG}
                    max={MAX_PET_WEIGHT_KG}
                    step='0.1'
                    value={formPet.weight}
                    onChange={setField('weight')}
                  />
                  <span className={styles.fieldHelp}>
                    Entre {MIN_PET_WEIGHT_KG} kg y {MAX_PET_WEIGHT_KG} kg.
                  </span>
                </div>
              </div>

              {featureFlags.portionPlanning && portionPreview ? (
                <div className={styles.portionCallout} aria-live='polite'>
                  Porción diaria estimada: <strong>{Math.round(portionPreview)} g</strong>
                </div>
              ) : null}
              {message ? (
                <p
                  className={message.error ? styles.formError : styles.formMessage}
                  role={message.error ? 'alert' : 'status'}
                >
                  {message.text}
                </p>
              ) : null}
              {featureFlags.portionPlanning ? (
                <p className={styles.disclaimer}>
                  Esta estimación orientativa no reemplaza la valoración de un profesional veterinario.
                </p>
              ) : null}
              <div className={styles.buttonRow}>
                <Button type='submit' disabled={isSaving}>
                  {isSaving ? 'Guardando…' : 'Guardar perfil'}
                </Button>
                {pets.length ? (
                  <Button variant='secondary' onClick={closeForm}>
                    Cancelar
                  </Button>
                ) : null}
              </div>
            </form>
          </section>
        ) : null}

        {message && !isFormOpen ? (
          <p
            className={message.error ? styles.formError : styles.formMessage}
            role={message.error ? 'alert' : 'status'}
          >
            {message.text}
          </p>
        ) : null}

        {pets.length ? (
          <section aria-label='Perfiles de mascotas'>
            <div className={styles.petGrid}>
              {pets.map((pet) => {
                const pendingDelete = pet.id === pendingDeleteId;

                return (
                  <article
                    key={pet.id}
                    className={styles.petCard}
                  >
                    <div className={styles.petCardHeader}>
                      <div>
                        <h3>{pet.name}</h3>
                        <p>Perfil de alimentación</p>
                      </div>
                    </div>
                    <dl className={styles.petFacts}>
                      {petFacts(pet).map(([label, value]) => (
                        <div className={styles.petFact} key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                    {featureFlags.portionPlanning && pet.portionSize ? (
                      <div className={styles.portionCallout}>
                        Porción orientativa:{' '}
                        <strong>{Math.round(pet.portionSize)} g al día</strong>
                      </div>
                    ) : null}
                    <div className={styles.cardActions}>
                      <Button
                        size='small'
                        variant='tertiary'
                        iconStart={<Pencil aria-hidden='true' size={15} />}
                        onClick={() => startEdit(pet)}
                      >
                        Editar
                      </Button>
                      <Button
                        size='small'
                        variant='tertiary'
                        iconStart={<Trash2 aria-hidden='true' size={15} />}
                        onClick={() => setPendingDeleteId(pet.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                    {pendingDelete ? (
                      <div className={styles.inlineConfirm} role='alert'>
                        <p>¿Eliminar el perfil de {pet.name}?</p>
                        <div className={styles.cardActions}>
                          <Button size='small' variant='danger' onClick={() => confirmDelete(pet.id)}>
                            Sí, eliminar
                          </Button>
                          <Button size='small' variant='secondary' onClick={() => setPendingDeleteId(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ) : !isFormOpen ? (
          <section className={styles.emptyState}>
            <Plus aria-hidden='true' size={38} />
            <h2>Creá el primer perfil</h2>
            <p>
              {featureFlags.portionPlanning
                ? 'Agregá sus datos esenciales para ver una porción orientativa y planificar compras.'
                : 'Agregá sus datos esenciales para tener su información organizada en un solo lugar.'}
            </p>
            <Button onClick={startNew}>Agregar mascota</Button>
          </section>
        ) : null}

        {pets.length >= maxPets ? (
          <p className={styles.disclaimer}>
            Podés guardar hasta {maxPets} perfiles de mascotas.
          </p>
        ) : null}
      </div>
    </AccountShell>
  );
};

export default PetsManager;
