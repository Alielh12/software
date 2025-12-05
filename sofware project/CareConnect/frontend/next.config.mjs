/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    serverActions: true
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr', 'ar']
  }
};

export default nextConfig;
