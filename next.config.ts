import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  webpack: (config) => {
    // Required for react-pdf to work without a canvas module
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
