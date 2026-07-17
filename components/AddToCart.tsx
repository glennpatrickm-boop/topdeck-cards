"use client";

import { useState } from "react";
import type { Card } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export default function AddToCart({ card }: { card: Card }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex items-center gap-3">
      <label className="sr-only" htmlFor="qty">
        Quantity
      </label>
      <select
        id="qty"
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="rounded-lg border border-borderc bg-surface-2 px-3 py-2.5 text-sm"
      >
        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => add(card, qty)}
        className="flex-1 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Add to cart
      </button>
    </div>
  );
}
