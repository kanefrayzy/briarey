'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { api, storageUrl, type CalculatorProductResult } from '@/lib/api'
import { useCart } from '@/lib/cart'
import Button from '@/components/Button'

/* ── Типы шагов ── */
type Speed = 'fast' | 'standard'
type ZoneType = 'one' | 'two'
type NodeType = 'exhaust' | 'supply_exhaust'
type EI = 'EI60' | 'EI90'
type DischargeLen = 10 | 20 | 30 | 40 | 50 | 60

interface FormState {
  volume: string
  speed: Speed | null
  zones: ZoneType | null
  nodeType: NodeType | null
  ei: EI | null
  suction: string
  discharge: DischargeLen | null
}

const INITIAL: FormState = {
  volume: '',
  speed: null,
  zones: null,
  nodeType: null,
  ei: null,
  suction: '',
  discharge: null,
}

/* ── Шаг-индикатор ── */
function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            background: i === current ? '#7a563e' : i < current ? '#637c8f' : 'rgba(255,255,255,0.15)',
          }}
        />
      ))}
      <span className="ml-2 text-white/40 text-xs">{current + 1} / {total}</span>
    </div>
  )
}

/* ── Выбор карточкой ── */
function OptionCard({
  selected,
  onClick,
  label,
  hint,
}: {
  selected: boolean
  onClick: () => void
  label: string
  hint?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 min-w-[140px] text-left px-4 py-3 rounded-xl border transition-all duration-150"
      style={{
        background: selected ? 'rgba(122,86,62,0.18)' : 'rgba(255,255,255,0.04)',
        borderColor: selected ? '#7a563e' : 'rgba(255,255,255,0.10)',
        boxShadow: selected ? '0 0 0 1px #7a563e inset' : 'none',
      }}
    >
      <span className="block text-white font-medium text-sm">{label}</span>
      {hint && <span className="block text-white/45 text-xs mt-0.5 leading-snug">{hint}</span>}
    </button>
  )
}

