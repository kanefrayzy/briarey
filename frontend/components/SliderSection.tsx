'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import Button from './Button'
import SmokeOverlay from './SmokeOverlay'
import GearIcon from './icons/GearIcon'
import ShieldCheckFilledIcon from './icons/ShieldCheckFilledIcon'
import TruckFilledIcon from './icons/TruckFilledIcon'
import SnowflakeIcon from './icons/SnowflakeIcon'
import ArrowNextIcon from './icons/ArrowNextIcon'
import ArrowNextMobileIcon from './icons/ArrowNextMobileIcon'
import { storageUrl, type Slide as ApiSlide } from '@/lib/api'

const SLIDES = [
  {
    id: 1,
    image: '/images/slide-1.png',
    title: 'Ведущее производство',
    subtitle: 'Производство противопожарного оборудования\nс гарантированной надёжностью поставок',
    icon: GearIcon,
    statTitle: 'Собственное производство\n(95% ассортимента)',
    statDesc: 'Гарантированные сроки,\nстабильные поставки.',
    nextFeature: 'Высокая\nотказоустойчивость\nоборудования',
    buttonLabel: "О компании",
    buttonHref: '/about',
    buttonVariant: 'catalog' as const,
  },
  {
    id: 2,
    image: '/images/slide-2.png',
    title: 'Реальный производственный цех',
    subtitle: 'Отказоустойчивые дымососы,\nузлы, клапаны и системы',
    icon: ShieldCheckFilledIcon,
    statTitle: 'Высокая отказоустойчивость\nоборудования',
    statDesc: 'Гарантированные сроки,\nстабильные поставки.',
    nextFeature: 'Быстрая доставка\nпо всей РФ',
    buttonLabel: 'Каталог',
    buttonHref: '/catalog',
    buttonVariant: 'catalog' as const,
  },
  {
    id: 3,
    image: '/images/slide-3.png',
    title: 'Подбор за 2 минуты.\nДоставка по всей РФ',
    subtitle: 'Складские запасы и отгрузка за 1–3 дня',
    icon: TruckFilledIcon,
    statTitle: 'Быстрая доставка по всей РФ',
    statDesc: 'Складские запасы и отгрузка\nза 1–3 дня.',
    nextFeature: 'Оборудование для\nфедеральных и\nмуниципальных служб',
    buttonLabel: 'Калькулятор оборудования',
    buttonHref: '/calculator',
    buttonVariant: 'calculator' as const,
  },
  {
    id: 4,
    image: '/images/slide-4.png',
    title: 'Дочерняя компания\n«Эгеон»',
    subtitle: 'Новая линейка для личного состава',
    icon: SnowflakeIcon,
    statTitle: 'Дымососы для пожарных\nмашин',
    statDesc: 'Высокая отказоустойчивость\nи автономность оборудования',
    nextFeature: 'Собственное\nпроизводство\n(95% ассортимента)',
    buttonLabel: 'Сайт «Эгеон»',
    buttonHref: 'https://egeon.ru',
    buttonVariant: 'catalog' as const,
  },
]

interface SliderSectionProps {
  showSmoke?: boolean
  slides?: ApiSlide[]
}

const ICON_MAP: Record<number, React.ComponentType> = {
  0: GearIcon,
  1: ShieldCheckFilledIcon,
  2: TruckFilledIcon,
  3: SnowflakeIcon,
}

function mapApiSlides(apiSlides: ApiSlide[]) {
  return apiSlides.map((s, i) => ({
    id: s.id,
    image: storageUrl(s.image),
    title: s.title,
    subtitle: s.subtitle,
    icon: ICON_MAP[i] || GearIcon,
    statTitle: s.stat_title,
    statDesc: s.stat_description,
    nextFeature: s.next_feature,
    buttonLabel: s.button_text,
    buttonHref: s.button_link,
    buttonVariant: 'catalog' as const,
  }))
}

