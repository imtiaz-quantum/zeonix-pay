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
        hostname: "192.168.68.133",
        port: "8000",
        pathname: "/media/**", // allow all files under /media/
      },
    ],
  },
};

export default nextConfig;
