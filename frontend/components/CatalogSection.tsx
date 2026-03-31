'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Button from './Button'
import CategoryCard from './catalog/CategoryCard'
import ProductCard from './catalog/ProductCard'
import SectionHeading from './SectionHeading'
import CategoryArrowRightIcon from './icons/CategoryArrowRightIcon'
import CategoryArrowLeftIcon from './icons/CategoryArrowLeftIcon'
import ChevronLeftIcon from './icons/ChevronLeftIcon'
import ChevronRightIcon from './icons/ChevronRightIcon'
import { api, Category as ApiCategory, Product as ApiProduct, storageUrl, productImageUrl } from '@/lib/api'

const DEFAULT_CATEGORIES = [
  { label: 'Узел стыковочный',              icon: '/images/catalog/icons/uzel.png' },
  { label: 'Клапана сброса',                icon: '/images/catalog/icons/klapan.png' },
  { label: 'Дымососы',                      icon: '/images/catalog/icons/dymosos.png' },
  { label: 'Доп. оборудование',             icon: '/images/catalog/icons/dop.png' },
  { label: 'Шкафы для хранения',            icon: '/images/catalog/icons/shkaf.png' },
  { label: 'Двери противопожарные',         icon: '/images/catalog/icons/dver.png' },
  { label: 'Установки сбора вещества',      icon: '/images/catalog/icons/ustanovki.png' },
  { label: 'Дымососы для пожарных машин',   icon: '/images/catalog/icons/dymosos-mashin.png' },
]

/** Default category slug to show initially */
const DEFAULT_SLUG = 'dymososy'

type MappedProduct = { id: number; name: string; flow: string; price: string; image: string; slug: string; categorySlug: string; techDocUrl: string | null }

const CATS_PER_PAGE = 3
const PER_PAGE = 3
const STEP = 172                     // 160px карточка + 12px gap

interface CatalogSectionProps {
  noBgImage?: boolean
  showButton?: boolean
  apiCategories?: ApiCategory[]
  apiProducts?: ApiProduct[]
}

function mapApiProducts(items: ApiProduct[]): MappedProduct[] {
  return items.map(p => {
    const productivityAttr = p.attribute_values?.find(av => av.category_attribute?.key === 'productivity')
    return {
      id: p.id,
      name: p.name,
      flow: productivityAttr ? productivityAttr.value : '',
      price: p.price ? `от ${p.price.toLocaleString('ru-RU')}` : '',
      image: productImageUrl(p.slug, p.image),
      slug: p.slug,
      categorySlug: p.category?.slug ?? '',
      techDocUrl: p.technical_doc_url ?? null,
    }
  })
}

