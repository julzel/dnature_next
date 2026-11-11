"use client";

import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type ChangeEvent, type FocusEvent, type KeyboardEvent, type MouseEvent, type PointerEvent, type SelectHTMLAttributes } from "react";
import styles from "./select.module.css";

export type SelectOption<Value extends string = string> = {
  value: Value;
  label: string;
  disabled?: boolean;
};

type SelectProps<Value extends string> = Pick<SelectHTMLAttributes<HTMLSelectElement>, "id" | "name" | "form" | "disabled" | "aria-describedby" | "aria-invalid"> & {
  label: string;
  value: Value;
  options: readonly SelectOption<Value>[];
  onValueChange: (value: Value) => void;
  placeholder?: string;
  className?: string;
};

function subscribeToHydration() { return () => {}; }
function clientSnapshot() { return true; }
function serverSnapshot() { return false; }
function searchableLabel(label: string) {
  return label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
function popupPosition(trigger: HTMLButtonElement) {
  const rect = trigger.getBoundingClientRect();
  const below = window.innerHeight - rect.bottom - 8;
  const above = rect.top - 8;
  const openAbove = below < Math.min(240, above);
  return { side: openAbove ? "top" : "bottom", maxHeight: Math.max(48, Math.min(320, openAbove ? above : below)) };
}

/** A controlled single select with a native HTML fallback and native form values. */
export function Select<Value extends string>({ label, value, options, onValueChange, placeholder = "Seleccioná una opción", className, id: providedId, name, form, disabled, "aria-describedby": describedBy, "aria-invalid": invalid }: SelectProps<Value>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const enhanced = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [position, setPosition] = useState({ side: "bottom", maxHeight: 320 });
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeaheadRef = useRef({ text: "", time: 0 });
  const selectedIndex = options.findIndex((option) => option.value === value);
  const enabledIndices = options.flatMap((option, index) => option.disabled ? [] : [index]);
  const highlightedIndex = enabledIndices.includes(activeIndex) ? activeIndex : enabledIndices.includes(selectedIndex) ? selectedIndex : (enabledIndices[0] ?? -1);
  const unavailable = disabled || enabledIndices.length === 0;
  const expanded = isOpen && !unavailable;
  const labelId = `${id}-label`;
  const listId = `${id}-options`;
  const closeMenu = useCallback(function closeSelect() {
    setIsOpen(false);
    typeaheadRef.current.text = "";
  }, []);

  useEffect(function dismissOutsideSelect() {
    if (!expanded) return;
    function handleOutsidePointer(event: globalThis.PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu();
    }
    function handleViewportChange(event: Event) {
      if (event.target instanceof Node && listRef.current?.contains(event.target)) return;
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) closeMenu();
      else setPosition(popupPosition(trigger));
    }
    document.addEventListener("pointerdown", handleOutsidePointer);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [expanded, closeMenu]);

  useEffect(function keepActiveOptionVisible() {
    if (!expanded) return;
    const list = listRef.current;
    const option = list?.children[highlightedIndex] as HTMLElement | undefined;
    if (!list || !option) return;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [expanded, highlightedIndex]);

  function openAt(index: number) {
    if (unavailable) return;
    if (triggerRef.current) setPosition(popupPosition(triggerRef.current));
    setActiveIndex(index);
    setIsOpen(true);
  }

  function chooseOption(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    closeMenu();
    if (option.value !== value) onValueChange(option.value);
  }

  function handleToggle() {
    typeaheadRef.current.text = "";
    if (expanded) closeMenu();
    else openAt(enabledIndices.includes(selectedIndex) ? selectedIndex : enabledIndices[0]);
  }

  function handleNativeChange(event: ChangeEvent<HTMLSelectElement>) {
    const option = options.find((item) => item.value === event.currentTarget.value);
    if (option && !option.disabled) onValueChange(option.value);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.ctrlKey || event.metaKey || event.nativeEvent.isComposing || unavailable) return;
    const current = enabledIndices.indexOf(highlightedIndex);
    if (event.key === "Escape" && expanded) {
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
    } else if (event.key === "Tab" && expanded) {
      chooseOption(highlightedIndex);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (expanded) chooseOption(highlightedIndex);
      else handleToggle();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      openAt(event.key === "Home" ? enabledIndices[0] : enabledIndices[enabledIndices.length - 1]);
    } else if (["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) {
      event.preventDefault();
      if (event.altKey && event.key === "ArrowUp" && expanded) chooseOption(highlightedIndex);
      else if (!expanded) openAt(enabledIndices.includes(selectedIndex) ? selectedIndex : enabledIndices[0]);
      else {
        const distance = event.key.startsWith("Page") ? 10 : 1;
        const direction = event.key === "ArrowDown" || event.key === "PageDown" ? 1 : -1;
        setActiveIndex(enabledIndices[Math.max(0, Math.min(enabledIndices.length - 1, current + direction * distance))]);
      }
    } else if (event.key.length === 1 && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const text = (now - typeaheadRef.current.time < 700 ? typeaheadRef.current.text : "") + searchableLabel(event.key);
      typeaheadRef.current = { text, time: now };
      const repeated = [...text].every((character) => character === text[0]);
      const query = repeated ? text[0] : text;
      const start = expanded ? highlightedIndex : selectedIndex;
      const offset = repeated || text.length === 1 ? 1 : 0;
      for (let step = 0; step < options.length; step++) {
        const index = (Math.max(0, start) + offset + step) % options.length;
        if (!options[index].disabled && searchableLabel(options[index].label).startsWith(query)) {
          openAt(index);
          break;
        }
      }
    }
  }

  function optionIndex(target: EventTarget) {
    const element = target instanceof Element ? target.closest<HTMLElement>("[data-option-index]") : null;
    return element ? Number(element.dataset.optionIndex) : -1;
  }

  function handleOptionClick(event: MouseEvent<HTMLUListElement>) {
    chooseOption(optionIndex(event.target));
    triggerRef.current?.focus({ preventScroll: true });
  }

  function handleOptionPointerMove(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType === "touch") return;
    const index = optionIndex(event.target);
    if (options[index] && !options[index].disabled) setActiveIndex(index);
  }

  function handleOptionMouseDown(event: MouseEvent<HTMLUListElement>) {
    event.preventDefault();
  }

  return (
    <div ref={rootRef} className={`${styles.field}${className ? ` ${className}` : ""}`} data-disabled={unavailable || undefined} onBlur={handleBlur}>
      <label id={labelId} htmlFor={enhanced ? id : `${id}-native`} className={styles.label}>{label}</label>
      <div className={styles.control}>
        <select id={`${id}-native`} name={name} form={form} value={value} onChange={handleNativeChange} disabled={disabled} hidden={enhanced} className={styles.native} aria-describedby={describedBy} aria-invalid={invalid}>
          {!options.some((option) => option.value === "") && <option value="" disabled hidden>{placeholder}</option>}
          {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
        </select>
        {!enhanced && <ChevronDown size={18} className={styles.nativeIcon} aria-hidden="true" />}
        {enhanced && <button ref={triggerRef} id={id} type="button" role="combobox" className={styles.trigger} disabled={unavailable} aria-expanded={expanded} aria-haspopup="listbox" aria-controls={expanded ? listId : undefined} aria-labelledby={labelId} aria-activedescendant={expanded && highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined} aria-describedby={describedBy} aria-invalid={invalid} onClick={handleToggle} onKeyDown={handleKeyDown}>
          <span>{options[selectedIndex]?.label ?? placeholder}</span>
          <ChevronDown size={18} className={styles.chevron} aria-hidden="true" />
        </button>}
        {expanded && <ul ref={listRef} id={listId} role="listbox" aria-labelledby={labelId} className={styles.listbox} data-side={position.side} style={{ maxBlockSize: position.maxHeight }} onClick={handleOptionClick} onPointerMove={handleOptionPointerMove} onMouseDown={handleOptionMouseDown}>
          {options.map((option, index) => <li key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={option.value === value} aria-disabled={option.disabled || undefined} data-option-index={index} data-active={index === highlightedIndex || undefined} className={styles.option}>
            <span>{option.label}</span>
            {option.value === value && <Check size={18} aria-hidden="true" />}
          </li>)}
        </ul>}
      </div>
    </div>
  );
}
