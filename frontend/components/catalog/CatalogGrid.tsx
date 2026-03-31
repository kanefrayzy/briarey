'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import CategoryCard from './CategoryCard'
import ProductCard from './ProductCard'
import SectionHeading from '@/components/SectionHeading'
import CategoryArrowLeftIcon from '@/components/icons/CategoryArrowLeftIcon'
import CategoryArrowRightIcon from '@/components/icons/CategoryArrowRightIcon'
import PaginationPrevIcon from '@/components/icons/PaginationPrevIcon'
import PaginationNextIcon from '@/components/icons/PaginationNextIcon'
import { Category as ApiCategory, Product as ApiProduct, api, storageUrl, productImageUrl } from '@/lib/api'

const DEFAULT_CATEGORIES = [
  { label: 'Узел стыковочный',            icon: '/images/catalog/icons/uzel.png' },
  { label: 'Клапана сброса',              icon: '/images/catalog/icons/klapan.png' },
  { label: 'Дымососы',                    icon: '/images/catalog/icons/dymosos.png' },
  { label: 'Доп. оборудование',           icon: '/images/catalog/icons/dop.png' },
  { label: 'Шкафы для хранения',          icon: '/images/catalog/icons/shkaf.png' },
  { label: 'Двери противопожарные',       icon: '/images/catalog/icons/dver.png' },
  { label: 'Установки сбора вещества',    icon: '/images/catalog/icons/ustanovki.png' },
  { label: 'Дымososы для пожарных машин', icon: '/images/catalog/icons/dymosos-mashin.png' },
]

const DEFAULT_SLUG = 'dymososy'

type MappedProduct = { id: number; name: string; flow: string; price: string; image: string; slug: string; categorySlug: string; techDocUrl: string | null }

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

const PER_PAGE = 9
const CATS_PER_PAGE = 3

interface CatalogGridProps {
  apiCategories?: ApiCategory[]
  initialCategorySlug?: string
  initialProducts?: ApiProduct[]
}

