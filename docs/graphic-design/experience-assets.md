# DNAture mixed-breed walking companions

The experience illustrations use the approved stray characters: the medium,
slightly scruffy mixed-breed dog with semi-folded ears and the domestic shorthair
tabby cat. Both scenes contain new walking poses generated from those character
references and the DNAture engraving style, then traced into native SVG paths.

| Choice | Complete illustration | Standalone walking pair |
| --- | --- | --- |
| Visita guiada | [visita-guiada.svg](../../public/images/experiences/visita-guiada.svg) — both walking right and sharing a glance beside a mint-and-ink signpost. | [walking-guided.svg](../../public/images/experiences/walking-guided.svg) |
| Explorar por mi cuenta | [explorar-por-mi-cuenta.svg](../../public/images/experiences/explorar-por-mi-cuenta.svg) — cat walking left and dog walking right, exploring independently. | [walking-explore.svg](../../public/images/experiences/walking-explore.svg) |

[Open the visual preview](experience-assets-preview.html). The
[manifest](../../public/images/experiences/manifest.json) records meaning,
vector hashes, palette, and reuse instructions. The current PNG masters, exact
prompts, reference identities, source hashes, and tracing settings are recorded in
[the mixed-breed generation record](artwork-sources/walking-companions/mixed-breed-generation.json).

## Use

- Complete scenes: 640 × 480, 4:3. Standalone pairs: 1536 × 1024, 3:2.
- Transparent native SVG paths; no embedded bitmap, font, external resource,
  filter, or animation. PNG masters are source artwork, not runtime assets.
- Use only ink `#092F39` and mint `#8FE4D9`. No dotted paths, stars, compasses,
  or orange accents in these illustrations.
- Keep the walking direction and mixed-breed identities. Both experiences
  include dogs and cats; the species does not determine the experience.
- Recommended display width: at least 192px. Preserve transparent margins and
  place directly on a continuous light surface without masks or shadows.
- Keep visible choice labels. Use empty alt when the adjacent control names the
  experience; provide contextual alt when the image stands alone.

The arrival dialog and reusable `ExperienceOptions` section share
`ExperienceChoiceImage`. Both receive the replacement assets at the existing
paths. The optional UI reveal honors reduced motion.

```tsx
<ExperienceChoiceImage experience="guided" />
<ExperienceChoiceImage experience="explore" />
```

## Rebuild

The original PNG masters remain unchanged. The tracer creates temporary masks
for palette quantization and traces them with `vtracer==0.6.15`. Pillow and
vtracer are artwork-tool dependencies, not application dependencies.

```sh
python3 scripts/trace-walking-artwork.py \
  docs/graphic-design/artwork-sources/walking-companions/mixed-breed-guided-source.png \
  public/images/experiences/walking-guided.svg \
  --title 'Compañeros mestizos de paseo · DNAture' \
  --description 'Un perro mestizo y un gato atigrado caminan juntos hacia la derecha y comparten una mirada tranquila. Grabado en tinta y menta, fondo transparente.' \
  --ink-threshold 0.6

python3 scripts/trace-walking-artwork.py \
  docs/graphic-design/artwork-sources/walking-companions/mixed-breed-explore-source.png \
  public/images/experiences/walking-explore.svg \
  --title 'Cada uno a su rumbo · DNAture' \
  --description 'Un gato atigrado camina hacia la izquierda y un perro mestizo hacia la derecha, explorando con tranquilidad. Grabado en tinta y menta, fondo transparente.' \
  --ink-threshold 0.6

node scripts/build-experience-artwork.mjs
```

The builder preserves the shared 4:3 canvas and the guided signpost, without
reintroducing removed decorations. Re-render at large and UI sizes after changes.
Earlier PNG masters and generation records remain historical references;
`mixed-breed-generation.json` identifies the current sources.
