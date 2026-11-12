"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Select } from "@/components/select";
import { useCart } from "@/features/cart/lib/cart-store";
import { CatalogCartQuantity } from "./catalog-cart-quantity";
import { formatCatalogPrice } from "../lib/catalog-money";
import type { ProductOption } from "../types/product-option";
import styles from "./catalog-cart.module.css";

export function CatalogCartControl({ parentSku, name, options }: { parentSku: string; name: string; options: ProductOption[] }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const cart = useCart();
  const [currentOptions, setOptions] = useState(options);
  const [choosing, setChoosing] = useState(false);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const multiple = currentOptions.length > 1;
  const inCart = currentOptions.find((option) => cart.items.some((item) => item.sku === option.sku));
  const selected = currentOptions.find((option) => option.sku === selectedSku) ?? inCart ?? (!multiple ? currentOptions[0] : undefined);
  const expanded = choosing || Boolean(inCart);
  const purchasable = currentOptions.some((option) => option.inStock && option.price !== null);

  function handleStart() { setChoosing(true); setNotice(null); requestAnimationFrame(function focusPresentation() { document.getElementById(id)?.focus(); }); }
  function handleSelection(sku: string) { setSelectedSku(sku); setNotice(null); }
  function handleAdded() { setChoosing(false); }
  function handleEmpty() {
    setChoosing(false); setSelectedSku(null);
    if (multiple) setNotice("Producto retirado del carrito.");
    requestAnimationFrame(function focusAdd() { root.current?.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true }); });
  }

  return <div ref={root} className={styles.control} role="group" aria-label={`Carrito: ${name}`}>
    {cart.error ? <p className={styles.feedback} role="alert">{cart.error} <Link href="/carrito">Revisar carrito</Link></p>
      : !purchasable && !inCart ? <p className={styles.feedback}>Esta presentación ya no está disponible.</p>
      : multiple && !expanded ? <button className={styles.add} type="button" onClick={handleStart} disabled={!cart.ready}><ShoppingCart size={18} strokeWidth={1.5} aria-hidden="true" />Agregar al carrito</button>
      : <>
        {multiple && <Select id={id} label={`Presentación de ${name}`} value={selected?.sku ?? ""} onValueChange={handleSelection} placeholder="Elegí una presentación" options={currentOptions.map((option) => ({ value: option.sku, label: `${option.name} · ${option.price === null ? "Consultar" : formatCatalogPrice(option.price)}${option.inStock ? "" : " · Agotado"}`, disabled: !option.inStock || option.price === null }))} />}
        {selected ? <CatalogCartQuantity key={selected.sku} parentSku={parentSku} name={name} option={selected} onOptionsChange={setOptions} onAdded={handleAdded} onEmpty={handleEmpty} />
          : <p className={styles.feedback}>Elegí una presentación para agregarla al carrito.</p>}
      </>}
    {notice && <p className={styles.feedback} role="status">{notice}</p>}
  </div>;
}
