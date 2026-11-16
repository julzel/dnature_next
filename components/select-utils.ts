export type SelectOption<Value extends string = string> = {
  value: Value;
  label: string;
  disabled?: boolean;
  /** Alternative names included in autocomplete matching. */
  aliases?: readonly string[];
};

export function searchableLabel(label: string) {
  return label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

export function selectPopupPosition(trigger: HTMLElement) {
  const rect = trigger.getBoundingClientRect();
  const viewport = window.visualViewport;
  const top = viewport?.offsetTop ?? 0;
  const bottom = top + (viewport?.height ?? innerHeight);
  const width = Math.min(rect.width, innerWidth - 16);
  const below = bottom - rect.bottom - 8;
  const above = rect.top - top - 8;
  const openAbove = below < Math.min(240, above);
  return { left: Math.max(8, Math.min(rect.left, innerWidth - width - 8)), width,
    top: openAbove ? undefined : rect.bottom + 4,
    bottom: openAbove ? innerHeight - rect.top + 4 : undefined,
    maxHeight: Math.max(48, Math.min(320, openAbove ? above : below)),
  };
}
