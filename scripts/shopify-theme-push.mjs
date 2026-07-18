/**
 * shopify-theme-push.mjs
 * Upserts custom sections + homepage template into the live Horizon theme
 * via the themeFilesUpsert mutation.
 *
 * Run: node scripts/shopify-theme-push.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const SHOP = "haisuki-collectibles.myshopify.com";
const API = `https://${SHOP}/admin/api/2025-07/graphql.json`;
const TOKEN = readFileSync(path.join(process.cwd(), ".shopify-token"), "utf8").trim();
const THEME = "gid://shopify/OnlineStoreTheme/164632264939";

function gql(query, variables) {
  const payloadFile = path.join(os.tmpdir(), `shopify-payload-${Date.now()}-${Math.random()}.json`);
  writeFileSync(payloadFile, JSON.stringify({ query, variables }));
  const out = execFileSync("curl", [
    "-s", "-X", "POST",
    "-H", `X-Shopify-Access-Token: ${TOKEN}`,
    "-H", "Content-Type: application/json",
    "--data", `@${payloadFile}`,
    API,
  ], { maxBuffer: 50 * 1024 * 1024 }).toString();
  const json = JSON.parse(out);
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const indexTemplate = {
  sections: {
    hero: {
      type: "haisuki-hero",
      settings: {
        cta_primary_link: "shopify://collections/pokemon-tcg",
        cta_secondary_link: "shopify://collections/one-piece-card-game",
      },
    },
    featured_pokemon: {
      type: "haisuki-featured",
      settings: {
        heading: "Pokémon TCG singles",
        collection: "pokemon-tcg",
        limit: 8,
      },
    },
    featured_onepiece: {
      type: "haisuki-featured",
      settings: {
        heading: "One Piece Card Game",
        collection: "one-piece-card-game",
        limit: 8,
      },
    },
  },
  order: ["hero", "featured_pokemon", "featured_onepiece"],
};

const files = [
  {
    filename: "sections/haisuki-hero.liquid",
    body: {
      type: "TEXT",
      value: readFileSync("shopify/sections/haisuki-hero.liquid", "utf8"),
    },
  },
  {
    filename: "sections/haisuki-featured.liquid",
    body: {
      type: "TEXT",
      value: readFileSync("shopify/sections/haisuki-featured.liquid", "utf8"),
    },
  },
  {
    filename: "templates/index.json",
    body: { type: "TEXT", value: JSON.stringify(indexTemplate, null, 2) },
  },
];

const res = gql(
  `mutation upsert($themeId: ID!, $files: [OnlineStoreThemeFilesUpsertFileInput!]!) {
    themeFilesUpsert(themeId: $themeId, files: $files) {
      upsertedThemeFiles { filename }
      userErrors { field message }
    }
  }`,
  { themeId: THEME, files }
);

console.log(JSON.stringify(res.themeFilesUpsert, null, 1));
