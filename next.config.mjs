/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['react-leaflet', 'leaflet'],
  reactStrictMode: true,
};

export default nextConfig;