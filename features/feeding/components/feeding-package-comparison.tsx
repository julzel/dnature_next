import { useId, useState, type ChangeEvent } from "react";
import { formatCatalogPrice } from "@/features/catalog/lib/catalog-money";
import type { FeedingResult } from "../lib/result";
import { FeedingPackage } from "./feeding-package";
import styles from "./feeding-results.module.css";

export function FeedingPackageComparison({ result, days, savedDate }: { result: FeedingResult; days: number; savedDate?: string }) {
  const [selected, setSelected] = useState(result.packages.find((pack) => pack.ready)?.id ?? result.packages[0]?.id);
  const group = useId();

  function handleSelect(event: ChangeEvent<HTMLInputElement>) { setSelected(event.currentTarget.value); }

  return <>
    <fieldset className={styles.mobileComparison}>
      <legend>Compará sus opciones</legend>
      <div>{result.packages.map((pack) => <label key={pack.id} data-selected={selected === pack.id}>
        <input type="radio" name={group} value={pack.id} checked={selected === pack.id} onChange={handleSelect} />
        <span><strong>{pack.name}</strong><span>{pack.ready ? formatCatalogPrice(pack.total) : "Por completar"}</span></span>
      </label>)}</div>
      <p className="sr-only" role="status">Mostrando el paquete {result.packages.find((pack) => pack.id === selected)?.name} para {result.name}.</p>
    </fieldset>
    <div className={styles.packages}>{result.packages.map((pack) => <FeedingPackage key={pack.id} pack={pack} days={days} pet={result} active={selected === pack.id} savedDate={savedDate} />)}</div>
  </>;
}
