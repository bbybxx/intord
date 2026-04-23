/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"]
  },
  // Для Vercel production
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Security headers to fix Permissions-Policy warnings
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'attribution-reporting=(), private-aggregation=(), private-state-token-issuance=(), private-state-token-redemption=(), join-ad-interest-group=(), run-ad-auction=(), browsing-topics=()'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
