import Link from "next/link";
import type { Card } from "@/lib/catalog";
import { rarityTone } from "@/lib/catalog";
import { money } from "@/lib/format";
import CardImage from "@/components/CardImage";

export default function CardTile({
  card,
  priority = false,
}: {
  card: Card;
  priority?: boolean;
}) {
  return (
    <article className="tile-lift group relative overflow-hidden rounded-2xl border border-borderc bg-surface">
      <Link
        href={`/card/${card.slug}`}
        className="block p-3"
        aria-label={`${card.name} — ${card.rarity} — ${money(card.price)}`}
      >
        <div className="relative aspect-[5/7] w-full">
          <CardImage
            src={card.imageSmall}
            alt={`${card.name} card`}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            priority={priority}
          />
        </div>
        <div className="mt-3 space-y-1.5">
          <span
            className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${rarityTone(card.rarity)}`}
          >
            {card.rarity}
          </span>
          <h3 className="truncate text-sm font-semibold">{card.name}</h3>
          <p className="truncate text-xs text-muted">
            {card.set} · {card.code}
          </p>
          <p className="text-base font-bold text-accent-2">{money(card.price)}</p>
        </div>
      </Link>
    </article>
  );
}
