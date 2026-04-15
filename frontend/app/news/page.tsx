import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import NewsCard, { NewsArticle } from '@/components/news/NewsCard'
import NewsFeatured from '@/components/news/NewsFeatured'
import Image from 'next/image'
import Link from 'next/link'
import { api, storageUrl } from '@/lib/api'
import { formatDate } from '@/lib/utils'

const CHUNK_SIZE = 4

function chunkNews(items: NewsArticle[], size: number) {
  const chunks: NewsArticle[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

function NewsChunkSection({ chunk }: { chunk: NewsArticle[] }) {
  const [featured, ...articles] = chunk
  if (!featured) return null

  return (
    <section>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 py-2 md:py-4">

        <div className="block md:hidden">
          <Link href={featured.slug ? `/news/${featured.slug}` : '#'} className="group block relative rounded-xl overflow-hidden mb-6" style={{ height: 300 }}>
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 50%, transparent 100%)' }} />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
              <h3 className="text-white font-bold text-[16px] leading-snug">{featured.title}</h3>
              <p className="text-white/70 text-[12px] leading-snug line-clamp-2">{featured.excerpt}</p>
              <time className="text-white/40 text-[11px] mt-1">{formatDate(featured.date)}</time>
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {articles.slice(0, 2).map((article) => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <div className="mb-10">
            <NewsFeatured {...featured} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export const metadata = {
  title: 'Новости',
  description: 'Новости и пресс-служба компании Бриарей.',
  alternates: { canonical: '/news' },
}

export default async function NewsPage() {
  const data = await api.getNews(1, 50).catch(() => null)

  const news: NewsArticle[] = data?.data?.map(n => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt,
    date: n.date,
    image: storageUrl(n.image),
    slug: n.slug,
  })) ?? []

  const chunks = chunkNews(news, CHUNK_SIZE)

  return (
    <>
      <Header />
      <main>
        <PageHeading title="Новости" />
        <div className="space-y-8 md:space-y-10">
          {chunks.map((chunk, index) => (
            <NewsChunkSection key={chunk[0]?.id ?? index} chunk={chunk} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
