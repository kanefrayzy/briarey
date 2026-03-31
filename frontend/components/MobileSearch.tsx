'use client'

import { useRef, useEffect } from 'react'
import SearchIcon from './icons/SearchIcon'
import CloseIcon from './icons/CloseIcon'
import { SearchDropdown, useProductSearch } from './SearchDropdown'

interface Props {
  open: boolean
  onToggle: () => void
}

export default function MobileSearch({ open, onToggle }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { query, results, loading, search, clear } = useProductSearch()

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    } else {
      clear()
    }
  }, [open, clear])

  const handleClose = () => {
    clear()
    onToggle()
  }

  return (
    <div className="relative flex items-center">

      {/* ── Expanding search bar (absolute overlay, expands leftward) ── */}
      <div
        className="absolute right-14 top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          height: '44px',
          width: open ? 'calc(100vw - 150px)' : '0px',
          maxWidth: open ? '320px' : '0px',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          background: 'rgba(30, 30, 40, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '999px',
          border: open ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
        }}
      >
        {/* Search icon inside input */}
        <SearchIcon className="flex-shrink-0 ml-4" width={17} height={17} fill="rgba(255,255,255,0.55)" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => search(e.target.value)}
          placeholder="Поиск товаров..."
          className="flex-1 bg-transparent text-white text-sm py-2.5 px-3 outline-none min-w-0 placeholder:text-white/40"
          style={{ caretColor: 'white' }}
        />
      </div>

      {/* ── Dropdown results ── */}
      {open && query.length >= 2 && (
        <div className="fixed left-3 right-3 top-[72px] z-50">
          <SearchDropdown query={query} results={results} loading={loading} onClose={handleClose} />
        </div>
      )}

      {/* ── Search / Close icon button ── */}
      <button
        onClick={open ? handleClose : onToggle}
        className="relative z-10 flex items-center justify-center w-11 h-11 rounded-full transition-colors"
        style={{ background: open ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.12)' }}
        aria-label={open ? 'Закрыть поиск' : 'Поиск'}
      >
        {open ? (
          <CloseIcon width={16} height={16} stroke="white" strokeWidth={2.5} fill="none" />
        ) : (
          <SearchIcon width={20} height={20} fill="white" />
        )}
      </button>
    </div>
  )
}
