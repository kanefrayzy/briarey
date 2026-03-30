import Image from 'next/image'
import Link from 'next/link'
import { NewsArticle } from './NewsCard'
import { formatDate } from '@/lib/utils'

export default function NewsFeatured({ title, excerpt, date, image, slug }: Omit<NewsArticle, 'id'>) {
  return (
    <Link href={slug ? `/news/${slug}` : '#'} className="group flex flex-col lg:flex-row gap-0 items-start">
      {/* Большое изображение слева */}
      <div className="relative lg:w-[80%] rounded-xl overflow-hidden" style={{ minHeight: '470px' }}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* Текст справа */}
      <div className="lg:w-[40%] flex flex-col justify-center px-8 py-6 gap-4">
        <h3 className="text-white font-bold text-[22px] leading-snug group-hover:text-white/80 transition-colors">
          {title}
        </h3>
        <p className="text-brand-gray text-sm leading-relaxed">{excerpt}</p>
        <time className="text-brand-gray/60 text-xs">{formatDate(date)}</time>
      </div>
    </Link>
  )
}
