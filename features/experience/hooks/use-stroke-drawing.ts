import { useLayoutEffect, useRef } from "react";

export function useStrokeDrawing(animated: boolean) {
  const svg = useRef<SVGSVGElement>(null);

  useLayoutEffect(function normalizeDrawingLengths() {
    if (animated) {
      svg.current?.querySelectorAll("path").forEach(function normalizePath(path) {
        path.setAttribute("pathLength", "1");
      });
    }
  }, [animated]);

  return svg;
}
