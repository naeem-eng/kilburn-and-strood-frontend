/** @type {import('next').NextConfig} */


const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});


const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/hs-forms/:path*',
        destination: 'https://js-eu1.hsforms.net/:path*',
      },
    ]
  },

  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true, // 308 redirect
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "smart-nurture-83db65dd5c.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "smart-nurture-83db65dd5c.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "smart-breeze-d8bb86b1e4.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "smart-breeze-d8bb86b1e4.media.strapiapp.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
