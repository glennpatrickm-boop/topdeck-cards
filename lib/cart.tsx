"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Card } from "@/lib/catalog";

export interface CartLine {
  slug: string;
  name: string;
  set: string;
  rarity: string;
  price: number;
  image: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  hydrated: boolean;
  add: (card: Card, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "topdeck-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* corrupted storage — start fresh */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration, so we don't wipe a saved cart).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage full/unavailable — cart still works in-memory */
    }
  }, [lines, hydrated]);

  const add = useCallback((card: Card, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === card.slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === card.slug ? { ...l, qty: Math.min(l.qty + qty, 9) } : l
        );
      }
      return [
        ...prev,
        {
          slug: card.slug,
          name: card.name,
          set: card.set,
          rarity: card.rarity,
          price: card.price,
          image: card.imageSmall,
          qty,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, 9) } : l))
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return { lines, count, subtotal, isOpen, hydrated, add, remove, setQty, clear, open, close };
  }, [lines, isOpen, hydrated, add, remove, setQty, clear, open, close]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
