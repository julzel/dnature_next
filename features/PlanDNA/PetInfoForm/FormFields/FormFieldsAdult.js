import React from "react";

// local imports
// styles
import styles from "./FormFieldsAdult.module.scss";
import CustomSelect from "../../../../components/CustomSelect";

const FormFieldsAdult = ({ handleChange, petData }) => {
  // size, castrated, weightStatus, activity
  const sizeOptions = [
    { value: "small", label: "Pequeño" },
    { value: "medium", label: "Mediano" },
    { value: "large", label: "Grande" },
  ];
  const castratedOptions = [
    { value: "castrated", label: "Castrado" },
    { value: "notCastrated", label: "No castrado" },
  ];
  const weightStatusOptions = [
    { value: "underweight", label: "Bajo peso" },
    { value: "ideal", label: "Peso ideal" },
    { value: "overweight", label: "Sobrepeso" },
  ];
  const activityOptions = [
    { value: "sedentary", label: "Sedentario" },
    { value: "active", label: "Activo" },
    { value: "veryActive", label: "Deportista" },
  ];

  return (
    <div>
      <div>
        <CustomSelect
          name={"size"}
          options={sizeOptions}
          onSelect={handleChange}
          selectedOption={petData.size}
          className={styles.select}
        />
      </div>
      <div>
        <CustomSelect
          name={"castrated"}
          options={castratedOptions}
          onSelect={handleChange}
          selectedOption={petData.castrated}
          className={styles.select}
        />
      </div>
      <div>
        <CustomSelect
          name={"weightStatus"}
          options={weightStatusOptions}
          onSelect={handleChange}
          selectedOption={petData.weightStatus}
          className={styles.select}
        />
      </div>
      <div>
        <CustomSelect
          name={"activity"}
          options={activityOptions}
          onSelect={handleChange}
          selectedOption={petData.activity}
          className={styles.select}
        />
      </div>
    </div>
  );
};

export default FormFieldsAdult;
