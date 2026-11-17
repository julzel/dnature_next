"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type MouseEvent } from "react";
import faq from "../data/faq.json";

function subscribeToHydration() { return () => {}; }
function clientSnapshot() { return true; }
function serverSnapshot() { return false; }

/** Keep native anchors usable, including bookmarked answers and browser history. */
export function useFaqNavigation() {
  const [query, setQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
  const [destination, setDestination] = useState("");
  const ready = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function restoreAnchor() {
      const anchor = window.location.hash.slice(1);
      const question = faq.questions.find((item) => `pregunta-${item.id}` === anchor);
      const topic = faq.topics.find((item) => `tema-${item.id}` === anchor);
      setQuery("");
      setActiveTopic(question?.topic_id ?? topic?.id ?? "all");
      setDestination(question || topic ? anchor : "");
    }
    restoreAnchor();
    window.addEventListener("hashchange", restoreAnchor);
    window.addEventListener("popstate", restoreAnchor);
    return () => {
      window.removeEventListener("hashchange", restoreAnchor);
      window.removeEventListener("popstate", restoreAnchor);
    };
  }, []);

  useEffect(() => {
    if (!destination) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(destination) ?? document.getElementById("faq-results");
      if (!target) return;
      if (target instanceof HTMLDetailsElement) target.open = true;
      const focusTarget = target instanceof HTMLDetailsElement ? target.querySelector<HTMLElement>("summary") : target.querySelector<HTMLElement>("h3") ?? target;
      focusTarget?.focus({ preventScroll: true });
      target.scrollIntoView({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [destination, activeTopic]);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.currentTarget.value);
    setActiveTopic("all");
    setDestination("");
    window.history.replaceState(null, "", "#respuestas");
  }

  function handleClear() {
    setQuery("");
    input.current?.focus();
  }

  function handleReset() {
    setActiveTopic("all");
    setQuery("");
    setDestination("");
    window.history.pushState(null, "", "#respuestas");
    input.current?.focus();
  }

  function handleNavigate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.currentTarget.hash.slice(1);
    const question = faq.questions.find((item) => `pregunta-${item.id}` === anchor);
    const topic = faq.topics.find((item) => `tema-${item.id}` === anchor);
    event.preventDefault();
    const picker = event.currentTarget.closest<HTMLDetailsElement>("details[data-faq-topics]");
    if (picker) picker.open = false;
    setActiveTopic(question?.topic_id ?? topic?.id ?? "all");
    if (question) setQuery("");
    setDestination(anchor);
    window.history.pushState(null, "", `#${anchor}`);
    // The target may already be selected; keep repeated clicks useful too.
    if (anchor === destination) {
      const target = document.getElementById(anchor);
      if (target instanceof HTMLDetailsElement) target.open = true;
      target?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  return { query, activeTopic, ready, input, handleSearchChange, handleClear, handleReset, handleNavigate };
}
