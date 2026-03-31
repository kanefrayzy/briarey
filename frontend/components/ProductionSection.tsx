'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import SectionHeading from './SectionHeading'
import { storageUrl, type ProductionSection as ProdSection, type ProductionFeature } from '@/lib/api'

// Fallback-данные
const defaultFeatures = [
  {
    title: 'ISO 9001',
    desc: 'Собственное производство по стандартам ISO 9001',
    image: '/images/production.png',
  },
  {
    title: '20 лет на рынке',
    desc: 'Компания основана в 2005 году и является ведущим производителем противопожарного оборудования',
    image: '/images/production.png',
  },
  {
    title: 'Патенты и сертификация',
    desc: 'Мы являемся официально запатентованным производителем оборудования',
    image: '/images/production.png',
  },
]

interface ProductionSectionProps {
  section?: ProdSection
  features?: ProductionFeature[]
  hideButton?: boolean
}

export default function ProductionSection({ section, features: apiFeatures, hideButton }: ProductionSectionProps) {
  const items = apiFeatures?.length
    ? apiFeatures.map(f => ({ title: f.title, desc: f.description, image: storageUrl(f.image) }))
    : defaultFeatures
  const sectionTitle = section?.title || 'Производство'
  const sectionSubtitle = section?.subtitle || 'Локализация производства 95%'
  const buttonText = section?.button_text || 'Видео инструкции'
  const buttonLink = section?.button_link || '/video'

  const [active, setActive] = useState(0)
  const current = items[active]

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 lg:py-24">

      {/* ── MOBILE ── */}
      <div className="block md:hidden">
        <h2 className="text-2xl font-bold text-white mb-4">{sectionTitle}</h2>

        {/* Картинка на всю ширину */}
        <div className="relative w-full rounded-xl overflow-hidden mb-6" style={{ height: 220, minHeight: 268, maxHeight: 268 }}>
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover"
            style={{ objectFit: 'cover', height: '100%' }}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Список фич */}
        <div className="flex flex-col gap-2 mb-6">
          {items.map((f, i) => (
            <button
              key={f.title}
              onClick={() => setActive(i)}
              className="text-left rounded-xl px-4 py-3 transition-colors"
              style={{ background: i === active ? 'rgba(255,255,255,0.1)' : 'transparent' }}
            >
              <span className="block text-white font-bold text-[15px] mb-1">{f.title}</span>
              <p className="text-white/60 text-[13px] leading-snug">{f.desc}</p>
            </button>
          ))}
        </div>

        {/* Кнопка */}
        {!hideButton && (
          <Button href={buttonLink} variant="catalog" className="!max-w-none w-full !justify-center py-4 text-base">
            {buttonText}
          </Button>
        )}
      </div>

      {/* ── DESKTOP (без изменений) ── */}
      <div className="hidden md:block">
        <SectionHeading
          title={sectionTitle}
          subtitle={sectionSubtitle}
          mb="mb-10"
          subtitleClass="text-white text-base text-right mt-2"
        />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Левый блок 35% */}
          <div className="flex flex-col gap-4 lg:w-[35%] flex-shrink-0">
            {items.map((f, i) => (
              <button
                key={f.title}
                onClick={() => setActive(i)}
                className="text-left rounded-xl p-10 transition-colors"
                style={{ background: i === active ? 'rgba(255,255,255,0.1)' : 'transparent' }}
              >
                <span className="block text-sm font-semibold text-white mb-4">{f.title}</span>
                <p className="text-brand-gray text-sm leading-loose max-w-[70%]">{f.desc}</p>
              </button>
            ))}
            {!hideButton && (
              <div className="mt-2">
                <Button href={buttonLink} variant="catalog">{buttonText}</Button>
              </div>
            )}
          </div>

          {/* Правый блок — изображение */}
          <div className="flex-1 relative rounded-xl overflow-hidden min-h-[320px]">
            <Image
              key={current.image}
              src={current.image}
              alt={current.title}
              fill
              className="object-cover rounded-xl"
              sizes="50vw"
            />
          </div>
        </div>
      </div>

    </section>
  )
}
