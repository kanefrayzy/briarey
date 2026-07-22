'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { api, storageUrl, type CalculatorResult } from '@/lib/api'
import { useCart } from '@/lib/cart'
import Button from '@/components/Button'

/* ── Типы шагов ── */
type ZoneType = 'one' | 'two'
type NodeType = 'exhaust' | 'supply_exhaust'
type Montage = 'internal' | 'external'
type EI = 'EI60' | 'EI90'
type Discharge = 'street' | 'vent' | 'shaft'

interface FormState {
  volume: string
  zones: ZoneType | null
  nodeType: NodeType | null
  montage: Montage | null
  ei: EI | null
  suction: string          // однозонное: '1.5' | '5'; двухзонное: '3' | 'custom'
  distance: string
  discharge: Discharge | null
}

const INITIAL: FormState = {
  volume: '',
  zones: null,
  nodeType: null,
  montage: null,
  ei: null,
  suction: '',
  distance: '',
  discharge: null,
}

function applyPhoneMask(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (!d) return ''
  if (d[0] === '8') d = '7' + d.slice(1)
  else if (d[0] !== '7') d = '7' + d
  d = d.slice(0, 11)
  if (d.length <= 1) return '+' + d
  if (d.length <= 4) return `+${d[0]} (${d.slice(1)}`
  if (d.length <= 7) return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4)}`
  if (d.length <= 9) return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`
  return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`
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

/* ── Модалка «Отправить на просчёт» ── */
function QuoteModal({
  open,
  onClose,
  summary,
}: {
  open: boolean
  onClose: () => void
  summary: string
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [inn, setInn] = useState('')
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const valid =
    name.trim() !== '' &&
    phone.replace(/\D/g, '').length >= 11 &&
    /\S+@\S+\.\S+/.test(email) &&
    inn.trim().length >= 10

  const submit = async () => {
    if (!valid || sending) return
    setSending(true)
    setError('')
    try {
      await api.submitContact({
        name,
        phone,
        email,
        inn,
        topic: 'Просчёт комплекта (калькулятор)',
        message: summary + (comment ? `\n\nКомментарий:\n${comment}` : ''),
        is_subscribed: false,
      })
      setSent(true)
    } catch {
      setError('Не удалось отправить. Попробуйте ещё раз.')
    } finally {
      setSending(false)
    }
  }

  const inputCls = 'w-full rounded-xl px-4 py-3 text-white text-sm outline-none'
  const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: '#242424', border: '1px solid rgba(255,255,255,0.10)' }}
        onClick={e => e.stopPropagation()}
      >
        {sent ? (
          <div className="text-center py-6">
            <p className="text-white text-lg font-semibold mb-2">Заявка отправлена!</p>
            <p className="text-white/55 text-sm mb-5">Менеджер свяжется с вами и подготовит точный просчёт комплекта.</p>
            <Button variant="calculator" onClick={onClose}>Закрыть</Button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-white text-xl font-bold">Отправить на просчёт</h3>
              <button onClick={onClose} className="text-white/50 hover:text-white transition-colors text-xl leading-none">×</button>
            </div>
            <div className="flex flex-col gap-3">
              <input className={inputCls} style={inputStyle} placeholder="Имя *" value={name}
                onChange={e => setName(e.target.value)} />
              <input className={inputCls} style={inputStyle} placeholder="Телефон *" type="tel" value={phone}
                onChange={e => setPhone(applyPhoneMask(e.target.value))} />
              <input className={inputCls} style={inputStyle} placeholder="Почта *" type="email" value={email}
                onChange={e => setEmail(e.target.value)} />
              <input className={inputCls} style={inputStyle} placeholder="ИНН организации *" value={inn}
                onChange={e => setInn(e.target.value.replace(/\D/g, '').slice(0, 12))} />
              <textarea className={inputCls} style={inputStyle} placeholder="Комментарий (необязательно)" rows={3}
                value={comment} onChange={e => setComment(e.target.value)} />
            </div>
            {error && <p className="text-sm mt-3" style={{ color: '#ef4444' }}>{error}</p>}
            <Button
              variant="calculator"
              className="mt-4 w-full !justify-center"
              onClick={submit}
              disabled={!valid || sending}
            >
              {sending ? 'Отправка...' : 'Отправить'}
            </Button>
            <p className="text-white/30 text-xs mt-3">
              Отправляя заявку, вы соглашаетесь с политикой обработки персональных данных.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Главный компонент ── */
const TOTAL_STEPS = 8

export default function CalculatorQuiz() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [rooms, setRooms] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<CalculatorResult | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const { addItem } = useCart()

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(f => ({ ...f, [key]: val }))

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1))
  const back = () => setStep(s => Math.max(s - 1, 0))

  const canNext = () => {
    if (step === 0) return form.volume !== '' && Number(form.volume) > 0
    if (step === 1) return form.zones !== null
    if (step === 2) return form.nodeType !== null
    if (step === 3) return form.montage !== null
    if (step === 4) return form.ei !== null
    if (step === 5) return form.suction !== ''
    if (step === 6) return form.distance !== '' && Number(form.distance) > 0
    if (step === 7) return form.discharge !== null
    return true
  }

  const calculate = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getCalculatorRecommend({
        volume: Number(form.volume),
        rooms,
        zones: form.zones === 'two' ? 2 : 1,
        nodeType: form.nodeType ?? 'exhaust',
        montage: form.montage ?? 'internal',
        suction: form.suction || (form.zones === 'two' ? '3' : '5'),
        distance: Number(form.distance) || 10,
        discharge: form.discharge ?? 'street',
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
    setAddedToCart(false)
    setQuoteOpen(false)
  }

  const addKitToCart = () => {
    if (!result?.product) return
    const p = result.product

    addItem({
      productId: p.id,
      slug: p.slug,
      name: p.name,
      image: storageUrl(p.image),
      price: p.price,
      qty: 1,
      extras: [],
      specs: p.specs.slice(0, 3).map(s => ({ key: s.key ?? '', label: s.label, value: s.value })),
      configuration: {
        suction_length: form.zones === 'two' ? 3 : Math.round(Number(form.suction) || 5),
        exhaust_length: Math.ceil((Number(form.distance) || 10) / 10) * 10,
        hoseCost: 0,
      },
    })

    result.accessories.forEach(acc => {
      addItem({
        productId: acc.id,
        slug: acc.slug,
        name: acc.name,
        image: storageUrl(acc.image),
        price: acc.price,
        qty: acc.qty,
        extras: [],
        specs: [],
      })
    })

    setAddedToCart(true)
  }

  /* Текстовая сводка расчёта — для заявки «на просчёт» */
  const buildSummary = (): string => {
    const zonesLabel = form.zones === 'two' ? 'двухзонное' : 'однозонное'
    const nodeLabel = form.nodeType === 'supply_exhaust' ? 'приточно-вытяжные' : 'вытяжные'
    const montageLabel = form.montage === 'external' ? 'внешняя перегородка (уличная стена)' : 'внутренняя перегородка'
    const dischargeLabel =
      form.discharge === 'vent' ? 'в вытяжную вентиляцию'
      : form.discharge === 'shaft' ? 'в шахту дымоудаления'
      : 'на улицу (окно/дверь)'
    const suctionLabel = form.zones === 'two'
      ? (form.suction === 'custom' ? 'двухзонная обвязка, верхний рукав более 3 м (нестандарт)' : 'двухзонная обвязка, верхний 3 м')
      : `всасывающий рукав ${form.suction === '1.5' ? '1,5' : form.suction} м`

    const lines: string[] = [
      'Расчёт комплекта дымоудаления:',
      `• Объём помещения: ${form.volume} м³${rooms > 1 ? ` (помещений: ${rooms})` : ''}`,
      `• Тип удаления: ${zonesLabel}`,
      `• Узлы стыковочные: ${nodeLabel}${form.ei ? ` (${form.ei})` : ''}, монтаж: ${montageLabel}`,
      `• Всасывающая линия: ${suctionLabel}`,
      `• Расстояние до точки выброса: ${form.distance} м`,
      `• Выброс: ${dischargeLabel}`,
    ]

    if (result) {
      lines.push(`• Требуемая производительность: ${result.required_productivity.toLocaleString('ru-RU')} м³/ч`)
      if (result.consultation_required) {
        lines.push('', 'Объём свыше 500 м³ — требуется индивидуальный подбор с производителем.')
      } else if (result.product) {
        lines.push('', `Рекомендованный дымосос:`, `  — ${result.product.name} (от ${result.product.price.toLocaleString('ru-RU')} ₽)`)
        if (result.accessories.length) {
          lines.push('', 'Комплектация под расчёт:')
          result.accessories.forEach(a =>
            lines.push(`  — ${a.name} × ${a.qty} (${(a.price * a.qty).toLocaleString('ru-RU')} ₽)`)
          )
        }
        lines.push('', `Полная комплектация, итого: ${result.total.toLocaleString('ru-RU')} ₽`)
        if (result.non_standard) {
          lines.push('* В комплектации нестандартное оборудование — требуется точный расчёт менеджером.')
        }
      }
    }

    return lines.join('\n')
  }

  /* ── Шаги ── */
  const STEPS = [
    // 0. Объём
    <div key="volume">
      <h2 className="text-white text-xl font-bold mb-1">Объём помещения</h2>
      <p className="text-white/50 text-sm mb-5">
        Укажите максимальный объём одного помещения, которое нужно защитить.
        Если дымосос подбирается для нескольких помещений — введите объём самого большого.
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="number"
          min={1}
          max={100000}
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
          <span className="text-white font-medium w-8 text-center">{rooms}</span>
          <button
            type="button"
            onClick={() => setRooms(r => Math.min(999, r + 1))}
            className="w-8 h-8 rounded-md flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.15)' }}
          >+</button>
        </div>
      </div>
    </div>,

    // 1. Зоны
    <div key="zones">
      <h2 className="text-white text-xl font-bold mb-1">Тип удаления</h2>
      <p className="text-white/50 text-sm mb-5">Сколько зон дымоудаления в помещении?</p>
      <div className="flex flex-wrap gap-3">
        <OptionCard
          selected={form.zones === 'one'}
          onClick={() => { set('zones', 'one'); set('suction', '') }}
          label="Однозонное"
          hint="Один узел стыковочный — один вход"
        />
        <OptionCard
          selected={form.zones === 'two'}
          onClick={() => { set('zones', 'two'); set('suction', '') }}
          label="Двухзонное"
          hint="Нижняя + верхняя зоны, 2 узла на помещение"
        />
      </div>
    </div>,

    // 2. Тип узлов
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

    // 3. Тип монтажа
    <div key="montage">
      <h2 className="text-white text-xl font-bold mb-1">Тип монтажа стыковочного узла</h2>
      <p className="text-white/50 text-sm mb-5">Куда будет монтироваться узел стыковочный?</p>
      <div className="flex flex-wrap gap-3">
        <OptionCard
          selected={form.montage === 'internal'}
          onClick={() => set('montage', 'internal')}
          label="Внутренняя перегородка"
          hint="Монтаж внутри здания"
        />
        <OptionCard
          selected={form.montage === 'external'}
          onClick={() => set('montage', 'external')}
          label="Внешняя перегородка"
          hint="Монтаж на уличную стену — узлы уличного исполнения"
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
              hint="Нижний рукав 2,5 м включён. Подходит для помещений с высотой потолков до 4 м включительно"
            />
            <OptionCard
              selected={form.suction === 'custom'}
              onClick={() => set('suction', 'custom')}
              label="Верхний более 3 м (на заказ)"
              hint="Нижний рукав 2,5 м включён. Конечный расчёт будет произведён индивидуально с менеджером"
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

    // 6. Расстояние до точки выброса
    <div key="distance">
      <h2 className="text-white text-xl font-bold mb-1">Расстояние до точки выброса</h2>
      <p className="text-white/50 text-sm mb-5">
        Максимальное расстояние от узла стыковочного до точки выброса газа
        (окно или дверь на улицу, вытяжная вентиляция, шахта дымоудаления).
        Напорную линию считаем кратно 10 м с округлением в большую сторону.
      </p>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={200}
          placeholder="Напр. 17"
          value={form.distance}
          onChange={e => set('distance', e.target.value)}
          className="rounded-xl px-4 py-3 text-white text-lg font-medium outline-none w-36"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
        />
        <span className="text-white/50">м</span>
      </div>
      {Number(form.distance) > 40 && (
        <p className="text-xs mt-3" style={{ color: '#c0703a' }}>
          ⚠ Длинная напорная линия снижает эффективность — уточните у менеджера
        </p>
      )}
    </div>,

    // 7. Куда выброс
    <div key="discharge">
      <h2 className="text-white text-xl font-bold mb-1">Куда будет осуществляться выброс газа?</h2>
      <p className="text-white/50 text-sm mb-5">От этого зависит дополнительное оборудование в комплекте</p>
      <div className="flex flex-wrap gap-3">
        <OptionCard
          selected={form.discharge === 'street'}
          onClick={() => set('discharge', 'street')}
          label="На улицу"
          hint="Через окно или дверь"
        />
        <OptionCard
          selected={form.discharge === 'vent'}
          onClick={() => set('discharge', 'vent')}
          label="В вытяжную вентиляцию"
          hint="+ узел СУ-ВВ и адаптер вытяжной"
        />
        <OptionCard
          selected={form.discharge === 'shaft'}
          onClick={() => set('discharge', 'shaft')}
          label="В шахту дымоудаления"
          hint="+ узел СУ-ДУ"
        />
      </div>
    </div>,
  ]

  /* ── Результаты ── */
  if (step >= TOTAL_STEPS && result) {
    return (
      <div className="max-w-2xl mx-auto">
        <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} summary={buildSummary()} />

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

        {result.consultation_required || !result.product ? (
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <p className="text-white/70 leading-relaxed">
              При подборе дымососа для помещений объёмом от 500 м³ и выше необходимо учитывать
              индивидуальные особенности помещения. В таких случаях без консультации
              с производителем не обойтись — отправьте расчёт на просчёт, и менеджер
              подберёт решение под ваш объект.
            </p>
            <div className="mt-5 flex gap-3 flex-wrap">
              <Button variant="calculator" onClick={() => setQuoteOpen(true)}>
                Отправить на просчёт
              </Button>
              <Button href="/catalog/dymososy" variant="outline">
                Весь каталог дымососов
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Комплектация под расчёт ── */}
            <div
              className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <h3 className="text-white font-semibold mb-4">Комплектация под расчёт</h3>

              {/* Рекомендуемый дымосос */}
              <div
                className="rounded-2xl p-5 mb-4"
                style={{ background: 'rgba(122,86,62,0.12)', border: '1px solid #7a563e' }}
              >
                <div
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
                  style={{ background: '#7a563e', color: '#fff' }}
                >
                  Рекомендуем
                </div>
                <div className="flex gap-4 items-start">
                  <div
                    className="relative rounded-xl overflow-hidden shrink-0"
                    style={{ width: 100, height: 100, background: '#3a3a3a' }}
                  >
                    <Image
                      src={storageUrl(result.product.image)}
                      alt={result.product.name}
                      fill
                      className="object-contain p-2"
                      sizes="100px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/catalog/${result.product.slug}`}
                      className="text-white font-semibold text-sm leading-snug hover:opacity-80 transition-opacity"
                    >
                      {result.product.name}
                    </Link>
                    <div className="flex flex-col gap-1 mt-2">
                      {result.product.specs.map((s, i) => (
                        <div key={i} className="flex gap-2 text-xs">
                          <span className="text-white/45 shrink-0">{s.label}:</span>
                          <span className="text-white/80">{s.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <span className="text-white font-bold text-lg">
                        от {result.product.price.toLocaleString('ru-RU')}
                      </span>{' '}
                      <span style={{ color: '#c0703a' }}>₽</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Доп. оборудование */}
              {result.accessories.length > 0 && (
                <div className="flex flex-col gap-2">
                  {result.accessories.map(it => (
                    <div key={it.id} className="flex items-start justify-between gap-4 text-sm">
                      <span className="text-white/60">{it.name} × {it.qty}</span>
                      <span className="text-white font-medium shrink-0">
                        {(it.price * it.qty).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                  <div
                    className="flex items-center justify-between mt-1 pt-3 text-sm"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <span className="text-white/60">Доп. оборудование, итого</span>
                    <span className="text-white font-medium">{result.accessories_total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              )}

              {/* Полная сумма */}
              <div
                className="flex items-center justify-between mt-3 pt-3"
                style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
              >
                <span className="text-white font-semibold">Полная комплектация, итого:</span>
                <span className="text-white font-bold text-lg">
                  от {result.total.toLocaleString('ru-RU')} <span style={{ color: '#c0703a' }}>₽</span>
                </span>
              </div>

              <p className="text-white/30 text-xs mt-3">
                * Предел огнестойкости узлов: {form.ei ?? 'EI 60'}. Точная спецификация уточняется при заказе.
              </p>
              {result.non_standard && (
                <p className="text-xs mt-1" style={{ color: '#c0703a' }}>
                  * Более точный расчёт будет произведён менеджером, так как в комплектации нестандартное оборудование
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-3 flex-wrap">
              <Button
                variant="calculator"
                onClick={addKitToCart}
                disabled={addedToCart}
              >
                {addedToCart ? '✓ Добавлено в корзину' : 'Добавить дымосос + комплект в корзину'}
              </Button>
              <Button variant="outline" onClick={() => setQuoteOpen(true)}>
                Отправить на просчёт
              </Button>
              <Button href="/catalog/dymososy" variant="outline">
                Весь каталог дымососов
              </Button>
            </div>
          </>
        )}
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
