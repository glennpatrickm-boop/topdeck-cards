/** Shared formatting helpers — usable from server and client components. */
export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
