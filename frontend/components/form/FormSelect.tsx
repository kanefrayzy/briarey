'use client'

import { useState, useRef, useEffect } from 'react'

import ChevronDownIcon from '../icons/ChevronDownIcon'

interface FormSelectProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function FormSelect({ label, options, value, onChange }: FormSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-brand-gray text-xs">{label}</span>}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-white text-sm rounded-lg transition-colors"
          style={{ background: '#161616' }}
        >
          <span>{value}</span>
          <ChevronDownIcon
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div
            className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg overflow-hidden shadow-xl"
          style={{ background: '#161616' }}
        >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false) }}
                className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/10"
                style={{ color: opt === value ? '#AC7F5E' : '#ffffff', background: '#161616' }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
