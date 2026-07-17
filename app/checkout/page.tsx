"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const { lines, subtotal, clear, hydrated } = useCart();
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [placing, setPlacing] = useState(false);

  const shipping = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: FormErrors = {};

    const required: [string, string][] = [
      ["name", "Full name is required"],
      ["email", "Email is required"],
      ["address", "Street address is required"],
      ["city", "City is required"],
      ["zip", "Postal code is required"],
      ["country", "Country is required"],
    ];
    for (const [field, msg] of required) {
      if (!String(data.get(field) ?? "").trim()) next[field] = msg;
    }
    const email = String(data.get("email") ?? "");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Demo checkout: no payment is collected. Generate an order number,
    // stash a summary for the confirmation page, clear the cart.
    setPlacing(true);
    const orderNo = `TD-${Date.now().toString(36).toUpperCase()}`;
    const summary = {
      orderNo,
      name: String(data.get("name")),
      email,
      items: lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price })),
      total,
      placedAt: new Date().toISOString(),
    };
    try {
      sessionStorage.setItem("topdeck-last-order", JSON.stringify(summary));
    } catch {
      /* sessionStorage unavailable — confirmation page shows a generic message */
    }

    // Small delay so the "Placing order…" state is visible (demo realism).
    setTimeout(() => {
      clear();
      router.push("/order-confirmed");
    }, 900);
  };

  const inputCls = (field: string) =>
    `w-full rounded-lg border bg-surface-2 px-3.5 py-2.5 text-sm placeholder:text-muted ${
      errors[field] ? "border-red-500" : "border-borderc"
    }`;

  const fieldError = (field: string) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-400" role="alert">
        {errors[field]}
      </p>
    ) : null;

  if (hydrated && lines.length === 0 && !placing) {
    return (
      <section className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold">Checkout</h1>
        <p className="mt-3 text-sm text-muted">
          Your cart is empty — add some cards first.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Browse cards
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <p className="mt-1 text-sm text-muted">
        Demo checkout — no payment is collected and nothing ships.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <fieldset className="rounded-2xl border border-borderc bg-surface p-5">
            <legend className="px-1 text-sm font-bold">Contact</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-xs font-medium text-muted">
                  Full name
                </label>
                <input id="name" name="name" autoComplete="name" className={inputCls("name")} placeholder="Monkey D. Luffy" />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-xs font-medium text-muted">
                  Email
                </label>
                <input id="email" name="email" type="email" autoComplete="email" className={inputCls("email")} placeholder="you@example.com" />
                {fieldError("email")}
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-borderc bg-surface p-5">
            <legend className="px-1 text-sm font-bold">Shipping address</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1 block text-xs font-medium text-muted">
                  Street address
                </label>
                <input id="address" name="address" autoComplete="street-address" className={inputCls("address")} placeholder="1 Going Merry Ave" />
                {fieldError("address")}
              </div>
              <div>
                <label htmlFor="city" className="mb-1 block text-xs font-medium text-muted">
                  City
                </label>
                <input id="city" name="city" autoComplete="address-level2" className={inputCls("city")} placeholder="Foosha Village" />
                {fieldError("city")}
              </div>
              <div>
                <label htmlFor="zip" className="mb-1 block text-xs font-medium text-muted">
                  Postal code
                </label>
                <input id="zip" name="zip" autoComplete="postal-code" className={inputCls("zip")} placeholder="1000" />
                {fieldError("zip")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="country" className="mb-1 block text-xs font-medium text-muted">
                  Country
                </label>
                <input id="country" name="country" autoComplete="country-name" className={inputCls("country")} placeholder="Philippines" />
                {fieldError("country")}
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={placing}
            className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {placing ? "Placing order…" : `Place order (demo) — ${money(total)}`}
          </button>
        </form>

        <aside className="h-fit rounded-2xl border border-borderc bg-surface p-5">
          <h2 className="text-base font-bold">Order summary</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {lines.map((l) => (
              <li key={l.slug} className="flex justify-between gap-3">
                <span className="min-w-0 truncate text-muted">
                  {l.qty} × {l.name}
                </span>
                <span className="shrink-0 font-medium">{money(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-borderc pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : money(shipping)}</dd>
            </div>
            <div className="flex justify-between text-base font-bold">
              <dt>Total</dt>
              <dd className="text-accent-2">{money(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
