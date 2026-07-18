/**
 * build-shopify-csv.mjs
 * Converts data/catalog.json into a Shopify product-import CSV
 * (data/shopify-products.csv). Shopify fetches Image Src URLs
 * server-side during import.
 *
 * Run: node scripts/build-shopify-csv.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const catalog = JSON.parse(
  readFileSync(path.join(process.cwd(), "data", "catalog.json"), "utf8")
);

const esc = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;

const HEADERS = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Variant SKU",
  "Variant Grams",
  "Variant Inventory Tracker",
  "Variant Inventory Qty",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Image Src",
  "Image Alt Text",
  "Status",
];

const rows = [HEADERS.join(",")];

for (const c of catalog) {
  const gameTag = c.game === "pokemon" ? "Pokemon" : "One Piece";
  const body = [
    `<p><strong>${c.name}</strong> — ${c.rarity} from ${c.set} (${c.code}).</p>`,
    c.meta.type ? `<p>Type: ${c.meta.type}${c.meta.hp ? ` · HP ${c.meta.hp}` : ""}</p>` : "",
    c.meta.color ? `<p>Color: ${c.meta.color}${c.meta.power ? ` · Power ${c.meta.power}` : ""}</p>` : "",
    c.meta.artist ? `<p>Illustrated by ${c.meta.artist}.</p>` : "",
    `<p>Near-mint condition, sleeved and top-loaded before shipping.</p>`,
  ]
    .filter(Boolean)
    .join("");

  rows.push(
    [
      esc(c.slug),
      esc(`${c.name} · ${c.rarity} (${c.code})`),
      esc(body),
      esc("Haisuki Collectibles"),
      esc("Trading Card"),
      esc([gameTag, c.rarity, c.set].join(", ")),
      "TRUE",
      esc("Title"),
      esc("Default Title"),
      esc(`HC-${c.code.replace(/\//g, "-")}`),
      "1",
      esc("shopify"),
      "5",
      esc("deny"),
      esc("manual"),
      String(c.price),
      "TRUE",
      "TRUE",
      esc(c.image),
      esc(`${c.name} ${c.rarity} card`),
      esc("active"),
    ].join(",")
  );
}

const out = path.join(process.cwd(), "data", "shopify-products.csv");
writeFileSync(out, rows.join("\n"));
console.log(`shopify-products.csv written: ${catalog.length} products`);
