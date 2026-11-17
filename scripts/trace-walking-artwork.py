#!/usr/bin/env python3
"""Convert the generated walking artwork into transparent two-color SVG paths.

Needs Pillow and vtracer==0.6.15. The original PNG is never modified.
The two binary masks are temporary inputs for palette-constrained vector tracing.
"""

import argparse
from pathlib import Path
import re
import tempfile
import xml.etree.ElementTree as ET

from PIL import Image
import vtracer

SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)
INK = (9, 47, 57)
MINT = (143, 228, 217)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--title", required=True)
    parser.add_argument("--description", required=True)
    parser.add_argument("--ink-threshold", type=float, default=0.72)
    args = parser.parse_args()

    source = Image.open(args.source).convert("RGBA")
    width, height = source.size
    silhouette = Image.new("L", source.size, 255)
    engraving = Image.new("L", source.size, 255)
    base_pixels = []
    ink_pixels = []
    axis = tuple(light-dark for light,dark in zip(MINT, INK))
    axis_length_squared = sum(direction**2 for direction in axis)
    # Assign only opaque subject pixels to the two approved print inks.
    # This is vector palette quantization, not a change to the source drawing.
    for red, green, blue, alpha in source.get_flattened_data():
        inside = alpha >= 128
        color = (red, green, blue)
        tone = sum((value-dark)*direction for value,dark,direction in zip(color, INK, axis)) / axis_length_squared
        base_pixels.append(0 if inside else 255)
        ink_pixels.append(0 if inside and tone < args.ink_threshold else 255)
    silhouette.putdata(base_pixels)
    engraving.putdata(ink_pixels)

    root = ET.Element(f"{{{SVG}}}svg", {
        "width": str(width), "height": str(height),
        "viewBox": f"0 0 {width} {height}", "role": "img",
        "aria-labelledby": f"{args.output.stem}-title {args.output.stem}-desc",
    })
    ET.SubElement(root, f"{{{SVG}}}title", {"id": f"{args.output.stem}-title"}).text = args.title
    ET.SubElement(root, f"{{{SVG}}}desc", {"id": f"{args.output.stem}-desc"}).text = args.description
    artwork = ET.SubElement(root, f"{{{SVG}}}g", {"data-artwork": "walking-companions"})
    with tempfile.TemporaryDirectory(prefix="dnature-trace-") as temporary:
        for name, mask, color, speckle in [
            ("silhouette", silhouette, "#8FE4D9", 8),
            ("engraving", engraving, "#092F39", 2),
        ]:
            mask_path = Path(temporary) / f"{name}.png"
            traced_path = Path(temporary) / f"{name}.svg"
            mask.save(mask_path)
            vtracer.convert_image_to_svg_py(
                str(mask_path), str(traced_path),
                colormode="binary", mode="spline", filter_speckle=speckle,
                corner_threshold=60, length_threshold=3.5,
                max_iterations=10, splice_threshold=45, path_precision=2,
            )
            layer = ET.SubElement(artwork, f"{{{SVG}}}g", {"fill": color})
            traced = ET.parse(traced_path).getroot()
            for element in traced:
                if element.tag != f"{{{SVG}}}path":
                    raise ValueError(f"Unexpected tracer output: {element.tag}")
                element.attrib.pop("fill", None)
                element.attrib["d"] = re.sub(r"\s*([MmLlCcQqSsTtZz])\s*", r"\1", element.attrib["d"])
                element.tail = None
                layer.append(element)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(ET.tostring(root, encoding="utf-8") + b"\n")
    print(f"{args.output.name}: {width}x{height}; {sum(1 for _ in root.iter(f'{{{SVG}}}path'))} paths; {args.output.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
