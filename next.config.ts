import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'safrescobaldistatic.blob.core.windows.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mozismenu.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.allrecipes.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.kitchentreaty.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
