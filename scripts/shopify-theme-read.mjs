/** Read theme files (list + fetch index.json) via Admin GraphQL. */
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

const mode = process.argv[2] ?? "list";

if (mode === "list") {
  const d = gql(
    `query($id: ID!) { theme(id: $id) { files(first: 250) { nodes { filename } } } }`,
    { id: THEME }
  );
  const names = d.theme.files.nodes.map((f) => f.filename);
  console.log(names.filter((n) => n.startsWith("sections/") || n.startsWith("templates/")).join("\n"));
} else {
  const d = gql(
    `query($id: ID!, $filenames: [String!]!) {
      theme(id: $id) {
        files(filenames: $filenames, first: 5) {
          nodes { filename body { ... on OnlineStoreThemeFileBodyText { content } } }
        }
      }
    }`,
    { id: THEME, filenames: [mode] }
  );
  console.log(d.theme.files.nodes[0]?.body?.content ?? "NOT FOUND");
}
