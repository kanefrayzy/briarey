'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'briarey_cookie_consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== 'accepted') {
        setVisible(true)
      }
    } catch {
      // приватный режим — просто не показываем баннер повторно в этой сессии
    }
  }, [])

  const accept = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted')
    } catch {
      /* хранилище недоступно */
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 pointer-events-none animate-fadeIn">
      <div
        className="pointer-events-auto mx-auto w-full max-w-3xl rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{
          background: '#242424',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
        }}
      >
        <div
          className="hidden sm:flex shrink-0 w-10 h-10 rounded-xl items-center justify-center"
          style={{ background: 'rgba(212,168,67,0.12)' }}
          aria-hidden="true"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="1.7">
            <path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-5-5 4 4 0 0 1-4-4Z" strokeLinejoin="round" />
            <circle cx="9" cy="13" r="1" fill="#D4A843" stroke="none" />
            <circle cx="14" cy="16" r="1" fill="#D4A843" stroke="none" />
            <circle cx="15" cy="10" r="1" fill="#D4A843" stroke="none" />
          </svg>
        </div>

        <p className="text-white/60 text-sm leading-relaxed flex-1">
          Мы используем файлы cookie, чтобы сайт работал корректно и мы понимали, какие разделы
          полезнее посетителям. Продолжая пользоваться сайтом, вы соглашаетесь с их использованием.
        </p>

        <button
          type="button"
          onClick={accept}
          className="shrink-0 inline-flex items-center justify-center font-semibold px-6 py-3 rounded text-sm transition-colors bg-[#7a563e] hover:bg-[#634531] text-white"
        >
          Хорошо
        </button>
      </div>
    </div>
  )
}
