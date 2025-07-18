import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    nodeMiddleware: true,
    dynamicIO: true,
    clientSegmentCache: true,
  },
};

export default nextConfig;
