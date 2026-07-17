import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <span aria-hidden className="text-6xl">🃏</span>
      <h1 className="mt-4 text-3xl font-extrabold">Whiffed the pull</h1>
      <p className="mt-2 text-sm text-muted">
        That page doesn&apos;t exist — but the chase cards do.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white hover:opacity-90"
      >
        Back to the shop
      </Link>
    </section>
  );
}
