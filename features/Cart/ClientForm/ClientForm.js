import React from "react";
import Link from 'next/link';
import { Check, Sparkles, UserRoundPlus } from 'lucide-react';

// local imports
// components
import Button from "../../../components/Button";

// styles
import styles from "./ClientForm.module.scss";

const ClientForm = ({
  client,
  handleBlur,
  handleChange,
  handleRememberToggle,
  handleSubmit,
  isInputValid,
  isFormValid,
  className,
  interactedFields,
  inputFields,
  rememberClient,
  rememberLabel,
  requiresAddress,
  canCreateAccount,
  showAccountPrompt,
  validationMessage,
}) => {
  return (
    <div className={[styles.clientForm, className].filter(Boolean).join(' ')}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Paso 2 de 3</p>
        <h2 id='checkout-client-title'>
          {requiresAddress ? 'Datos para la entrega' : 'Datos de contacto'}
        </h2>
        <p className={styles.intro} id='checkout-client-description'>
          {requiresAddress
            ? 'Completá dónde podemos coordinar la entrega.'
            : 'Usaremos estos datos para coordinar el retiro y confirmar tu solicitud.'}
        </p>
      </header>

      {showAccountPrompt ? (
        <aside className={styles.accountPrompt} aria-labelledby='account-invite-title'>
          <span className={styles.accountIcon} aria-hidden='true'>
            <Sparkles size={20} />
          </span>
          <div className={styles.accountContent}>
            <p className={styles.optionalLabel}>Mi DNAture · Opcional</p>
            <h3 id='account-invite-title'>
              {canCreateAccount
                ? 'Tu próxima compra, en menos pasos'
                : '¿Ya tenés acceso a Mi DNAture?'}
            </h3>
            <p>
              {canCreateAccount
                ? 'Creá una cuenta gratuita para guardar tus datos, mascotas y carritos frecuentes.'
                : 'Iniciá sesión para completar tus datos guardados. También podés seguir como invitado.'}
            </p>
            {canCreateAccount ? (
              <ul aria-label='Beneficios de crear una cuenta'>
                <li><Check aria-hidden='true' size={15} /> Datos listos</li>
                <li><Check aria-hidden='true' size={15} /> Perfiles de mascotas</li>
                <li><Check aria-hidden='true' size={15} /> Carritos frecuentes</li>
              </ul>
            ) : null}
            <div className={styles.accountActions}>
              {canCreateAccount ? (
                <Button
                  href='/cuenta/iniciar-sesion?siguiente=/checkout&modo=registro'
                  variant='secondary'
                  size='small'
                  iconStart={<UserRoundPlus aria-hidden='true' size={17} />}
                >
                  Crear mi cuenta
                </Button>
              ) : null}
              <Link href='/cuenta/iniciar-sesion?siguiente=/checkout&modo=ingresar'>
                {canCreateAccount ? 'Ya tengo cuenta' : 'Iniciar sesión'}
              </Link>
            </div>
            <span className={styles.guestNote}>
              Tu cuenta es opcional; podés terminar esta solicitud como invitado.
            </span>
          </div>
        </aside>
      ) : null}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.fields}>
          {inputFields.map((field) => {
            const value = Object.prototype.hasOwnProperty.call(
              client.address || {},
              field.name
            )
              ? client.address[field.name] || ""
              : client[field.name] || "";
            const isInvalidField =
              !isInputValid(value, field) &&
              interactedFields[field.name];
            const errorId = `${field.name}-error`;
            const isWideField = ['direccion', 'notasEntrega'].includes(field.name);
            return (
              <div
                className={`${styles.field} ${isWideField ? styles.wideField : ''}`}
                key={field.name}
              >
                <label htmlFor={field.name}>
                  {field.label}
                  {!field.isRequired ? <span>Opcional</span> : null}
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    id={field.name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={field.isRequired}
                    aria-required={field.isRequired}
                    aria-label={field.label}
                    aria-invalid={isInvalidField || undefined}
                    aria-describedby={isInvalidField ? errorId : undefined}
                    autoComplete={field.autoComplete}
                    className={isInvalidField ? styles.errorInput : undefined}
                  >
                    <option value=''>Seleccioná una provincia</option>
                    {field.options.map((option) => (
                      <option value={option} key={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    id={field.name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={field.isRequired}
                    aria-required={field.isRequired}
                    aria-label={field.label}
                    aria-invalid={isInvalidField || undefined}
                    aria-describedby={isInvalidField ? errorId : undefined}
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    className={isInvalidField ? styles.errorInput : undefined}
                    pattern={field.pattern}
                    maxLength={field.maxLength}
                  />
                )}
                {isInvalidField && (
                  <p className={styles.errorMessage} id={errorId} role='alert'>
                    {validationMessage(value, field)}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.formFooter}>
          <label className={styles.checkbox}>
            <input
              type='checkbox'
              onChange={handleRememberToggle}
              checked={rememberClient}
            />
            <span className={styles.checkmark} aria-hidden='true'></span>
            <span>{rememberLabel}</span>
          </label>
          <p className={styles.deviceNote}>
            Evitá esta opción si usás un dispositivo compartido.
          </p>
          <Button type='submit' variant='primary' size='large' fullWidth disabled={!isFormValid()}>
            Revisar solicitud
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
