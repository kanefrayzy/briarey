import { NewsArticle } from '@/components/news/NewsCard'

export interface NewsContentBlock {
  text: string
  image: string
  reverse?: boolean
  withPlayIcon?: boolean
}

export interface NewsItem extends NewsArticle {
  contentTitle: string
  contentBlocks: NewsContentBlock[]
}

const baseNews: NewsArticle[] = [
  {
    id: 1,
    title: 'Испытание оборудования в условиях, приближенных к боевым',
    excerpt: 'В Москве специалисты МЧС России провели практические занятия по совершенствованию навыков работы звеньев ГДЗС.',
    date: 'April 28, 2020',
    image: '/images/news-1.png',
    slug: 'ispytanie-oborudovaniya',
  },
  {
    id: 2,
    title: 'Подбор оборудования для объектов сложной конфигурации',
    excerpt: 'Как правильно подобрать дымосос при проектировании переносной системы газодымоудаления.',
    date: 'May 02, 2020',
    image: '/images/news-2.png',
    slug: 'podbor-oborudovaniya',
  },
  {
    id: 3,
    title: 'Итоги участия в выставке Комплексная безопасность 2023',
    excerpt: 'С 31 мая по 03 июня 2023 года на территории КВЦ «Патриот» проводился Международный салон.',
    date: 'May 10, 2020',
    image: '/images/news-3.png',
    slug: 'kompleksnaya-bezopasnost-2023',
  },
  {
    id: 4,
    title: 'Проект СТР-01: развитие линейки противопожарных решений',
    excerpt: 'Наша компания ратует за технологическое расширение и внедрение инноваций.',
    date: 'May 15, 2020',
    image: '/images/news-featured.png',
    slug: 'proekt-str-01',
  },
  {
    id: 5,
    title: 'Новые требования к системам газодымоудаления в 2026 году',
    excerpt: 'Разбираем изменения в нормативной базе и влияние на проектирование.',
    date: 'June 01, 2020',
    image: '/images/news-1.png',
    slug: 'trebovaniya-2026',
  },
  {
    id: 6,
    title: 'Проверка оборудования перед запуском: чек-лист инженера',
    excerpt: 'Короткий чек-лист, который помогает избежать типовых ошибок на объекте.',
    date: 'June 04, 2020',
    image: '/images/news-2.png',
    slug: 'checklist-zapusk',
  },
  {
    id: 7,
    title: 'Складская программа: ускоренная отгрузка по РФ',
    excerpt: 'Рассказываем, как организована логистика и какие позиции доступны сразу.',
    date: 'June 10, 2020',
    image: '/images/news-3.png',
    slug: 'skladskaya-programma',
  },
  {
    id: 8,
    title: 'Совместные испытания с проектными организациями',
    excerpt: 'Проводим тестирование и подбираем конфигурации под нестандартные объекты.',
    date: 'June 15, 2020',
    image: '/images/news-featured.png',
    slug: 'sovmestnye-ispytaniya',
  },
  {
    id: 9,
    title: 'Результаты внутренней сертификации производственной линии',
    excerpt: 'Подтверждены показатели стабильности качества и производительности.',
    date: 'July 01, 2020',
    image: '/images/news-1.png',
    slug: 'sertifikaciya-linii',
  },
  {
    id: 10,
    title: 'Как выбрать подрядчика для монтажа противопожарного оборудования',
    excerpt: 'Ключевые критерии оценки и рекомендации для заказчиков.',
    date: 'July 05, 2020',
    image: '/images/news-2.png',
    slug: 'vybor-podryadchika',
  },
  {
    id: 11,
    title: 'Практика применения переносных комплексов на промышленных объектах',
    excerpt: 'Кейсы внедрения и обзор эксплуатационных результатов.',
    date: 'July 12, 2020',
    image: '/images/news-3.png',
    slug: 'praktika-primeneniya',
  },
  {
    id: 12,
    title: 'Новый учебный модуль для сервисных инженеров',
    excerpt: 'Обновили программу обучения для ускорения ввода специалистов в проекты.',
    date: 'July 20, 2020',
    image: '/images/news-featured.png',
    slug: 'uchebnyy-modul',
  },
]

const defaultBlockText =
  'С 29 мая по 1 июня на территории КВЦ «Патриот» будет проходить международный салон «Комплексная безопасность-2024». Второй год подряд наша компания будет выставляться на салоне со своим стендом. В этот раз мы будем представлять оборудование нового бренда: пожарные дымососы ЭГЕОН с электромоторным приводом производительностью до 40 000 м3/час.'

export const NEWS_ITEMS: NewsItem[] = baseNews.map((item, index) => ({
  ...item,
  contentTitle: item.title,
  contentBlocks: [
    {
      text: defaultBlockText,
      image: item.image,
    },
    {
      text: defaultBlockText,
      image: baseNews[(index + 1) % baseNews.length].image,
      reverse: true,
      withPlayIcon: true,
    },
  ],
}))

export const NEWS_LIST: NewsArticle[] = NEWS_ITEMS.map(({ id, title, excerpt, date, image, slug }) => ({
  id,
  title,
  excerpt,
  date,
  image,
  slug,
}))

export function getNewsBySlug(slug: string) {
  return NEWS_ITEMS.find((item) => item.slug === slug)
}
