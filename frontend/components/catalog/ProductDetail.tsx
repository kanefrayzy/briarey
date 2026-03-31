'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/Button'
import ProductCard from './ProductCard'
import SectionHeading from '@/components/SectionHeading'
import CatalogSection from '@/components/CatalogSection'
import type { Product } from '@/data/products'
import SpeedIcon from '@/components/icons/SpeedIcon'
import SpecSizeIcon from '@/components/icons/SpecSizeIcon'
import SpecWeightIcon from '@/components/icons/SpecWeightIcon'
import SpecPowerIcon from '@/components/icons/SpecPowerIcon'
import DownloadIcon from '@/components/icons/DownloadIcon'
import WalletIcon from '@/components/icons/WalletIcon'
import TruckIcon from '@/components/icons/TruckIcon'
import CheckmarkIcon from '@/components/icons/CheckmarkIcon'
import { useCart } from '@/lib/cart'

const SPEC_ICON_MAP: Record<string, React.ComponentType> = {
  size: SpecSizeIcon,
  dimensions: SpecSizeIcon,
  weight: SpecWeightIcon,
  mass: SpecWeightIcon,
  engine: SpecPowerIcon,
  motor: SpecPowerIcon,
  power: SpecPowerIcon,
  productivity: SpeedIcon,
  airflow: SpeedIcon,
  speed: SpeedIcon,
  fire_resistance: SpecPowerIcon,
}
const SPEC_ICONS_FALLBACK = [SpecSizeIcon, SpecWeightIcon, SpecPowerIcon, SpeedIcon]

function SpecIcon({ specKey, index }: { specKey?: string; index: number }) {
  const Icon = (specKey && SPEC_ICON_MAP[specKey]) || SPEC_ICONS_FALLBACK[index] || SpeedIcon
  return <Icon />
}
interface Props {
  product: Product
}

