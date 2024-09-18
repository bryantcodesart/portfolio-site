/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io'],
  },
  env: {
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
  },
  optimizeFonts: false,
  // Add the following redirect configuration
  async redirects() {
    return [
      {
        source: '/check-in',
        destination: process.env.CHECKIN_REDIRECT,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
