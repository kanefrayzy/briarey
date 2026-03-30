'use client'

import Image from 'next/image'
import PhoneContactIcon from '@/components/icons/PhoneContactIcon'
import TelegramIcon from '@/components/icons/TelegramIcon'
import WhatsAppIcon from '@/components/icons/WhatsAppIcon'
import AvitoIcon from '@/components/icons/AvitoIcon'
import CloseIcon from '@/components/icons/CloseIcon'

interface OrderSuccessModalProps {
  onClose: () => void
}

const socialLinks = [
  { label: 'Телефон',  href: 'tel:+74997137079',      icon: <PhoneContactIcon /> },
  { label: 'Telegram', href: 'https://t.me/briarey',   icon: <TelegramIcon /> },
  { label: 'WhatsApp', href: 'https://wa.me/',         icon: <WhatsAppIcon /> },
  { label: 'Авито',    href: 'https://avito.ru',       icon: <AvitoIcon /> },
]

export default function OrderSuccessModal({ onClose }: OrderSuccessModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col items-center text-center rounded-2xl px-10 py-12"
        style={{ background: '#2e2e2e', maxWidth: 400, width: '90%' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Крестик */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          aria-label="Закрыть"
        >
          <CloseIcon width={20} height={20} stroke="currentColor" strokeWidth={2} />
        </button>

        {/* Логотип */}
        <div className="mb-6">
          <Image
            src="/images/logo.svg"
            alt="Бриарей"
            width={180}
            height={60}
            className="object-contain"
          />
        </div>

        {/* Заголовок */}
        <h2 className="text-white text-2xl font-bold mb-3">
          Спасибо за заказ!
        </h2>

        {/* Подзаголовок */}
        <p className="text-white/80 text-base leading-relaxed mb-8">
          Наш менеджер свяжется с вами<br />в ближайшее время
        </p>

        {/* Соцсети */}
        <div className="flex gap-3">
          {socialLinks.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl transition-opacity hover:opacity-75"
              style={{
                width: 48,
                height: 48,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
