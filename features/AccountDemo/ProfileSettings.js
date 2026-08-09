'use client';

import { BellRing, LogOut, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '../../components/Button';
import AccountShell from './components/AccountShell';
import { useAccountDemo } from './model/account-demo-context';
import styles from './AccountDemo.module.scss';

const ProfileSettings = () => {
  const router = useRouter();
  const {
    preferences,
    profile,
    resetDemo,
    signOut,
    updatePreferences,
    updateProfile,
  } = useAccountDemo();
  const [profileDraft, setProfileDraft] = useState(null);
  const [message, setMessage] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const form = profileDraft || profile;

  const setField = (field) => (event) => {
    setProfileDraft((current) => ({
      ...(current || profile),
      [field]: event.target.value,
    }));
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.firstName.trim()) {
      setMessage('Ingresá tu nombre.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setMessage('Ingresá un correo electrónico válido.');
      return;
    }

    updateProfile({
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
    });
    setProfileDraft(null);
    setMessage('Tus datos se guardaron en esta demostración.');
  };

  const handleSignOut = () => {
    signOut();
    router.push('/cuenta/iniciar-sesion');
  };

  const handleReset = () => {
    resetDemo();
    router.push('/cuenta/iniciar-sesion');
  };

  return (
    <AccountShell
      eyebrow='Datos y preferencias'
      title='Mi perfil'
      description='Mantené tus datos principales al día y elegí cómo querés usar la experiencia.'
    >
      <div className={styles.contentStack}>
        <section className={styles.formCard} aria-labelledby='personal-data-title'>
          <div className={styles.cardHeader}>
            <div>
              <h2 id='personal-data-title'>Datos personales</h2>
              <p>Una futura compra podría completar estos datos automáticamente.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor='profile-first-name'>Nombre</label>
                <input
                  id='profile-first-name'
                  autoComplete='given-name'
                  value={form.firstName}
                  onChange={setField('firstName')}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor='profile-last-name'>Apellidos</label>
                <input
                  id='profile-last-name'
                  autoComplete='family-name'
                  value={form.lastName}
                  onChange={setField('lastName')}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor='profile-email'>Correo electrónico</label>
                <input
                  id='profile-email'
                  type='email'
                  autoComplete='email'
                  value={form.email}
                  onChange={setField('email')}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor='profile-phone'>Teléfono</label>
                <input
                  id='profile-phone'
                  type='tel'
                  autoComplete='tel'
                  value={form.phone}
                  onChange={setField('phone')}
                />
              </div>
            </div>
            <div className={styles.buttonRow}>
              <Button type='submit'>Guardar datos</Button>
            </div>
            {message ? (
              <p
                className={message.startsWith('Ingresá') ? styles.formError : styles.formMessage}
                role='status'
              >
                {message}
              </p>
            ) : null}
          </form>
        </section>

        <section className={styles.formCard} aria-labelledby='address-title'>
          <div className={styles.cardHeader}>
            <div>
              <h2 id='address-title'>Dirección frecuente</h2>
              <p>Propuesta para agilizar la coordinación de entrega en Costa Rica.</p>
            </div>
            <span className={styles.proposalBadge}>Uso futuro</span>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label htmlFor='profile-province'>Provincia</label>
                <input
                  id='profile-province'
                  autoComplete='address-level1'
                  value={form.province}
                  onChange={setField('province')}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor='profile-canton'>Cantón</label>
                <input
                  id='profile-canton'
                  autoComplete='address-level2'
                  value={form.canton}
                  onChange={setField('canton')}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor='profile-district'>Distrito</label>
                <input
                  id='profile-district'
                  autoComplete='address-level3'
                  value={form.district}
                  onChange={setField('district')}
                />
              </div>
              <div className={styles.fullField}>
                <label htmlFor='profile-address'>Otras señas</label>
                <textarea
                  id='profile-address'
                  autoComplete='street-address'
                  maxLength={300}
                  value={form.address}
                  onChange={setField('address')}
                />
              </div>
            </div>
            <div className={styles.buttonRow}>
              <Button type='submit'>Guardar dirección</Button>
            </div>
          </form>
        </section>

        <section className={styles.card} aria-labelledby='preferences-title'>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <span className={styles.smallIcon} aria-hidden='true'>
                <Sparkles size={21} />
              </span>
              <div>
                <h2 id='preferences-title'>Preferencias de experiencia</h2>
                <p>Controles claros para que la personalización siempre sea opcional.</p>
              </div>
            </div>
          </div>
          <div className={styles.preferenceList}>
            <div className={styles.preferenceRow}>
              <div>
                <h3>Recomendaciones personalizadas</h3>
                <p>Usar los perfiles de mascotas para ordenar ideas de productos.</p>
              </div>
              <button
                type='button'
                role='switch'
                className={styles.toggle}
                aria-label='Recomendaciones personalizadas'
                aria-checked={preferences.personalization}
                onClick={() =>
                  updatePreferences({ personalization: !preferences.personalization })
                }
              >
                <span aria-hidden='true' />
              </button>
            </div>
            <div className={styles.preferenceRow}>
              <div>
                <h3>Recordatorios dentro de mi cuenta</h3>
                <p>Mostrar avisos útiles sobre perfiles y próximas compras.</p>
              </div>
              <button
                type='button'
                role='switch'
                className={styles.toggle}
                aria-label='Recordatorios dentro de mi cuenta'
                aria-checked={preferences.inAccountReminders}
                onClick={() =>
                  updatePreferences({ inAccountReminders: !preferences.inAccountReminders })
                }
              >
                <span aria-hidden='true' />
              </button>
            </div>
          </div>
        </section>

        <div className={styles.twoColumnGrid}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <span className={styles.smallIcon} aria-hidden='true'>
                  <ShieldCheck size={21} />
                </span>
                <div>
                  <h2>Tu sesión</h2>
                  <p>Cerrá la sesión simulada sin borrar perfiles ni carritos.</p>
                </div>
              </div>
            </div>
            <Button
              variant='secondary'
              iconStart={<LogOut aria-hidden='true' size={17} />}
              onClick={handleSignOut}
            >
              Cerrar sesión
            </Button>
          </section>

          <section className={`${styles.card} ${styles.dangerZone}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitleGroup}>
                <span className={styles.smallIcon} aria-hidden='true'>
                  <BellRing size={21} />
                </span>
                <div>
                  <h2>Reiniciar propuesta</h2>
                  <p>Borrá de este dispositivo todos los datos de la cuenta demo.</p>
                </div>
              </div>
            </div>
            {!showResetConfirm ? (
              <Button
                variant='tertiary'
                iconStart={<Trash2 aria-hidden='true' size={17} />}
                onClick={() => setShowResetConfirm(true)}
              >
                Borrar datos de demostración
              </Button>
            ) : (
              <div className={styles.inlineConfirm} role='alert'>
                <p>Se borrarán tu perfil, mascotas y carritos guardados de la demo.</p>
                <div className={styles.cardActions}>
                  <Button size='small' variant='danger' onClick={handleReset}>
                    Sí, borrar todo
                  </Button>
                  <Button size='small' variant='secondary' onClick={() => setShowResetConfirm(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </AccountShell>
  );
};

export default ProfileSettings;
