import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: { unoptimized: true },
  allowedDevOrigins: ['10.106.16.165', 'localhost', '127.0.0.1'],
};

export default nextConfig;
