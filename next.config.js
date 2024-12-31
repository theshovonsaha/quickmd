/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react/jsx-runtime.js": "react/jsx-runtime",
      "react/jsx-dev-runtime.js": "react/jsx-dev-runtime",
    };
    return config;
  },
};

module.exports = nextConfig;
