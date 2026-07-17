import Link from "next/link";
import { catalog, featured } from "@/lib/catalog";
import CardTile from "@/components/CardTile";

const TRUST = [
  { icon: "🔍", title: "Verified authentic", body: "Every single inspected and sleeved before it ships." },
  { icon: "🚚", title: "Fast dispatch", body: "Orders out the door within 24 hours, tracked worldwide." },
  { icon: "🛡️", title: "Condition guaranteed", body: "Near-mint or better — or your money back, no questions." },
];

export default function HomePage() {
  const chase = featured();
  const bestsellers = [...catalog]
    .filter((c) => c.price >= 4.99 && c.price < 50)
    .slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(139_92_246/0.18),transparent_70%)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-2">
              Pokémon 151 · One Piece OP-01 &amp; OP-02
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
              Chase cards,
              <br />
              <span className="foil-text">without the chase.</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted">
              Hand-picked singles from the most collected sets in the hobby —
              graded-quality condition, shipped fast, priced honestly.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Shop all cards
              </Link>
              <Link
                href="/shop?rarity=Secret+Rare"
                className="foil-ring rounded-full px-7 py-3 text-sm font-semibold transition-colors hover:text-accent-2"
              >
                Browse secret rares
              </Link>
            </div>
          </div>

          {/* Featured chase card fan */}
          <ul className="grid grid-cols-3 gap-3" aria-label="Featured chase cards">
            {chase.slice(0, 6).map((card, i) => (
              <li
                key={card.slug}
                className={i % 2 === 1 ? "translate-y-4" : ""}
              >
                <CardTile card={card} priority={i < 3} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Trust strip */}
      <section aria-label="Why buy from TopDeck" className="border-y border-borderc bg-surface">
        <ul className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-3">
          {TRUST.map((t) => (
            <li key={t.title} className="flex items-start gap-3">
              <span aria-hidden className="text-2xl">{t.icon}</span>
              <div>
                <h2 className="text-sm font-bold">{t.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">{t.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold">Shop by game</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/shop?game=pokemon"
            className="tile-lift group relative overflow-hidden rounded-2xl border border-borderc bg-[linear-gradient(135deg,#1e1b4b,#12151f_60%)] p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-2">
              Scarlet &amp; Violet
            </p>
            <h3 className="mt-2 text-2xl font-extrabold">Pokémon 151</h3>
            <p className="mt-2 max-w-xs text-sm text-muted">
              The original 151, reborn — Charizard ex, Mew ex, and every
              illustration rare worth pulling.
            </p>
            <span className="mt-5 inline-block text-sm font-semibold text-accent-2 group-hover:underline">
              Browse Pokémon →
            </span>
          </Link>
          <Link
            href="/shop?game=onepiece"
            className="tile-lift group relative overflow-hidden rounded-2xl border border-borderc bg-[linear-gradient(135deg,#3b0a2e,#12151f_60%)] p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-pink-300">
              Romance Dawn · Paramount War
            </p>
            <h3 className="mt-2 text-2xl font-extrabold">One Piece Card Game</h3>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Leaders, super rares, and the secret-rare Shanks everyone is
              hunting for.
            </p>
            <span className="mt-5 inline-block text-sm font-semibold text-pink-300 group-hover:underline">
              Browse One Piece →
            </span>
          </Link>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Popular this week</h2>
          <Link href="/shop" className="text-sm text-accent-2 hover:underline">
            View all →
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {bestsellers.map((card) => (
            <li key={card.slug}>
              <CardTile card={card} />
            </li>
          ))}
        </ul>
      </section>

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="foil-ring rounded-3xl px-6 py-10 text-center sm:px-12">
          <h2 className="text-2xl font-bold">Restock alerts, no spam</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            One email when new chase cards land. Unsubscribe anytime.
          </p>
          <form
            className="mx-auto mt-6 flex max-w-md gap-2"
            action="/shop"
            aria-label="Newsletter signup (demo)"
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-borderc bg-surface px-5 py-2.5 text-sm placeholder:text-muted"
            />
            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Notify me
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
