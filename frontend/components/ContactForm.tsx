'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from './Button'
import FormInput from './form/FormInput'
import FormSelect from './form/FormSelect'
import FormCheckbox from './form/FormCheckbox'
import { api } from '@/lib/api'

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

const DEFAULT_TOPICS = [
  'Стать диллером',
  'Технический вопрос',
  'Коммерческое предложение',
  'Другое',
]

export default function ContactForm() {
  const [topics, setTopics] = useState<string[]>(DEFAULT_TOPICS)
  const [topic, setTopic] = useState(DEFAULT_TOPICS[0])
  const pendingTopicRef = useRef<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [consent, setConsent] = useState(true)
  const [subscribe, setSubscribe] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  // Read calculator prefill from sessionStorage on mount OR via custom event (same-page navigation)
  const applyPrefill = () => {
    try {
      const raw = sessionStorage.getItem('contactFormPrefill')
      if (raw) {
        const { topic: t, message: m } = JSON.parse(raw) as { topic?: string; message?: string }
        sessionStorage.removeItem('contactFormPrefill')
        if (t) {
          pendingTopicRef.current = t
          setTopic(prev => {
            if (topics.includes(t)) return t
            return prev
          })
        }
        if (m) setMessage(m)
        setSent(false)
      }
    } catch {}
  }

  useEffect(() => {
    applyPrefill()
    const handler = () => applyPrefill()
    window.addEventListener('contactFormPrefill', handler)
    return () => window.removeEventListener('contactFormPrefill', handler)
  }, [])

  useEffect(() => {
    api.getContactTopics()
      .then(data => {
        if (data?.length) {
          const labels = data.map(t => t.label)
          setTopics(labels)
          // Preserve prefill topic if it's in the list, otherwise use first
          setTopic(prev => {
            const keep = pendingTopicRef.current ?? prev
            pendingTopicRef.current = null
            return labels.includes(keep) ? keep : labels[0]
          })
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent || sending) return
    setSending(true)
    try {
      await api.submitContact({
        name,
        phone,
        email: email || undefined,
        message: message || undefined,
        topic,
        is_subscribed: subscribe,
      })
      setSent(true)
      setName('')
      setPhone('')
      setEmail('')
      setMessage('')
    } catch {
      // silent fail
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact-form" className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 md:py-16">
      <div className="bg-[#2e2e2e] rounded-2xl overflow-hidden flex flex-col lg:flex-row">

        {/* Мобильное изображение */}
        <div className="block lg:hidden p-3 pb-0">
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
            <Image src="/images/contact-bg.png" alt="Заявка" fill className="object-cover" />
          </div>
        </div>

        {/* Десктопное изображение */}
        <div className="hidden lg:block lg:w-[46%] relative min-h-[600px]">
          <Image src="/images/contact-bg.png" alt="Заявка" fill className="object-cover" />
        </div>

        {/* Правая часть — форма */}
        <div className="flex-1 px-4 py-8 lg:px-10 lg:py-12 flex flex-col gap-5">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white">Заявка</h2>
            <p className="mt-2 text-brand-gray text-xs lg:text-sm leading-relaxed max-w-md">
              Тут можно оставить заявку, для того чтобы наши менеджера связались с вами в удобное время
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <FormInput label="Имя" type="text" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)} />
            <FormInput label="Телефон" type="tel" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPhone(applyPhoneMask(e.target.value))} />
            <FormInput label="Email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)} />
            <FormInput label="Текст сообщения" multiline rows={3} value={message} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setMessage(e.target.value)} />

            <div>
              <p className="text-brand-gray text-xs mb-2">Тема обращения</p>
              <FormSelect label="" options={topics} value={topic} onChange={setTopic} />
            </div>

            <div className="flex flex-col gap-3 mt-1">
              <FormCheckbox checked={consent} onChange={setConsent}>
                Я даю согласие на обработку персональных данных в соответствии с{' '}
                <Link href="/privacy" className="hover:underline" style={{ color: '#AC7F5E' }}>
                  Политикой обработки персональных данных
                </Link>
              </FormCheckbox>
              <FormCheckbox checked={subscribe} onChange={setSubscribe}>
                Я хочу получать полезные материалы и другие новостные и рекламные рассылки
              </FormCheckbox>
            </div>

            <Button type="submit" variant="catalog" disabled={!consent || sending} className="mt-2 w-full lg:w-auto lg:self-start">
              {sent ? 'Отправлено!' : sending ? 'Отправка...' : 'Отправить'}
            </Button>
          </form>
        </div>

      </div>
    </section>
  )
}
