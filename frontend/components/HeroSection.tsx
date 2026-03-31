'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import SmokeOverlay from './SmokeOverlay'
import { type HeroSection as HeroData } from '@/lib/api'

interface HeroSectionProps {
  data?: HeroData
}

export default function HeroSection({ data }: HeroSectionProps) {
  const title = data?.title || 'Системы\nгазодымоудаления'
  const subtitle = data?.subtitle || 'Производство и продажа'
  const ctaText = data?.cta_text || 'Каталог'
  const ctaLink = data?.cta_link || '/catalog'
  const cardTitle = data?.card_title || 'Подбор комплекта за 2 минуты'
  const cardDescription = data?.card_description || 'Начните с удобного расчёта необходимого оборудования для вашего объекта!'
  const cardButtonText = data?.card_button_text || 'Калькулятор'
  const cardButtonLink = data?.card_button_link || '/calculator'

  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ограничиваем чтобы трансформы не убегали за пределы секции
  const s = Math.min(scrollY, 900)

  return (
    <>
      {/* ══ МОБИЛЬНАЯ ВЕРСИЯ (< md) — без параллакса ══ */}
      <section
        className="block md:hidden relative w-full overflow-hidden"
        style={{ minHeight: '380px', marginTop: '-64px', background: '#0c0c12' }}
      >
        {/* fon.png — Next.js отдаст WebP автоматически */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src="/images/fon.png" fill className="object-cover object-center" alt="" aria-hidden priority />
        </div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dd.gif"
            alt="Дымосос Бриарей"
            fill
            className="object-cover"
            style={{ objectPosition: '-240px top' }}
            priority
          />
        </div>

        <SmokeOverlay position="bottom" zIndex={2} height="30%" />
        <div style={{ height: '96px' }} />

        <div className="relative z-10 flex justify-end px-5 pb-7">
          <div className="flex flex-col gap-2.5 max-w-[220px]">
            <h2 className="text-white text-xl font-semibold leading-snug">{cardTitle}</h2>
            <p className="text-white/75 text-sm leading-relaxed">{cardDescription}</p>
            <div className="mt-1 flex">
              <Button href={cardButtonLink} variant="calculator">{cardButtonText}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ДЕСКТОПНАЯ ВЕРСИЯ (md+) — параллакс ══ */}
      <section
        className="hidden md:block relative w-full overflow-hidden"
        style={{ height: '100vh', minHeight: '580px', marginTop: '-96px', paddingTop: '96px', background: '#0c0c12' }}
      >
        {/* fon.png — Next.js отдаст WebP, parallax translateY */}
        <div
          className="absolute pointer-events-none"
          style={{ inset: '-4%', zIndex: 1, willChange: 'transform', transform: `translateY(${s * 0.05}px)` }}
        >
          <Image src="/images/fon.png" fill className="object-cover object-center" alt="" aria-hidden priority />
        </div>
        {/*
          Параллакс-слои (дальний → ближний):
            fon.png       backgroundPosition 0.05x  — почти статично
            gif           scale + translateY 0.12x  — медленно опускается и растёт
            лого          translateY 0.25x + fade   — быстрее уходит, исчезает за дымососом
            перекрывашка  z=11                      — статично
            контент       translateY -0.10x + fade  — уходит вверх, исчезает
        */}

        {/* ── Дымосос (gif) ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: '-6%',
            zIndex: 10,
            willChange: 'transform',
            transform: `translateY(${s * 0.08}px)`,
          }}
        >
          <Image
            src="/images/dd.gif"
            alt="Дымосос Бриарей"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* ── Перекрывашка ── */}
        <SmokeOverlay position="bottom" height="32%" />

        {/* ── Логотип — уходит за дымосос (z=9) ── */}
        <div
          className="absolute top-[128px] left-1/2 pointer-events-none"
          style={{
            zIndex: 9,
            willChange: 'transform, opacity',
            transform: `translateX(-50%) translateY(${s * 0.25}px)`,
            opacity: Math.max(0, 1 - s / 320),
          }}
        >
          <Image
            src="/images/logo.svg"
            alt="Бриарей"
            width={610}
            height={126}
            className="w-72 lg:w-[380px] xl:w-[610px] h-auto"
            priority
          />
        </div>

        {/* ── Контент (текст + карточка) ── */}
        <div
          className="relative z-20 h-full max-w-[1440px] mx-auto px-14 flex items-center justify-between"
          style={{
            willChange: 'transform, opacity',
            transform: `translateY(${s * -0.10}px)`,
            opacity: Math.max(0, 1 - s / 480),
          }}
        >
          <div className="flex flex-col gap-4 max-w-[360px]">
            <div className="flex flex-col gap-2">
              <h1 className="text-[46px] font-bold text-white leading-tight" style={{ whiteSpace: 'pre-line' }}>
                {title}
              </h1>
              <p className="text-white/80 text-2xl">{subtitle}</p>
            </div>
            <div className="pt-1">
              <Button href={ctaLink} variant="catalog">{ctaText}</Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-[450px] p-8 bg-[#292B32]/25 backdrop-blur-md rounded-2xl shadow-2xl text-left">
            <h2 className="max-w-xs text-white text-4xl font-semibold leading-tight">{cardTitle}</h2>
            <p className="max-w-xs text-white/90 text-base leading-tight">{cardDescription}</p>
            <Button href={cardButtonLink} variant="calculator">{cardButtonText}</Button>
          </div>
        </div>
      </section>
    </>
  )
}

