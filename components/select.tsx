"use client";

import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type ChangeEvent, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type SelectHTMLAttributes } from "react";
import { searchableLabel, selectPopupPosition, type SelectOption } from "./select-utils";
import styles from "./select.module.css";

export type { SelectOption } from "./select-utils";
export type SelectProps<Value extends string = string> = Pick<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name" | "form" | "disabled" | "required" | "aria-describedby" | "aria-invalid" | "aria-label"> & {
  label: string;
  value: Value;
  options: readonly SelectOption<Value>[];
  onValueChange: (value: Value) => void;
  placeholder?: string;
  className?: string;
  /** Editable combobox with live, accent-insensitive option/alias matching. */
  autocomplete?: boolean;
  /** Offer an explicit custom entry; only available with autocomplete. */
  allowCustom?: boolean;
  onSearchChange?: (query: string) => void;
  maxLength?: number;
  optional?: boolean;
};
function subscribeToHydration() { return () => {}; }
function clientSnapshot() { return true; }
function serverSnapshot() { return false; }

/**
 * Controlled single selection with native form values and validation.
 * Set `autocomplete` for long lists; options can include `aliases` for search.
 * `allowCustom` requires an explicit choice to commit typed entries.
 * Pass `required` for native form validation, or `optional` for the label hint.
 */
