'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import NavMenu from './NavMenu'
import MobileSearch from './MobileSearch'
import PhoneIcon from './icons/PhoneIcon'
import MailIcon from './icons/MailIcon'
import CartIcon from './icons/CartIcon'
import SearchIcon from './icons/SearchIcon'
import CloseIcon from './icons/CloseIcon'
import BurgerIcon from './icons/BurgerIcon'
import type { SiteSettings } from '@/lib/api'
import { api } from '@/lib/api'
import { useCart } from '@/lib/cart'
import { SearchDropdown, useProductSearch } from './SearchDropdown'

interface HeaderProps {
  settings?: SiteSettings
}

export default function Header({ settings: settingsProp }: HeaderProps) {
  const [settings, setSettings] = useState<SiteSettings | undefined>(settingsProp)

  useEffect(() => {
    if (!settingsProp) {
      api.getSiteSettings().then(s => setSettings(s)).catch(() => {})
    }
  }, [settingsProp])

  const phone1 = settings?.phone_1 || '8 (499) 713-70-79'
  const phone2 = settings?.phone_2 || '8 (901) 183-70-79'
  const email = settings?.email || 'info@briarey.ru'
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false)
  const { totalItems } = useCart()
  const desktopSearch = useProductSearch()
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const desktopSearchRef = useRef<HTMLDivElement>(null)

  // Focus input when desktop search opens
  useEffect(() => {
    if (desktopSearchOpen) {
      setTimeout(() => desktopInputRef.current?.focus(), 50)
    } else {
      desktopSearch.clear()
    }
  }, [desktopSearchOpen])

  // Close desktop search on outside click
  useEffect(() => {
    if (!desktopSearchOpen) return
    const handler = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setDesktopSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [desktopSearchOpen])

  return (
    <header className="sticky top-0 z-50 w-full">

      {/* ── Top info bar ── (скрыт на мобилке) */}
      <div className="hidden md:block w-full border-b border-white/5" style={{ background: '#0e151b' }}>
        <div className="max-w-[1440px] mx-auto px-6 py-1.5 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-xs text-white/90">
          <Link href="/about" className="hover:text-white transition-colors">О компании</Link>
          <Link href="/dealers" className="hover:text-white transition-colors">Диллерам</Link>
          <Link href="/certificates" className="hover:text-white transition-colors">Доставка</Link>
          <a href={`tel:${phone1.replace(/[^\d+]/g, '')}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneIcon />{phone1}
          </a>
          <a href={`tel:${phone2.replace(/[^\d+]/g, '')}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <PhoneIcon />{phone2}
          </a>
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <MailIcon />{email}
          </a>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav
        className="w-full"
        style={{
          background: 'rgba(14, 21, 27, 0.45)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-3 flex items-center gap-8 relative">

          {/* Logo — скрыт когда открыт поиск на мобилке */}
          <Link
            href="/"
            className={`flex-shrink-0 transition-all duration-300 ${
              searchOpen ? 'opacity-0 pointer-events-none w-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            <Image src="/images/logo.svg" alt="Бриарей" width={170} height={52} className="h-10 w-auto" priority />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8 ml-2">
            <Link href="/catalog" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
              Каталог
            </Link>
            <Link href="/certificates" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
              Техдокументация
            </Link>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">

            {/* Mobile: Cart icon (скрыт когда открыт поиск) */}
            <Link
              href="/cart"
              className={`relative flex md:hidden items-center justify-center w-11 h-11 rounded-full transition-all duration-300 ${
                searchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              style={{ background: '#7a563e' }}
              aria-label="Корзина"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[11px] font-bold px-1">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile: Search (раскрывающийся поиск) */}
            <div className="flex md:hidden">
              <MobileSearch open={searchOpen} onToggle={() => setSearchOpen(!searchOpen)} />
            </div>

            {/* Desktop: Корзина */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/cart" className="text-sm text-white/70 hover:text-white transition-colors font-medium">Корзина</Link>
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors"
                style={{ background: '#7a563e' }}
                aria-label="Корзина"
              >
                <CartIcon />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 rounded-full bg-red-500 text-white text-[11px] font-bold px-1">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Desktop: Поиск */}
            <div className="hidden md:block relative" ref={desktopSearchRef}>
              {desktopSearchOpen ? (
                <div className="flex items-center gap-2 border border-white/40 rounded-full px-4 py-2 bg-white/5"
                  style={{ minWidth: 240 }}
                >
                  <SearchIcon width={18} height={18} fill="rgba(255,255,255,0.55)" />
                  <input
                    ref={desktopInputRef}
                    type="text"
                    value={desktopSearch.query}
                    onChange={e => desktopSearch.search(e.target.value)}
                    placeholder="Поиск товаров..."
                    className="bg-transparent text-white text-sm outline-none flex-1 min-w-0 placeholder:text-white/40"
                    style={{ caretColor: 'white' }}
                    onKeyDown={e => { if (e.key === 'Escape') setDesktopSearchOpen(false) }}
                  />
                  <button onClick={() => setDesktopSearchOpen(false)} className="text-white/50 hover:text-white transition-colors">
                    <CloseIcon width={14} height={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDesktopSearchOpen(true)}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white border border-white/20 hover:border-white/40 bg-transparent hover:bg-white/8 rounded-full px-4 py-2 transition-colors"
                >
                  Поиск
                  <SearchIcon />
                </button>
              )}
              {desktopSearchOpen && desktopSearch.query.length >= 2 && (
                <div className="absolute top-full right-0 mt-2 z-50" style={{ minWidth: 380 }}>
                  <SearchDropdown
                    query={desktopSearch.query}
                    results={desktopSearch.results}
                    loading={desktopSearch.loading}
                    onClose={() => setDesktopSearchOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Desktop: Консультация */}
            <Link href="/#contact-form" className="hidden md:flex text-sm text-white/70 hover:text-white border border-white/25 hover:border-white/50 rounded-full px-5 py-2 transition-colors">
              Консультация
            </Link>

            {/* Burger — на мобилке: круглый с белым прозрачным фоном, побольше */}
            <button
              className="flex items-center justify-center w-11 h-11 md:w-auto md:h-auto md:p-1 rounded-full md:rounded-none bg-white/[0.12] md:bg-transparent text-white/80 hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Меню"
            >
              {menuOpen ? (
                <CloseIcon width={18} height={18} />
              ) : (
                <BurgerIcon />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Nav Menu ── */}
      <NavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
