import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "api.zeonixpay.com",
        pathname: "/media/**",   // matches /media/... paths
      },
    ],
  },
};

export default nextConfig;
