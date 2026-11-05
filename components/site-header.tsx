"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { families } from "@/lib/landing-content";
import { Icon } from "./icon";
import { Modal } from "./modal";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState<"search" | "cart" | "account">("search");
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const results = families.filter((family) => family.name.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es").trim()));
  function openPanel(next: typeof panel, trigger: HTMLElement) {
    // Safari pointer clicks do not focus buttons; focus the opener for native dialog restoration.
    trigger.focus();
    setPanel(next);
    setQuery("");
    dialog.current?.showModal();
  }
  return <>
    <div className="brand-bar"><div className="shell"><span>Nutrición con esencia en el ADN.</span><Link href="/ciencia/nuestros-criterios">Conocé nuestros criterios <span aria-hidden="true">↗</span></Link></div></div>
    <header className="site-header shell">
      <Link href="/" className="brand-logo" aria-label="DNAture, inicio"><Image src="/brand/logo.svg" alt="DNAture" width={170} height={34} unoptimized /></Link>
      <nav aria-label="Navegación principal" className="desktop-nav">
        <Link href="/prototype#productos">Productos</Link><Link href="/ciencia">Ciencia</Link><Link href="/nosotros">Nosotros</Link><Link href="/prototype#preguntas">Ayuda</Link>
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Buscar en DNAture" onClick={(event) => openPanel("search", event.currentTarget)}><Icon name="search" /></button>
        <button className="icon-button account-button" type="button" aria-label="Mi DNAture" onClick={(event) => openPanel("account", event.currentTarget)}><Icon name="user" /></button>
        <button className="icon-button cart-button" type="button" aria-label="Ver carrito, 0 productos" onClick={(event) => openPanel("cart", event.currentTarget)}><Icon name="bag" /><span className="cart-count" aria-hidden="true">0</span></button>
        <button className="icon-button mobile-menu-button" type="button" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "close" : "menu"} /></button>
      </div>
    </header>
    <nav id="mobile-navigation" aria-label="Navegación móvil" className="mobile-nav shell" hidden={!menuOpen}>
      <Link href="/prototype#productos" onClick={() => setMenuOpen(false)}>Productos <Icon name="arrow" /></Link><Link href="/ciencia" onClick={() => setMenuOpen(false)}>Ciencia <Icon name="arrow" /></Link><Link href="/nosotros" onClick={() => setMenuOpen(false)}>Nosotros <Icon name="arrow" /></Link><Link href="/prototype#preguntas" onClick={() => setMenuOpen(false)}>Ayuda <Icon name="arrow" /></Link>
    </nav>
    <Modal dialogRef={dialog} titleId="header-dialog-title">
      {panel === "search" ? <>
        <p className="eyebrow">Encontrá tu punto de partida</p><h2 id="header-dialog-title">¿Qué querés explorar?</h2>
        <label className="search-label" htmlFor="site-search">Buscar una familia de productos</label>
        <input id="site-search" className="search-input" type="search" placeholder="Por ejemplo, recetas o suplementos" value={query} onChange={(event) => setQuery(event.target.value)} />
        <p className="small muted" role="status">{results.length} {results.length === 1 ? "familia encontrada" : "familias encontradas"}</p>
        <div className="search-results">{results.length ? results.map((family) => <Link key={family.id} href="/prototype#productos" onClick={() => dialog.current?.close()}><span className="family-dot" style={{ background: family.color }} />{family.name}<Icon name="arrow" /></Link>) : <div className="empty-state"><p>No encontramos una familia con ese nombre.</p><button className="text-button" onClick={() => setQuery("")}>Ver todas las familias</button></div>}</div>
      </> : panel === "cart" ? <div className="empty-state"><span className="empty-icon"><Icon name="bag" /></span><p className="eyebrow">Un nuevo comienzo</p><h2 id="header-dialog-title">Tu carrito está vacío</h2><p>Explorá las familias y conocé qué información revisar antes de elegir.</p><Link href="/prototype#productos" className="button button-primary" onClick={() => dialog.current?.close()}>Explorar productos <Icon name="arrow" /></Link><p className="small muted">Esta vista previa todavía no permite realizar compras.</p></div> : <div className="empty-state"><span className="empty-icon"><Icon name="paw" /></span><p className="eyebrow">Mi DNAture</p><h2 id="header-dialog-title">Cada historia tiene un comienzo.</h2><p>Cuando la tienda esté disponible, este será tu espacio para volver a tus productos y continuar tu rutina.</p><Link className="button button-primary" href="/prototype#productos" onClick={() => dialog.current?.close()}>Explorar las familias <Icon name="arrow" /></Link></div>}
    </Modal>
  </>;
}
