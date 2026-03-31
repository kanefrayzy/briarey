'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import CloseIcon from './icons/CloseIcon'
import ChevronDownIcon from './icons/ChevronDownIcon'

export const catalogItems = [
  { label: 'Дымососы', href: '/catalog/dymososy', icon: '/images/catalog/icons/dymosos.png' },
  { label: 'Клапана сброса', href: '/catalog/klapana-sbrosa', icon: '/images/catalog/icons/klapan.png' },
  { label: 'Доп. оборудование', href: '/catalog/dop-oborudovanie', icon: '/images/catalog/icons/dop.png' },
  { label: 'Узел стыковочный', href: '/catalog/uzel-stykovochnyj', icon: '/images/catalog/icons/uzel.png' },
  { label: 'Шкафы для хранения', href: '/catalog/shkafy-dlya-hraneniya', icon: '/images/catalog/icons/shkaf.png' },
  { label: 'Двери противопожарные', href: '/catalog/dveri-protivopozharnye', icon: '/images/catalog/icons/dver.png' },
  { label: 'Установки сбора вещества', href: '/catalog/ustanovki-sbora-veshchestva', icon: '/images/catalog/icons/ustanovki.png' },
  { label: 'Оборудование для пожарных машин', href: '/catalog/dymososy-dlya-pozharnyh-mashin', icon: '/images/catalog/icons/dymosos-mashin.png' },
]

const navLinks = [
  { label: 'Главная страница', href: '/' },
  { label: 'Калькулятор', href: '/calculator' },
  { label: 'О компании', href: '/about' },
  { label: 'Информация', href: '/certificates' },
  { label: 'Дилерам', href: '/dealers' },
  { label: 'Новости', href: '/news' },
  { label: 'Вакансии', href: '/vacancies' },
  { label: 'Контакты', href: '#footer-contacts' },
]

interface NavMenuProps {
  open: boolean
  onClose: () => void
}

export default function NavMenu({ open, onClose }: NavMenuProps) {
  const [catalogOpen, setCatalogOpen] = useState(false)

  useEffect(() => {
    if (!open) setCatalogOpen(false)
  }, [open])

  // Lock scroll on mobile when open
  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    document.body.style.overflow = (open && isMobile) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[9998] lg:hidden"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={onClose}
        />
      )}

      {/*
        Mobile:  fixed inset-0 z-[9999] → full screen
        Desktop: absolute top-full right-6 → под хедером, у правого края
      */}
      <div
        aria-hidden={!open}
        className={[
          // mobile: full screen fixed
          'fixed inset-0 z-[9999]',
          // desktop: dropdown under header, right-aligned
          'lg:absolute lg:inset-auto lg:top-full lg:right-6 lg:w-[300px] lg:z-50',
          // desktop shape
          'lg:rounded-2xl lg:shadow-2xl',
          // desktop height limit
          'lg:max-h-[80vh] lg:overflow-y-auto',
          // transition
          'transition-all duration-200 ease-out',
          open
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-2',
        ].join(' ')}
        style={{
          background: 'rgba(12, 12, 18, 0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Inner scroll wrapper for mobile */}
        <div className="flex flex-col h-full lg:h-auto overflow-y-auto">

          {/* Header: logo (mobile only) + close button (always) */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <Link href="/" onClick={onClose} className="lg:invisible">
              <Image src="/images/logo.svg" alt="Бриарей" width={120} height={36} className="h-12 w-auto" />
            </Link>
            <button
              onClick={onClose}
              className="ml-auto text-white/50 hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Nav content */}
          <nav className="flex flex-col px-6 py-4 lg:px-8 lg:py-0 gap-0">

            {/* Links before Каталог */}
            {navLinks.slice(0, 2).map((link) => (
              <MenuLink key={link.href} href={link.href} onClick={onClose}>
                {link.label}
              </MenuLink>
            ))}

            {/* Каталог accordion */}
            <div>
              <button
                className="w-full flex items-center justify-between py-3.5 text-white font-semibold text-xl hover:text-white/70 transition-colors"
                onClick={() => setCatalogOpen(!catalogOpen)}
              >
                Каталог
                <ChevronDownIcon
                  width={14} height={14}
                  style={{ transition: 'transform 0.2s', transform: catalogOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              <div
                style={{
                  overflow: 'hidden',
                  maxHeight: catalogOpen ? '600px' : '0',
                  transition: 'max-height 0.25s ease',
                }}
              >
                <div className="grid grid-cols-1 gap-x-8 gap-y-0 pb-3 pt-1 pl-1">
                  {catalogItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 py-2.5 text-white hover:text-white/65 transition-colors text-xl font-medium"
                    >
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded flex-shrink-0 overflow-hidden"
                      >
                        <Image src={item.icon} alt={item.label} width={24} height={24} className="object-contain" />
                      </div>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Remaining links */}
            {navLinks.slice(2).map((link) => (
              <MenuLink key={link.href} href={link.href} onClick={onClose}>
                {link.label}
              </MenuLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

function MenuLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="py-3.5 text-white font-semibold text-xl hover:text-white/70 transition-colors"
    >
      {children}
    </Link>
  )
}