export default function SliderSection({ showSmoke = true, slides: apiSlides }: SliderSectionProps) {
  const SLIDES_DATA = apiSlides?.length ? mapApiSlides(apiSlides) : SLIDES
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const dragStartX = useRef<number | null>(null)
  const isDragging = useRef(false)

  const goTo = useCallback((idx: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const next = useCallback(() => goTo((current + 1) % SLIDES_DATA.length), [current, goTo, SLIDES_DATA.length])
  const prev = useCallback(() => goTo((current - 1 + SLIDES_DATA.length) % SLIDES_DATA.length), [current, goTo, SLIDES_DATA.length])

  const handleDragStart = (clientX: number) => {
    dragStartX.current = clientX
    isDragging.current = true
  }

  const handleDragEnd = (clientX: number) => {
    if (!isDragging.current || dragStartX.current === null) return
    isDragging.current = false
    const delta = dragStartX.current - clientX
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev()
    }
    dragStartX.current = null
  }

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const slide = SLIDES_DATA[current]

  return (
    <section className="relative w-full">

      {/* ─── Продолжение дыма сверху — затухает в слайдере ─── */}
      {showSmoke && <SmokeOverlay position="top" />}

      {/* ─── Контейнер ─── */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="relative max-w-[1440px] mx-auto overflow-hidden rounded-xl h-[320px] md:h-auto md:[aspect-ratio:3/2] cursor-grab active:cursor-grabbing select-none"
        onTouchStart={e => handleDragStart(e.touches[0].clientX)}
        onTouchEnd={e => handleDragEnd(e.changedTouches[0].clientX)}
        onMouseDown={e => handleDragStart(e.clientX)}
        onMouseUp={e => handleDragEnd(e.clientX)}
        onMouseLeave={() => { isDragging.current = false; dragStartX.current = null }}
      >

        {/* Слайды-изображения */}
        {SLIDES_DATA.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              className="object-cover object-center"
              priority={i === 0}
            />
            {/* Left dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0c]/85 via-transparent to-transparent" />
          </div>
        ))}

        {/* Контент */}
        <div className="relative z-10 flex h-full">

          {/* ─── Левая часть ─── */}
          <div className="flex-1 flex flex-col justify-center px-6 lg:px-14 py-10 lg:py-16 gap-3 lg:gap-4 max-w-[620px]">

            <h2
              className="text-2xl lg:text-[44px] font-bold text-white leading-tight mt-4"
              style={{ whiteSpace: 'pre-line' }}
            >
              {slide.title}
            </h2>

            <p
              className="text-white/70 text-xs lg:text-[15px] leading-snug"
              style={{ whiteSpace: 'pre-line' }}
            >
              {slide.subtitle}
            </p>

            <div className="flex flex-col gap-2 lg:gap-3 mt-1 lg:mt-3">
              {/* иконка + statTitle в ряд */}
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <slide.icon />
                </div>
                <p
                  className="text-white font-medium text-xs lg:text-[15px] lg:font-semibold leading-snug self-center"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {slide.statTitle}
                </p>
              </div>
              {/* statDesc — только десктоп */}
              <p
                className="hidden lg:block text-white/50 text-[12px] leading-snug"
                style={{ whiteSpace: 'pre-line' }}
              >
                {slide.statDesc}
              </p>
            </div>

            {/* Кнопка — только на мобилке */}
            {slide.buttonLabel && (
              <div className="mt-2 lg:hidden">
                <Button href={slide.buttonHref} variant={slide.buttonVariant}>
                  {slide.buttonLabel}
                </Button>
              </div>
            )}
          </div>

          {/* ─── Правая часть — только десктоп ─── */}
          <div className="hidden lg:flex ml-auto flex-shrink-0 flex-col justify-center py-10 pl-4 pr-14 gap-0" style={{ width: '380px' }}>

            {/* Далее → */}
            <button
              onClick={next}
              className="self-end flex items-center gap-2 text-white/80 hover:text-white text-lg font-semibold transition-colors mb-3"
            >
              Далее
              <ArrowNextIcon />
            </button>

            {/* Следующий слайд — превью */}
            <p
              className="text-white font-bold text-[24px] leading-tight text-right"
              style={{ whiteSpace: 'pre-line' }}
            >
              {slide.nextFeature}
            </p>

            {/* Кнопка */}
            {slide.buttonLabel && (
              <div className="self-end mt-6">
                <Button href={slide.buttonHref} variant={slide.buttonVariant}>
                  {slide.buttonLabel}
                </Button>
              </div>
            )}
          </div>

          {/* ─── Стрелка вперёд — только мобилка ─── */}
          <button
            onClick={next}
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-black/40"
            aria-label="Следующий слайд"
          >
            <ArrowNextMobileIcon />
          </button>
        </div>

        {/* Точки навигации — десктоп */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-20 items-center gap-[11px]" style={{ bottom: 34 }}>
          {SLIDES_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 14 : 12,
                height: i === current ? 14 : 12,
                background: i === current ? '#FF5722' : 'rgba(255,255,255,0.35)',
              }}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
        {/* Точки навигации — мобилка, внутри контейнера снизу */}
        <div className="flex lg:hidden absolute left-1/2 -translate-x-1/2 z-20 items-center gap-[11px]" style={{ bottom: 14 }}>
          {SLIDES_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 14 : 12,
                height: i === current ? 14 : 12,
                background: i === current ? '#FF5722' : 'rgba(255,255,255,0.45)',
              }}
              aria-label={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
