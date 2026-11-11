import type { ProductCopyBlock } from "../types/product";
import styles from "./product-detail.module.css";

export function ProductDescription({ blocks }: { blocks: ProductCopyBlock[] }) {
  return <div className={styles.description}>
    {blocks.map((block, index) => block.type === "text" ? <p key={index}>{block.text}</p> : <div key={index} className={styles.tableRegion} role="region" aria-label="Composición publicada del producto" tabIndex={0}><table>
      <caption className="sr-only">Composición publicada del producto</caption>
      <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody>
    </table></div>)}
  </div>;
}
