/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"]
  },
  // Для Vercel production
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined
};

export default nextConfig;
