import React from "react";

// local imports
// styles
import CustomSelect from "../../../../components/CustomSelect";

const stageOptions = [
  { value: "stage1", label: "Etapa 1" },
  { value: "stage2", label: "Etapa 2" },
  { value: "stage3", label: "Etapa 3" },
];

const FormFieldsPuppy = ({ handleChange, petData }) => {
  return (
    <div>
      <div>
        <CustomSelect
          name={"stage"}
          label="Etapa"
          options={stageOptions}
          onSelect={handleChange}
          selectedOption={stageOptions.find(
            (option) => option.value === petData.stage
          )}
        />
      </div>
    </div>
  );
};

export default FormFieldsPuppy;
