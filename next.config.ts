import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.basehub.com']
  }
};

export default nextConfig;
