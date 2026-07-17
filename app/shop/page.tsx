import type { Metadata } from "next";
import { Suspense } from "react";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop all cards",
  description:
    "Browse Pokémon 151 and One Piece TCG singles — filter by game, rarity, and price.",
};

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Shop all cards</h1>
      <Suspense fallback={<p className="mt-8 text-sm text-muted">Loading cards…</p>}>
        <ShopClient />
      </Suspense>
    </section>
  );
}