/* ── Аккордион-блок ─────────────────────────────────────────── */
function AccordionBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-xl mb-4 overflow-hidden bg-[#2e2e2e]">
      <button
        className="w-full flex items-start justify-between gap-4 px-6 pt-6 pb-4 lg:px-8 lg:pt-8 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <p className="text-white font-bold text-lg lg:text-xl leading-snug">{title}</p>
          {subtitle && <p className="text-xs mt-1 text-[#9AA3B2]">{subtitle}</p>}
        </div>
        <span className={`flex-shrink-0 flex items-center justify-center text-white/60 transition-transform mt-1 text-2xl leading-none ${open ? 'rotate-45' : 'rotate-0'}`}>
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 lg:px-8 lg:pb-8">
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Слайдер ────────────────────────────────────────────────── */
function RangeSlider({ min, max, step, value, onChange, label, hint }: {
  min: number; max: number; step: number; value: number
  onChange: (v: number) => void; label: string; hint: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-7">
      {/* Трек */}
      <div className="relative h-[10px] rounded-full mb-3 bg-white/10">
        {/* Заполнение — чуть уже трека, по центру */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-[7px] rounded-full bg-[#bdbdbd]"
          style={{ width: `${pct}%` }}
        />
        {/* Невидимый нативный input поверх */}
        <input
          type="range"
          min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full cursor-pointer opacity-0 top-[-12px] h-[34px]"
        />
        {/* Кастомная ручка — вертикальный прямоугольник */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-[#7a563e] w-[8px] h-[32px] rounded-[4px]"
          style={{ left: `${pct}%` }}
        />
      </div>
      {/* Подпись под треком */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#9AA3B2]">{label}</span>
        <span className="text-xs text-[#9AA3B2]">{hint}</span>
      </div>
    </div>
  )
}

/* ── Иконка галочки ─────────────────────────────────────────── */
function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded border-2 border-[#7A563E]">
        {checked && <CheckmarkIcon />}
    </div>
  )
}

/** Parse meter value from starter kit qty string like "5м" or "10м" */
function parseMeters(qty: string): number {
  const m = qty.match(/(\d+)\s*м/i)
  return m ? parseInt(m[1], 10) : 0
}

/** Check if extra is a hose (рукав) */
function isHoseExtra(name: string): boolean {
  const lower = name.toLowerCase()
  return lower.includes('рукав') && (lower.includes('дополнительн') || lower.includes('доп.'))
}

/** Check if hose is suction type */
function isSuctionHose(name: string): boolean {
  return name.toLowerCase().includes('всасыв')
}

/** Check if hose is exhaust type */
function isExhaustHose(name: string): boolean {
  return name.toLowerCase().includes('напорн')
}

/* ── Конструктор комплекта (только для дымососов) ────────────── */
function KitConstructor({ product, selectedExtras, toggleExtra, formatPrice, onAddToCart }: {
  product: Product
  selectedExtras: Record<number, number>
  toggleExtra: (id: number) => void
  formatPrice: (p: number) => string
  onAddToCart: (config?: { suction_length: number; exhaust_length: number; hoseCost: number }) => void
}) {
  // Parse base hose lengths from starter kit
  const kitItems = product.starterKit?.items ?? []
  const baseSuction = kitItems.find(i => i.name.toLowerCase().includes('всасыв'))
  const baseExhaust = kitItems.find(i => i.name.toLowerCase().includes('напорн'))
  const baseSuctionLength = baseSuction ? parseMeters(baseSuction.qty) : 5
  const baseExhaustLength = baseExhaust ? parseMeters(baseExhaust.qty) : 10

  // Find hose extras for per-section pricing
  const suctionExtra = product.extras.find(e => isHoseExtra(e.name) && isSuctionHose(e.name))
  const exhaustExtra = product.extras.find(e => isHoseExtra(e.name) && isExhaustHose(e.name))
  // Fallback: if one hose type is missing, use the other's price
  const suctionPricePerSection = suctionExtra?.price ?? exhaustExtra?.price ?? 0
  const exhaustPricePerSection = exhaustExtra?.price ?? suctionExtra?.price ?? 0

  // Non-hose extras (shown as checkboxes)
  const equipmentExtras = product.extras.filter(e => !isHoseExtra(e.name))

  const [suction, setSuction] = useState(baseSuctionLength)
  const [exhaust, setExhaust] = useState(baseExhaustLength)

  // Extra hose cost (only above kit base)
  const extraSuctionSections = Math.max(0, (suction - baseSuctionLength) / 5)
  const extraExhaustSections = Math.max(0, (exhaust - baseExhaustLength) / 10)
  const hoseCost = extraSuctionSections * suctionPricePerSection + extraExhaustSections * exhaustPricePerSection

  // Equipment extras cost
  const equipmentCost = equipmentExtras.reduce(
    (sum, e) => sum + (selectedExtras[e.id] ?? 0) * e.price, 0
  )

  const total = product.price + hoseCost + equipmentCost
  const selectedNames = equipmentExtras.filter(e => !!selectedExtras[e.id]).map(e => e.name)

  return (
    <div className="rounded-xl overflow-hidden mb-4 bg-[#2e2e2e]">

      {/* ── Верхняя часть: слайдеры + чекбоксы ── */}
      <div className="flex flex-col lg:flex-row">

        {/* Левая: слайдеры */}
        <div className="lg:w-[50%] p-6 lg:p-8">
          <p className="text-white font-bold text-xl lg:text-2xl mb-1">Конструктор комплекта</p>
          <p className="text-xs mb-2 text-[#9AA3B2]">
            В комплект входит: рукав всасывающий — {baseSuctionLength}м, рукав напорный — {baseExhaustLength}м
          </p>
          <p className="text-xs mb-7 leading-relaxed text-[#E05B2B]">
            Если точка забора или сброса дальше чем базовые показатели –<br className="hidden sm:block" />
            увеличьте до нужного размера. Доплата только за дополнительные метры.
          </p>

          <RangeSlider
            min={baseSuctionLength} max={baseSuctionLength + 15} step={5} value={suction} onChange={setSuction}
            label="Удаление от точки забора до дымососа"
            hint={suctionPricePerSection > 0
              ? `${baseSuctionLength}–${baseSuctionLength + 15} м • шаг 5 м (+${formatPrice(suctionPricePerSection)} ₽)`
              : `${baseSuctionLength}–${baseSuctionLength + 15} м • шаг 5 м`}
          />
          <RangeSlider
            min={baseExhaustLength} max={baseExhaustLength + 50} step={10} value={exhaust} onChange={setExhaust}
            label="Удаление от дымососа до точки сброса"
            hint={exhaustPricePerSection > 0
              ? `${baseExhaustLength}–${baseExhaustLength + 50} м • шаг 10 м (+${formatPrice(exhaustPricePerSection)} ₽)`
              : `${baseExhaustLength}–${baseExhaustLength + 50} м • шаг 10 м`}
          />
        </div>

        {/* Правая: чекбоксы */}
        <div className="lg:w-[40%] flex flex-col p-6 lg:p-8 gap-5">
          <p className="text-xs text-[#E05B2B]">
            Возможно понадобится дополнительное оборудование.
          </p>
          {equipmentExtras.map(extra => {
            const checked = !!selectedExtras[extra.id]
            return (
              <button
                key={extra.id}
                onClick={() => toggleExtra(extra.id)}
                className="flex items-start gap-3 text-left group"
              >
                <span className="mt-0.5">
                  <CheckIcon checked={checked} />
                </span>
                <div>
                  <p className={`text-sm font-medium leading-snug transition-colors ${checked ? 'text-white' : 'text-white/75'}`}>
                    {extra.name}
                  </p>
                  <p className="text-xs mt-0.5 text-[#9AA3B2]">{extra.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Нижняя часть: итог ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 px-6 py-7 lg:px-8 bg-[#1e1e1e] border-t border-white/[0.07]">
        {/* Левая: заголовок + список */}
        <div className="flex-1">
          <p className="text-white font-bold text-xl lg:text-[26px] leading-tight mb-4">
            Итоговая сумма с дополнительными опциями:
          </p>
          {selectedNames.length > 0 ? (
            <div>
              <p className="text-xs mb-2 text-[#E05B2B]">
                Возможно понадобится дополнительное оборудование.
              </p>
              {selectedNames.map((n, i) => (
                <p key={i} className="text-xs leading-relaxed text-[#9AA3B2]">• {n}</p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#E05B2B]">
              Возможно понадобится дополнительное оборудование.
            </p>
          )}
        </div>

        {/* Правая: подпись + цена + кнопки */}
        <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
          <p className="text-xs text-[#9AA3B2]">
            {hoseCost > 0
              ? `В\u00a0т.ч. доп. рукава: +${formatPrice(hoseCost)} ₽`
              : 'Базовый комплект (рукава входят в стоимость)'}
          </p>
          <div className="text-white font-semibold text-3xl lg:text-4xl">
            от {formatPrice(total)}{' '}
            <span className="font-normal text-2xl text-[#7a563e]">₽</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button variant="calculator" className="!justify-center sm:!px-10" onClick={() => onAddToCart({ suction_length: suction, exhaust_length: exhaust, hoseCost })}>
              В корзину
            </Button>
            <button className="flex items-center justify-center px-8 py-3 text-sm font-semibold text-white rounded transition-opacity hover:opacity-80 border border-[#7a563e]">
              Консультация
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

/* ── Доп. оборудование (для не-дымососов с extras) ───────────── */
function ExtraEquipment({ product, selectedExtras, toggleExtra, formatPrice, onAddToCart }: {
  product: Product
  selectedExtras: Record<number, number>
  toggleExtra: (id: number) => void
  formatPrice: (p: number) => string
  onAddToCart: () => void
}) {
  const equipmentCost = product.extras.reduce(
    (sum, e) => sum + (selectedExtras[e.id] ?? 0) * e.price, 0
  )
  const total = product.price + equipmentCost
  const selectedNames = product.extras.filter(e => !!selectedExtras[e.id]).map(e => e.name)

  return (
    <div className="rounded-xl overflow-hidden mb-4 bg-[#2e2e2e]">
      <div className="p-6 lg:p-8">
        <p className="text-white font-bold text-xl lg:text-2xl mb-1">Возможно понадобится дополнительное оборудование</p>
        <p className="text-xs mb-6 text-[#E05B2B]">
          Выберите нужное оборудование для вашего комплекта.
        </p>
        <div className="flex flex-col gap-5">
          {product.extras.map(extra => {
            const checked = !!selectedExtras[extra.id]
            return (
              <button
                key={extra.id}
                onClick={() => toggleExtra(extra.id)}
                className="flex items-start gap-3 text-left group"
              >
                <span className="mt-0.5">
                  <CheckIcon checked={checked} />
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-medium leading-snug transition-colors ${checked ? 'text-white' : 'text-white/75'}`}>
                    {extra.name}
                  </p>
                  <p className="text-xs mt-0.5 text-[#9AA3B2]">{extra.description}</p>
                </div>
                <span className="text-sm text-[#9AA3B2] whitespace-nowrap">
                  {formatPrice(extra.price)} ₽
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Итог */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 px-6 py-7 lg:px-8 bg-[#1e1e1e] border-t border-white/[0.07]">
        <div className="flex-1">
          <p className="text-white font-bold text-xl lg:text-[26px] leading-tight mb-4">
            Итоговая сумма:
          </p>
          {selectedNames.length > 0 && selectedNames.map((n, i) => (
            <p key={i} className="text-xs leading-relaxed text-[#9AA3B2]">• {n}</p>
          ))}
        </div>
        <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
          <div className="text-white font-semibold text-3xl lg:text-4xl">
            от {formatPrice(total)}{' '}
            <span className="font-normal text-2xl text-[#7a563e]">₽</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button variant="calculator" className="!justify-center sm:!px-10" onClick={onAddToCart}>
              В корзину
            </Button>
            <button className="flex items-center justify-center px-8 py-3 text-sm font-semibold text-white rounded transition-opacity hover:opacity-80 border border-[#7a563e]">
              Консультация
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail({ product }: Props) {
  const [activeThumb, setActiveThumb]     = useState(0)
  const [selectedExtras, setSelectedExtras] = useState<Record<number, number>>({})
  const { addItem } = useCart()

  const toggleExtra = (id: number) => {
    setSelectedExtras(prev => {
      if (prev[id]) {
        const next = { ...prev }
        delete next[id]
        return next
      }
      return { ...prev, [id]: 1 }
    })
  }

  const handleAddToCart = (config?: { suction_length: number; exhaust_length: number; hoseCost: number }) => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      specs: (product.specs ?? []).slice(0, 3).map(s => ({ key: s.key ?? '', label: s.label, value: s.value })),
      extras: (product.extras ?? [])
        .filter(e => !!selectedExtras[e.id])
        .map(e => ({
          id: e.id,
          name: e.name,
          price: e.price,
          qty: selectedExtras[e.id],
        })),
      configuration: config,
    })
  }

  const formatPrice = (p: number) =>
    p.toLocaleString('ru-RU').replace(/\s/g, '\u00a0')

  return (
    <div>

      {/* ── Заголовок ─────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-14 pt-12 pb-8">
          <SectionHeading
            title={product.name}
            subtitle={<>{product.category}</>}
            align="start"
            mb="mb-0"
            titleClass="text-2xl lg:text-[48px] font-bold text-white leading-tight"
            subtitleClass="text-white/60 text-[15px] leading-snug text-right max-w-[260px] mt-2"
          />
        </div>
      </section>

      {/* ── Главный блок товара ───────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-14 pb-12">

        {/* Карточка: фото слева + инфо справа */}
        <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden mb-6">

          {/* Левая: фото */}
          <div className="lg:w-[56%] flex flex-col gap-3 p-4 bg-[#3f3f3f] rounded-l-[10px]">
            {/* Главное фото */}
            <div className="relative w-full" style={{ height: 'clamp(240px, 40vw, 520px)' }}>
              <Image
                src={product.thumbnails[activeThumb] ?? product.image}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 56vw"
              />
            </div>

            {/* Миниатюры */}
            {product.thumbnails.length > 1 && (
              <div className="flex gap-3 justify-center">
                {product.thumbnails.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveThumb(i)}
                    className={`relative rounded-lg overflow-hidden transition-all w-[72px] h-[72px] bg-[#2a2a2a] border-2 ${i === activeThumb ? 'border-[#7a563e]' : 'border-transparent'}`}
                  >
                    <Image src={src} alt="" fill className="object-contain p-1" sizes="72px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Правая: информация */}
          <div className="lg:w-[44%] flex flex-col justify-start gap-4 px-6 py-8 lg:px-10 bg-black/35 rounded-r-[10px]">
            {/* Название */}
            <h1 className="text-white font-bold text-2xl lg:text-[32px] leading-tight">
              {product.name}
            </h1>

            {/* Цена */}
            <div className="text-white/80 text-2xl lg:text-3xl font-semibold">
              от {formatPrice(product.price)}{' '}
              <span className="font-normal text-[#7a563e]">₽</span>
            </div>

            {/* Описание/бейдж */}
            <p className="text-sm leading-snug text-[#B8C0CC]">
              {product.badge}
            </p>

            {/* Статусы */}
            <div className="flex flex-wrap gap-3">
              <span className="text-xs px-4 py-2 rounded-full border border-white/30 text-white/70 bg-[#2e2e2e]">
                В наличии
              </span>
              <span className="text-xs px-4 py-2 rounded-full border border-white/30 text-white/70 bg-[#2e2e2e]">
                Гарантия 12 месяцев
              </span>
            </div>

            {/* Характеристики */}
            {product.specs && product.specs.length > 0 && (
              <div className="flex flex-col gap-1">
                {product.specs.map((spec, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-5 flex items-center justify-center">
                      <SpecIcon specKey={spec.key} index={i} />
                    </div>
                    <span className="text-sm flex-1 text-[#B8C0CC]">
                      <span className="font-semibold text-white/80">{spec.label}:</span>
                    </span>
                    <span className="text-sm text-white ml-auto">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Состав стартового комплекта */}
            {product.composition.length > 0 && (
            <div>
              <p className="text-sm mb-1 text-[#9AA3B2]">
                В состав стартового комплекта уже входит:
              </p>
              {product.composition.map((line, i) => (
                <p key={i} className="text-sm text-[#9AA3B2]">{line}</p>
              ))}
            </div>
            )}

            {/* Подсказка калькулятора */}
            {product.calculatorHint && (
            <p className="text-xs leading-relaxed text-[#637C90]">
              {product.calculatorHint}
            </p>
            )}

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="calculator" className="flex-1 !justify-center" onClick={handleAddToCart}>
                В корзину
              </Button>
              <button className="flex-1 flex items-center justify-center py-3 px-6 text-sm font-semibold text-white transition-opacity hover:opacity-80 rounded border border-[#7a563e]">
                Рассчитать комплект
              </button>
            </div>

            {/* Тех. документ */}
            {product.technicalDocUrl && (
              <div className="flex justify-end">
                <a
                  href={product.technicalDocUrl}
                  className="flex items-center gap-2 text-sm transition-opacity hover:opacity-70 text-[#637C90]"
                >
                  тех. документ
                  <span className="flex items-center justify-center rounded w-[27px] h-[27px] bg-[#2B2523] border border-white/30">
                    <DownloadIcon />
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Блок 1: Состав стартового комплекта (раскрывающийся) ── */}
        {product.starterKit && (
          <AccordionBlock title="Состав стартового комплекта" subtitle="Пересчёт: базовый набор + доп. рукава по шагам 5/10 м + опции">
            <div className="flex flex-col sm:flex-row gap-5">
              {product.starterKit.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0 relative rounded-lg overflow-hidden w-[90px] h-[90px] bg-[#2a2a2a]">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" sizes="90px" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{item.name}</p>
                    {item.description.split('\n').map((line, j) => (
                      <p key={j} className="text-xs text-[#9AA3B2]">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-4 text-[#9AA3B2]">{product.starterKit.subtitle}</p>
          </AccordionBlock>
        )}

        {/* ── Блок 2: Основные характеристики (раскрывающийся) ── */}
        {product.mainSpecs && product.mainSpecs.map((section, si) => (
          <AccordionBlock key={si} title="Основные характеристики:" subtitle={section.title}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {section.columns.map((col, ci) => (
                <div key={ci}>
                  <p className="text-white font-semibold text-sm mb-2">{col.heading}</p>
                  {col.content.map((line, li) => (
                    <p key={li} className="text-sm text-[#9AA3B2]">{line}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Оплата + доставка внутри блока */}
            <div className="flex flex-col sm:flex-row -mx-6 -mb-6 lg:-mx-8 lg:-mb-8 bg-black/50">
              <div className="flex-1 flex items-center gap-4 px-6 py-4 lg:px-8">
                <WalletIcon />
                <div>
                  <span className="font-semibold text-sm mr-2 text-[#7A563E]">Оплата</span>
                  <span className="text-xs text-[#B8C0CC]">по счёту / безналичный расчёт / банковский перевод</span>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-4 px-6 py-4 lg:px-8">
                <TruckIcon />
                <div>
                  <span className="font-semibold text-sm mr-2 text-[#7A563E]">Доставка</span>
                  <span className="text-xs text-[#B8C0CC]">по Москве бесплатно / ТК Пэк, ДЛ, Байкал-Сервис / самовывоз со склада в г.&nbsp;Раменское</span>
                </div>
              </div>
            </div>
          </AccordionBlock>
        ))}

        {/* ── Блок 3: Конструктор / Доп. оборудование ────────── */}
        {product.starterKit && (product.categorySlug === 'dymososy' || product.categorySlug === 'dymososy-dlya-pozharnyh-mashin') ? (
          <KitConstructor product={product} selectedExtras={selectedExtras} toggleExtra={toggleExtra} formatPrice={formatPrice} onAddToCart={handleAddToCart} />
        ) : product.extras.length > 0 ? (
          <ExtraEquipment product={product} selectedExtras={selectedExtras} toggleExtra={toggleExtra} formatPrice={formatPrice} onAddToCart={() => handleAddToCart()} />
        ) : null}

      </div>

      {/* ── Каталог (похожие) ─────────────────────────── */}
      <CatalogSection noBgImage showButton={false} />
    </div>
  )
}
