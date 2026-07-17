/**
 * build-catalog.mjs
 * Builds data/catalog.json from:
 *  - Pokémon TCG data (official PokemonTCG/pokemon-tcg-data repo, set sv3pt5 "151")
 *  - One Piece Card Game official cardlist HTML (OP-01, OP-02)
 *
 * Run: node scripts/build-catalog.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const RAW = path.join(process.cwd(), "scripts", "raw");
const OUT = path.join(process.cwd(), "data", "catalog.json");

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* ---------------- Pokémon (151 / sv3pt5) ---------------- */

const pkmRaw = JSON.parse(readFileSync(path.join(RAW, "sv3pt5.json"), "utf8"));

// Iconic picks: for each name, prefer the rarest printing.
const RARITY_RANK = {
  "Special Illustration Rare": 6,
  "Hyper Rare": 5,
  "Illustration Rare": 4,
  "Ultra Rare": 3,
  "Double Rare": 2,
  Rare: 1,
};
const PKM_PICKS = [
  "Charizard ex",
  "Venusaur ex",
  "Blastoise ex",
  "Pikachu",
  "Mew ex",
  "Alakazam ex",
  "Zapdos ex",
  "Snorlax",
  "Dragonite",
  "Gyarados",
  "Bulbasaur",
  "Charmander",
  "Charmeleon",
  "Squirtle",
  "Psyduck",
  "Poliwhirl",
  "Kadabra",
  "Machamp",
  "Golem ex",
  "Slowpoke",
  "Magneton",
  "Dodrio",
  "Hitmonchan",
  "Kangaskhan",
  "Jynx",
  "Ditto",
  "Omanyte",
  "Zapdos",
];

const PKM_PRICE = {
  "Special Illustration Rare": 129.99,
  "Hyper Rare": 49.99,
  "Illustration Rare": 19.99,
  "Ultra Rare": 14.99,
  "Double Rare": 7.99,
  Rare: 2.99,
  default: 1.49,
};

const pokemon = [];
for (const name of PKM_PICKS) {
  const printings = pkmRaw.filter((c) => c.name === name);
  if (!printings.length) continue;
  printings.sort(
    (a, b) => (RARITY_RANK[b.rarity] ?? 0) - (RARITY_RANK[a.rarity] ?? 0)
  );
  const c = printings[0];
  const rarity = c.rarity ?? "Common";
  pokemon.push({
    slug: `${slugify(c.name)}-151-${c.number}`,
    name: c.name,
    game: "pokemon",
    gameLabel: "Pokémon TCG",
    set: "Scarlet & Violet — 151",
    code: `${c.number}/165`,
    rarity,
    price: PKM_PRICE[rarity] ?? PKM_PRICE.default,
    image: c.images.large,
    imageSmall: c.images.small,
    meta: {
      type: (c.types ?? []).join("/") || "Trainer",
      hp: c.hp ?? null,
      artist: c.artist ?? null,
    },
  });
}

/* ---------------- One Piece (OP-01, OP-02) ---------------- */

const decodeEntities = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function parseOnePiece(file, setLabel) {
  const html = readFileSync(path.join(RAW, file), "utf8");
  const cards = [];
  // Each card: <dl class="modalCol" id="OP01-001"> ... </dl>
  const blocks = html.split('<dl class="modalCol"').slice(1);
  for (const block of blocks) {
    const id = block.match(/id="([^"]+)"/)?.[1];
    if (!id) continue;
    const info = block.match(
      /<div class="infoCol">\s*<span>([^<]+)<\/span>\s*\|\s*<span>([^<]+)<\/span>\s*\|\s*<span>([^<]+)<\/span>/
    );
    const name = block.match(/<div class="cardName">([^<]+)<\/div>/)?.[1];
    const img = block.match(/data-src="\.\.(\/images\/cardlist\/card\/[^"]+)"/)?.[1];
    const color = block.match(/<div class="color"><h3>Color<\/h3>([^<]+)</)?.[1];
    const power = block.match(/<div class="power"><h3>Power<\/h3>([^<]+)</)?.[1];
    if (!name || !img || !info) continue;
    cards.push({
      id,
      rarity: info[2].trim(),
      category: info[3].trim(),
      name: decodeEntities(name.trim()),
      image: `https://en.onepiece-cardgame.com${img}`,
      color: color?.trim() ?? null,
      power: power?.trim() ?? null,
      setLabel,
    });
  }
  return cards;
}

const OP_RARITY_LABEL = {
  SEC: "Secret Rare",
  SR: "Super Rare",
  L: "Leader",
  R: "Rare",
  UC: "Uncommon",
  C: "Common",
  SP: "Special",
};
const OP_PRICE = {
  SEC: 149.99,
  SR: 29.99,
  L: 12.99,
  R: 4.99,
  UC: 1.99,
  C: 0.99,
  SP: 59.99,
};

const op01 = parseOnePiece("op01.html", "OP-01 Romance Dawn");
const op02 = parseOnePiece("op02.html", "OP-02 Paramount War");

// Pick: all base-print Leaders + SEC + SR (skip alt-art "_p" duplicates), cap per set.
function pickOnePiece(cards, cap) {
  const base = cards.filter((c) => !c.id.includes("_"));
  const picked = [
    ...base.filter((c) => c.rarity === "SEC"),
    ...base.filter((c) => c.rarity === "L"),
    ...base.filter((c) => c.rarity === "SR"),
  ].slice(0, cap);
  return picked;
}

const onepiece = [...pickOnePiece(op01, 16), ...pickOnePiece(op02, 14)].map(
  (c) => ({
    slug: `${slugify(c.name)}-${slugify(c.id)}`,
    name: c.name,
    game: "onepiece",
    gameLabel: "One Piece Card Game",
    set: c.setLabel,
    code: c.id,
    rarity: OP_RARITY_LABEL[c.rarity] ?? c.rarity,
    price: OP_PRICE[c.rarity] ?? 1.99,
    image: c.image,
    imageSmall: c.image,
    meta: {
      color: c.color,
      power: c.power,
      category: c.category,
    },
  })
);

/* ---------------- Merge + write ---------------- */

const catalog = [...pokemon, ...onepiece];

// sanity: unique slugs
const slugs = new Set();
for (const c of catalog) {
  if (slugs.has(c.slug)) throw new Error(`duplicate slug: ${c.slug}`);
  slugs.add(c.slug);
}

writeFileSync(OUT, JSON.stringify(catalog, null, 2));
console.log(
  `catalog.json written: ${catalog.length} cards (${pokemon.length} pokemon, ${onepiece.length} one piece)`
);
console.log("sample:", JSON.stringify(catalog[0], null, 1));
