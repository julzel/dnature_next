# DNAture species assets

Reusable, editable SVGs with transparent backgrounds. The detailed animals
use the DNAture ink-and-mint engraving style. Both detailed animals stand on
four legs facing right; the dog is a golden retriever. They were created with
built-in image generation and traced into native SVG paths on a shared canvas,
optical width, and baseline. Original brandbook-derived SVGs, generated PNGs,
and prompts are preserved alongside the
[cat generation record](artwork-sources/pet-species/standing-cat-generation.json)
and [golden retriever generation record](artwork-sources/pet-species/golden-retriever-generation.json).
The retriever’s latest [lighter-shading revision](artwork-sources/pet-species/golden-retriever-lightening.json)
opens the dense fur shadows while retaining the pose, palette, and baseline.
The small variants use the supplied silhouettes from `EDITABLES.ai`, without
the circular badge or outer ring. The source brandbook and original exports in
`public/images/icons/` remain intact.

[Open the visual preview](pet-species-preview.html). The
[machine-readable manifest](../../public/images/pets/manifest.json) records
provenance, source hashes, colors, intended sizes, and usage rules.

| Species | Detailed image, 96px and up | Compact image, 24–80px |
| --- | --- | --- |
| Gato | [cat.svg](../../public/images/pets/cat.svg) | [cat-small.svg](../../public/images/pets/cat-small.svg) |
| Perro | [dog.svg](../../public/images/pets/dog.svg) | [dog-small.svg](../../public/images/pets/dog-small.svg) |

An additional [Border collie engraving](../../public/images/pets/border-collie.svg)
uses the same ink/mint palette, 480×480 canvas, 400px optical width and 428.5px
baseline. It was created with built-in image generation and converted into native
SVG paths; its [source and prompt](artwork-sources/pet-species/border-collie-generation.json)
are preserved. It is a standalone breed asset and does not replace the generic dog.

The [Poodle / caniche engraving](../../public/images/pets/poodle.svg) matches this
graphic line with a curly coat and natural standing pose. It uses native paths,
the same palette, 480×480 canvas and 428.5px baseline; its taller proportions fit
within 400px width and 380px height. The [source and generation prompt](artwork-sources/pet-species/poodle-generation.json)
are preserved alongside the other breed artwork.

The [short-haired Chihuahua engraving](../../public/images/pets/chihuahua.svg)
uses the same native vector format, two-color palette, 480×480 canvas and 428.5px
baseline. Its [source and generation prompt](artwork-sources/pet-species/chihuahua-generation.json)
are preserved; it remains a standalone breed asset.

The [English Bulldog engraving](../../public/images/pets/english-bulldog.svg)
uses the same native vector format, ink/mint palette, 480×480 canvas and shared
baseline. Its [source and generation prompt](artwork-sources/pet-species/english-bulldog-generation.json)
are preserved with the other standalone breed assets.

The [French Bulldog engraving](../../public/images/pets/french-bulldog.svg)
shares the series' native paths, two-color palette, 480×480 canvas and baseline.
Its upright ears and compact proportions distinguish it from the English Bulldog;
the [source and generation prompt](artwork-sources/pet-species/french-bulldog-generation.json)
are preserved with the breed artwork.

The [Pug engraving](../../public/images/pets/pug.svg) follows the same native
vector format, ink/mint palette, 480×480 canvas and shared baseline. It features
folded ears, an engraved facial mask and curled tail; its [source and generation
prompt](artwork-sources/pet-species/pug-generation.json) are preserved.

The [German Shepherd engraving](../../public/images/pets/german-shepherd.svg)
uses the same native paths, ink/mint palette, 480×480 canvas and shared baseline.
Its upright ears, saddle pattern and long bushy tail identify the breed; its
[source and generation prompt](artwork-sources/pet-species/german-shepherd-generation.json)
are preserved with the series.

All files have a `480 × 480` viewBox and a shared baseline. Different poses
retain their natural proportions. Detailed engravings use ink `#092F39` and
mint `#8FE4D9`; compact silhouettes use ink alone. These illustration colors
are not additional UI or category tokens. Files contain native paths, with no
embedded raster image, font dependency, script, external resource, or filter.

## Website use

```tsx
import { PetSpeciesImage } from "@/components/pet-species-image";

// A selector button already has visible text naming the species.
<PetSpeciesImage species="cat" alt="" size={128} />

// Product eligibility must come from the product's actual data.
<PetSpeciesImage species="cat" alt="Solo para gatos" size={32} />

// Use empty alt instead if adjacent visible text already says “Solo para gatos”.
<PetSpeciesImage species="dog" alt="" size={48} />
```

The component defaults to an engraving at 96px or larger and a silhouette below
96px. Set `variant="engraving"` or `variant="silhouette"` to choose explicitly.
It serves the SVG directly through `next/image`, with intrinsic dimensions and
no client-side drawing code. A brief optional opacity reveal honors reduced
motion. The questionnaire uses the engravings; saved/reviewed pet profiles use
the compact assets.

Place the animals directly on white, cool-light, or turquoise surfaces. Keep
natural transparent edges and generous room for whiskers and tails. Do not add
cards, rounded masks, elevation, decorative borders, or breed claims. The
single-ink compact variants need a light surface; do not use them against dark
ink backgrounds. Keep category colors on category identifiers.

The compact assets use different poses from the engraving set because the
source silhouettes read more clearly at small sizes. Always pair eligibility
with a label, and show both species where the product data supports both.
