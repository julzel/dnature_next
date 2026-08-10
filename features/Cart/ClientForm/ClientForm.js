import React from "react";
import Link from 'next/link';

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
  showAccountPrompt,
  validationMessage,
}) => {
  return (
    <div className={`${styles.clientForm} ${className ? className : null}`}>
      <div>
        <p className={styles.eyebrow}>Paso 2 de 3</p>
        <h2>{requiresAddress ? 'Datos para la entrega' : 'Datos de contacto'}</h2>
        <p className={styles.intro}>
          {requiresAddress
            ? 'Completá dónde podemos coordinar la entrega.'
            : 'Usaremos estos datos para coordinar el retiro y confirmar tu solicitud.'}
        </p>
        {showAccountPrompt ? (
          <p className={styles.accountPrompt}>
            ¿Ya tenés una cuenta?{' '}
            <Link href='/cuenta/iniciar-sesion?siguiente=/checkout'>
              Iniciá sesión para completar tus datos
            </Link>
            . También podés continuar como invitado.
          </p>
        ) : null}
      </div>
      <form onSubmit={handleSubmit}>
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
          return (
            <div key={field.name}>
              <label htmlFor={field.name}>
                {field.label}:
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    id={field.name}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required={field.isRequired}
                    aria-required={field.isRequired}
                    aria-invalid={isInvalidField || undefined}
                    aria-describedby={isInvalidField ? errorId : undefined}
                    autoComplete={field.autoComplete}
                    className={isInvalidField ? styles.error : undefined}
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
                    aria-invalid={isInvalidField || undefined}
                    aria-describedby={isInvalidField ? errorId : undefined}
                    aria-label={field.label}
                    autoComplete={field.autoComplete}
                    inputMode={field.inputMode}
                    className={isInvalidField ? styles.error : undefined}
                    pattern={field.pattern}
                    maxLength={field.maxLength}
                  />
                )}
              </label>
              {isInvalidField && (
                <p className={styles.error} id={errorId}>
                  {validationMessage(value, field)}
                </p>
              )}
            </div>
          );
        })}
        <div>
          <label className={styles.checkbox}>
            <input
              type={"checkbox"}
              onChange={handleRememberToggle}
              checked={rememberClient}
            />
            <span className={styles.checkmark}></span>
            {rememberLabel}
          </label>
        </div>
        <Button type="submit" variant="primary" fullWidth disabled={!isFormValid()}>
          Revisar solicitud
        </Button>
      </form>
    </div>
  );
};

export default ClientForm;
