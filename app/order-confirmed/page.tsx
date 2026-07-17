"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { money } from "@/lib/format";

interface OrderSummary {
  orderNo: string;
  name: string;
  email: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  placedAt: string;
}

export default function OrderConfirmedPage() {
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("topdeck-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* no stored order */
    }
    setLoaded(true);
  }, []);

  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <span aria-hidden className="text-6xl">✅</span>
      <h1 className="mt-4 text-3xl font-extrabold">Order confirmed!</h1>

      {!loaded ? null : order ? (
        <>
          <p className="mt-2 text-sm text-muted">
            Thanks, {order.name.split(" ")[0]} — a confirmation was “sent” to{" "}
            {order.email}. (This is a demo: nothing was charged and nothing
            ships.)
          </p>
          <div className="mt-8 rounded-2xl border border-borderc bg-surface p-6 text-left">
            <p className="text-xs uppercase tracking-wide text-muted">Order number</p>
            <p className="mt-1 font-mono text-lg font-bold text-accent-2">
              {order.orderNo}
            </p>
            <ul className="mt-5 space-y-2 border-t border-borderc pt-4 text-sm">
              {order.items.map((it) => (
                <li key={it.name} className="flex justify-between gap-3">
                  <span className="min-w-0 truncate text-muted">
                    {it.qty} × {it.name}
                  </span>
                  <span className="shrink-0 font-medium">
                    {money(it.price * it.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-borderc pt-3 text-base font-bold">
              <span>Total</span>
              <span className="text-accent-2">{money(order.total)}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-2 text-sm text-muted">
          Your order was placed. (This is a demo — nothing was charged.)
        </p>
      )}

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
      >
        Keep browsing
      </Link>
    </section>
  );
}
