import styles from "./cart.module.css";

export type CartStep = "cart" | "details" | "review";

export function CartProgress({ step, onBack }: { step: CartStep; onBack: () => void }) {
  return <nav aria-label="Pasos del pedido" className={styles.progress}>
    <ol>
      <li aria-current={step === "cart" ? "step" : undefined}>{step === "cart" ? <span><small>01</small>Carrito</span> : <button type="button" onClick={onBack}><small>01</small>Carrito</button>}</li>
      <li aria-current={step === "details" ? "step" : undefined}><span><small>02</small>Datos y entrega</span></li>
      <li aria-current={step === "review" ? "step" : undefined}><span><small>03</small>Revisión</span></li>
    </ol>
  </nav>;
}
