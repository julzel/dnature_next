# DNAture species assets

Four reusable, editable SVGs with transparent backgrounds. The detailed animals
are adaptations of the native vector engravings on page 46 of the revised
`DNA-BRANDBOOK.pdf`. The small variants use the supplied silhouettes from
`EDITABLES.ai`, without the circular badge or outer ring. These are website
adaptations of supplied artwork, not new original drawings. The source exports
in `public/images/icons/` remain intact.

[Open the visual preview](pet-species-preview.html). The
[machine-readable manifest](../../public/images/pets/manifest.json) records
provenance, source hashes, colors, intended sizes, and usage rules.

| Species | Detailed image, 96px and up | Compact image, 24–80px |
| --- | --- | --- |
| Gato | [cat.svg](../../public/images/pets/cat.svg) | [cat-small.svg](../../public/images/pets/cat-small.svg) |
| Perro | [dog.svg](../../public/images/pets/dog.svg) | [dog-small.svg](../../public/images/pets/dog-small.svg) |

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
