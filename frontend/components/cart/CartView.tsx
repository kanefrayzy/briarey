'use client'

import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/Button'
import { useCart, type CartItem } from '@/lib/cart'
import { productImageUrl } from '@/lib/api'
import TrashIcon from '@/components/icons/TrashIcon'
import SpeedIcon from '@/components/icons/SpeedIcon'
import SpecSizeIcon from '@/components/icons/SpecSizeIcon'
import SpecWeightIcon from '@/components/icons/SpecWeightIcon'
import SpecPowerIcon from '@/components/icons/SpecPowerIcon'

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
const SPEC_FALLBACK = [SpecSizeIcon, SpecWeightIcon, SpecPowerIcon, SpeedIcon]

function SpecIcon({ specKey, index }: { specKey?: string; index: number }) {
  const Icon = (specKey && SPEC_ICON_MAP[specKey]) || SPEC_FALLBACK[index % SPEC_FALLBACK.length]
  return <Icon />
}

/* ── Одна карточка товара ── */
interface CartItemRowProps {
  item: CartItem
  isLast: boolean
  onIncrease: (id: number) => void
  onDecrease: (id: number) => void
  onRemove: (id: number) => void
}

function CartItemRow({ item, isLast, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  const extrasTotal = item.extras.reduce((s, e) => s + e.price * e.qty, 0)
  const hoseCost = item.configuration?.hoseCost ?? 0
  const lineTotal = (item.price + extrasTotal + hoseCost) * item.qty
  const specs = item.specs?.slice(0, 3) ?? []

  return (
    <div className={!isLast ? 'border-b border-white/10 pb-8 mb-8' : ''}>
      <Link href={`/catalog/${item.slug}`} className="inline-block hover:opacity-80 transition-opacity">
        <h3 className="text-white font-bold text-xl md:text-3xl leading-snug mb-2">{item.name}</h3>
      </Link>

      {/* ── МОБИЛЬНАЯ ── */}
      <div className="flex gap-4 md:hidden mb-4">
        <Link href={`/catalog/${item.slug}`} className="shrink-0 hover:opacity-80 transition-opacity">
          <div className="relative rounded-xl overflow-hidden" style={{ width: 110, height: 110, background: '#3a3a3a' }}>
            <Image src={productImageUrl(item.slug, item.image)} alt={item.name} fill className="object-contain p-1" sizes="110px" />
          </div>
        </Link>
        <div className="flex flex-col justify-between gap-2 flex-1">
          {/* Specs с иконками */}
          {specs.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {specs.map((s, i) => (
                <div key={s.label} className="flex items-center gap-1.5 text-xs">
                  <div className="flex-shrink-0 w-4 flex items-center justify-center text-white/50">
                    <SpecIcon specKey={s.key} index={i} />
                  </div>
                  <span className="text-white font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => item.qty === 1 ? onRemove(item.productId) : onDecrease(item.productId)}
                className="w-9 h-9 flex items-center justify-center text-white text-lg transition-colors hover:bg-white/5 rounded-md"
                style={{ border: '1px solid #7a563e' }}
              >
                {item.qty === 1 ? <TrashIcon /> : '−'}
              </button>
              <span className="text-white text-sm font-medium px-1">{item.qty} шт.</span>
              <button
                onClick={() => onIncrease(item.productId)}
                className="w-9 h-9 flex items-center justify-center text-white text-lg transition-colors hover:bg-white/5 rounded-md"
                style={{ border: '1px solid #7a563e' }}
              >
                +
              </button>
            </div>
            <p className="text-white text-base font-medium">
              от {lineTotal.toLocaleString('ru-RU')}{' '}
              <span style={{ color: '#c0703a' }}>₽</span>
            </p>
          </div>
        </div>
      </div>

      {item.configuration && item.configuration.hoseCost > 0 && (
        <div className="md:hidden mb-2">
          <p className="text-white/60 text-sm mb-2">Конфигурация:</p>
          <ul className="flex flex-col gap-1.5">
            <li className="flex items-center justify-between gap-4 text-sm">
              <span className="text-white/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                Всасывающий рукав — {item.configuration.suction_length}м
              </span>
            </li>
            <li className="flex items-center justify-between gap-4 text-sm">
              <span className="text-white/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                Напорный рукав — {item.configuration.exhaust_length}м
              </span>
            </li>
            <li className="flex items-center justify-between gap-4 text-sm">
              <span className="text-white/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                Доп. рукава
              </span>
              <span className="text-white/50 shrink-0">+{item.configuration.hoseCost.toLocaleString('ru-RU')} ₽</span>
            </li>
          </ul>
        </div>
      )}

      {item.extras.length > 0 && (
        <div className="md:hidden mb-2">
          <p className="text-white/60 text-sm mb-2">Дополнительно:</p>
          <ul className="flex flex-col gap-1.5">
            {item.extras.map((ex) => (
              <li key={ex.id} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-white/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                  {ex.name}
                </span>
                <span className="text-white/50 shrink-0">{ex.qty} шт.</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex gap-10">
        <div className="shrink-0 flex gap-6">
          <Link href={`/catalog/${item.slug}`} className="hover:opacity-80 transition-opacity shrink-0">
            <div className="relative rounded-xl overflow-hidden" style={{ width: 220, height: 200, background: '#3a3a3a' }}>
              <Image src={productImageUrl(item.slug, item.image)} alt={item.name} fill className="object-contain p-2" sizes="220px" />
            </div>
          </Link>
          {/* Specs с иконками справа от картинки */}
          {specs.length > 0 && (
            <div className="flex flex-col justify-center gap-3 min-w-[160px]">
              {specs.map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 flex items-center justify-center text-white/60">
                    <SpecIcon specKey={s.key} index={i} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/50">{s.label}</span>
                    <span className="text-sm text-white font-semibold">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {item.configuration && item.configuration.hoseCost > 0 && (
            <div className="mb-4">
              <p className="text-white/60 text-base mb-3">Конфигурация:</p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center justify-between gap-4 text-base">
                  <span className="text-white/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                    Всасывающий рукав — {item.configuration.suction_length}м
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4 text-base">
                  <span className="text-white/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                    Напорный рукав — {item.configuration.exhaust_length}м
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4 text-base">
                  <span className="text-white/80 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                    Доп. рукава
                  </span>
                  <span className="text-white/50 shrink-0">+{item.configuration.hoseCost.toLocaleString('ru-RU')} ₽</span>
                </li>
              </ul>
            </div>
          )}

          {item.extras.length > 0 && (
            <div>
              <p className="text-white/60 text-base mb-3">Дополнительно:</p>
              <ul className="flex flex-col gap-2">
                {item.extras.map((ex) => (
                  <li key={ex.id} className="flex items-center justify-between gap-4 text-base">
                    <span className="text-white/80 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                      {ex.name}
                    </span>
                    <span className="text-white/50 shrink-0">{ex.qty} шт.</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => item.qty === 1 ? onRemove(item.productId) : onDecrease(item.productId)}
                className="w-20 h-20 flex items-center justify-center text-white text-3xl transition-colors hover:bg-white/5 rounded-md"
                style={{ border: '1px solid #7a563e' }}
              >
                {item.qty === 1 ? <TrashIcon /> : '−'}
              </button>
              <div className="px-4 flex items-center justify-center text-white text-3xl font-medium" style={{ minWidth: 80 }}>
                {item.qty} шт.
              </div>
              <button
                onClick={() => onIncrease(item.productId)}
                className="w-20 h-20 flex items-center justify-center text-white text-3xl transition-colors hover:bg-white/5 rounded-md"
                style={{ border: '1px solid #7a563e' }}
              >
                +
              </button>
            </div>
            <p className="text-white text-3xl font-medium">
              от {lineTotal.toLocaleString('ru-RU')}{' '}
              <span style={{ color: '#c0703a' }}>₽</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Сводка заказа (десктоп — sticky sidebar) ── */
function CartSummary({ totalItems, totalPrice }: { totalItems: number; totalPrice: number }) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-5 sticky top-6"
      style={{ background: '#2a2a2a', minWidth: 260 }}
    >
      <h3 className="text-white font-bold text-xl">Ваш заказ:</h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Количество товара</span>
          <span className="text-white font-medium">{totalItems} шт.</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Сумма товара</span>
          <span className="text-white font-medium">{totalPrice.toLocaleString('ru-RU')} руб.</span>
        </div>
      </div>
      <Button variant="calculator" href="/checkout" fullWidth>
        Перейти к оформлению
      </Button>
    </div>
  )
}

/* ── Мобильная панель снизу ── */
function MobileCheckoutBar({ totalItems, totalPrice }: { totalItems: number; totalPrice: number }) {
  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 flex items-center gap-3"
      style={{ background: 'rgba(18,18,24,0.97)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex flex-col leading-tight flex-1 min-w-0">
        <span className="text-white/50 text-xs">{totalItems} товар(а)</span>
        <span className="text-white font-bold text-lg">{totalPrice.toLocaleString('ru-RU')} ₽</span>
      </div>
      <Button variant="calculator" href="/checkout">
        Оформить заказ
      </Button>
    </div>
  )
}

/* ── Основной компонент ── */
export default function CartView() {
  const { items, updateQty, removeItem, totalItems, totalPrice } = useCart()

  const increase = (productId: number) => {
    const item = items.find(i => i.productId === productId)
    if (item) updateQty(productId, item.qty + 1)
  }

  const decrease = (productId: number) => {
    const item = items.find(i => i.productId === productId)
    if (item && item.qty > 1) updateQty(productId, item.qty - 1)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 py-16 text-center">
        <p className="text-white/50 text-lg">Корзина пуста</p>
        <Button variant="calculator" href="/catalog" className="mt-6">
          Перейти в каталог
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-28 lg:pb-24">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 rounded-xl p-4 md:p-8" style={{ background: '#2a2a2a' }}>
            {items.map((item, idx) => (
              <CartItemRow
                key={item.productId}
                item={item}
                isLast={idx === items.length - 1}
                onIncrease={increase}
                onDecrease={decrease}
                onRemove={removeItem}
              />
            ))}
          </div>
          <div className="hidden lg:block w-[300px] xl:w-[320px]">
            <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
          </div>
        </div>
      </div>
      <MobileCheckoutBar totalItems={totalItems} totalPrice={totalPrice} />
    </>
  )
}
