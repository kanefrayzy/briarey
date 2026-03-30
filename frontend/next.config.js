/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nikstudiotest.ru',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/storage/:path*',
        destination: `${process.env.STORAGE_UPSTREAM || 'http://nginx'}/storage/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
