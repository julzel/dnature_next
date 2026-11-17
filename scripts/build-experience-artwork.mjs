import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(root, "public/images/experiences");
const ink = "#092F39";
const mint = "#8FE4D9";

// New walking poses preserve the approved mixed-breed dog and cat identities.
// Each standalone source SVG contains actual traced paths and no bitmap.
function walkingPair(experience, { x, y, width, height }) {
  const source = readFileSync(resolve(destination, `walking-${experience}.svg`), "utf8");
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1].split(/\s+/).map(Number);
  const group = source.match(/<g\s[\s\S]*<\/g>/)?.[0];
  if (!group || !viewBox || viewBox.length !== 4) throw new Error(`Invalid walking-${experience}.svg`);
  const scale = Math.min(width / viewBox[2], height / viewBox[3]);
  const left = x + (width - viewBox[2] * scale) / 2;
  const top = y + (height - viewBox[3] * scale) / 2;
  return `<g id="walking-companions" transform="translate(${left} ${top}) scale(${scale})">${group}</g>`;
}

function line(d, color = ink, width = 2, attributes = "") {
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" ${attributes}/>`;
}

function shape(d, fill, width = 2, stroke = ink) {
  return `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
}

function document(name, title, description, contents) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480" role="img" aria-labelledby="${name}-title ${name}-desc">
<title id="${name}-title">${title} · DNAture</title>
<desc id="${name}-desc">${description}</desc>
<g stroke-linecap="round" stroke-linejoin="round">
${contents.join("\n")}
</g>
</svg>\n`;
}

const guided = [
  '<g id="signpost">',
  shape("M560 76h10v301l-5 9-5-9Z", mint, 2.4),
  line("M564 152v214M567 194v162", ink, 1),
  shape("M501 80h78l34 26-34 26H501Z", mint, 2.5),
  line("M515 106h53m-10-8 10 8-10 8", ink, 3),
  line("M508 87h48M508 125h48M511 121l5-5m2 5 5-5m2 5 5-5m2 5 5-5m2 5 5-5", ink, 1),
  line("M560 264l7-5m-7 14 7-5m-7 14 7-5m-7 14 7-5", ink, 1.2),
  '</g>',
  walkingPair("guided", { x: 24, y: 80, width: 520, height: 340 }),
];

const explore = [
  walkingPair("explore", { x: 24, y: 80, width: 592, height: 340 }),
];

mkdirSync(destination, { recursive: true });
writeFileSync(resolve(destination, "visita-guiada.svg"), document(
  "visita-guiada", "Visita guiada",
  "Un perro mestizo y un gato atigrado caminan juntos hacia la derecha, compartiendo una mirada tranquila junto a un poste indicador. Grabado en tinta y menta, fondo transparente.",
  guided,
));
writeFileSync(resolve(destination, "explorar-por-mi-cuenta.svg"), document(
  "explorar-por-mi-cuenta", "Explorar por mi cuenta",
  "Un gato atigrado camina hacia la izquierda y un perro mestizo hacia la derecha. Sus cuerpos y miradas apuntan en direcciones opuestas, con actitud tranquila. Grabado en tinta y menta, fondo transparente.",
  explore,
));
const manifest = {
  schema_version: "3.0.0",
  name: "DNAture mixed-breed walking companions and experience choices",
  format: "svg",
  view_box: [0, 0, 640, 480],
  background: "transparent",
  palette: { ink, mint },
  recommended_min_width_px: 192,
  provenance: {
    type: "Reference-guided mixed-breed walking illustrations converted into native SVG paths; mint-and-ink signpost for guided choice",
    source_record: "docs/graphic-design/artwork-sources/walking-companions/mixed-breed-generation.json",
    walking_sources: ["guided", "explore"].map((experience) => ({
      path: `public/images/experiences/walking-${experience}.svg`,
      sha256: createHash("sha256").update(readFileSync(resolve(destination, `walking-${experience}.svg`))).digest("hex"),
    })),
    generator: "scripts/build-experience-artwork.mjs",
    regenerate: "node scripts/build-experience-artwork.mjs",
    vectorizer: "scripts/trace-walking-artwork.py",
    method: "Distinct walking poses generated from the approved mixed-breed dog and cat references, then traced with vtracer 0.6.15 into ink/mint paths. No embedded bitmap, external dependency, filter or font in the SVGs.",
  },
  assets: [
    { id: "guided", label_es: "Visita guiada", path: "/images/experiences/visita-guiada.svg", meaning: "Accompanied, personalized experience", motif: "Mixed-breed dog and tabby cat walk right together and exchange a glance beside a mint-and-ink signpost" },
    { id: "explore", label_es: "Explorar por mi cuenta", path: "/images/experiences/explorar-por-mi-cuenta.svg", meaning: "Independent discovery", motif: "Tabby cat walks left and mixed-breed dog walks right, calmly exploring independently" },
  ],
  standalone_pairs: [
    { id: "walking-guided", path: "/images/experiences/walking-guided.svg", direction: "right" },
    { id: "walking-explore", path: "/images/experiences/walking-explore.svg", direction: "cat-left, dog-right" },
  ],
  usage_rules: [
    "Both experiences support cats and dogs. The guided pair walks together; the exploration pair parts calmly in opposite directions.",
    "Preserve the approved mixed-breed dog and cat identities, natural walking gait, and intended directions.",
    "Keep the experience name visible beside the artwork; the illustration does not replace the control label.",
    "Use empty alt when the adjacent control already supplies the experience name.",
    "Place directly on a continuous light surface. Preserve the 4:3 experience canvas and the intrinsic ratio of standalone pairs.",
    "Do not add cards, circular masks, shadows, or category colors.",
    "Use only ink and mint in these illustrations. Do not add dotted paths, stars, compasses, or orange accents.",
    "The artwork is static. Any UI reveal must honor reduced motion.",
  ],
  react_component: "features/experience/components/experience-choice-image.tsx",
  preview: "docs/graphic-design/experience-assets-preview.html",
};
writeFileSync(resolve(destination, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log("Generated both experience SVGs using the new walking companions.");
