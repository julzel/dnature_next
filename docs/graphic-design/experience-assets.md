# DNAture walking companions

Two newly generated walking illustrations replace the original standing dog and
crouching cat in the experience scenes. The new soft-coated dog has floppy ears
and a feathered tail; the new slender cat has a long raised tail. The guided
pair walks together and shares a glance. In the exploration scene, the cat
walks left and the dog walks right, calmly choosing separate paths.

The new drawings were created with the built-in image generator using the
DNAture engraving skill, then converted to actual two-color SVG paths. They
are not copies, flips, or rearrangements of the original species-selection
animals. The two scenes use different generated poses. Existing species
selection assets in `public/images/pets/` remain unchanged.

| Choice | Complete illustration | Standalone walking pair |
| --- | --- | --- |
| Visita guiada | [visita-guiada.svg](../../public/images/experiences/visita-guiada.svg) — both walking right, sharing a glance, beside one route and a signpost. | [walking-guided.svg](../../public/images/experiences/walking-guided.svg) |
| Explorar por mi cuenta | [explorar-por-mi-cuenta.svg](../../public/images/experiences/explorar-por-mi-cuenta.svg) — cat walking outward left and dog outward right, with a compass above and two routes branching from a central fork. | [walking-explore.svg](../../public/images/experiences/walking-explore.svg) |

[Open the visual preview](experience-assets-preview.html). The
[AI-readable manifest](../../public/images/experiences/manifest.json) records
meaning, source hashes, palette, and reuse instructions. The original generated
PNGs and exact prompts are preserved in
[the generation record](artwork-sources/walking-companions/generation.json).

## Use

- Complete scenes: 640 × 480, 4:3. Standalone pairs retain their intrinsic ratios.
- All SVGs have transparent backgrounds and contain vector paths, with no
  embedded bitmap, font, external resource, filter, or animation.
- The original generated PNGs are source artwork, not runtime website assets.
- Recommended scene display width: at least 192px. Keep visible choice labels.
- Use ink `#092F39` and mint `#8FE4D9` for the animals. Turquoise `#00A9B5` and
  orange `#FF6A00` identify routes and navigation motifs.
- Place directly on a continuous light surface, preserving transparent edges.
  Do not add cards, rounded masks, shadows, or category colors.
- Preserve the walking gait and intended directions: together for the guided
  scene, outward along separate branches for exploration. Neither experience
  is specific to one species.

The arrival dialog and reusable `ExperienceOptions` section use the unchanged
`ExperienceChoiceImage` component. Its empty default alt is intentional because
the controls already name the experiences. Pass contextual alt text when an
image has no adjacent label. The optional UI reveal honors reduced motion.

```tsx
<ExperienceChoiceImage experience="guided" />
<ExperienceChoiceImage experience="explore" />
```

## Rebuild

The PNG masters stay unchanged. `scripts/trace-walking-artwork.py` creates
transient silhouette and ink masks, assigns the approved ink/mint palette, and
traces them with `vtracer==0.6.15`. It requires Pillow and vtracer in the local
Python environment; these are not application dependencies.

```sh
python3 scripts/trace-walking-artwork.py \
  docs/graphic-design/artwork-sources/walking-companions/guided-source.png \
  public/images/experiences/walking-guided.svg \
  --title 'Compañeros de paseo · DNAture' \
  --description 'Un perro y un gato caminan hacia la derecha compartiendo una mirada amistosa. Grabado en tinta y menta, fondo transparente.'

python3 scripts/trace-walking-artwork.py \
  docs/graphic-design/artwork-sources/walking-companions/explore-split-source.png \
  public/images/experiences/walking-explore.svg \
  --title 'Cada uno a su rumbo · DNAture' \
  --description 'Un gato camina hacia la izquierda y un perro hacia la derecha, eligiendo caminos distintos con actitud tranquila. Grabado vectorizado en tinta y menta sobre fondo transparente.'

node scripts/build-experience-artwork.mjs
```

Re-render the complete scenes at large and UI sizes after changing trace
settings. Preserve clear eyes, distinct legs, whiskers, tails, and transparent
space between the animals. Source masters and generation prompts provide
provenance for future revisions.

The earlier `explore-source.png` remains archived. The active exploration
source is `explore-split-source.png`; its edit prompt and output hash are in
[the split-path revision record](artwork-sources/walking-companions/revision-explore-split.json).
