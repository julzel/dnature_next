"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../lib/cart-store";
import styles from "./cart-link.module.css";

export function CartLink({ className }: { className?: string }) {
  const cart = useCart();
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  return <Link href="/carrito" className={`${className ?? ""} ${styles.link}`} aria-label={`Carrito, ${count} ${count === 1 ? "producto" : "productos"}`}>
    <ShoppingCart size={22} strokeWidth={1.5} aria-hidden="true" />
    {count > 0 && <span className={styles.count} aria-hidden="true">{count > 99 ? "99+" : count}</span>}
  </Link>;
}
