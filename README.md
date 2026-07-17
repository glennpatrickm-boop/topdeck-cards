# TopDeck — TCG Card Shop

**Live site:** https://topdeck-cards.vercel.app

A trading-card e-commerce demo for Pokémon TCG (Scarlet & Violet — 151) and
the One Piece Card Game (OP-01 Romance Dawn, OP-02 Paramount War). Built as a
portfolio project: conversion-focused landing page, filterable catalog,
statically generated product pages, cart, and a validated demo checkout.

> Demo only — no payments are processed and nothing ships. Card images are
> served via the Pokémon TCG API and the official One Piece Card Game site;
> all trademarks belong to their respective owners.

## Stack

- **Next.js 16** (App Router, Turbopack) — 63 fully static routes at build
- **Tailwind CSS v4** — custom dark holo-foil design tokens
- **TypeScript** end to end
- No backend, no database: a curated `data/catalog.json` is the source of truth

## Features

- **Landing page** tuned for conversion: hero with featured chase cards,
  trust strip, collection tiles, best-sellers, newsletter CTA
- **Shop** with URL-driven filters (game / rarity / price) and sorting —
  filter state is shareable and survives refresh
- **Product pages** statically generated per card (`generateStaticParams`),
  with per-page metadata and a pure-CSS 3D holo-tilt effect
- **Cart** in React context, persisted to `localStorage`, with slide-over
  drawer and full cart page (free shipping threshold logic)
- **Checkout** with client-side validation → demo order confirmation with
  generated order number
- **Resilient images**: `next/image` proxies the card CDNs through the site's
  own origin (works behind restrictive corporate networks), with a branded
  fallback if a source is unreachable
- **Performance**: every route prerendered, system font stack (zero webfont
  payload), semantic HTML, accessible focus states and ARIA labels

## Catalog pipeline

`scripts/build-catalog.mjs` builds `data/catalog.json`:

1. Pokémon data from the official
   [pokemon-tcg-data](https://github.com/PokemonTCG/pokemon-tcg-data) repo —
   picks the rarest printing per curated name (e.g. Charizard ex 199/165 SIR)
2. One Piece data parsed from the official cardlist — secret rares, leaders,
   and super rares from OP-01/OP-02, every image URL verified with a HEAD
   request at build time

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 63 static pages
```
