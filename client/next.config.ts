import type { NextConfig } from "next";
import "./src/config/env.validatiion";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/**"),
      new URL("https://picsum.photos/**"),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
