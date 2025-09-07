import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/Keep_Out',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;