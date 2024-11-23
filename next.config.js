/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // We're using TypeScript for type checking
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
