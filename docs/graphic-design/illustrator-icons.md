# Illustrator icon exports

The 19 artboards in the PDF-compatible `EDITABLES.ai` are exported individually
to `public/images/icons/`. Each SVG contains the original vector paths, colors,
and white circular border, with a transparent exterior. Empty artboard margins
are removed and each badge has a consistent `0 0 432 432` viewBox.

The original Illustrator file is preserved. These are source-faithful brand assets;
exporting them does not introduce their warm colors into application UI styles.

| Artboard | Asset | Artwork |
| --- | --- | --- |
| 01 | `res.svg` | Cattle |
| 02 | `ternero.svg` | Calf |
| 03 | `bufalo.svg` | Buffalo |
| 04 | `cordero.svg` | Sheep |
| 05 | `caballo.svg` | Horse |
| 06 | `pollo.svg` | Chicken |
| 07 | `pescado.svg` | Fish |
| 08 | `conejo.svg` | Rabbit |
| 09 | `codorniz.svg` | Quail |
| 10 | `mejillon.svg` | Mussel |
| 11 | `cabra.svg` | Goat |
| 12 | `abeja.svg` | Bee |
| 13 | `peces.svg` | Two fish |
| 14 | `pescado-horizontal.svg` | Stylized horizontal fish |
| 15 | `pescado-curvo.svg` | Curved fish |
| 16 | `calabaza.svg` | Pumpkin |
| 17 | `capsulas.svg` | Capsules |
| 18 | `gato.svg` | Cat |
| 19 | `perro.svg` | Dog |

Fish filenames describe the silhouettes rather than assigning species that are
not labeled in the source. The JSON manifest in the same folder provides IDs,
Spanish labels, public URLs, dimensions, original artboard numbers, and the
source SHA-256 for traceability. Each SVG also has its own accessible title.

## Usage

```tsx
import Image from "next/image";

<Image src="/images/icons/perro.svg" alt="Perro" width={48} height={48} />
```

For decorative usage beside equivalent visible text, provide `alt=""` instead.

## Regenerate

Requires Python 3 and system Poppler (`pdfinfo`, `pdftocairo`). No application
dependencies or Adobe installation are needed.

```bash
python3 scripts/export-illustrator-icons.py
```

The exporter validates the current 19-artboard structure and fails if an artboard
has unexpected non-path artwork or different badge dimensions. Inspect a revised
Illustrator document and update the export map before regenerating changed artwork.
