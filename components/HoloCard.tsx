"use client";

import { useRef } from "react";
import CardImage from "@/components/CardImage";

/**
 * Product-page hero image with a 3D tilt + holo shine that follows
 * the pointer. Pure CSS custom properties driven by pointer events —
 * no animation libraries.
 */
export default function HoloCard({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    el.style.setProperty("--ry", `${(px - 0.5) * 16}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 16}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--shine", "1");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--shine", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="holo-tilt relative mx-auto aspect-[5/7] w-full max-w-sm overflow-hidden rounded-2xl"
    >
      <CardImage
        src={src}
        alt={alt}
        sizes="(max-width: 640px) 90vw, 384px"
        priority
      />
      <div aria-hidden className="holo-shine" />
    </div>
  );
}
