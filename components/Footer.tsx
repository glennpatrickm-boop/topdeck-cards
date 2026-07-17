import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-borderc bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">
            <span className="foil-text">TopDeck</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            Singles, sealed, and chase cards — shipped fast.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Shop
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/shop" className="text-muted hover:text-accent-2">
                All cards
              </Link>
            </li>
            <li>
              <Link href="/shop?game=pokemon" className="text-muted hover:text-accent-2">
                Pokémon TCG
              </Link>
            </li>
            <li>
              <Link href="/shop?game=onepiece" className="text-muted hover:text-accent-2">
                One Piece Card Game
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            About this site
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            Demo project — not a real store; no payments are processed. Card
            images are served via the Pokémon TCG API and the official One
            Piece Card Game site. Pokémon and One Piece are trademarks of
            their respective owners; this site is not affiliated with or
            endorsed by them.
          </p>
        </div>
      </div>
      <div className="border-t border-borderc py-4 text-center text-xs text-muted">
        Built with Next.js · © {new Date().getFullYear()} TopDeck demo
      </div>
    </footer>
  );
}
