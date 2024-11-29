/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.html$/,
      type: 'asset/source'
    });
    return config;
  },
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
  }
}

module.exports = nextConfig