export function Select<Value extends string>({ label, value, options, onValueChange, placeholder = "Seleccioná una opción", className, autocomplete = false, allowCustom = false, onSearchChange, maxLength = 100, optional = false, required, id: providedId, name, form, disabled, "aria-label": ariaLabel, "aria-describedby": describedBy, "aria-invalid": invalid }: SelectProps<Value>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const enhanced = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [validationError, setValidationError] = useState(false);
  const [position, setPosition] = useState<ReturnType<typeof selectPopupPosition>>({ left: 0, width: 0, top: 0, bottom: undefined, maxHeight: 320 });
  const rootRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeaheadRef = useRef({ text: "", time: 0 });
  const search = autocomplete ? searchableLabel(query ?? "") : "";
  const matches: SelectOption<Value>[] = options.filter((option) => [option.label, ...(option.aliases ?? [])].some((text) => searchableLabel(text).includes(search)));
  const custom = autocomplete && allowCustom && query?.trim();
  if (custom && !options.some((option) => [option.value, option.label, ...(option.aliases ?? [])].some((text) => searchableLabel(text) === searchableLabel(custom)))) {
    matches.push({ value: custom as Value, label: `Usar «${custom}»` });
  }
  const selected = options.find((option) => option.value === value);
  const enabledIndices = matches.flatMap((option, index) => option.disabled ? [] : [index]);
  const selectedIndex = matches.findIndex((option) => option.value === value);
  const highlightedIndex = enabledIndices.includes(activeIndex) ? activeIndex : autocomplete ? -1 : enabledIndices.includes(selectedIndex) ? selectedIndex : (enabledIndices[0] ?? -1);
  const unavailable = disabled || (!autocomplete && !options.some((option) => !option.disabled));
  const expanded = isOpen && !unavailable;
  const labelId = `${id}-label`;
  const listId = `${id}-options`;
  const errorId = `${id}-required`;
  const description = [describedBy, validationError ? errorId : ""].filter(Boolean).join(" ") || undefined;
  const closeMenu = useCallback(function closeSelect() { setIsOpen(false); if (!allowCustom) setQuery(null); typeaheadRef.current.text = ""; }, [allowCustom]);

  function focusControl() { (autocomplete ? inputRef.current : triggerRef.current)?.focus({ preventScroll: true }); }
  function positionMenu() {
    const control = controlRef.current;
    if (control) setPosition(selectPopupPosition(control));
  }
  useEffect(function dismissOutsideSelect() {
    if (!expanded) return;
    function handleOutsidePointer(event: globalThis.PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node) && !listRef.current?.contains(event.target as Node)) closeMenu();
    }
    function handleViewportChange(event: Event) {
      if (event.target instanceof Node && listRef.current?.contains(event.target)) return;
      const control = controlRef.current;
      if (!control) return;
      const rect = control.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) closeMenu();
      else setPosition(selectPopupPosition(control));
    }
    document.addEventListener("pointerdown", handleOutsidePointer);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    window.visualViewport?.addEventListener("resize", handleViewportChange);
    window.visualViewport?.addEventListener("scroll", handleViewportChange);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.visualViewport?.removeEventListener("resize", handleViewportChange);
      window.visualViewport?.removeEventListener("scroll", handleViewportChange);
    };
  }, [expanded, autocomplete, closeMenu]);

  useEffect(function keepActiveOptionVisible() {
    if (!expanded) return;
    const list = listRef.current;
    const option = list?.querySelector<HTMLElement>(`[data-option-index="${highlightedIndex}"]`);
    if (!list || !option) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
  }, [expanded, highlightedIndex]);

  function openAt(index: number) { if (!unavailable) { positionMenu(); setActiveIndex(index); setIsOpen(true); } }
  function chooseOption(index: number) {
    const option = matches[index];
    if (!option || option.disabled) return;
    closeMenu(); setQuery(null); setValidationError(false);
    if (option.value !== value) onValueChange(option.value);
  }
  function handleToggle() {
    if (autocomplete) { inputRef.current?.focus(); if (!expanded) openAt(-1); else closeMenu(); }
    else if (expanded) closeMenu();
    else openAt(enabledIndices.includes(selectedIndex) ? selectedIndex : (enabledIndices[0] ?? -1));
  }
  function handleNativeChange(event: ChangeEvent<HTMLSelectElement>) { setQuery(null); setValidationError(false); onValueChange(event.currentTarget.value as Value); }
  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    const text = event.currentTarget.value;
    setQuery(text); setActiveIndex(-1); setIsOpen(true); positionMenu(); onSearchChange?.(text);
  }
  function handleInputFocus() { openAt(-1); }
  function handleInvalid(event: FormEventSelect) {
    if (!enhanced) return;
    event.preventDefault(); setValidationError(true);
    if (!event.currentTarget.form || event.currentTarget.form.querySelector("input:invalid, select:invalid, textarea:invalid") === event.currentTarget) {
      focusControl();
      (autocomplete ? inputRef.current : triggerRef.current)?.scrollIntoView({ block: "center" });
    }
  }
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget) && !listRef.current?.contains(event.relatedTarget)) closeMenu();
  }
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement | HTMLInputElement>) {
    if (event.ctrlKey || event.metaKey || event.nativeEvent.isComposing || unavailable) return;
    const current = enabledIndices.indexOf(highlightedIndex);
    if (event.key === "Escape" && expanded) { event.preventDefault(); event.stopPropagation(); closeMenu(); }
    else if (event.key === "Tab" && expanded) { if (!autocomplete) chooseOption(highlightedIndex); else closeMenu(); }
    else if (event.key === "Enter" || (!autocomplete && event.key === " ")) {
      if (autocomplete && !expanded) return;
      event.preventDefault();
      if (expanded) { if (highlightedIndex >= 0) chooseOption(highlightedIndex); else if (matches.length === 1) chooseOption(0); else if (value) closeMenu(); }
      else handleToggle();
    } else if ((!autocomplete || expanded) && (event.key === "Home" || event.key === "End") && !event.shiftKey) {
      event.preventDefault(); openAt(event.key === "Home" ? enabledIndices[0] : enabledIndices.at(-1) ?? -1);
    } else if (["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) {
      event.preventDefault();
      if (event.altKey && event.key === "ArrowUp" && expanded) { if (highlightedIndex >= 0) chooseOption(highlightedIndex); else closeMenu(); }
      else if (!expanded) openAt(autocomplete ? (enabledIndices[0] ?? -1) : enabledIndices.includes(selectedIndex) ? selectedIndex : (enabledIndices[0] ?? -1));
      else {
        const distance = event.key.startsWith("Page") ? 10 : 1;
        const direction = event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1;
        setActiveIndex(enabledIndices[Math.max(0, Math.min(enabledIndices.length - 1, current < 0 && direction < 0 ? enabledIndices.length - 1 : current + direction * distance))] ?? -1);
      }
    } else if (!autocomplete && event.key.length === 1 && !event.altKey) {
      event.preventDefault();
      const now = event.timeStamp;
      const text = (now - typeaheadRef.current.time < 700 ? typeaheadRef.current.text : "") + searchableLabel(event.key);
      typeaheadRef.current = { text, time: now };
      const repeated = [...text].every((character) => character === text[0]);
      const prefix = repeated ? text[0] : text;
      const start = expanded ? highlightedIndex : selectedIndex;
      for (let step = 0; step < matches.length; step++) {
        const index = (Math.max(0, start) + (repeated || text.length === 1 ? 1 : 0) + step) % matches.length;
        if (!matches[index].disabled && searchableLabel(matches[index].label).startsWith(prefix)) { openAt(index); break; }
      }
    }
  }
  function optionIndex(target: EventTarget) { return target instanceof Element ? Number(target.closest<HTMLElement>("[data-option-index]")?.dataset.optionIndex ?? -1) : -1; }
  function handleOptionClick(event: MouseEvent<HTMLUListElement>) { const index = optionIndex(event.target); if (!matches[index] || matches[index].disabled) return; chooseOption(index); focusControl(); closeMenu(); }
  function handleOptionPointerMove(event: PointerEvent<HTMLUListElement>) { const index = optionIndex(event.target); if (event.pointerType !== "touch" && matches[index] && !matches[index].disabled) setActiveIndex(index); }
  function handleOptionMouseDown(event: MouseEvent<HTMLUListElement>) { event.preventDefault(); }

  const accessible = { "aria-label": ariaLabel, "aria-labelledby": ariaLabel ? undefined : labelId, "aria-haspopup": "listbox" as const, "aria-activedescendant": expanded && highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined, "aria-describedby": description, "aria-invalid": validationError ? true : invalid, "aria-required": required || undefined };
  return <div ref={rootRef} className={`${styles.field}${className ? ` ${className}` : ""}`} data-disabled={unavailable || undefined} onBlur={handleBlur}>
    <label id={labelId} htmlFor={enhanced ? id : `${id}-native`} className={styles.label}>{label}</label>
    <div ref={controlRef} className={styles.control}>
      <select id={`${id}-native`} name={name} form={form} value={value} onChange={handleNativeChange} onInvalid={handleInvalid} required={required} disabled={disabled} tabIndex={enhanced ? -1 : undefined} aria-hidden={enhanced || undefined} className={enhanced ? styles.nativeEnhanced : styles.native} aria-label={ariaLabel} aria-describedby={describedBy} aria-invalid={invalid}>
        {!options.some((option) => option.value === "") && <option value="" disabled hidden>{placeholder}</option>}
        {allowCustom && value && !options.some((option) => option.value === value) && <option value={value}>{value}</option>}
        {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
      </select>
      {!enhanced && <ChevronDown size={18} className={styles.nativeIcon} aria-hidden="true" />}
      {enhanced && (autocomplete ? <div className={styles.searchControl}>
        <Search size={18} aria-hidden="true" className={styles.searchIcon} />
        <input ref={inputRef} id={id} type="text" role="combobox" aria-expanded={expanded} aria-controls={expanded ? listId : undefined} className={styles.searchInput} value={query ?? selected?.label ?? (allowCustom ? value : "")} onChange={handleInput} onClick={handleInputFocus} onFocus={handleInputFocus} onKeyDown={handleKeyDown} disabled={disabled} autoComplete="off" spellCheck={false} maxLength={maxLength} placeholder={placeholder} aria-autocomplete="list" {...accessible} />
        <button type="button" className={styles.toggle} disabled={disabled} tabIndex={-1} aria-label={`Mostrar opciones de ${label.toLowerCase()}`} onClick={handleToggle}><ChevronDown size={18} className={styles.chevron} data-open={expanded} aria-hidden="true" /></button>
      </div> : <button ref={triggerRef} id={id} type="button" role="combobox" aria-expanded={expanded} aria-controls={expanded ? listId : undefined} className={styles.trigger} disabled={unavailable} {...accessible} onClick={handleToggle} onKeyDown={handleKeyDown}>
        <span data-placeholder={!selected || undefined}>{selected?.label ?? placeholder}</span><ChevronDown size={18} className={styles.chevron} data-open={expanded} aria-hidden="true" />
      </button>)}
    </div>
    {validationError && <p id={errorId} className={styles.error}>Seleccioná una opción para continuar.</p>}
    {autocomplete && <span className="sr-only" role="status">{expanded ? `${matches.length} ${matches.length === 1 ? "opción" : "opciones"}. Usá las flechas y Enter para elegir.` : ""}</span>}
    {expanded && createPortal(<ul ref={listRef} id={listId} role="listbox" aria-label={ariaLabel ?? label} className={styles.listbox} style={{ left: position.left, width: position.width, top: position.top, bottom: position.bottom, maxHeight: position.maxHeight }} onClick={handleOptionClick} onPointerMove={handleOptionPointerMove} onMouseDown={handleOptionMouseDown}>
      {matches.map((option, index) => <li key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === value} aria-disabled={option.disabled || undefined} data-option-index={index} data-active={index === highlightedIndex || undefined} className={styles.option}>
        <span>{option.label}{search && option.aliases?.filter((alias) => searchableLabel(alias).includes(search) && searchableLabel(alias) !== searchableLabel(option.label)).map((alias) => <span key={alias} className={styles.alias}> · {alias}</span>)}</span>
        {option.value === value && <Check size={18} aria-hidden="true" />}
      </li>)}
      {!matches.length && <li role="presentation" className={styles.empty}>No encontramos coincidencias. Probá con otro nombre.</li>}
    </ul>, document.body)}
  </div>;
}
type FormEventSelect = import("react").InvalidEvent<HTMLSelectElement>;
