"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, RefreshCw, RotateCcw, Search } from "lucide-react";
import { useMemo, useState, useTransition, type ChangeEvent } from "react";
import { Select } from "@/components/select";
import { Logo } from "@/components/logo";
import { visibleSales, type SalesFilters } from "../lib/filter-sales";
import type { SalesDataset } from "../types/sales";
import styles from "./sales-dashboard.module.css";

const PAGE_SIZE = 25;

function money(value: number, currency: string): string {
  try { return new Intl.NumberFormat("es-CR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value); }
  catch { return `${new Intl.NumberFormat("es-CR").format(value)} ${currency}`; }
}

export function SalesDashboard({ dataset }: { dataset: SalesDataset }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const currencies = useMemo(() => [...new Set(dataset.buckets.map((bucket) => bucket.currency))].sort(), [dataset]);
  const channels = useMemo(() => [...new Set(dataset.buckets.map((bucket) => bucket.channel))].sort(), [dataset]);
  const categories = useMemo(() => {
    const found = new Map<string, string>();
    for (const product of dataset.products) {
      if (!product.categories.length) found.set("uncategorized", "Sin categoría");
      for (const category of product.categories) found.set(category.id, category.label);
    }
    return [...found].sort((a, b) => a[1].localeCompare(b[1], "es"));
  }, [dataset]);
  const [filters, setFilters] = useState<SalesFilters>({
    period: "6m", search: "", category: "", channel: "",
    currency: currencies.includes("CRC") ? "CRC" : (currencies[0] ?? ""), sort: "units",
  });
  const [limit, setLimit] = useState(PAGE_SIZE);
  const view = useMemo(() => visibleSales(dataset, filters), [dataset, filters]);

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setFilters((current) => ({ ...current, search: event.target.value }));
    setLimit(PAGE_SIZE);
  }
  function handlePeriod(value: string) {
    setFilters((current) => ({ ...current, period: value as SalesFilters["period"] }));
    setLimit(PAGE_SIZE);
  }
  function handleCategory(value: string) {
    setFilters((current) => ({ ...current, category: value }));
    setLimit(PAGE_SIZE);
  }
  function handleChannel(value: string) {
    setFilters((current) => ({ ...current, channel: value }));
    setLimit(PAGE_SIZE);
  }
  function handleCurrency(value: string) {
    setFilters((current) => ({ ...current, currency: value }));
    setLimit(PAGE_SIZE);
  }
  function handleSort(value: string) {
    setFilters((current) => ({ ...current, sort: value as SalesFilters["sort"] }));
  }
  function handleReset() {
    setFilters({ period: "6m", search: "", category: "", channel: "", currency: currencies.includes("CRC") ? "CRC" : (currencies[0] ?? ""), sort: "units" });
    setLimit(PAGE_SIZE);
  }
  function handleLoadMore() { setLimit((current) => current + PAGE_SIZE); }
  function handleRefresh() { startTransition(() => router.refresh()); }

  return <div className={styles.page}>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className={styles.topbar}>
      <div className={styles.container}>
        <Link href="/" aria-label="DNAture, inicio"><Logo shape="full" color="brand" size={118} loading="eager" alt="" /></Link>
        <span>Panel de desarrollo</span>
      </div>
    </header>
    <main id="contenido" className={styles.container}>
      <div className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Solo desarrollo</p>
          <h1>Ventas internas</h1>
          <p className={styles.description}>Productos más vendidos según órdenes confirmadas de Avify.</p>
          <p className={styles.detail}>Órdenes completas y en proceso · Valor bruto de líneas antes de descuentos y devoluciones.</p>
        </div>
        <button className={styles.refresh} type="button" onClick={handleRefresh} disabled={pending}>
          <RefreshCw size={18} aria-hidden="true" className={pending ? styles.spinning : undefined} />
          <span>Actualizar datos</span>
        </button>
      </div>

      <p className={styles.source} role="status">{pending ? "Actualizando datos de Avify…" : `Actualizado ${new Intl.DateTimeFormat("es-CR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Costa_Rica" }).format(new Date(dataset.fetchedAt))} · ${new Intl.NumberFormat("es-CR").format(dataset.eligibleOrders)} órdenes elegibles`}</p>

      <section className={styles.metrics} aria-label="Resumen de productos filtrados">
        <div className={styles.metric}><span>Productos</span><strong>{new Intl.NumberFormat("es-CR").format(view.products)}</strong></div>
        <div className={styles.metric}><span>Unidades vendidas</span><strong>{new Intl.NumberFormat("es-CR").format(view.units)}</strong></div>
        <div className={styles.metric}><span>Valor bruto de líneas · {filters.currency || "—"}</span><strong>{filters.currency ? money(view.gross, filters.currency) : "—"}</strong></div>
      </section>

      <section className={styles.resultsSection} aria-labelledby="sales-products-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.eyebrow}>Catálogo y demanda</p><h2 id="sales-products-title">Productos</h2></div>
          <p>Del {dataset.fromDate} al {dataset.today}</p>
        </div>
        <div className={styles.filters}>
          <label className={styles.searchLabel}>Buscar producto o SKU
            <span className={styles.searchWrap}><Search size={18} aria-hidden="true" /><input type="search" value={filters.search} onChange={handleSearch} placeholder="Buscar producto" /></span>
          </label>
          <Select label="Período" value={filters.period} onValueChange={handlePeriod} options={[{ value: "30", label: "Últimos 30 días" }, { value: "90", label: "Últimos 90 días" }, { value: "6m", label: "Últimos 6 meses" }]} />
          <Select label="Categoría" value={filters.category} onValueChange={handleCategory} autocomplete={categories.length > 8} options={[{ value: "", label: "Todas" }, ...categories.map(([value, label]) => ({ value, label }))]} />
          <Select label="Canal" value={filters.channel} onValueChange={handleChannel} autocomplete={channels.length > 8} options={[{ value: "", label: "Todos" }, ...channels.map((value) => ({ value, label: value }))]} />
          {currencies.length > 1 && <Select label="Moneda" value={filters.currency} onValueChange={handleCurrency} options={currencies.map((value) => ({ value, label: value }))} />}
          <Select label="Ordenar por" value={filters.sort} onValueChange={handleSort} options={[{ value: "units", label: "Más unidades" }, { value: "orders", label: "Más órdenes" }, { value: "gross", label: "Mayor valor bruto" }, { value: "name", label: "Nombre" }]} />
          <button type="button" className={styles.reset} onClick={handleReset} aria-label="Limpiar filtros"><RotateCcw size={18} aria-hidden="true" /><span>Limpiar filtros</span></button>
        </div>

        <p className={styles.resultCount} role="status">{view.products === 0 ? "No hay productos para estos filtros." : `${new Intl.NumberFormat("es-CR").format(view.products)} productos encontrados`}</p>
        {view.products > 0 && <ol className={styles.list}>
          {view.rows.slice(0, limit).map((product, index) => <li className={styles.row} key={product.sku}>
            <span className={styles.rank}>{index + 1}</span>
            <div className={styles.product}><h3>{product.name}</h3><p>{product.customSku || product.sku}</p><div className={styles.categoryTags}>{product.categories.length ? product.categories.map((category) => <span key={category.id}>{category.label}</span>) : <span>Sin categoría</span>}</div></div>
            <dl className={styles.stats}>
              <div><dt>Unidades</dt><dd>{new Intl.NumberFormat("es-CR").format(product.units)}</dd></div>
              <div><dt>Órdenes</dt><dd>{new Intl.NumberFormat("es-CR").format(product.orders)}</dd></div>
              <div><dt>Valor bruto</dt><dd>{money(product.gross, filters.currency)}</dd></div>
            </dl>
          </li>)}
        </ol>}
        {view.rows.length > limit && <button className={styles.more} type="button" onClick={handleLoadMore}>Mostrar más productos <ArrowDown size={18} aria-hidden="true" /></button>}
      </section>
    </main>
  </div>;
}
