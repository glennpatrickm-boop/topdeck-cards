"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";

export default function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQty, remove } = useCart();

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        type="button"
        aria-label="Close cart"
        onClick={close}
        className="absolute inset-0 h-full w-full bg-black/60"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l border-borderc bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-borderc px-4 py-3">
          <h2 className="text-base font-bold">Your cart</h2>
          <button
            type="button"
            onClick={close}
            className="rounded-lg border border-borderc px-2.5 py-1 text-sm text-muted hover:text-foreground"
          >
            ✕<span className="sr-only">Close</span>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <span aria-hidden className="text-4xl">🎴</span>
            <p className="text-sm text-muted">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={close}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Browse cards
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-borderc overflow-y-auto px-4">
              {lines.map((l) => (
                <li key={l.slug} className="flex gap-3 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.image}
                    alt=""
                    width={48}
                    height={67}
                    loading="lazy"
                    className="h-[67px] w-12 rounded-md object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{l.name}</p>
                    <p className="truncate text-xs text-muted">{l.rarity}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${l.slug}`}>
                        Quantity for {l.name}
                      </label>
                      <select
                        id={`qty-${l.slug}`}
                        value={l.qty}
                        onChange={(e) => setQty(l.slug, Number(e.target.value))}
                        className="rounded-md border border-borderc bg-surface-2 px-1.5 py-0.5 text-xs"
                      >
                        {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => remove(l.slug)}
                        className="text-xs text-muted underline-offset-2 hover:text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">{money(l.price * l.qty)}</p>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-borderc p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="text-lg font-bold">{money(subtotal)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={close}
                className="block rounded-full bg-accent py-2.5 text-center text-sm font-semibold text-white hover:opacity-90"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="block text-center text-xs text-muted underline-offset-2 hover:underline"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
