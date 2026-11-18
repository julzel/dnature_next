import type { MouseEventHandler } from "react";
import type { searchFaq } from "../lib/search";
import { FaqTopicIcon } from "./faq-topic-icon";
import styles from "./faq.module.css";

type Props = {
  groups: ReturnType<typeof searchFaq>;
  activeTopic: string;
  onNavigate: MouseEventHandler<HTMLAnchorElement>;
};

export function FaqTopicNav({ groups, activeTopic, onNavigate }: Props) {
  const total = groups.reduce((sum, group) => sum + group.questions.length, 0);
  const topics = [{ id: "all", label: "Todos los temas", count: total }, ...groups.map((group) => ({ id: group.id, label: group.label, count: group.questions.length }))];
  return (
    <nav className={styles.topicNav} aria-label="Temas de preguntas frecuentes">
      <p>Explorá por tema</p>
      <ul>
        {topics.map((topic) => <li key={topic.id}>
          <a href={topic.id === "all" ? "#respuestas" : `#tema-${topic.id}`} aria-current={activeTopic === topic.id ? "true" : undefined} onClick={onNavigate}>
            <FaqTopicIcon topic={topic.id} />
            <span>{topic.label}</span>
            <span className={styles.topicCount} aria-label={`${topic.count} preguntas`}>{topic.count}</span>
          </a>
        </li>)}
      </ul>
    </nav>
  );
}
