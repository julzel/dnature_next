'use client';

import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../../components/Button';
import {
  MAX_PET_WEIGHT_KG,
  MIN_PET_WEIGHT_KG,
  calculatePortionSizeInGrams,
  valueKeys,
} from '../../util/portion-size';
import AccountShell from './components/AccountShell';
import { useAccountDemo } from './model/account-demo-context';
import { MAX_DEMO_PETS } from './model/account-demo-state';
import styles from './AccountDemo.module.scss';

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
  const {
    deletePet,
    pets,
    savePet,
    selectedPetId,
    selectPet,
  } = useAccountDemo();
  const [formPet, setFormPet] = useState(emptyPet);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [message, setMessage] = useState('');

  const portionPreview = useMemo(
    () => calculatePortionSizeInGrams(formPet),
    [formPet]
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
    setMessage('');
  };

  const startNew = () => {
    setFormPet(emptyPet);
    setIsFormOpen(true);
    setMessage('');
    setPendingDeleteId(null);
  };

  const startEdit = (pet) => {
    setFormPet({ ...pet, weight: String(pet.weight) });
    setIsFormOpen(true);
    setMessage('');
    setPendingDeleteId(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const closeForm = () => {
    setFormPet(emptyPet);
    setIsFormOpen(false);
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = formPet.name.trim();

    if (!cleanName) {
      setMessage('Escribí el nombre de tu mascota.');
      return;
    }

    if (!portionPreview) {
      setMessage(`Ingresá un peso entre ${MIN_PET_WEIGHT_KG} kg y ${MAX_PET_WEIGHT_KG} kg.`);
      return;
    }

    const wasEditing = Boolean(formPet.id);
    savePet({ ...formPet, name: cleanName, weight: Number(formPet.weight) });
    setMessage(wasEditing ? 'Los cambios se guardaron.' : `${cleanName} se agregó a tu cuenta.`);
    setFormPet(emptyPet);
    setIsFormOpen(false);
  };

  const confirmDelete = (petId) => {
    deletePet(petId);
    setPendingDeleteId(null);
    setMessage('El perfil se eliminó de esta demostración.');
  };

  return (
    <AccountShell
      eyebrow='Perfiles personalizados'
      title='Mis mascotas'
      description='Guardá sus datos esenciales y consultá una porción diaria de referencia.'
      action={
        pets.length > 0 && pets.length < MAX_DEMO_PETS && !isFormOpen ? (
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
                <p>Usamos estos datos únicamente dentro de esta propuesta local.</p>
              </div>
              {portionPreview ? (
                <span className={styles.statusBadge}>Perfil listo</span>
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

              {portionPreview ? (
                <div className={styles.portionCallout} aria-live='polite'>
                  Porción diaria estimada: <strong>{Math.round(portionPreview)} g</strong>
                </div>
              ) : null}
              {message ? (
                <p
                  className={message.includes('Ingresá') || message.includes('Escribí') ? styles.formError : styles.formMessage}
                  role='status'
                >
                  {message}
                </p>
              ) : null}
              <p className={styles.disclaimer}>
                Esta estimación orientativa no reemplaza la valoración de un profesional veterinario.
              </p>
              <div className={styles.buttonRow}>
                <Button type='submit'>Guardar perfil</Button>
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
          <p className={styles.formMessage} role='status'>
            {message}
          </p>
        ) : null}

        {pets.length ? (
          <section aria-label='Perfiles de mascotas'>
            <div className={styles.petGrid}>
              {pets.map((pet) => {
                const isSelected = pet.id === selectedPetId;
                const pendingDelete = pet.id === pendingDeleteId;

                return (
                  <article
                    key={pet.id}
                    className={`${styles.petCard} ${isSelected ? styles.petCardSelected : ''}`}
                  >
                    <div className={styles.petCardHeader}>
                      <div>
                        <h3>{pet.name}</h3>
                        <p>Perfil de alimentación</p>
                      </div>
                      {isSelected ? (
                        <span className={styles.selectedBadge}>Principal</span>
                      ) : null}
                    </div>
                    <dl className={styles.petFacts}>
                      {petFacts(pet).map(([label, value]) => (
                        <div className={styles.petFact} key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className={styles.portionCallout}>
                      Porción orientativa: <strong>{Math.round(pet.portionSize)} g al día</strong>
                    </div>
                    <div className={styles.cardActions}>
                      {!isSelected ? (
                        <Button
                          size='small'
                          variant='secondary'
                          iconStart={<Check aria-hidden='true' size={16} />}
                          onClick={() => selectPet(pet.id)}
                        >
                          Usar como principal
                        </Button>
                      ) : null}
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
              Agregá los datos esenciales de tu mascota para ver su porción orientativa y planificar compras.
            </p>
            <Button onClick={startNew}>Agregar mascota</Button>
          </section>
        ) : null}

        {pets.length >= MAX_DEMO_PETS ? (
          <p className={styles.disclaimer}>
            La demostración admite hasta {MAX_DEMO_PETS} perfiles de mascotas.
          </p>
        ) : null}
      </div>
    </AccountShell>
  );
};

export default PetsManager;
