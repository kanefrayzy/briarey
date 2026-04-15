import type { MetadataRoute } from 'next'
import { api } from '@/lib/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://briarey.ru'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Static pages
  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/catalog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/calculator', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/news', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/certificates', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/vacancies', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/dealers', priority: 0.6, changeFrequency: 'monthly' as const },
  ]

  for (const page of staticPages) {
    entries.push({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })
  }

  // Categories
  try {
    const categories = await api.getCategories()
    for (const cat of categories) {
      entries.push({
        url: `${SITE_URL}/catalog/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  } catch { /* API unavailable */ }

  // Products (all categories)
  try {
    const products = await api.getProducts()
    for (const product of products) {
      entries.push({
        url: `${SITE_URL}/catalog/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  } catch { /* API unavailable */ }

  // News
  try {
    const newsData = await api.getNews(1, 100)
    for (const item of newsData.data) {
      entries.push({
        url: `${SITE_URL}/news/${item.slug}`,
        lastModified: new Date(item.date),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
  } catch { /* API unavailable */ }

  return entries
}
