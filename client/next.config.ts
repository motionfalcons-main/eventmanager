import type { NextConfig } from "next";

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
  // Ensure proper module resolution
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  }
  /* config options here */
};

export default nextConfig;