/* ── Карточка результата ── */
function ProductCard({ product, recommended }: { product: CalculatorProductResult; recommended: boolean }) {
  const { addItem } = useCart()

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: storageUrl(product.image),
      price: product.price,
      qty: 1,
      extras: [],
      specs: product.specs.slice(0, 3).map(s => ({ key: s.key ?? '', label: s.label, value: s.value })),
    })
  }

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: recommended ? 'rgba(122,86,62,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${recommended ? '#7a563e' : 'rgba(255,255,255,0.10)'}`,
      }}
    >
      {recommended && (
        <div
          className="self-start text-xs font-semibold px-3 py-1 rounded-full"
          style={{ background: '#7a563e', color: '#fff' }}
        >
          Рекомендуем
        </div>
      )}

      <div className="flex gap-4 items-start">
        {/* Изображение */}
        <div
          className="relative rounded-xl overflow-hidden shrink-0"
          style={{ width: 100, height: 100, background: '#3a3a3a' }}
        >
          <Image
            src={storageUrl(product.image)}
            alt={product.name}
            fill
            className="object-contain p-2"
            sizes="100px"
          />
        </div>

        {/* Название и характеристики */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/catalog/${product.slug}`}
            className="text-white font-semibold text-sm leading-snug hover:opacity-80 transition-opacity"
          >
            {product.name}
          </Link>
          <div className="flex flex-col gap-1 mt-2">
            {product.specs.map((s, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span className="text-white/45 shrink-0">{s.label}:</span>
                <span className="text-white/80">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-auto pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <span className="text-white font-bold text-lg">
            от {product.price.toLocaleString('ru-RU')}
          </span>
          {' '}
          <span style={{ color: '#c0703a' }}>₽</span>
        </div>
        <div className="flex gap-2">
          <Button href={`/catalog/${product.slug}`} variant="outline" className="text-xs !px-3 !py-2">
            Подробнее
          </Button>
          <Button variant="calculator" className="text-xs !px-3 !py-2" onClick={handleAdd}>
            В корзину
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Список рукавов/узлов ── */
function AccessoriesList({
  zones,
  nodeType,
  ei,
  suction,
  discharge,
  rooms,
}: {
  zones: ZoneType
  nodeType: NodeType
  ei: EI
  suction: string
  discharge: DischargeLen
  rooms: number
}) {
  const zoneMult = zones === 'two' ? 2 : 1
  const nodesCount = rooms * zoneMult
  const hosesCount = discharge / 10
  const suctionLabel = zones === 'one'
    ? (suction === '1.5' ? 'Всасывающий рукав 1,5 м' : 'Всасывающий рукав 5 м (стандарт)')
    : (suction === '3' ? 'Двухзонная обвязка: нижний 2,5 м + верхний 3 м' : 'Двухзонная обвязка: нижний 2,5 м + верхний 5 м')

  const items = [
    {
      label: `Узлы стыковочные ${nodeType === 'supply_exhaust' ? 'приточно-вытяжные' : 'вытяжные'} (${ei})`,
      value: `${nodesCount} шт.`,
    },
    {
      label: suctionLabel,
      value: '1 компл.',
    },
    {
      label: `Рукав напорный РН (10 м × ${hosesCount})`,
      value: `${hosesCount} шт. = ${discharge} м`,
    },
  ]

  return (
    <div
      className="rounded-2xl p-5 mt-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
    >
      <h3 className="text-white font-semibold mb-3">Комплектация под расчёт</h3>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-4 text-sm">
            <span className="text-white/60">{item.label}</span>
            <span className="text-white font-medium shrink-0">{item.value}</span>
          </div>
        ))}
      </div>
      <p className="text-white/30 text-xs mt-3">
        * Точная спецификация уточняется при заказе. Обратитесь к нашим менеджерам.
      </p>
    </div>
  )
}

/* ── Главный компонент ── */
const TOTAL_STEPS = 7

export default function CalculatorQuiz() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [rooms, setRooms] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<null | Awaited<ReturnType<typeof api.getCalculatorRecommend>>>(null)

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1))
  const back = () => setStep(s => Math.max(s - 1, 0))

  const canNext = () => {
    if (step === 0) return form.volume !== '' && Number(form.volume) > 0
    if (step === 1) return form.speed !== null
    if (step === 2) return form.zones !== null
    if (step === 3) return form.nodeType !== null
    if (step === 4) return form.ei !== null
    if (step === 5) return form.suction !== ''
    if (step === 6) return form.discharge !== null
    return true
  }

  const calculate = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getCalculatorRecommend({
        volume: Number(form.volume),
        speed: form.speed!,
        zones: form.zones === 'two' ? 2 : 1,
      })
      setResult(data)
      setStep(TOTAL_STEPS) // результаты
    } catch {
      setError('Ошибка при подборе. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setForm(INITIAL)
    setRooms(1)
    setResult(null)
    setError('')
    setStep(0)
  }

  const openContact = (currentResult: typeof result) => {
    const speedLabel = form.speed === 'fast' ? 'ускоренная (10 мин)' : 'стандартная (1 час)'
    const zonesLabel = form.zones === 'two' ? 'двухзонное' : 'однозонное'
    const nodeLabel  = form.nodeType === 'supply_exhaust' ? 'приточно-вытяжные' : 'вытяжные'
    const volumeLine = rooms > 1
      ? `${form.volume} м³ × ${rooms} помещений = ${Number(form.volume) * rooms} м³ общий`
      : `${form.volume} м³`

    const topProduct = currentResult?.products?.[0]
    const productLine = topProduct
      ? `  — ${topProduct.name} (${topProduct.productivity.toLocaleString('ru-RU')} м³/ч)`
      : ''

    const lines: string[] = [
      'Расчёт дымоудаления:',
      `• Объём помещения: ${volumeLine}`,
      `• Скорость удаления: ${speedLabel}`,
      `• Зонирование: ${zonesLabel}`,
      `• Узлы стыковочные: ${nodeLabel}${form.ei ? ` (${form.ei})` : ''}`,
      form.discharge ? `• Напорная линия: ${form.discharge} м` : '',
      currentResult ? `• Требуемая производительность: ${currentResult.required_productivity.toLocaleString('ru-RU')} м³/ч` : '',
      productLine ? `\nРекомендованное оборудование:\n${productLine}` : '',
    ].filter(Boolean)

    sessionStorage.setItem('contactFormPrefill', JSON.stringify({
      topic: 'Коммерческое предложение',
      message: lines.join('\n'),
    }))

    // Notify already-mounted ContactForm
    window.dispatchEvent(new Event('contactFormPrefill'))

    const el = document.getElementById('contact-form')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  /* ── Шаги ── */
  const STEPS = [
    // 0. Объём
    <div key="volume">
      <h2 className="text-white text-xl font-bold mb-1">Объём помещения</h2>
      <p className="text-white/50 text-sm mb-5">Укажите максимальный объём одного помещения, которое нужно защитить</p>
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="number"
          min={1}
          max={5000}
          placeholder="Напр. 185"
          value={form.volume}
          onChange={e => set('volume', e.target.value)}
          className="rounded-xl px-4 py-3 text-white text-lg font-medium outline-none w-36"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
        />
        <span className="text-white/50">м³</span>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-white/50 text-sm">Помещений:</span>
          <button
            type="button"
            onClick={() => setRooms(r => Math.max(1, r - 1))}
            className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
          >−</button>
          <span className="text-white font-medium w-6 text-center">{rooms}</span>
          <button
            type="button"
            onClick={() => setRooms(r => Math.min(99, r + 1))}
            className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
          >+</button>
        </div>
      </div>
    </div>,

    // 1. Скорость
    <div key="speed">
      <h2 className="text-white text-xl font-bold mb-1">Скорость удаления</h2>
      <p className="text-white/50 text-sm mb-5">Как быстро нужно удалить дым из помещения?</p>
      <div className="flex flex-wrap gap-3">
        <OptionCard
          selected={form.speed === 'fast'}
          onClick={() => set('speed', 'fast')}
          label="Ускоренная (10 минут)"
          hint="Для жилых и офисных зданий"
        />
        <OptionCard
          selected={form.speed === 'standard'}
          onClick={() => set('speed', 'standard')}
          label="Стандартная (1 час)"
          hint="4-кратный обмен воздуха"
        />
      </div>
    </div>,

    // 2. Зоны
    <div key="zones">
      <h2 className="text-white text-xl font-bold mb-1">Тип удаления</h2>
      <p className="text-white/50 text-sm mb-5">Сколько зон дымоудаления в помещении?</p>
      <div className="flex flex-wrap gap-3">
        <OptionCard
          selected={form.zones === 'one'}
          onClick={() => set('zones', 'one')}
          label="Однозонное"
          hint="Один узел стыковочный — один вход"
        />
        <OptionCard
          selected={form.zones === 'two'}
          onClick={() => set('zones', 'two')}
          label="Двухзонное"
          hint="Нижняя + верхняя зоны, 2 узла на помещение"
        />
      </div>
    </div>,

    // 3. Тип узлов
    <div key="nodeType">
      <h2 className="text-white text-xl font-bold mb-1">Тип узлов стыковочных</h2>
      <p className="text-white/50 text-sm mb-5">Нужна ли компенсация воздухом?</p>
      <div className="flex flex-wrap gap-3">
        <OptionCard
          selected={form.nodeType === 'exhaust'}
          onClick={() => set('nodeType', 'exhaust')}
          label="Вытяжной"
          hint="Только удаление дыма/газа"
        />
        <OptionCard
          selected={form.nodeType === 'supply_exhaust'}
          onClick={() => set('nodeType', 'supply_exhaust')}
          label="Приточно-вытяжной"
          hint="Удаление + компенсация воздухом"
        />
      </div>
    </div>,

    // 4. Огнестойкость
    <div key="ei">
      <h2 className="text-white text-xl font-bold mb-1">Предел огнестойкости</h2>
      <p className="text-white/50 text-sm mb-5">Требуемый класс огнестойкости узлов по проекту</p>
      <div className="flex flex-wrap gap-3">
        <OptionCard selected={form.ei === 'EI60'} onClick={() => set('ei', 'EI60')} label="EI 60" />
        <OptionCard selected={form.ei === 'EI90'} onClick={() => set('ei', 'EI90')} label="EI 90" />
      </div>
    </div>,

    // 5. Всасывающая линия
    <div key="suction">
      <h2 className="text-white text-xl font-bold mb-1">Всасывающая линия</h2>
      <p className="text-white/50 text-sm mb-5">Длина рукава от узла стыковочного до дымососа</p>
      <div className="flex flex-wrap gap-3">
        {form.zones === 'two' ? (
          <>
            <OptionCard
              selected={form.suction === '3'}
              onClick={() => set('suction', '3')}
              label="Верхний 3 м (стандарт)"
              hint="Нижний рукав 2,5 м включён"
            />
            <OptionCard
              selected={form.suction === '5'}
              onClick={() => set('suction', '5')}
              label="Верхний 5 м (на заказ)"
              hint="Нижний рукав 2,5 м включён"
            />
          </>
        ) : (
          <>
            <OptionCard selected={form.suction === '1.5'} onClick={() => set('suction', '1.5')} label="1,5 м" />
            <OptionCard
              selected={form.suction === '5'}
              onClick={() => set('suction', '5')}
              label="5 м (стандарт)"
            />
          </>
        )}
      </div>
    </div>,

    // 6. Напорная линия
    <div key="discharge">
      <h2 className="text-white text-xl font-bold mb-1">Напорная линия</h2>
      <p className="text-white/50 text-sm mb-5">Расстояние от дымососа до точки выброса (кратно 10 м)</p>
      <div className="flex flex-wrap gap-3">
        {([10, 20, 30, 40, 50, 60] as DischargeLen[]).map(len => (
          <OptionCard
            key={len}
            selected={form.discharge === len}
            onClick={() => set('discharge', len)}
            label={`${len} м`}
          />
        ))}
      </div>
      {form.discharge && form.discharge > 40 && (
        <p className="text-xs mt-3" style={{ color: '#c0703a' }}>
          ⚠ Длинная напорная линия снижает эффективность — уточните у менеджера
        </p>
      )}
    </div>,
  ]

  /* ── Результаты ── */
  if (step >= TOTAL_STEPS && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-white text-2xl font-bold">Результат подбора</h2>
            <p className="text-white/50 text-sm mt-1">
              Требуемая производительность: <strong className="text-white">{result.required_productivity.toLocaleString('ru-RU')} м³/ч</strong>
            </p>
          </div>
          <button
            onClick={reset}
            className="text-sm text-white/50 hover:text-white transition-colors flex items-center gap-2"
          >
            ↺ Начать заново
          </button>
        </div>

        {result.products.length === 0 ? (
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <p className="text-white/60">Подходящих дымососов не найдено. Обратитесь к нашим менеджерам.</p>
            <Button variant="calculator" className="mt-4" onClick={() => openContact(null)}>
              Связаться с нами
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {result.products.map((p, i) => (
              <ProductCard key={p.id} product={p} recommended={i === 0} />
            ))}
          </div>
        )}

        {form.zones && form.nodeType && form.ei && form.suction && form.discharge && (
          <AccessoriesList
            zones={form.zones}
            nodeType={form.nodeType}
            ei={form.ei}
            suction={form.suction}
            discharge={form.discharge}
            rooms={rooms}
          />
        )}

        <div className="mt-6 flex gap-3 flex-wrap">
          <Button variant="calculator" onClick={() => openContact(result)}>
            Получить коммерческое предложение
          </Button>
          <Button href="/catalog/dymososy" variant="outline">
            Весь каталог дымососов
          </Button>
        </div>
      </div>
    )
  }

  /* ── Квиз ── */
  return (
    <div className="max-w-2xl mx-auto">
      <StepDots total={TOTAL_STEPS} current={step} />

      <div className="min-h-[220px]">
        {STEPS[step]}
      </div>

      {error && (
        <p className="text-sm mt-3" style={{ color: '#ef4444' }}>{error}</p>
      )}

      <div className="flex items-center gap-3 mt-8">
        {step > 0 && (
          <button
            type="button"
            onClick={back}
            className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-1.5"
          >
            ← Назад
          </button>
        )}
        <div className="ml-auto flex gap-3">
          {step < TOTAL_STEPS - 1 ? (
            <Button
              variant="calculator"
              onClick={next}
              disabled={!canNext()}
            >
              Далее →
            </Button>
          ) : (
            <Button
              variant="calculator"
              onClick={calculate}
              disabled={!canNext() || loading}
            >
              {loading ? 'Подбираем...' : 'Подобрать дымосос'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
