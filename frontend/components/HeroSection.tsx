'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import SmokeOverlay from './SmokeOverlay'
import { type HeroSection as HeroData } from '@/lib/api'

interface HeroSectionProps {
  data?: HeroData
}

/**
 * Видео дыма с отложенной загрузкой: до полной загрузки страницы показывается
 * лёгкий постер (webp), а тяжёлое видео (~11 МБ) начинает скачиваться только
 * после события load (или через 4 с — страховка), не блокируя первую отрисовку.
 */
function DeferredSmokeVideo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const [ready, setReady] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const start = () => setReady(true)

    if (document.readyState === 'complete') {
      start()
    } else {
      window.addEventListener('load', start, { once: true })
      timer = setTimeout(start, 4000) // страховка, если load задерживается
    }

    return () => {
      window.removeEventListener('load', start)
      if (timer) clearTimeout(timer)
    }
  }, [])

  // После появления <source> нужно явно перечитать и запустить видео
  useEffect(() => {
    if (ready && ref.current) {
      ref.current.load()
      ref.current.play().catch(() => {})
    }
  }, [ready])

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      poster="/images/dymka-poster.webp"
      aria-hidden="true"
      className={className}
      style={style}
    >
      {ready && (
        <>
          {/* Safari (iOS/macOS) — ProRes 4444 с альфа-каналом */}
          <source src="/images/dymka.mov" type="video/quicktime" />
          {/* Chrome, Firefox и остальные */}
          <source src="/images/dymka.webm" type="video/webm" />
        </>
      )}
    </video>
  )
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
        style={{
          minHeight: '380px',
          marginTop: '-64px',
          backgroundImage: 'url(/images/fon.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 z-0">
          <DeferredSmokeVideo
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '-240px top' }}
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
        style={{
          height: '100vh',
          minHeight: '580px',
          marginTop: '-96px',
          paddingTop: '96px',
          backgroundImage: 'url(/images/fon.webp)',
          backgroundSize: 'cover',
          backgroundPosition: `center ${s * 0.05}px`,
        }}
      >
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
          <DeferredSmokeVideo className="absolute inset-0 w-full h-full object-cover object-center" />
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

