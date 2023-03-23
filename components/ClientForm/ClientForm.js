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
  handleSubmit,
  isInputValid,
  isFormValid,
  className,
  interactedFields,
  inputFields,
  handleRememberClient,
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
          const isInValid =
            !isInputValid(value, field.isRequired) &&
            interactedFields[field.name];
          return (
            <div key={field.name}>
              <label>
                {field.label}:
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={value}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={field.isRequired}
                  aria-required={field.isRequired}
                  aria-label={field.label}
                  className={isInValid ? styles.error : null}
                />
              </label>
              {isInValid && (
                <p className={styles.error}>
                  {field.label} es un campo requerido.
                </p>
              )}
            </div>
          );
        })}
        <div>
          <label>
            Recuérdame:
            <input type={"checkbox"} onChange={handleRememberClient} />
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
