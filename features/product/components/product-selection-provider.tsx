"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ProductOption } from "../types/product";

function useSelectionState(options: ProductOption[]) {
  const [currentOptions, setCurrentOptions] = useState(options);
  const [sku, setSku] = useState(() => [...options].sort((a, b) => Number(b.inStock) - Number(a.inStock) || (a.price ?? Infinity) - (b.price ?? Infinity))[0]?.sku ?? "");
  const [quantity, setQuantity] = useState("1");
  const selected = currentOptions.find((option) => option.sku === sku);
  return { currentOptions, setCurrentOptions, sku, setSku, quantity, setQuantity, selected };
}

const ProductSelectionContext = createContext<ReturnType<typeof useSelectionState> | null>(null);

export function ProductSelectionProvider({ options, children }: { options: ProductOption[]; children: ReactNode }) {
  const selection = useSelectionState(options);
  return <ProductSelectionContext.Provider value={selection}>{children}</ProductSelectionContext.Provider>;
}

export function useProductSelection() {
  const selection = useContext(ProductSelectionContext);
  if (!selection) throw new Error("Product selection requires ProductSelectionProvider.");
  return selection;
}