export default function CatalogGrid({ apiCategories, initialCategorySlug, initialProducts }: CatalogGridProps) {
  const [categories, setCategories] = useState(
    apiCategories?.length
      ? apiCategories.map(c => ({ label: c.name, icon: storageUrl(c.icon), slug: c.slug }))
      : DEFAULT_CATEGORIES.map(c => ({ ...c, slug: '' }))
  )

  const resolvedInitialSlug = initialCategorySlug || DEFAULT_SLUG
  const defaultIdx = categories.findIndex(c => c.slug === resolvedInitialSlug)
  const [ALL_PRODUCTS, setAllProducts] = useState<MappedProduct[]>(
    initialProducts?.length ? mapApiProducts(initialProducts) : []
  )
  const [activeCategory, setActiveCategory] = useState(defaultIdx >= 0 ? defaultIdx : (initialCategorySlug ? 0 : 2))
  const [catPage, setCatPage]               = useState(defaultIdx >= 0 ? Math.floor(defaultIdx / CATS_PER_PAGE) : 0)
  const [page, setPage]                     = useState(0)
  const [loading, setLoading]               = useState(!initialProducts?.length)

  // Auto-fetch on mount: load categories (if needed) + initial products
  useEffect(() => {
    const load = async () => {
      try {
        let cats = categories
        if (!apiCategories?.length) {
          const fetched = await api.getCategories()
          cats = fetched.map(c => ({ label: c.name, icon: storageUrl(c.icon), slug: c.slug }))
          setCategories(cats)
        }
        const slug = initialCategorySlug || DEFAULT_SLUG
        const idx = cats.findIndex(c => c.slug === slug)
        if (idx >= 0) {
          setActiveCategory(idx)
          setCatPage(Math.floor(idx / CATS_PER_PAGE))
        }

        // Всегда перезагружаем продукты по slug если initialProducts не пришли
        if (!initialProducts?.length) {
          const prods = await api.getProducts(slug)
          setAllProducts(mapApiProducts(prods))
        }
      } catch { /* keep existing state */ } finally { setLoading(false) }
    }
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch products when category is clicked
  const handleCategoryChange = useCallback(async (idx: number) => {
    setActiveCategory(idx)
    setPage(0)
    const cat = categories[idx]
    if (cat?.slug) {
      setLoading(true)
      try {
        const prods = await api.getProducts(cat.slug)
        setAllProducts(mapApiProducts(prods))
      } catch { /* keep current products */ } finally { setLoading(false) }
    }
  }, [categories])

  const totalPages    = Math.ceil(ALL_PRODUCTS.length / PER_PAGE)
  const visible       = ALL_PRODUCTS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)
  const totalCatPages = Math.ceil(categories.length / CATS_PER_PAGE)
  const visibleCats   = categories.slice(catPage * CATS_PER_PAGE, (catPage + 1) * CATS_PER_PAGE)

  const handlePageChange = (p: number) => {
    setPage(p)
    // Скролл к верху секции
    document.getElementById('catalog-page-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="catalog-page-grid"
      className="relative"
      style={{ background: '#242424', maxWidth: 1440, margin: '0 auto' }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image src="/images/hero-catalog.png" fill className="object-contain object-top" alt="" aria-hidden />
      </div>
    <div className="max-w-[1440px] mx-auto px-4 lg:px-14 py-12">
      {/* Заголовок */}
      <SectionHeading
        title="Каталог оборудования"
        subtitle={<>Отказоустойчивые дымососы,<br />узлы, клапаны и системы</>}
        align="start"
        mb="mb-8"
        titleClass="text-2xl lg:text-[48px] font-bold text-white leading-tight"
        subtitleClass="text-white text-[15px] leading-snug text-right max-w-[260px] mt-2"
      />

      {/* Категории — desktop */}
      <div
        className="hidden md:flex items-start gap-1 overflow-x-auto rounded-2xl mb-10"
        style={{ background: '#2e2e2e' }}
      >
        {categories.map((cat, i) => (
          <CategoryCard
            key={cat.label}
            label={cat.label}
            icon={cat.icon}
            active={i === activeCategory}
            onClick={() => handleCategoryChange(i)}
          />
        ))}
      </div>

      {/* Категории — mobile */}
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

        <div className="flex flex-1 items-start">
          {visibleCats.map((cat, i) => {
            const globalIdx = catPage * CATS_PER_PAGE + i
            return (
              <CategoryCard
                key={cat.label}
                label={cat.label}
                icon={cat.icon}
                active={globalIdx === activeCategory}
                onClick={() => handleCategoryChange(globalIdx)}
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

      {/* Сетка продуктов — 3 колонки */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#2e2e2e' }}>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {visible.map(product => (
          <ProductCard
            key={product.id}
            name={product.name}
            flow={product.flow}
            price={product.price}
            image={product.image}
            href={`/catalog/${product.slug}`}
            categorySlug={product.categorySlug}
            techDocUrl={product.techDocUrl ?? undefined}
          />
        ))}
      </div>
      )}

      {/* Пагинация — слева */}
      <div className="flex items-center gap-1">
        {/* Кнопка «предыдущая» */}
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
          className="flex items-center justify-center transition-opacity disabled:opacity-30"
          style={{
            width: 40,
            height: 40,
            background: '#2e2e2e',
            borderRadius: 4,
            color: 'white',
          }}
          aria-label="Предыдущая страница"
        >
          <PaginationPrevIcon />
        </button>

        {/* Номера страниц */}
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className="flex items-center justify-center text-sm font-medium transition-colors"
            style={{
              width:      40,
              height:     40,
              borderRadius: 4,
              background:   i === page ? '#1a1a1a' : '#2e2e2e',
              color:        'white',
              fontWeight:   i === page ? 700 : 400,
            }}
          >
            {i + 1}
          </button>
        ))}

        {/* Кнопка «следующая» */}
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages - 1}
          className="flex items-center justify-center transition-opacity disabled:opacity-30"
          style={{
            width: 40,
            height: 40,
            background: '#2e2e2e',
            borderRadius: 4,
            color: 'white',
          }}
          aria-label="Следующая страница"
        >
          <PaginationNextIcon />
        </button>
      </div>
    </div>
    </section>
  )
}
