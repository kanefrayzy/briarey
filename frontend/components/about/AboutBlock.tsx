'use client'

import Image from 'next/image'
import { useState } from 'react'
import PlayLargeIcon from '@/components/icons/PlayLargeIcon'

interface Column {
  title: string
  text: string
}

interface AboutBlockProps {
  videoUrl?: string
  posterUrl?: string
  columns?: Column[]
}

const DEFAULT_COLUMNS: Column[] = [
  {
    title: 'Производство и стандарты качества',
    text: 'ООО «БРИАРЕЙ» — ведущий российский производитель оборудования газодымоудаления. Производственные процессы соответствуют стандартам ISO 9001, а продукция сертифицирована и запатентована. С 2018 года компания является членом Торгово‑промышленной палаты Московской области и подтверждает высокий уровень надёжности и качества.',
  },
  {
    title: 'Опыт, разработки и отраслевые проекты',
    text: 'Благодаря многолетнему опыту в сфере пожарной безопасности компания выпускает как серийное, так и индивидуальное оборудование. В числе реализованных решений — дымососы высокой производительности серии ДПМ‑7. В 2024 году запущен бренд «ЭГЕОН» для противопожарного оснащения пожарных подразделений, а с октября 2025 года компания участвует в проекте «СТР 01».',
  },
]

export default function AboutBlock({
  videoUrl,
  posterUrl = '/images/about/about.png',
  columns = DEFAULT_COLUMNS,
}: AboutBlockProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-10 lg:pb-16">
      {/* Видео / заглушка */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden group ${videoUrl ? 'cursor-pointer' : 'cursor-default'}`}
        style={{ aspectRatio: '16/9', maxHeight: 620 }}
        onClick={() => videoUrl && setPlaying(true)}
      >
        {!playing ? (
          <>
            <Image
              src={posterUrl}
              alt="О компании БРИАРЕЙ"
              fill
              className="object-cover"
              priority
            />
            {/* Затемнение */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            {/* Кнопка play — показываем только если есть ссылка на видео */}
            {videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="scale-100 group-hover:scale-110 transition-transform">
                  <PlayLargeIcon />
                </div>
              </div>
            )}
          </>
        ) : videoUrl ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        ) : null}
      </div>

      {/* Два столбца с текстом */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 lg:mt-14">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 leading-snug">
              {col.title}
            </h3>
            <p className="text-white/60 text-sm lg:text-base leading-relaxed lg:leading-loose">
              {col.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
