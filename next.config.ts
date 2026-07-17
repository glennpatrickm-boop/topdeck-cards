import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.pokemontcg.io" },
      { protocol: "https", hostname: "en.onepiece-cardgame.com" },
    ],
    // Card scans are pre-optimized PNGs at fixed sizes; two device sizes
    // keep the optimizer cache small.
    deviceSizes: [420, 768],
    imageSizes: [96, 256],
  },
};

export default nextConfig;
