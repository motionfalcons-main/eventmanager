import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [{
      protocol: 'http',
      hostname: 'localhost',
      port: '8080',
      pathname: '**'
    }]
  },
  // Ensure proper module resolution with path aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  }
  /* config options here */
};

export default nextConfig;
