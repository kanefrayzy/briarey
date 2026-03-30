'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import CheckoutField from '@/components/form/CheckoutField'
import OrderSuccessModal from '@/components/checkout/OrderSuccessModal'
import DeliveryIcon from '@/components/icons/DeliveryIcon'
import PickupIcon from '@/components/icons/PickupIcon'
import { useCart } from '@/lib/cart'
import { api } from '@/lib/api'

type DeliveryMode = 'delivery' | 'pickup'

const RECIPIENT_TYPES = ['Юридическое лицо', 'Физическое лицо']
const RECIPIENT_MAP: Record<string, 'legal' | 'individual'> = {
  'Юридическое лицо': 'legal',
  'Физическое лицо': 'individual',
}

export default function CheckoutForm() {
  const router = useRouter()
  const { items, clearCart } = useCart()

  const [mode, setMode] = useState<DeliveryMode>('delivery')
  const [recipientType, setRecipientType] = useState(RECIPIENT_TYPES[0])
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [requisites, setRequisites] = useState('')
  const [address, setAddress] = useState('')
  const [entrance, setEntrance] = useState('')
  const [floor, setFloor] = useState('')
  const [apartment, setApartment] = useState('')
  const [comment, setComment] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (items.length === 0) {
      setError('Корзина пуста')
      return
    }

    setSubmitting(true)
    try {
      await api.submitOrder({
        delivery_method: mode,
        recipient_type: RECIPIENT_MAP[recipientType],
        name,
        phone,
        email: email || undefined,
        requisites: requisites || undefined,
        address: mode === 'delivery' ? address || undefined : undefined,
        entrance: mode === 'delivery' ? entrance || undefined : undefined,
        floor: mode === 'delivery' ? floor || undefined : undefined,
        apartment: mode === 'delivery' ? apartment || undefined : undefined,
        comment: mode === 'delivery' ? comment || undefined : undefined,
        items: items.map(item => ({
          product_id: item.productId,
          qty: item.qty,
          extras: item.extras.length > 0
            ? item.extras.map(ex => ({ id: ex.id, qty: ex.qty }))
            : undefined,
          configuration: item.configuration ?? undefined,
        })),
      })
      clearCart()
      setShowSuccess(true)
    } catch {
      setError('Не удалось оформить заказ. Попробуйте ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleCloseSuccess() {
    setShowSuccess(false)
    router.push('/')
  }

  return (
    <>
    {showSuccess && <OrderSuccessModal onClose={handleCloseSuccess} />}
    <form onSubmit={handleSubmit}>
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-16 lg:pb-24">

      {/* Вкладки доставки */}
      <div className="flex gap-3 mb-10" style={{ maxWidth: 720 }}>
        <button
          type="button"
          onClick={() => setMode('delivery')}
          className="flex-1 flex items-center justify-center gap-3 py-4 text-sm font-medium transition-colors rounded"
          style={{
            background: mode === 'delivery' ? '#7a563e' : 'transparent',
            color: 'white',
            border: `1px solid ${mode === 'delivery' ? '#7a563e' : 'rgba(255,255,255,0.3)'}`,
          }}
        >
          <DeliveryIcon />
          Доставка
        </button>
        <button
          type="button"
          onClick={() => setMode('pickup')}
          className="flex-1 flex items-center justify-center gap-3 py-4 text-sm font-medium transition-colors rounded"
          style={{
            background: mode === 'pickup' ? '#7a563e' : 'transparent',
            color: 'white',
            border: `1px solid ${mode === 'pickup' ? '#7a563e' : 'rgba(255,255,255,0.3)'}`,
          }}
        >
          <PickupIcon />
          Самовывоз
        </button>
      </div>

      {/* Получатель */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-5">Получатель</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10" style={{ maxWidth: 900 }}>
        {/* Левая колонка */}
        <div className="flex flex-col gap-3">
          {/* Выпадающий тип получателя */}
          <div className="relative rounded" style={{ border: '1px solid white' }}>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              className="w-full bg-transparent px-4 py-3 text-white text-sm focus:outline-none appearance-none cursor-pointer"
            >
              {RECIPIENT_TYPES.map((t) => (
                <option key={t} value={t} style={{ background: '#1a1a1a' }}>{t}</option>
              ))}
            </select>
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          {/* Реквизиты */}
          <CheckoutField multiline rows={5} placeholder="Реквизиты для выставления счёта" value={requisites} onChange={e => setRequisites(e.target.value)} />
        </div>

        {/* Правая колонка */}
        <div className="flex flex-col gap-3">
          <CheckoutField placeholder="Введите ваше имя" value={name} onChange={e => setName(e.target.value)} required />
          <CheckoutField placeholder="Номер телефона" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
          <CheckoutField placeholder="Почта" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
      </div>

      {/* Адрес — только для доставки */}
      {mode === 'delivery' && (
        <>
          <h2 className="text-white text-xl md:text-2xl font-bold mb-6">Адрес доставки</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10" style={{ maxWidth: 900 }}>
            {/* Левая */}
            <div className="flex flex-col gap-3">
              <CheckoutField placeholder="Начните вводить ваш адрес" value={address} onChange={e => setAddress(e.target.value)} />
              <CheckoutField multiline rows={4} placeholder="Комментарий для курьера" value={comment} onChange={e => setComment(e.target.value)} />
            </div>
            {/* Правая */}
            <div className="flex flex-col gap-3">
              <CheckoutField placeholder="Подъезд" value={entrance} onChange={e => setEntrance(e.target.value)} />
              <CheckoutField placeholder="Этаж" value={floor} onChange={e => setFloor(e.target.value)} />
              <CheckoutField placeholder="Квартира / офис" value={apartment} onChange={e => setApartment(e.target.value)} />
            </div>
          </div>
        </>
      )}

      {/* Самовывоз — адрес производства */}
      {mode === 'pickup' && (
        <>
          <h2 className="text-white text-xl md:text-2xl font-bold mb-6">Адрес производства</h2>
          <div className="flex flex-col gap-3 mb-10 text-sm md:text-base" style={{ maxWidth: 720 }}>
            {[
              { label: 'Адрес:', value: 'Мос. Обл, г. Раменское, ул. 100–Свирской дивизии, д. 11.', link: true },
              { label: 'Время работы:', value: 'Пн–Вс, 10:00 – 20:00', link: false },
              { label: 'Контактный номер:', value: '+7 (499) 713–70–79', link: true },
              { label: 'Почта:', value: 'info@briarey.ru', link: true },
            ].map(({ label, value, link }) => (
              <div key={label} className="flex items-baseline gap-3 flex-wrap">
                <span className="text-white/60 shrink-0">{label}</span>
                {link ? (
                  <span className="text-white underline decoration-white/40">{value}</span>
                ) : (
                  <span className="text-white">{value}</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Ошибка */}
      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      {/* Кнопка */}
      <Button variant="calculator" type="submit" disabled={submitting}>
        {submitting ? 'Оформляем...' : 'Оформить заказ'}
      </Button>
    </div>
    </form>
    </>
  )
}
