import { Plus } from "lucide-react";
import Link from "next/link";
import faq from "../data/faq.json";
import styles from "./faq.module.css";

type Question = (typeof faq.questions)[number];

export function FaqQuestion({ question }: { question: Question }) {
  return (
    <details id={`pregunta-${question.id}`} className={styles.question}>
      <summary>
        <span>{question.question}</span>
        <Plus className={styles.plus} size={24} strokeWidth={1.5} aria-hidden="true" />
      </summary>
      <div className={styles.reveal}>
        <div className={styles.answer}>
          {question.answer_blocks.map((block, index) => block.type === "unordered-list" || block.type === "ordered-list" ? (
            block.type === "ordered-list" ? <ol key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ol> : <ul key={index}>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
          ) : <p key={index} className={block.type === "note" ? styles.answerNote : undefined}>{block.text}</p>)}
          {question.links.length > 0 && <ul className={styles.relatedLinks}>{question.links.map((link) => <li key={link.url}><Link href={link.url}>{link.label}</Link></li>)}</ul>}
          {question.sources.length > 0 && <div className={styles.sources}>
            <p>Fuentes de orientación</p>
            <ul>{question.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}<span className="sr-only"> (abre en otra pestaña)</span></a></li>)}</ul>
          </div>}
        </div>
      </div>
    </details>
  );
}
