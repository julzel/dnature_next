"use client";

import { useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { directions } from "../data/about-content";
import styles from "./direction-explorer.module.css";

export function DirectionExplorer() {
  const [selected, setSelected] = useState(0);

  function handleSelect(event: MouseEvent<HTMLButtonElement>) {
    setSelected(directions.findIndex((direction) => direction.id === event.currentTarget.value));
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
    setSelected(next);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[next].focus();
  }

  return (
    <div className={styles.explorer} style={{ "--selected-index": selected } as CSSProperties}>
      <div className={styles.tabRule}>
        <div className={styles.tabs} role="tablist" aria-label="Explorá nuestra misión y visión">
          {directions.map((direction, index) => (
            <button
              key={direction.id}
              id={`about-${direction.id}-tab`}
              role="tab"
              type="button"
              value={direction.id}
              aria-selected={selected === index}
              aria-controls={`about-${direction.id}-panel`}
              tabIndex={selected === index ? 0 : -1}
              onClick={handleSelect}
              onKeyDown={handleKeyDown}
            >
              {direction.label}
            </button>
          ))}
          <span className={styles.marker} aria-hidden="true" />
        </div>
      </div>
      <div className={styles.panelViewport}>
        <div className={styles.panelTrack}>
          {directions.map((direction, index) => (
            <div
              key={direction.id}
              id={`about-${direction.id}-panel`}
              className={styles.panel}
              role="tabpanel"
              aria-labelledby={`about-${direction.id}-tab`}
              aria-hidden={selected !== index}
              inert={selected !== index}
              tabIndex={selected === index ? 0 : -1}
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
      </div>
    </div>
  );
}
