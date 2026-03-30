import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import NewsCard from '@/components/news/NewsCard'
import { api, storageUrl } from '@/lib/api'
import PlaySmallIcon from '@/components/icons/PlaySmallIcon'

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await api.getNewsDetail(params.slug).catch(() => null)
  if (!item) return { title: 'Новость | БРИАРЕЙ' }
  return {
    title: `${item.title} | БРИАРЕЙ`,
    description: item.excerpt,
  }
}

function PlayIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center">
        <PlaySmallIcon />
      </div>
    </div>
  )
}

export default async function NewsDetailsPage({ params }: Props) {
  const [item, allNews] = await Promise.all([
    api.getNewsDetail(params.slug).catch(() => null),
    api.getNews(1, 4).catch(() => null),
  ])
  if (!item) notFound()

  const moreNews = (allNews?.data ?? [])
    .filter(n => n.id !== item.id)
    .slice(0, 3)
    .map(n => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt,
      date: n.date,
      image: storageUrl(n.image),
      slug: n.slug,
    }))

  return (
    <>
      <Header />
      <main>
        <PageHeading title="Новости" />

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-10 md:pb-14 lg:pb-20">
          <h1 className="text-white font-bold text-xl md:text-2xl lg:text-3xl leading-tight mb-8 lg:mb-10">
            {item.title}
          </h1>

          <div className="flex flex-col gap-8 lg:gap-10">
            {item.content_blocks?.map((block) => {
              const reverse = Boolean(block.is_reversed)
              return (
                <div
                  key={block.id}
                  className={[
                    'flex flex-col gap-4 lg:gap-4 lg:items-stretch',
                    reverse ? 'lg:flex-row-reverse' : 'lg:flex-row',
                  ].join(' ')}
                >
                  {block.image && (
                    <div className="media relative w-full lg:w-auto rounded-xl overflow-hidden min-h-[220px] h-full flex items-center justify-start">
                      <Image
                        src={storageUrl(block.image)}
                        alt={item.title}
                        width={1920}
                        height={1080}
                        className="h-full w-auto max-w-none"
                      />
                      {block.has_play_icon && <PlayIcon />}
                    </div>
                  )}

                  {block.text && (
                    <div className="text lg:flex-1 text-brand-gray text-sm md:text-lg md:leading-loose leading-relaxed whitespace-pre-line">
                      {block.text}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-12 md:pb-16 lg:pb-24">
          <h2 className="text-white font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-8">Еще новости</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {moreNews.map((news) => (
              <NewsCard key={news.id} {...news} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
