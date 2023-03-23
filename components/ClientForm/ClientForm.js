import React from "react";

// local imports
// components
import Button from "../Button";

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
}) => {
  return (
    <div className={`${styles.clientForm} ${className ? className : ""}`}>
      <div>
        <h2>Detalles de entrega:</h2>
      </div>
      <form onSubmit={handleSubmit}>
        {inputFields.map((field) => {
          const value = ["direccion", "provincia", "canton"].includes(
            field.name
          )
            ? client.address[field.name]
            : client[field.name];
          const isInvalidField =
            !isInputValid(value, field.isRequired) &&
            interactedFields[field.name];
          const pattern = field.type === "tel" ? "+506\\d{8}" : undefined;
          return (
            <div key={field.name}>
              <label htmlFor={field.name}>
                {field.label}:
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
                  className={isInvalidField ? styles.error : null}
                  pattern={pattern}
                />
              </label>
              {isInvalidField && (
                <p className={styles.error}>
                  {field.label} es un campo requerido.
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
            Recordar mis datos
          </label>
        </div>
        <Button type="submit" disabled={!isFormValid()}>
          Ok
        </Button>
      </form>
    </div>
  );
};

export default ClientForm;
