"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Card artwork with a graceful branded fallback if the remote CDN
 * is unreachable (e.g. behind a restrictive network).
 */
export default function CardImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-surface-2 p-4 text-center ${className}`}
      >
        <span aria-hidden className="text-3xl">🎴</span>
        <span className="text-xs text-muted">{alt}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
