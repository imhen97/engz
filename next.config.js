/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: false,
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@prisma/client",
      "prisma",
      "nodemailer",
    ],
  },
};

module.exports = nextConfig;
