export function productText(value: string | undefined): string {
  if (!value) return "";
  const entities: Record<string, string> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, code: string) => {
    if (!code.startsWith("#")) return entities[code.toLowerCase()] ?? entity;
    const number = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : " ";
  }).replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[^]*?-->/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\S\n]+/g, " ").trim();
}

