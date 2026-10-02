'use client';

import { LogOut, MapPin, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

import Button from '../../components/Button';
import { COSTA_RICA_PROVINCES, useAccount } from './state';
import AccountShell from './components/AccountShell';

const ProfileSettings = () => {
  const { profile, saveAddress, signOut, updateProfile } = useAccount();
  const [profileDraft, setProfileDraft] = useState(null);
  const [addressDraft, setAddressDraft] = useState(null);
  const [profileMessage, setProfileMessage] = useState(null);
  const [addressMessage, setAddressMessage] = useState(null);
  const [securityMessage, setSecurityMessage] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const profileForm = profileDraft || profile;
  const addressForm = addressDraft || profile;

  const setProfileField = (field) => (event) => {
    setProfileDraft((current) => ({
      ...(current || profile),
      [field]: event.target.value,
    }));
    setProfileMessage(null);
  };

  const setAddressField = (field) => (event) => {
    setAddressDraft((current) => ({
      ...(current || profile),
      [field]: event.target.value,
    }));
    setAddressMessage(null);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);
    const result = await updateProfile(profileForm);
    setIsSavingProfile(false);
    setProfileMessage({ error: !result.ok, text: result.message });
    if (result.ok) setProfileDraft(null);
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    setIsSavingAddress(true);
    setAddressMessage(null);
    const result = await saveAddress(addressForm);
    setIsSavingAddress(false);
    setAddressMessage({ error: !result.ok, text: result.message });
    if (result.ok) setAddressDraft(null);
  };

  return (
    <AccountShell
      eyebrow='Datos de tu cuenta'
      title='Mi perfil'
      description='Mantené tus datos principales y tu dirección frecuente al día.'
    >
      <div>
        <section aria-labelledby='personal-data-title'>
          <div>
            <div>
              <h2 id='personal-data-title'>Datos personales</h2>
              <p>Usaremos estos datos para facilitar la atención y tus compras.</p>
            </div>
          </div>
          <form onSubmit={handleProfileSubmit} noValidate>
            <div>
              <div>
                <label htmlFor='profile-first-name'>Nombre</label>
                <input
                  id='profile-first-name'
                  autoComplete='given-name'
                  maxLength={80}
                  value={profileForm.firstName}
                  onChange={setProfileField('firstName')}
                />
              </div>
              <div>
                <label htmlFor='profile-last-name'>Apellidos</label>
                <input
                  id='profile-last-name'
                  autoComplete='family-name'
                  maxLength={120}
                  value={profileForm.lastName}
                  onChange={setProfileField('lastName')}
                />
              </div>
              <div>
                <label htmlFor='profile-email'>Correo electrónico</label>
                <input
                  id='profile-email'
                  type='email'
                  autoComplete='email'
                  value={profile.email}
                  readOnly
                  aria-describedby='profile-email-help'
                />
                <span id='profile-email-help'>
                  Es el correo verificado con el que ingresás a tu cuenta.
                </span>
              </div>
              <div>
                <label htmlFor='profile-phone'>Teléfono</label>
                <input
                  id='profile-phone'
                  type='tel'
                  autoComplete='tel'
                  maxLength={32}
                  placeholder='8888-8888'
                  value={profileForm.phone}
                  onChange={setProfileField('phone')}
                />
              </div>
            </div>
            <div>
              <Button type='submit' disabled={isSavingProfile}>
                {isSavingProfile ? 'Guardando…' : 'Guardar datos'}
              </Button>
            </div>
            {profileMessage ? (
              <p
                role={profileMessage.error ? 'alert' : 'status'}
              >
                {profileMessage.text}
              </p>
            ) : null}
          </form>
        </section>

        <section aria-labelledby='address-title'>
          <div>
            <div>
              <span aria-hidden='true'>
                <MapPin size={21} />
              </span>
              <div>
                <h2 id='address-title'>Dirección frecuente</h2>
                <p>
                  Guardarla agiliza la coordinación, pero no confirma cobertura
                  de entrega.
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleAddressSubmit} noValidate>
            <div>
              <div>
                <label htmlFor='profile-province'>Provincia</label>
                <select
                  id='profile-province'
                  autoComplete='address-level1'
                  value={addressForm.province}
                  onChange={setAddressField('province')}
                >
                  <option value=''>Seleccioná una provincia</option>
                  {COSTA_RICA_PROVINCES.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor='profile-canton'>Cantón</label>
                <input
                  id='profile-canton'
                  autoComplete='address-level2'
                  maxLength={100}
                  value={addressForm.canton}
                  onChange={setAddressField('canton')}
                />
              </div>
              <div>
                <label htmlFor='profile-district'>Distrito</label>
                <input
                  id='profile-district'
                  autoComplete='address-level3'
                  maxLength={100}
                  value={addressForm.district}
                  onChange={setAddressField('district')}
                />
              </div>
              <div>
                <label htmlFor='profile-address'>Otras señas</label>
                <textarea
                  id='profile-address'
                  autoComplete='street-address'
                  maxLength={500}
                  value={addressForm.address}
                  onChange={setAddressField('address')}
                />
              </div>
              <div>
                <label htmlFor='profile-delivery-notes'>Notas para la entrega</label>
                <textarea
                  id='profile-delivery-notes'
                  maxLength={300}
                  placeholder='Por ejemplo: llamar al llegar.'
                  value={addressForm.deliveryNotes || ''}
                  onChange={setAddressField('deliveryNotes')}
                />
              </div>
            </div>
            <div>
              <Button type='submit' disabled={isSavingAddress}>
                {isSavingAddress ? 'Guardando…' : 'Guardar dirección'}
              </Button>
            </div>
            {addressMessage ? (
              <p
                role={addressMessage.error ? 'alert' : 'status'}
              >
                {addressMessage.text}
              </p>
            ) : null}
          </form>
        </section>

        <section aria-labelledby='security-title'>
          <div>
            <div>
              <span aria-hidden='true'>
                <ShieldCheck size={21} />
              </span>
              <div>
                <h2 id='security-title'>Acceso a la cuenta</h2>
                <p>
                  Cerrá la sesión cuando usés un dispositivo compartido.
                </p>
              </div>
            </div>
          </div>
          <div>
            <Button
              variant='secondary'
              iconStart={<LogOut aria-hidden='true' size={17} />}
              onClick={async () => {
                setSecurityMessage(null);
                const result = await signOut();
                if (!result.ok) {
                  setSecurityMessage({ error: true, text: result.message });
                }
              }}
            >
              Cerrar sesión
            </Button>
          </div>
          {securityMessage ? (
            <p role='alert'>
              {securityMessage.text}
            </p>
          ) : null}
        </section>
      </div>
    </AccountShell>
  );
};

export default ProfileSettings;
