"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { catalog, rarities } from "@/lib/catalog";
import CardTile from "@/components/CardTile";

const GAMES = [
  { value: "", label: "All games" },
  { value: "pokemon", label: "Pokémon TCG" },
  { value: "onepiece", label: "One Piece" },
];

const PRICES = [
  { value: "", label: "Any price" },
  { value: "0-5", label: "Under $5" },
  { value: "5-25", label: "$5 – $25" },
  { value: "25-100", label: "$25 – $100" },
  { value: "100-", label: "$100+" },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
  { value: "name", label: "Name A–Z" },
];

export default function ShopClient() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const game = params.get("game") ?? "";
  const rarity = params.get("rarity") ?? "";
  const price = params.get("price") ?? "";
  const sort = params.get("sort") ?? "featured";

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  const cards = useMemo(() => {
    let list = catalog;
    if (game) list = list.filter((c) => c.game === game);
    if (rarity) list = list.filter((c) => c.rarity === rarity);
    if (price) {
      const [lo, hi] = price.split("-");
      list = list.filter(
        (c) =>
          c.price >= Number(lo || 0) && (hi === "" || c.price <= Number(hi))
      );
    }
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [game, rarity, price, sort]);

  const selectCls =
    "rounded-lg border border-borderc bg-surface px-3 py-2 text-sm text-foreground";

  return (
    <>
      <form
        className="mt-6 flex flex-wrap items-end gap-3"
        aria-label="Filter cards"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label htmlFor="f-game" className="mb-1 block text-xs font-medium text-muted">
            Game
          </label>
          <select
            id="f-game"
            className={selectCls}
            value={game}
            onChange={(e) => setParam("game", e.target.value)}
          >
            {GAMES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-rarity" className="mb-1 block text-xs font-medium text-muted">
            Rarity
          </label>
          <select
            id="f-rarity"
            className={selectCls}
            value={rarity}
            onChange={(e) => setParam("rarity", e.target.value)}
          >
            <option value="">Any rarity</option>
            {rarities.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-price" className="mb-1 block text-xs font-medium text-muted">
            Price
          </label>
          <select
            id="f-price"
            className={selectCls}
            value={price}
            onChange={(e) => setParam("price", e.target.value)}
          >
            {PRICES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-sort" className="mb-1 block text-xs font-medium text-muted">
            Sort
          </label>
          <select
            id="f-sort"
            className={selectCls}
            value={sort}
            onChange={(e) => setParam("sort", e.target.value)}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {(game || rarity || price) && (
          <button
            type="button"
            onClick={() => router.replace(pathname, { scroll: false })}
            className="rounded-lg border border-borderc px-3 py-2 text-sm text-muted hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </form>

      <p className="mt-4 text-sm text-muted" role="status">
        {cards.length} card{cards.length === 1 ? "" : "s"}
      </p>

      {cards.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-borderc bg-surface p-10 text-center">
          <p className="text-lg font-semibold">No cards match those filters.</p>
          <p className="mt-1 text-sm text-muted">
            Try widening the price range or clearing a filter.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((card, i) => (
            <li key={card.slug}>
              <CardTile card={card} priority={i < 4} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
