"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop all" },
  { href: "/shop?game=pokemon", label: "Pokémon" },
  { href: "/shop?game=onepiece", label: "One Piece" },
];

export default function Header() {
  const { count, open, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-borderc bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          <span className="foil-text">TopDeck</span>
          <span className="sr-only">— trading card shop home</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors hover:text-accent-2 ${
                    pathname === item.href.split("?")[0] && item.href === pathname
                      ? "text-foreground"
                      : "text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={open}
            className="relative rounded-full border border-borderc bg-surface px-4 py-2 text-sm font-medium transition-colors hover:border-accent"
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            Cart
            {hydrated && count > 0 && (
              <span
                aria-hidden
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white"
              >
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            className="rounded-lg border border-borderc bg-surface p-2 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span aria-hidden className="block w-4 text-sm leading-none">
              {menuOpen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav aria-label="Mobile" id="mobile-nav" className="border-t border-borderc md:hidden">
          <ul className="space-y-1 px-4 py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-2 py-2 text-sm text-muted hover:bg-surface hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
