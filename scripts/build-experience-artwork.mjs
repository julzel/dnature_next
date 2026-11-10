import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(root, "public/images/experiences");
const ink = "#092F39";
const mint = "#8FE4D9";
const teal = "#00A9B5";
const orange = "#FF6A00";

// These are new walking drawings, not the original species-selection animals.
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
  '<g id="guided-route">',
  line("M55 434C174 457 316 451 435 434S555 418 565 385", teal, 3, 'stroke-dasharray="3 10"'),
  shape("M50 429h10v10H50Z", orange, 0, "none"),
  line("M549 387h33M555 393h20", ink, 1.5),
  '</g>',
  '<g id="signpost">',
  shape("M560 76h10v301l-5 9-5-9Z", mint, 2.4),
  line("M564 152v214M567 194v162", ink, 1),
  shape("M501 80h78l34 26-34 26H501Z", mint, 2.5),
  shape("M573 81l33 25-33 25h10l30-25-34-26Z", orange, 0, "none"),
  line("M515 106h53m-10-8 10 8-10 8", ink, 3),
  line("M508 87h48M508 125h48M511 121l5-5m2 5 5-5m2 5 5-5m2 5 5-5m2 5 5-5", ink, 1),
  line("M560 264l7-5m-7 14 7-5m-7 14 7-5m-7 14 7-5", ink, 1.2),
  '</g>',
  walkingPair("guided", { x: 24, y: 80, width: 520, height: 340 }),
];

const explore = [
  '<g id="branching-routes">',
  line("M320 460V422", teal, 3, 'stroke-dasharray="3 10"'),
  line("M320 422C260 447 150 448 46 416M320 422C400 448 508 440 594 402", teal, 3, 'stroke-dasharray="3 10"'),
  line("M58 410l-14 6 9 12M582 396l14 6-7 13", ink, 2),
  shape("M316 418h8v8h-8Z", orange, 0, "none"),
  '</g>',
  '<g id="compass" transform="translate(260.5 4) scale(.7)">',
  line("M85 48v13m0 118v13M16 120h13m112 0h13", ink, 2),
  line("M38 73l9 9m76 76 9 9M38 167l9-9m76-76 9-9", teal, 1.5),
  shape("M85 65l11 44 44 11-44 11-11 44-11-44-44-11 44-11Z", mint, 2.5),
  shape("M85 65v55l11-11Z", orange, 0, "none"),
  shape("M85 120v55l-11-44Z", ink, 0, "none"),
  line("M30 120h110M74 109l22 22m-22 0 22-22", ink, 1.2),
  '</g>',
  walkingPair("explore", { x: 24, y: 164, width: 592, height: 288 }),
];

mkdirSync(destination, { recursive: true });
writeFileSync(resolve(destination, "visita-guiada.svg"), document(
  "visita-guiada", "Visita guiada",
  "Un nuevo perro de orejas caídas y un gato de cola larga caminan juntos hacia la derecha, compartiendo una mirada tranquila. Un poste indicador y una ruta única acompañan su paseo. Grabado en tinta y menta, fondo transparente.",
  guided,
));
writeFileSync(resolve(destination, "explorar-por-mi-cuenta.svg"), document(
  "explorar-por-mi-cuenta", "Explorar por mi cuenta",
  "En una bifurcación, el gato camina hacia la izquierda y el perro hacia la derecha. Sus cuerpos y miradas apuntan en direcciones opuestas, con actitud tranquila. Una brújula acompaña la elección de caminos. Grabado en tinta y menta, fondo transparente.",
  explore,
));
const manifest = {
  schema_version: "2.1.0",
  name: "DNAture walking companions and experience choices",
  format: "svg",
  view_box: [0, 0, 640, 480],
  background: "transparent",
  palette: { ink, mint, teal, orange },
  recommended_min_width_px: 192,
  provenance: {
    type: "New AI-generated walking illustrations converted into native SVG paths; authored vector navigation motifs",
    source_record: "docs/graphic-design/artwork-sources/walking-companions/generation.json",
    walking_sources: ["guided", "explore"].map((experience) => ({
      path: `public/images/experiences/walking-${experience}.svg`,
      sha256: createHash("sha256").update(readFileSync(resolve(destination, `walking-${experience}.svg`))).digest("hex"),
    })),
    generator: "scripts/build-experience-artwork.mjs",
    regenerate: "node scripts/build-experience-artwork.mjs",
    vectorizer: "scripts/trace-walking-artwork.py",
    method: "Distinct walking poses generated for each scene, then traced with vtracer 0.6.15 into ink/mint paths. No animal paths are reused from the original species-selection assets. No embedded bitmap, external dependency, filter or font in the SVGs.",
  },
  assets: [
    { id: "guided", label_es: "Visita guiada", path: "/images/experiences/visita-guiada.svg", meaning: "Accompanied, personalized experience", motif: "New dog and cat walk right together and exchange a glance; signpost and one route" },
    { id: "explore", label_es: "Explorar por mi cuenta", path: "/images/experiences/explorar-por-mi-cuenta.svg", meaning: "Independent discovery", motif: "Cat walks outward left and dog outward right, choosing opposite branches from one central fork; compass above" },
  ],
  standalone_pairs: [
    { id: "walking-guided", path: "/images/experiences/walking-guided.svg", direction: "right" },
    { id: "walking-explore", path: "/images/experiences/walking-explore.svg", direction: "cat-left, dog-right" },
  ],
  usage_rules: [
    "Both experiences support cats and dogs. The guided pair walks together; the exploration pair parts calmly toward opposite branches.",
    "Preserve each pair's natural walking gait and intended directions; do not substitute the old standing dog or crouching cat.",
    "Keep the experience name visible beside the artwork; the illustration does not replace the control label.",
    "Use empty alt when the adjacent control already supplies the experience name.",
    "Place directly on a continuous light surface. Preserve the 4:3 experience canvas and the intrinsic ratio of standalone pairs.",
    "Do not add cards, circular masks, shadows, or category colors.",
    "Orange is the approved brand accent, not a product category identifier.",
    "The artwork is static. Any UI reveal must honor reduced motion.",
  ],
  react_component: "features/experience/components/experience-choice-image.tsx",
  preview: "docs/graphic-design/experience-assets-preview.html",
};
writeFileSync(resolve(destination, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log("Generated both experience SVGs using the new walking companions.");
