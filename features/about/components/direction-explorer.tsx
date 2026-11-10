"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { directions } from "../data/about-content";
import styles from "./direction-explorer.module.css";

export function DirectionExplorer() {
  const [selected, setSelected] = useState<string>(directions[0].id);

  function handleSelect(event: MouseEvent<HTMLButtonElement>) {
    setSelected(event.currentTarget.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = directions.findIndex((direction) => direction.id === event.currentTarget.value);
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % directions.length; break;
      case "ArrowLeft": next = (index - 1 + directions.length) % directions.length; break;
      case "Home": next = 0; break;
      case "End": next = directions.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(directions[next].id);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[next].focus();
  }

  return (
    <div className={styles.explorer}>
      <div className={styles.tabs} role="tablist" aria-label="Explorá nuestra misión y visión">
        {directions.map((direction) => (
          <button
            key={direction.id}
            id={`about-${direction.id}-tab`}
            role="tab"
            type="button"
            value={direction.id}
            aria-selected={selected === direction.id}
            aria-controls={`about-${direction.id}-panel`}
            tabIndex={selected === direction.id ? 0 : -1}
            onClick={handleSelect}
            onKeyDown={handleKeyDown}
          >
            {direction.label}
          </button>
        ))}
      </div>
      {directions.map((direction) => (
        <div
          key={direction.id}
          id={`about-${direction.id}-panel`}
          className={styles.panel}
          role="tabpanel"
          aria-labelledby={`about-${direction.id}-tab`}
          hidden={selected !== direction.id}
          tabIndex={0}
        >
          <div className={styles.panelHeading}>
            <p className={styles.horizon}>{direction.horizon}</p>
            <h3>{direction.heading}</h3>
          </div>
          <div className={styles.copy}>
            <p>{direction.description}</p>
            <p>{direction.detail}</p>
          </div>
          <ul className={styles.principles} aria-label={`Ejes de nuestra ${direction.label.toLowerCase()}`}>
            {direction.principles.map((principle) => <li key={principle}>{principle}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
