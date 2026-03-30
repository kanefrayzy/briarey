'use client'

import Image from 'next/image'
import { useState, useRef, useCallback, useEffect } from 'react'
import ImageLightbox from '@/components/ui/ImageLightbox'
import SliderArrowLeftIcon from '@/components/icons/SliderArrowLeftIcon'
import SliderArrowRightIcon from '@/components/icons/SliderArrowRightIcon'

// --- Утилита: определяем мобильный экран ---
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

// --- Данные слайдов ---
const defaultSlides = [
  { src: '/images/about/about.png', alt: 'Производство БРИАРЕЙ  1' },
  { src: '/images/slide-1.png',     alt: 'Производство БРИАРЕЙ  2' },
  { src: '/images/slide-3.png',     alt: 'Производство БРИАРЕЙ  3' },
  { src: '/images/slide-4.png',     alt: 'Производство БРИАРЕЙ  4' },
  { src: '/images/about/about.png', alt: 'Производство БРИАРЕЙ  5' },
]

interface AboutPhotoSliderProps {
  photos?: { src: string; alt: string }[]
}

export default function AboutPhotoSlider({ photos }: AboutPhotoSliderProps) {
  const slides = photos?.length ? photos : defaultSlides

  // Расширенная лента для бесконечного цикла: [last, ...slides, first]
  const ext = [slides[slides.length - 1], ...slides, slides[0]]

  // Desktop: слайд занимает 80% контейнера, начальное смещение 10%
  const SLOT   = 80
  const OFFSET = 10
  // Mobile: слайд на всю ширину
  const SLOT_MOB   = 100
  const OFFSET_MOB = 0

  // Порог свайпа (px)
  const SWIPE_THRESHOLD = 50
  // Порог клика: если перетащили меньше 5px  считаем кликом
  const CLICK_THRESHOLD = 5

  const isMobile = useIsMobile()
  const SLOT_V   = isMobile ? SLOT_MOB   : SLOT
  const OFFSET_V = isMobile ? OFFSET_MOB : OFFSET

  const [trackIdx, setTrackIdx]           = useState(1)
  const [transitioning, setTransitioning] = useState(true)

  // Свайп
  const [dragX, setDragX]  = useState(0)
  const dragStart           = useRef<number | null>(null)
  const dragDistRef         = useRef(0)
  const isDragging          = useRef(false)
  // wasSwipe: выставляется в onPointerUp, проверяется в onClick, чтобы не открывать лайтбокс после свайпа
  const wasSwipe            = useRef(false)

  // Лайтбокс
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  const snapTimer = useRef<ReturnType<typeof setTimeout>>()
  const busy      = useRef(false)

  const realIdx = Math.min(Math.max(trackIdx - 1, 0), slides.length - 1)

  const snapTo = useCallback((toIdx: number) => {
    snapTimer.current = setTimeout(() => {
      setTransitioning(false)
      setTrackIdx(toIdx)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setTransitioning(true)
        busy.current = false
      }))
    }, 560)
  }, [])

  const next = useCallback(() => {
    if (busy.current) return
    busy.current = true
    setTrackIdx(t => {
      const n = t + 1
      if (n === ext.length - 1) snapTo(1)
      else busy.current = false
      return n
    })
  }, [snapTo])

  const prev = useCallback(() => {
    if (busy.current) return
    busy.current = true
    setTrackIdx(t => {
      const n = t - 1
      if (n === 0) snapTo(slides.length)
      else busy.current = false
      return n
    })
  }, [snapTo])

  const goTo = useCallback((realI: number) => {
    if (busy.current) return
    setTrackIdx(realI + 1)
  }, [])

  useEffect(() => () => { if (snapTimer.current) clearTimeout(snapTimer.current) }, [])

  // --- Pointer events (mouse + touch) ---
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragStart.current   = e.clientX
    dragDistRef.current = 0
    isDragging.current  = false
    setDragX(0)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStart.current === null) return
    const dx = e.clientX - dragStart.current
    dragDistRef.current = dx
    if (Math.abs(dx) > CLICK_THRESHOLD) isDragging.current = true
    setDragX(dx)
  }, [])

  const onPointerUp = useCallback(() => {
    if (dragStart.current === null) return
    const dx       = dragDistRef.current
    dragStart.current = null
    setDragX(0)
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      wasSwipe.current = true
      if (dx < 0) next()
      else         prev()
    } else {
      wasSwipe.current = false
    }
  }, [next, prev])

  const onPointerCancel = useCallback(() => {
    dragStart.current = null
    setDragX(0)
  }, [])

  const trackTransform  = `translateX(calc(${OFFSET_V}% - ${trackIdx * SLOT_V}% + ${dragX}px))`
  const trackTransition = transitioning && dragX === 0
    ? 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)'
    : 'none'

  return (
    <section className="w-full bg-[#1A1A1A] py-10 lg:py-16 select-none">

      <div className="relative">

        {/* Лента слайдов */}
        <div
          className={`overflow-hidden${isMobile ? ' cursor-grab active:cursor-grabbing' : ''}`}
          style={{ touchAction: 'pan-y' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <div
            className="flex items-center"
            style={{
              transform:  trackTransform,
              transition: trackTransition,
              willChange: 'transform',
            }}
          >
            {ext.map((slide, i) => {
              const isActive = i === trackIdx
              return (
                <div
                  key={i}
                  className="flex-shrink-0 px-[1.5%]"
                  style={{ width: `${SLOT_V}%` }}
                >
                  <div
                    className="relative w-full overflow-hidden rounded-2xl"
                    style={{
                      aspectRatio: '16/9',
                      transform: isActive ? 'scale(1)' : 'scale(0.88)',
                      opacity:   isActive ? 1 : (isMobile ? 0 : 0.45),
                      transition: transitioning
                        ? 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.55s ease'
                        : 'none',
                      cursor: isActive ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (wasSwipe.current) { wasSwipe.current = false; return }
                      if (isActive) {
                        setLightbox({ src: slide.src, alt: slide.alt })
                      } else {
                        goTo(i - 1)
                      }
                    }}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className="object-cover pointer-events-none"
                      draggable={false}
                      priority={i === 1}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Стрелка влево */}
        <button
          onClick={prev}
          aria-label="Предыдущий слайд"
          className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 hover:opacity-50 transition-opacity duration-200"
          style={isMobile
            ? { left: '8px' }
            : { left: `calc(${OFFSET}% - 3.5% + 10px)` }
          }
        >
          <SliderArrowLeftIcon />
        </button>

        {/* Стрелка вправо */}
        <button
          onClick={next}
          aria-label="Следующий слайд"
          className="absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 hover:opacity-50 transition-opacity duration-200"
          style={isMobile
            ? { right: '8px' }
            : { right: `calc(${OFFSET}% - 3.5% + 10px)` }
          }
        >
          <SliderArrowRightIcon />
        </button>

      </div>

      {/* Точки-индикаторы */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Слайд ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === realIdx ? 24 : 8,
              height:     8,
              background: i === realIdx ? '#FF5722' : 'rgba(255,255,255,0.25)',
            }}
          />
        ))}
      </div>

      {/* Лайтбокс */}
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}

    </section>
  )
}