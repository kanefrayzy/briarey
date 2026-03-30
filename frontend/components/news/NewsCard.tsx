import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export interface NewsArticle {
  id: number
  title: string
  excerpt: string
  date: string
  image: string
  slug?: string
}

export default function NewsCard({ title, excerpt, date, image, slug }: Omit<NewsArticle, 'id'>) {
  return (
    <Link href={slug ? `/news/${slug}` : '#'} className="group flex flex-col">
      {/* Изображение */}
      <div className="relative w-full rounded-xl overflow-hidden h-[130px] md:h-[230px]">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>

      {/* Текст */}
      <div className="pt-3 flex flex-col gap-1.5">
        <h3 className="text-white font-bold text-[14px] md:text-2xl leading-snug group-hover:text-white/80 transition-colors">
          {title}
        </h3>
        <p className="text-brand-gray text-[11px] md:text-sm leading-relaxed line-clamp-3">{excerpt}</p>
        <time className="text-brand-gray/60 text-[10px] md:text-xs mt-1">{formatDate(date)}</time>
      </div>
    </Link>
  )
}
