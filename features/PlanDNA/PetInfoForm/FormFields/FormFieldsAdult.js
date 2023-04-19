import React from "react";

// local imports
// styles
import CustomSelect from "../../../../components/CustomSelect";
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
const FormFieldsAdult = ({ handleChange, petData }) => {
  return (
    <div>
      <div>
        <CustomSelect
          name={"size"}
          label="Tamaño"
          options={sizeOptions}
          onSelect={handleChange}
          selectedOption={sizeOptions.find(
            (option) => option.value === petData.size
          )}
        />
      </div>
      <div>
        <CustomSelect
          name={"castrated"}
          label="Castración"
          options={castratedOptions}
          onSelect={handleChange}
          selectedOption={castratedOptions.find(
            (option) => option.value === petData.castrated
          )}
        />
      </div>
      <div>
        <CustomSelect
          name={"weightStatus"}
          label="Contextura física"
          options={weightStatusOptions}
          onSelect={handleChange}
          selectedOption={weightStatusOptions.find(
            (option) => option.value === petData.weightStatus
          )}
        />
      </div>
      <div>
        <CustomSelect
          name={"activity"}
          label="Actividad diaria"
          options={activityOptions}
          onSelect={handleChange}
          selectedOption={activityOptions.find(
            (option) => option.value === petData.activity
          )}
        />
      </div>
    </div>
  );
};

export default FormFieldsAdult;
