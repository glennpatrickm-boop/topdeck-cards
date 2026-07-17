import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog, getCard, getRelated, rarityTone } from "@/lib/catalog";
import { money } from "@/lib/format";
import AddToCart from "@/components/AddToCart";
import HoloCard from "@/components/HoloCard";
import CardTile from "@/components/CardTile";

export function generateStaticParams() {
  return catalog.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getCard(slug);
  if (!card) return { title: "Card not found" };
  return {
    title: `${card.name} — ${card.set}`,
    description: `${card.name} (${card.code}) ${card.rarity} from ${card.set}. ${money(card.price)} at TopDeck.`,
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getCard(slug);
  if (!card) notFound();

  const related = getRelated(card);
  const facts: [string, string][] = [
    ["Set", card.set],
    ["Card number", card.code],
    ["Rarity", card.rarity],
  ];
  if (card.meta.type) facts.push(["Type", card.meta.type]);
  if (card.meta.hp) facts.push(["HP", card.meta.hp]);
  if (card.meta.color) facts.push(["Color", card.meta.color]);
  if (card.meta.power) facts.push(["Power", card.meta.power]);
  if (card.meta.category) facts.push(["Category", card.meta.category]);
  if (card.meta.artist) facts.push(["Illustrator", card.meta.artist]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <Link href="/" className="hover:text-accent-2">Home</Link>
            <span aria-hidden> /</span>
          </li>
          <li>
            <Link href={`/shop?game=${card.game}`} className="hover:text-accent-2">
              {card.gameLabel}
            </Link>
            <span aria-hidden> /</span>
          </li>
          <li aria-current="page" className="text-foreground">{card.name}</li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <HoloCard src={card.image} alt={`${card.name} card artwork`} />

        <div>
          <span
            className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${rarityTone(card.rarity)}`}
          >
            {card.rarity}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold">{card.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {card.set} · {card.code}
          </p>

          <p className="mt-5 text-3xl font-bold text-accent-2">
            {money(card.price)}
          </p>
          <p className="mt-1 text-xs text-muted">
            Near-mint condition · sleeved &amp; top-loaded
          </p>

          <div className="mt-6 max-w-sm">
            <AddToCart card={card} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border border-borderc bg-surface p-5 text-sm">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
                <dd className="mt-0.5 font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold">More from this set</h2>
          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((c) => (
              <li key={c.slug}>
                <CardTile card={c} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
