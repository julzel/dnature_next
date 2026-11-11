import styles from "./pet-questionnaire-intro.module.css";

export function PetQuestionnaireIntro() {
  return (
    <div className={styles.intro}>
      <h2>Cada mascota tiene <span>su propia esencia.</span></h2>
      <p>Empecemos por conocer a quien te acompaña. Tres preguntas sencillas para crear su perfil.</p>
    </div>
  );
}
