import Image from 'next/image'
import Link from 'next/link'
import Button from './Button'
import NewsCard, { NewsArticle } from './news/NewsCard'
import NewsFeatured from './news/NewsFeatured'
import { formatDate } from '@/lib/utils'
import SectionHeading from './SectionHeading'
import { NewsItem as ApiNewsItem, storageUrl } from '@/lib/api'

const defaultFeatured: Omit<NewsArticle, 'id'> = {
  title: 'Проект СТР-01',
  excerpt:
    'Наша компания всегда ратует за технологическое расширение и внедрение инноваций в области противопожарного оборудования.',
  date: 'April 28, 2020',
  image: '/images/news-featured.png',
  slug: 'proekt-str-01',
}

const defaultArticles: NewsArticle[] = [
  {
    id: 1,
    title: 'Испытание оборудования в условиях, приближенных к боевым',
    excerpt:
      'В Москве специалисты МЧС России провели практические занятия по совершенствованию навыков работы звеньев ГДЗС.',
    date: 'April 28, 2020',
    image: '/images/news-1.png',
    slug: 'ispytanie-oborudovaniya',
  },
  {
    id: 2,
    title: 'Подбор оборудования',
    excerpt:
      'Как правильно подобрать дымосос при проектировании переносной системы газодымоудаления? Необходимо учитывать комплекс факторов.',
    date: 'April 28, 2020',
    image: '/images/news-2.png',
    slug: 'podbor-oborudovaniya',
  },
  {
    id: 3,
    title: 'Итоги участия в выставке Комплексная безопасность 2023',
    excerpt:
      'С 31 мая по 03 июня 2023 года на территории КВЦ «Патриот» в г. Кубинка проводился Международный салон.',
    date: 'April 28, 2020',
    image: '/images/news-3.png',
    slug: 'kompleksnaya-bezopasnost-2023',
  },
]

interface NewsSectionProps {
  news?: ApiNewsItem[]
}

export default function NewsSection({ news }: NewsSectionProps) {
  const items: NewsArticle[] = news?.length
    ? news.map(n => ({
        id: n.id,
        title: n.title,
        excerpt: n.excerpt,
        date: n.date,
        image: storageUrl(n.image),
        slug: n.slug,
      }))
    : [{ ...defaultFeatured, id: 0 }, ...defaultArticles]

  const feat = items[0]
  const rest = items.slice(1)

  return (
    <section>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 py-10 md:py-16 bg-[#282828] rounded-2xl">

        {/* Заголовок */}
        <SectionHeading
          title="Новости"
          subtitle="Пресс служба"
          subtitleClass="text-brand-gray text-base text-right mt-2"
        />

        {/* ── MOBILE ── */}
        <div className="block md:hidden">
          {/* Главная новость — картинка на всю ширину, текст снизу поверх */}
          <Link href={feat.slug ? `/news/${feat.slug}` : '#'} className="group block relative rounded-xl overflow-hidden mb-6" style={{ height: 300 }}>
            <Image
              src={feat.image}
              alt={feat.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
            {/* Градиент снизу */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 50%, transparent 100%)' }} />
            {/* Текст */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1">
              <h3 className="text-white font-bold text-[16px] leading-snug">{feat.title}</h3>
              <p className="text-white/70 text-[12px] leading-snug line-clamp-2">{feat.excerpt}</p>
              <time className="text-white/40 text-[11px] mt-1">{formatDate(feat.date)}</time>
            </div>
          </Link>

          {/* 2 новости */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {rest.slice(0, 2).map((article) => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>

          {/* Кнопка */}
          <Button href="/news" variant="catalog" className="!max-w-none w-full !justify-center py-4 text-base">
            Все новости
          </Button>
        </div>

        {/* ── DESKTOP (без изменений) ── */}
        <div className="hidden md:block">
          {/* Главная новость */}
          <div className="mb-10">
            <NewsFeatured {...feat} />
          </div>

          {/* Сетка новостей */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rest.map((article) => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>

          {/* Кнопка */}
          <div className="mt-12">
            <Button href="/news" variant="catalog">Все новости</Button>
          </div>
        </div>

      </div>
    </section>
  )
}
