"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import styles from "./faq.module.css";

export function FaqAnswerLink({ id, ready }: { id: string; ready: boolean }) {
  const [status, setStatus] = useState<"idle" | "pending" | "copied" | "manual">("idle");
  const [url, setUrl] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "manual") {
      input.current?.focus();
      input.current?.select();
    }
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus("idle"), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function handleCopy() {
    const address = new URL(window.location.href);
    address.search = "";
    address.hash = `pregunta-${id}`;
    setUrl(address.href);
    setStatus("pending");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(address.href);
      setStatus("copied");
    } catch {
      // HTTP/local browsers may disallow clipboard access; offer a selectable URL.
      setStatus("manual");
    }
  }

  return (
    <div className={styles.answerLink} data-faq-client-only>
      <button type="button" onClick={handleCopy} disabled={!ready || status === "pending"}>
        {status === "copied" ? <Check size={18} aria-hidden="true" /> : <Link2 size={18} aria-hidden="true" />}
        {status === "copied" ? "Enlace copiado" : status === "pending" ? "Copiando…" : "Copiar enlace de esta respuesta"}
      </button>
      <span className="sr-only" role="status">{status === "copied" ? "Enlace copiado al portapapeles." : status === "manual" ? "No pudimos copiar automáticamente. Seleccioná y copiá el enlace." : ""}</span>
      {status === "manual" && <label>Copiá este enlace<input ref={input} readOnly value={url} /></label>}
    </div>
  );
}
