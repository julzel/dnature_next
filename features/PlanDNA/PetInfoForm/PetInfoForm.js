import React from "react";

// local imports
// styles
import styles from "./PetInfoForm.module.scss";

// components
import Button from "../../../components/Button";
import CustomSelect from "../../../components/CustomSelect";
import FormFieldsAdult from "./FormFields/FormFieldsAdult";

const PetInfoForm = ({ petData, ageOptions, handleChange, handleSubmit }) => {
  const { age } = petData;
  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      {/* Add other form fields here */}
      <div className={styles.fieldGroup}>
        <label htmlFor="age" className={styles.fieldLabel}>
          Age:
        </label>
        <CustomSelect
          onSelect={handleChange}
          options={ageOptions}
          selectedOption={ageOptions.find((option) => option.value === age)}
          name="age"
        />
      </div>

      {age === "adulto" ? (
        // <div>Render adult dog specific fields</div>
        <FormFieldsAdult handleChange={handleChange} petData={petData} />
      ) : age === "cachorro" ? (
        <div>Render puppy specific fields</div>
      ) : null}

      <Button type="submit" className={styles.submitButton}>
        Add Pet
      </Button>
    </form>
  );
};

export default PetInfoForm;
