import catalogJson from "@/data/catalog.json";

export type Game = "pokemon" | "onepiece";

export interface Card {
  slug: string;
  name: string;
  game: Game;
  gameLabel: string;
  set: string;
  code: string;
  rarity: string;
  price: number;
  image: string;
  imageSmall: string;
  meta: {
    type?: string;
    hp?: string | null;
    artist?: string | null;
    color?: string | null;
    power?: string | null;
    category?: string | null;
  };
}

export const catalog = catalogJson as Card[];

export const getCard = (slug: string): Card | undefined =>
  catalog.find((c) => c.slug === slug);

export const getRelated = (card: Card, n = 4): Card[] =>
  catalog
    .filter((c) => c.slug !== card.slug && c.set === card.set)
    .slice(0, n);

export const rarities = [...new Set(catalog.map((c) => c.rarity))];

/** Chase cards for the landing page hero / featured row. */
export const featured = (): Card[] => {
  const order = [
    "charizard-ex-151-199",
    "shanks-op01-120",
    "mew-ex-151-205",
    "yamato-op01-121",
    "uta-op02-120",
    "venusaur-ex-151-198",
  ];
  const bySlug = new Map(catalog.map((c) => [c.slug, c]));
  const picks = order.map((s) => bySlug.get(s)).filter(Boolean) as Card[];
  // fall back to priciest cards if curated slugs drift
  if (picks.length < 4) {
    return [...catalog].sort((a, b) => b.price - a.price).slice(0, 6);
  }
  return picks;
};

/** Badge tone per rarity tier, used by CardTile and product pages. */
export function rarityTone(rarity: string): string {
  switch (rarity) {
    case "Special Illustration Rare":
    case "Secret Rare":
      return "bg-amber-400/15 text-amber-300 border-amber-400/40";
    case "Hyper Rare":
    case "Super Rare":
      return "bg-violet-400/15 text-violet-300 border-violet-400/40";
    case "Illustration Rare":
    case "Leader":
      return "bg-cyan-400/15 text-cyan-300 border-cyan-400/40";
    case "Ultra Rare":
    case "Double Rare":
      return "bg-pink-400/15 text-pink-300 border-pink-400/40";
    default:
      return "bg-slate-400/15 text-slate-300 border-slate-400/40";
  }
}
