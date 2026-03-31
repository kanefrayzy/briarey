import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Бриарей — Противопожарное оборудование',
    short_name: 'Бриарей',
    description: 'Производство и продажа противопожарного оборудования',
    start_url: '/',
    display: 'standalone',
    theme_color: '#0c0c12',
    background_color: '#0c0c12',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
