/**
 * shopify-collections.mjs
 * Creates smart collections (by tag) for Pokémon and One Piece and
 * publishes them to the Online Store. Same curl transport as the importer.
 *
 * Run: node scripts/shopify-collections.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const SHOP = "haisuki-collectibles.myshopify.com";
const API = `https://${SHOP}/admin/api/2025-07/graphql.json`;
const TOKEN = readFileSync(path.join(process.cwd(), ".shopify-token"), "utf8").trim();

function gql(query, variables) {
  const payloadFile = path.join(os.tmpdir(), `shopify-payload-${Date.now()}-${Math.random()}.json`);
  writeFileSync(payloadFile, JSON.stringify({ query, variables }));
  const out = execFileSync("curl", [
    "-s", "-X", "POST",
    "-H", `X-Shopify-Access-Token: ${TOKEN}`,
    "-H", "Content-Type: application/json",
    "--data", `@${payloadFile}`,
    API,
  ]).toString();
  const json = JSON.parse(out);
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const pubs = gql(`{ publications(first: 10) { nodes { id name } } }`);
const onlineStore = pubs.publications.nodes.find((p) => p.name === "Online Store");

const CREATE = `
mutation collectionCreate($input: CollectionInput!) {
  collectionCreate(input: $input) {
    collection { id handle }
    userErrors { field message }
  }
}`;

const PUBLISH = `
mutation publish($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    userErrors { field message }
  }
}`;

const collections = [
  {
    title: "Pokémon TCG",
    handle: "pokemon-tcg",
    descriptionHtml:
      "<p>Singles from Scarlet &amp; Violet — 151: Charizard ex, Mew ex, and every illustration rare worth pulling.</p>",
    tag: "Pokemon",
  },
  {
    title: "One Piece Card Game",
    handle: "one-piece-card-game",
    descriptionHtml:
      "<p>Leaders, super rares, and secret rares from OP-01 Romance Dawn and OP-02 Paramount War.</p>",
    tag: "One Piece",
  },
];

for (const c of collections) {
  const res = gql(CREATE, {
    input: {
      title: c.title,
      handle: c.handle,
      descriptionHtml: c.descriptionHtml,
      ruleSet: {
        appliedDisjunctively: false,
        rules: [{ column: "TAG", relation: "EQUALS", condition: c.tag }],
      },
    },
  });
  const errs = res.collectionCreate.userErrors;
  if (errs.length) {
    console.log("ERR", c.handle, JSON.stringify(errs));
    continue;
  }
  const id = res.collectionCreate.collection.id;
  gql(PUBLISH, { id, input: [{ publicationId: onlineStore.id }] });
  console.log("OK", c.handle, id);
}
console.log("collections done");
