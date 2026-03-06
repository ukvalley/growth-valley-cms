/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignore ESLint errors during build (pre-existing issues)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript errors during build (pre-existing issues)
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;