/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/uranai',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig