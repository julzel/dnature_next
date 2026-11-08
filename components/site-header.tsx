"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type ChangeEvent, type MouseEvent } from "react";
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
  function handleOpenSearch(event: MouseEvent<HTMLButtonElement>) { openPanel("search", event.currentTarget); }
  function handleOpenAccount(event: MouseEvent<HTMLButtonElement>) { openPanel("account", event.currentTarget); }
  function handleOpenCart(event: MouseEvent<HTMLButtonElement>) { openPanel("cart", event.currentTarget); }
  function handleToggleMenu() { setMenuOpen((current) => !current); }
  function handleCloseMenu() { setMenuOpen(false); }
  function handleCloseDialog() { dialog.current?.close(); }
  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) { setQuery(event.target.value); }
  function handleClearQuery() { setQuery(""); }
  return <>
    <div className="brand-bar"><div className="shell"><span>Nutrición con esencia en el ADN.</span><Link href="/ciencia/nuestros-criterios">Conocé nuestros criterios <span aria-hidden="true">↗</span></Link></div></div>
    <header className="site-header shell">
      <Link href="/" className="brand-logo" aria-label="DNAture, inicio"><Image src="/brand/logo.svg" alt="DNAture" width={170} height={34} unoptimized /></Link>
      <nav aria-label="Navegación principal" className="desktop-nav">
        <Link href="/productos">Productos</Link><Link href="/ciencia">Ciencia</Link><Link href="/nosotros">Nosotros</Link><Link href="/prototype#preguntas">Ayuda</Link>
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Buscar en DNAture" onClick={handleOpenSearch}><Icon name="search" /></button>
        <button className="icon-button account-button" type="button" aria-label="Mi DNAture" onClick={handleOpenAccount}><Icon name="user" /></button>
        <button className="icon-button cart-button" type="button" aria-label="Ver carrito, 0 productos" onClick={handleOpenCart}><Icon name="bag" /><span className="cart-count" aria-hidden="true">0</span></button>
        <button className="icon-button mobile-menu-button" type="button" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={handleToggleMenu}><Icon name={menuOpen ? "close" : "menu"} /></button>
      </div>
    </header>
    <nav id="mobile-navigation" aria-label="Navegación móvil" className="mobile-nav shell" hidden={!menuOpen}>
      <Link href="/productos" onClick={handleCloseMenu}>Productos <Icon name="arrow" /></Link><Link href="/ciencia" onClick={handleCloseMenu}>Ciencia <Icon name="arrow" /></Link><Link href="/nosotros" onClick={handleCloseMenu}>Nosotros <Icon name="arrow" /></Link><Link href="/prototype#preguntas" onClick={handleCloseMenu}>Ayuda <Icon name="arrow" /></Link>
    </nav>
    <Modal dialogRef={dialog} titleId="header-dialog-title">
      {panel === "search" ? <>
        <p className="eyebrow">Encontrá tu punto de partida</p><h2 id="header-dialog-title">¿Qué querés explorar?</h2>
        <label className="search-label" htmlFor="site-search">Buscar una familia de productos</label>
        <input id="site-search" className="search-input" type="search" placeholder="Por ejemplo, recetas o suplementos" value={query} onChange={handleSearchChange} />
        <p className="small muted" role="status">{results.length} {results.length === 1 ? "familia encontrada" : "familias encontradas"}</p>
        <div className="search-results">{results.length ? results.map((family) => <Link key={family.id} href="/productos" onClick={handleCloseDialog}><span className="family-dot" style={{ background: family.color }} />{family.name}<Icon name="arrow" /></Link>) : <div className="empty-state"><p>No encontramos una familia con ese nombre.</p><button className="text-button" onClick={handleClearQuery}>Ver todas las familias</button></div>}</div>
      </> : panel === "cart" ? <div className="empty-state"><span className="empty-icon"><Icon name="bag" /></span><p className="eyebrow">Un nuevo comienzo</p><h2 id="header-dialog-title">Tu carrito está vacío</h2><p>Explorá las familias y conocé qué información revisar antes de elegir.</p><Link href="/productos" className="button button-primary" onClick={handleCloseDialog}>Explorar productos <Icon name="arrow" /></Link><p className="small muted">Esta vista previa todavía no permite realizar compras.</p></div> : <div className="empty-state"><span className="empty-icon"><Icon name="paw" /></span><p className="eyebrow">Mi DNAture</p><h2 id="header-dialog-title">Cada historia tiene un comienzo.</h2><p>Cuando la tienda esté disponible, este será tu espacio para volver a tus productos y continuar tu rutina.</p><Link className="button button-primary" href="/productos" onClick={handleCloseDialog}>Explorar las familias <Icon name="arrow" /></Link></div>}
    </Modal>
  </>;
}
