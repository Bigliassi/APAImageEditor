/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
  }),
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig; 