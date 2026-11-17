"use client";

import { usePathname } from "next/navigation";
import { CartLink } from "@/features/cart/components/cart-link";

export function ActiveCartLink({ className }: { className: string }) {
  const pathname = usePathname();
  return <CartLink className={className} current={pathname === "/carrito"} />;
}
