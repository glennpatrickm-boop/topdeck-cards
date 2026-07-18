/**
 * shopify-import.mjs
 * Imports data/catalog.json into the Haisuki Collectibles dev store via the
 * Admin GraphQL API. Uses curl as HTTP transport (corporate proxy blocks
 * Node's TLS stack but allows schannel/curl).
 *
 * Run: node scripts/shopify-import.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const SHOP = "haisuki-collectibles.myshopify.com";
const API = `https://${SHOP}/admin/api/2025-07/graphql.json`;
const TOKEN = readFileSync(path.join(process.cwd(), ".shopify-token"), "utf8").trim();

function gql(query, variables) {
  const payloadFile = path.join(os.tmpdir(), `shopify-payload-${Date.now()}.json`);
  writeFileSync(payloadFile, JSON.stringify({ query, variables }));
  const out = execFileSync("curl", [
    "-s",
    "-X", "POST",
    "-H", `X-Shopify-Access-Token: ${TOKEN}`,
    "-H", "Content-Type: application/json",
    "--data", `@${payloadFile}`,
    API,
  ]).toString();
  const json = JSON.parse(out);
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const catalog = JSON.parse(
  readFileSync(path.join(process.cwd(), "data", "catalog.json"), "utf8")
);

/* 1. Find the Online Store publication (to publish products to it). */
const pubs = gql(`{ publications(first: 10) { nodes { id name } } }`);
const onlineStore = pubs.publications.nodes.find((p) => p.name === "Online Store");
if (!onlineStore) throw new Error("Online Store publication not found");
console.log("Online Store publication:", onlineStore.id);

/* 2. Create each product (synchronous productSet with image + variant). */
const PRODUCT_SET = `
mutation productSet($input: ProductSetInput!) {
  productSet(input: $input, synchronous: true) {
    product { id handle }
    userErrors { field message }
  }
}`;

const PUBLISH = `
mutation publish($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    userErrors { field message }
  }
}`;

let created = 0;
const failures = [];
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

  const input = {
    title: `${c.name} · ${c.rarity} (${c.code})`,
    handle: c.slug,
    descriptionHtml: body,
    vendor: "Haisuki Collectibles",
    productType: "Trading Card",
    tags: [gameTag, c.rarity, c.set],
    status: "ACTIVE",
    files: [
      {
        originalSource: c.image,
        alt: `${c.name} ${c.rarity} card`,
        contentType: "IMAGE",
      },
    ],
    productOptions: [{ name: "Title", values: [{ name: "Default Title" }] }],
    variants: [
      {
        optionValues: [{ optionName: "Title", name: "Default Title" }],
        price: String(c.price),
        sku: `HC-${c.code.replace(/\//g, "-")}`,
      },
    ],
  };

  try {
    const res = gql(PRODUCT_SET, { input });
    const errs = res.productSet.userErrors;
    if (errs.length) {
      failures.push({ slug: c.slug, errs });
      console.log("ERR", c.slug, JSON.stringify(errs));
      continue;
    }
    const productId = res.productSet.product.id;
    const pubRes = gql(PUBLISH, {
      id: productId,
      input: [{ publicationId: onlineStore.id }],
    });
    if (pubRes.publishablePublish.userErrors.length) {
      console.log("PUB-ERR", c.slug, JSON.stringify(pubRes.publishablePublish.userErrors));
    }
    created++;
    console.log(`OK ${created}/${catalog.length}`, c.slug);
  } catch (e) {
    failures.push({ slug: c.slug, errs: String(e).slice(0, 200) });
    console.log("FAIL", c.slug, String(e).slice(0, 200));
  }
}

console.log(`\nDone: ${created} created, ${failures.length} failed`);
if (failures.length) console.log(JSON.stringify(failures, null, 1));
