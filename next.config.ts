import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/webp"],
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [384],
    qualities: [72],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
