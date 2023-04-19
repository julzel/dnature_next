import React from "react";

// local imports
// styles
import styles from "./PetInfoForm.module.scss";

// components
import Button from "../../../components/Button";
import CustomSelect from "../../../components/CustomSelect";
import FormFieldsAdult from "./FormFields/FormFieldsAdult";
import FormFieldsPuppy from "./FormFields/FormFieldsPuppy";

const PetInfoForm = ({ petData, ageOptions, handleChange, handleSubmit }) => {
  const { age } = petData;
  return (
    <form className={styles.petFormContainer} onSubmit={handleSubmit}>
      {/* Add other form fields here */}
      <div className={styles.fieldGroup}>
        <CustomSelect
          name="age"
          label="Edad"
          options={ageOptions}
          onSelect={handleChange}
          selectedOption={ageOptions.find((option) => option.value === age)}
        />
      </div>

      {age === "adulto" ? (
        // <div>Render adult dog specific fields</div>
        <FormFieldsAdult handleChange={handleChange} petData={petData} />
      ) : age === "cachorro" ? (
        <FormFieldsPuppy handleChange={handleChange} petData={petData} />
      ) : null}

      <div className={styles.petFormActions}>
        <Button type="submit" className={styles.submitButton}>
          Add Pet
        </Button>
      </div>
    </form>
  );
};

export default PetInfoForm;