export default function CatalogSection({ noBgImage = false, showButton = true, apiCategories: propCategories, apiProducts: propProducts }: CatalogSectionProps) {
  const [categories, setCategories] = useState<{ label: string; icon: string; slug?: string }[]>(
    propCategories?.length
      ? propCategories.map(c => ({ label: c.name, icon: storageUrl(c.icon), slug: c.slug }))
      : DEFAULT_CATEGORIES
  )
  const [products, setProducts] = useState<MappedProduct[]>(
    propProducts?.length ? mapApiProducts(propProducts) : []
  )
  const [loading, setLoading] = useState(!propProducts?.length)

  // Find the index of the default category (Дымососы)
  const defaultActiveIdx = categories.findIndex(c => c.slug === DEFAULT_SLUG)
  const [active, setActive]       = useState(defaultActiveIdx >= 0 ? defaultActiveIdx : 2)
  const [catPage, setCatPage]     = useState(0)
  const [page, setPage]           = useState(0)
  const [activeCardIdx, setActiveCardIdx] = useState(0)

  // Self-fetch on mount if no props provided, or fetch products for default category
  useEffect(() => {
    const load = async () => {
      try {
        let cats = categories
        if (!propCategories?.length) {
          const fetched = await api.getCategories()
          cats = fetched.map(c => ({ label: c.name, icon: storageUrl(c.icon), slug: c.slug }))
          setCategories(cats)
        }
        const idx = cats.findIndex(c => c.slug === DEFAULT_SLUG)
        if (idx >= 0) setActive(idx)

        const prods = await api.getProducts(DEFAULT_SLUG)
        setProducts(mapApiProducts(prods))
      } catch { /* keep existing state */ } finally { setLoading(false) }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch products when active category changes
  const handleCategoryClick = useCallback(async (idx: number) => {
    setActive(idx)
    setPage(0)
    setActiveCardIdx(0)
    const cat = categories[idx]
    if (!cat?.slug) return
    setLoading(true)
    try {
      const prods = await api.getProducts(cat.slug)
      setProducts(mapApiProducts(prods))
    } catch { /* keep old products */ } finally { setLoading(false) }
  }, [categories])

  const CATEGORIES = categories
  const PRODUCTS = products

  // Бесконечная карусель: тройной клон
  const N = PRODUCTS.length || 1
  const LOOPED = PRODUCTS.length > 0 ? [...PRODUCTS, ...PRODUCTS, ...PRODUCTS] : []

  const totalCatPages = Math.ceil(CATEGORIES.length / CATS_PER_PAGE)
  const visibleCats   = CATEGORIES.slice(catPage * CATS_PER_PAGE, (catPage + 1) * CATS_PER_PAGE)
  const totalPages    = Math.ceil(PRODUCTS.length / PER_PAGE)
  const visible       = PRODUCTS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  // ── Drag-scroll мобильная карусель ────────────────────────────
  const carouselRef  = useRef<HTMLDivElement>(null)
  const isDragging   = useRef(false)
  const startX       = useRef(0)
  const scrollStart  = useRef(0)
  const isJumping    = useRef(false)
  const hasDraggedMobile = useRef(false)

  // Начальная позиция — центр второй копии (индекс N)
  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    el.scrollLeft = N * STEP
  }, [N])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current  = true
    startX.current      = e.clientX
    scrollStart.current = carouselRef.current?.scrollLeft ?? 0
    hasDraggedMobile.current = false
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 8) hasDraggedMobile.current = true
    if (carouselRef.current) carouselRef.current.scrollLeft = scrollStart.current - dx
  }
  const onPointerUp = () => { isDragging.current = false }

  const onCarouselScroll = () => {
    const el = carouselRef.current
    if (!el || isJumping.current) return
    const sl = el.scrollLeft
    const idx = Math.round(sl / STEP)
    // Обновляем активный индекс (0..N-1)
    setActiveCardIdx(((idx % N) + N) % N)
    // Бесконечный цикл: телепорт при входе в зоны клонов
    if (sl < N * STEP) {
      isJumping.current = true
      el.scrollLeft = sl + N * STEP
      requestAnimationFrame(() => { isJumping.current = false })
    } else if (sl >= N * 2 * STEP) {
      isJumping.current = true
      el.scrollLeft = sl - N * STEP
      requestAnimationFrame(() => { isJumping.current = false })
    }
  }

  // ── Drag-scroll десктопная карусель ───────────────────────────
  const desktopRef        = useRef<HTMLDivElement>(null)
  const isDraggingDesk    = useRef(false)
  const startXDesk        = useRef(0)
  const scrollStartDesk   = useRef(0)
  const hasDraggedDesk    = useRef(false)
  const DRAG_THRESHOLD    = 8

  const onDeskDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingDesk.current  = true
    startXDesk.current      = e.clientX
    scrollStartDesk.current = desktopRef.current?.scrollLeft ?? 0
    hasDraggedDesk.current  = false
  }
  const onDeskMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingDesk.current) return
    const dx = e.clientX - startXDesk.current
    if (Math.abs(dx) > DRAG_THRESHOLD) hasDraggedDesk.current = true
    if (desktopRef.current) desktopRef.current.scrollLeft = scrollStartDesk.current - dx
  }
  const onDeskUp = () => {
    isDraggingDesk.current = false
  }

  return (
    <section
      id="catalog"
      className="relative"
      style={{ background: '#242424', maxWidth: 1440, margin: '0 auto' }}
    >
      {!noBgImage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Image src="/images/hero-catalog.png" fill className="object-contain object-top" alt="" aria-hidden />
        </div>
      )}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-14 py-12">

        {/* ── Заголовок ── */}
        <SectionHeading
          title="Каталог оборудования"
          subtitle={<>Отказоустойчивые дымососы,<br />узлы, клапаны и системы</>}
          align="start"
          mb="mb-8"
          titleClass="text-2xl lg:text-[48px] font-bold text-white leading-tight"
          subtitleClass="text-white text-[15px] leading-snug text-right max-w-[260px] mt-2"
        />

        {/* КАТЕГОРИИ DESKTOP */}
        <div
          className="hidden md:flex items-start gap-1 overflow-x-auto rounded-2xl mb-10"
          style={{ background: '#2e2e2e' }}
        >
          {CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.label}
              label={cat.label}
              icon={cat.icon}
              active={i === active}
              onClick={() => handleCategoryClick(i)}
            />
          ))}
        </div>

        {/* КАТЕГОРИИ MOBILE — 3 за раз, стрелки */}
        <div
          className="flex md:hidden items-stretch mb-6 -mx-4"
          style={{ background: '#2e2e2e' }}
        >
          <button
            onClick={() => setCatPage(p => Math.max(p - 1, 0))}
            disabled={catPage === 0}
            className="flex-shrink-0 w-10 flex items-center justify-center disabled:opacity-20 transition-opacity"
          >
            <CategoryArrowLeftIcon />
          </button>

          <div className="flex flex-1 items-start py-0 px-0 lg:px-3 lg:py-3">
            {visibleCats.map((cat, i) => {
              const globalIdx = catPage * CATS_PER_PAGE + i
              return (
                <CategoryCard
                  key={cat.label}
                  label={cat.label}
                  icon={cat.icon}
                  active={globalIdx === active}
                  onClick={() => handleCategoryClick(globalIdx)}
                />
              )
            })}
            {visibleCats.length < CATS_PER_PAGE &&
              Array.from({ length: CATS_PER_PAGE - visibleCats.length }).map((_, i) => (
                <div key={`empty-${i}`} className="flex flex-1" />
              ))
            }
          </div>

          <button
            onClick={() => setCatPage(p => Math.min(p + 1, totalCatPages - 1))}
            disabled={catPage === totalCatPages - 1}
            className="flex-shrink-0 w-10 flex items-center justify-center disabled:opacity-20 transition-opacity"
          >
            <CategoryArrowRightIcon />
          </button>
        </div>

        {/* КАРТОЧКИ DESKTOP — 3 колонки, стрелки, доты, drag-scroll */}
        <div className="hidden md:block">
          {loading ? (
            <div className="flex gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-shrink-0 w-[calc(33.333%-14px)] rounded-2xl overflow-hidden animate-pulse" style={{ background: '#2e2e2e' }}>
                  <div className="w-full bg-[#3a3a3a]" style={{ aspectRatio: '4/3' }} />
                  <div className="p-4 space-y-3" style={{ minHeight: 180 }}>
                    <div className="h-4 bg-[#3a3a3a] rounded w-3/4" />
                    <div className="h-3 bg-[#3a3a3a] rounded w-1/2" />
                    <div className="h-5 bg-[#3a3a3a] rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="relative">
            <button
              onClick={() => {
                const el = desktopRef.current
                if (el) el.scrollBy({ left: -el.clientWidth, behavior: 'smooth' })
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-10 z-10 transition-opacity hover:opacity-70"
            >
              <ChevronLeftIcon />
            </button>

            <div
              ref={desktopRef}
              className="flex gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
              onMouseDown={e => {
                onDeskDown(e as unknown as React.PointerEvent<HTMLDivElement>)
                e.preventDefault()
              }}
              onMouseMove={e => onDeskMove(e as unknown as React.PointerEvent<HTMLDivElement>)}
              onMouseUp={onDeskUp}
              onMouseLeave={onDeskUp}
              onClickCapture={e => { if (hasDraggedDesk.current) { e.stopPropagation(); e.preventDefault() } }}
            >
              {PRODUCTS.map(product => (
                <div key={product.id} className="flex-shrink-0 w-[calc(33.333%-14px)]">
                  <ProductCard
                    name={product.name}
                    flow={product.flow}
                    price={product.price}
                    image={product.image}
                    href={`/catalog/${product.slug}`}
                    categorySlug={product.categorySlug}
                    techDocUrl={product.techDocUrl ?? undefined}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const el = desktopRef.current
                if (el) el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-10 z-10 transition-opacity hover:opacity-70"
            >
              <ChevronRightIcon />
            </button>
          </div>
          )}
        </div>

        {/* КАРТОЧКИ MOBILE — peek-карусель 160×280 */}
        <div className="block md:hidden overflow-hidden -mx-4">
          {loading ? (
            <div className="flex gap-3 justify-center px-4">
              {[1, 2].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#2e2e2e', width: 160, height: 280, flexShrink: 0 }}>
                  <div className="w-full bg-[#3a3a3a]" style={{ aspectRatio: '4/3' }} />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-[#3a3a3a] rounded w-3/4" />
                    <div className="h-3 bg-[#3a3a3a] rounded w-1/2" />
                    <div className="h-4 bg-[#3a3a3a] rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
            style={{
              scrollSnapType:      'x mandatory',
              paddingInline:       'calc(50% - 80px)',
              scrollPaddingInline: 'calc(50% - 80px)',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onScroll={onCarouselScroll}
            onClickCapture={e => { if (hasDraggedMobile.current) { e.stopPropagation(); e.preventDefault() } }}
          >
            {LOOPED.map((product, i) => {
              const realIdx = i % N
              const isFocused = realIdx === activeCardIdx
              return (
                <div
                  key={i}
                  style={{
                    scrollSnapAlign: 'center',
                    flexShrink: 0,
                    transition: 'opacity 0.3s, transform 0.3s',
                    opacity:   isFocused ? 1 : 0.45,
                    transform: isFocused ? 'scale(1)' : 'scale(0.93)',
                  }}
                >
                  <ProductCard
                    name={product.name}
                    flow={product.flow}
                    price={product.price}
                    image={product.image}
                    href={`/catalog/${product.slug}`}
                    categorySlug={product.categorySlug}
                    techDocUrl={product.techDocUrl ?? undefined}
                    compact
                  />
                </div>
              )
            })}
          </div>
          )}
        </div>

        {/* ── Кнопка каталога ── */}
        {showButton && (
          <div className="flex justify-start mt-8">
            <Button
              href="/catalog"
              variant="catalog"
              className="w-full md:w-auto md:min-w-[140px] lg:max-w-max py-4 text-base tracking-wider"
            >
              Каталог
            </Button>
          </div>
        )}

      </div>
    </section>
  )
}
