/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // چون از public/images استفاده می‌کنی
  },
  experimental: {
    appDir: true, // برای فعال‌کردن پوشه app
  },
};

export default nextConfig;
