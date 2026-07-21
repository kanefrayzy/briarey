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
  async headers() {
    return [
      {
        // Статичные медиа (видео, фоны, слайды) — кеш на 7 дней вместо max-age=0,
        // чтобы повторные визиты не перекачивали тяжёлые файлы
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
