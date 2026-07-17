"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, setQty, remove, hydrated } = useCart();

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Your cart</h1>

      {!hydrated ? (
        <p className="mt-8 text-sm text-muted">Loading cart…</p>
      ) : lines.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-borderc bg-surface p-12 text-center">
          <span aria-hidden className="text-5xl">🎴</span>
          <p className="mt-4 text-lg font-semibold">Nothing here yet.</p>
          <p className="mt-1 text-sm text-muted">
            Chase cards are waiting — go find your next pull.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Browse cards
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_290px]">
          <ul className="divide-y divide-borderc rounded-2xl border border-borderc bg-surface px-5">
            {lines.map((l) => (
              <li key={l.slug} className="flex gap-4 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.image}
                  alt=""
                  width={64}
                  height={90}
                  loading="lazy"
                  className="h-[90px] w-16 rounded-lg object-contain"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/card/${l.slug}`}
                    className="text-sm font-semibold hover:text-accent-2"
                  >
                    {l.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">
                    {l.set} · {l.rarity}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="sr-only" htmlFor={`cart-qty-${l.slug}`}>
                      Quantity for {l.name}
                    </label>
                    <select
                      id={`cart-qty-${l.slug}`}
                      value={l.qty}
                      onChange={(e) => setQty(l.slug, Number(e.target.value))}
                      className="rounded-md border border-borderc bg-surface-2 px-2 py-1 text-xs"
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
                <div className="text-right">
                  <p className="text-sm font-bold">{money(l.price * l.qty)}</p>
                  {l.qty > 1 && (
                    <p className="text-xs text-muted">{money(l.price)} each</p>
                  )}
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-borderc bg-surface p-5">
            <h2 className="text-base font-bold">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium">{money(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-medium">
                  {subtotal >= 50 ? "Free" : money(4.99)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-borderc pt-2 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold text-accent-2">
                  {money(subtotal + (subtotal >= 50 ? 0 : 4.99))}
                </dd>
              </div>
            </dl>
            {subtotal < 50 && subtotal > 0 && (
              <p className="mt-3 text-xs text-muted">
                Add {money(50 - subtotal)} more for free shipping.
              </p>
            )}
            <Link
              href="/checkout"
              className="mt-5 block rounded-full bg-accent py-2.5 text-center text-sm font-semibold text-white hover:opacity-90"
            >
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
