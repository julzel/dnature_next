import React, { useReducer } from "react";

// local imports
// components
import PlanDNA from "./PlanDNA";
import Intro from "./Intro/Intro";
import StepsContainer from "./Steps";

// styles
import styles from "./PlanDNA.module.scss";

const initialState = {
  step: 0,
  petsData: [],
  selectedProteins: [],
  deliveryData: {},
  userData: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };
    case "NEXT_STEP":
      return { ...state, step: state.step + 1 };
    case "PREV_STEP":
      return { ...state, step: state.step - 1 };
    case "UPDATE_PET_DATA":
      return { ...state, petsData: action.payload };
    case "UPDATE_SELECTED_PROTEINS":
      return { ...state, selectedProteins: action.payload };
    case "UPDATE_DELIVERY_DATA":
      return { ...state, deliveryData: action.payload };
    case "UPDATE_USER_DATA":
      return { ...state, userData: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const PlanDNAContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const steps = [
    "1. Cuéntanos sobre tu mascota",
    "2. Elige los sabores que quieres llevar",
    "3. Elige la forma de entrega",
    "4. Confirma tu información",
  ];

  return (
    <div className={styles.planDnaContainer}>
      {state.step === 0 ? (
        <Intro start={() => dispatch({ type: "NEXT_STEP" })} />
      ) : (
        <StepsContainer
          nextStep={() => dispatch({ type: "NEXT_STEP" })}
          prevStep={() => dispatch({ type: "PREV_STEP" })}
          setStep={(step) => dispatch({ type: "SET_STEP", payload: step })}
          steps={steps}
          currentStep={state.step}
        >
          <PlanDNA
            formData={state}
            updatepetsData={(data) =>
              dispatch({ type: "UPDATE_PET_DATA", payload: data })
            }
            updateSelectedProteins={(data) =>
              dispatch({ type: "UPDATE_SELECTED_PROTEINS", payload: data })
            }
            updateDeliveryData={(data) =>
              dispatch({ type: "UPDATE_DELIVERY_DATA", payload: data })
            }
            updateUserData={(data) =>
              dispatch({ type: "UPDATE_USER_DATA", payload: data })
            }
          />
        </StepsContainer>
      )}
    </div>
  );
};

export default PlanDNAContainer;
