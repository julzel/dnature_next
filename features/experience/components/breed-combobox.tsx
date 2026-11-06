"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FocusEvent, type KeyboardEvent, type MouseEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { getBreeds, normalizeBreed, type PetSpecies } from "../data/pet-breeds";
import styles from "./breed-combobox.module.css";

type BreedComboboxProps = {
  species: PetSpecies;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function BreedCombobox({ species, value, onChange, error }: BreedComboboxProps) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const breeds = getBreeds(species);
  const search = normalizeBreed(query === value ? "" : query);
  const matches = breeds.filter((breed) => normalizeBreed(`${breed.label} ${breed.aliases ?? ""}`).includes(search));
  const options = matches.slice(0, 8).map((breed) => ({ value: breed.label, label: breed.label }));
  const custom = query.trim();
  if (search && !breeds.some((breed) => normalizeBreed(breed.label) === normalizeBreed(custom))) {
    options.push({ value: custom, label: `Usar «${custom}»` });
  }

  useEffect(function revealActiveOption() {
    if (open && activeIndex >= 0) list.current?.children.item(activeIndex)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  function selectOption(index: number) {
    const option = options[index];
    if (!option) return;
    setQuery(option.value);
    onChange(option.value);
    setOpen(false);
    setActiveIndex(-1);
    input.current?.focus({ preventScroll: true });
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    onChange("");
    setOpen(true);
    setActiveIndex(-1);
  }

  function handleFocus() { setOpen(true); }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      const next = event.key === "ArrowDown" ? activeIndex + 1 : activeIndex < 0 ? options.length - 1 : activeIndex - 1;
      setActiveIndex(Math.max(0, Math.min(options.length - 1, next)));
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      if (activeIndex >= 0) selectOption(activeIndex);
      else if (value) setOpen(false);
      else if (options.length === 1) selectOption(0);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  function handleOptionMouseDown(event: MouseEvent<HTMLUListElement>) { event.preventDefault(); }

  function handleOptionClick(event: MouseEvent<HTMLUListElement>) {
    const option = (event.target as Element).closest<HTMLElement>("[data-option-index]");
    if (option) selectOption(Number(option.dataset.optionIndex));
  }

  return (
    <div className={styles.combobox} onBlur={handleBlur}>
      <label className={styles.label} htmlFor={id}>Raza</label>
      <div className={styles.field}>
        <input
          ref={input} id={id} name="breed" type="text" role="combobox"
          value={query} onChange={handleInput} onFocus={handleFocus} onKeyDown={handleKeyDown}
          aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-options`}
          aria-activedescendant={open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined}
          aria-invalid={Boolean(error)} aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
          placeholder="Escribí para buscar" autoComplete="off" maxLength={80}
        />
        <ChevronDown size={24} aria-hidden="true" />
      {open && (
        <ul ref={list} id={`${id}-options`} className={styles.options} role="listbox" aria-label="Razas sugeridas" onMouseDown={handleOptionMouseDown} onClick={handleOptionClick}>
          {options.map((option, index) => (
            <li key={option.label} id={`${id}-option-${index}`} role="option" aria-selected={value === option.value}
              data-option-index={index} data-active={activeIndex === index}>
              <span>{option.label}</span>{value === option.value && <Check size={18} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
      </div>
      <p id={`${id}-help`} className={styles.help}>Podés elegir mestizo, indicar que no lo sabés o agregar una raza que no aparezca.</p>
      <span className="sr-only" role="status">{open ? `${matches.length} sugerencias. Usá las flechas y Enter para elegir.` : ""}</span>
      {error && <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
