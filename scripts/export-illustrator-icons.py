#!/usr/bin/env python3
"""Export the 19 PDF-compatible EDITABLES.ai artboards using system Poppler."""

import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tempfile
from xml.etree import ElementTree as ET

REPO = Path(__file__).resolve().parent.parent
SVG = "http://www.w3.org/2000/svg"
ET.register_namespace("", SVG)

# Artboards contain outlined artwork rather than editable text labels.
ICONS = [
    ("res", "Res"),
    ("ternero", "Ternero"),
    ("bufalo", "Búfalo"),
    ("cordero", "Cordero"),
    ("caballo", "Caballo"),
    ("pollo", "Pollo"),
    ("pescado", "Pescado"),
    ("conejo", "Conejo"),
    ("codorniz", "Codorniz"),
    ("mejillon", "Mejillón"),
    ("cabra", "Cabra"),
    ("abeja", "Abeja"),
    ("peces", "Dos peces"),
    ("pescado-horizontal", "Pescado horizontal"),
    ("pescado-curvo", "Pescado curvo"),
    ("calabaza", "Calabaza"),
    ("capsulas", "Cápsulas"),
    ("gato", "Gato"),
    ("perro", "Perro"),
]


def badge_bounds(root):
    """Use the source's outer circle, including its white ring, as the viewport."""
    first = root.find(f"{{{SVG}}}path")
    if first is None or first.get("fill") != "rgb(100%, 100%, 100%)":
        raise ValueError("Expected the original white outer badge path.")
    path = first.get("d", "")
    if not set(re.findall(r"[A-Za-z]", path)) <= set("MCLZz"):
        raise ValueError("Unexpected outer badge geometry; inspect the source before exporting.")
    values = [float(n) for n in re.findall(r"[-+]?(?:\d*\.\d+|\d+)", path)]
    if not values or len(values) % 2:
        raise ValueError("Invalid outer badge coordinates.")
    xs, ys = values[::2], values[1::2]
    left, top = min(xs), min(ys)
    width, height = max(xs) - left, max(ys) - top
    if abs(width - 432) > 0.01 or abs(height - 432) > 0.01:
        raise ValueError("Expected a 432-point circular badge; inspect the updated artboard.")
    return left, top


def standalone_svg(root, slug, label):
    for element in root.iter():
        if element.tag not in {f"{{{SVG}}}{tag}" for tag in ("svg", "path", "g")}:
            raise ValueError("Unexpected non-path content; inspect the artboard before exporting.")
    left, top = badge_bounds(root)
    title_id = f"dnature-icon-{slug}-title"
    output = ET.Element(f"{{{SVG}}}svg", {
        "width": "432", "height": "432", "viewBox": "0 0 432 432",
        "role": "img", "aria-labelledby": title_id,
    })
    ET.SubElement(output, f"{{{SVG}}}title", {"id": title_id}).text = label
    group = ET.SubElement(output, f"{{{SVG}}}g", {"transform": f"translate({-left:.6f} {-top:.6f})"})
    # Preserve the original path geometry and fills. No tracing or rasterization.
    for element in root:
        group.append(element)
    for element in output.iter():
        if element.text is not None and not element.text.strip():
            element.text = None
        element.tail = None
        for key, default in (("fill-opacity", "1"), ("fill-rule", "nonzero")):
            if element.get(key) == default:
                del element.attrib[key]
    return ET.tostring(output, encoding="utf-8", xml_declaration=False) + b"\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=REPO / "EDITABLES.ai")
    parser.add_argument("--output-dir", type=Path, default=REPO / "public/images/icons")
    args = parser.parse_args()
    source = args.source.read_bytes()
    outputs = {}
    manifest = {
        "source": args.source.name,
        "sourceSha256": hashlib.sha256(source).hexdigest(),
        "icons": [],
    }
    with tempfile.TemporaryDirectory(prefix="dnature-icons-") as temporary:
        work = Path(temporary)
        snapshot = work / "source.ai"
        snapshot.write_bytes(source)
        info = subprocess.run(["pdfinfo", str(snapshot)], check=True, capture_output=True, text=True).stdout
        if not re.search(r"^Pages:\s+19\s*$", info, re.MULTILINE):
            raise ValueError("Expected 19 artboards. Inspect new artboards before updating the export map.")
        for page, (slug, label) in enumerate(ICONS, start=1):
            raw = work / f"artboard-{page:02}.svg"
            subprocess.run(["pdftocairo", "-svg", "-f", str(page), "-l", str(page), str(snapshot), str(raw)], check=True, capture_output=True)
            outputs[f"{slug}.svg"] = standalone_svg(ET.parse(raw).getroot(), slug, label)
            manifest["icons"].append({
                "id": slug, "label": label, "artboard": page,
                "src": f"/images/icons/{slug}.svg", "width": 432, "height": 432,
            })
    # Write only after every artboard has been successfully converted and validated.
    args.output_dir.mkdir(parents=True, exist_ok=True)
    for filename, content in outputs.items():
        (args.output_dir / filename).write_bytes(content)
    (args.output_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"Exported {len(outputs)} standalone SVGs to {args.output_dir}")


if __name__ == "__main__":
    main()
