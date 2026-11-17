import faq from "../data/faq.json";

export function normalizeFaqText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

const searchIndex = new Map(faq.questions.map((question) => {
  const topic = faq.topics.find((item) => item.id === question.topic_id);
  const content = question.answer_blocks.flatMap((block) => [block.text, ...block.items]);
  return [question.id, normalizeFaqText([question.question, ...content, ...question.search_terms, topic?.label, topic?.description].join(" "))];
}));

const alternatives: Record<string, string[]> = {
  envio: ["envio", "entrega"],
  envios: ["envio", "entrega"],
  entregas: ["entrega"],
  porciones: ["porcion"],
  raciones: ["racion", "porcion"],
  alergias: ["alergia"],
};

export function searchFaq(query: string) {
  const terms = normalizeFaqText(query).split(/\s+/).filter(Boolean).map((term) => alternatives[term] ?? [term]);
  return faq.topics.map((topic) => ({
    ...topic,
    questions: faq.questions.filter((question) => question.topic_id === topic.id && terms.every((options) => options.some((term) => searchIndex.get(question.id)!.includes(term)))),
  }));
}
