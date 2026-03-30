'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { api, storageUrl, type Product } from '@/lib/api'

interface SearchDropdownProps {
  query: string
  results: Product[]
  loading: boolean
  onClose: () => void
}

function SearchDropdown({ query, results, loading, onClose }: SearchDropdownProps) {
  if (!query || query.length < 2) return null

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-50"
      style={{
        background: 'rgba(14, 21, 27, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {loading ? (
        <div className="px-4 py-6 text-center text-white/50 text-sm">Поиск...</div>
      ) : results.length === 0 ? (
        <div className="px-4 py-6 text-center text-white/50 text-sm">
          Ничего не найдено по запросу «{query}»
        </div>
      ) : (
        <div className="max-h-[360px] overflow-y-auto">
          {results.map(product => (
            <Link
              key={product.id}
              href={`/catalog/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div
                className="relative flex-shrink-0 rounded-lg overflow-hidden"
                style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.06)' }}
              >
                <Image
                  src={storageUrl(product.image)}
                  alt={product.name}
                  fill
                  className="object-contain p-1"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{product.name}</p>
                {product.category && (
                  <p className="text-white/40 text-xs">{product.category.name}</p>
                )}
              </div>
              {product.price > 0 && (
                <span className="flex-shrink-0 text-white/70 text-sm font-medium">
                  от {product.price.toLocaleString('ru-RU')}{' '}
                  <span className="text-[#c0703a]">₽</span>
                </span>
              )}
            </Link>
          ))}
          <Link
            href={`/catalog?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-[#c0703a] hover:bg-white/5 transition-colors border-t border-white/5"
          >
            Все результаты →
          </Link>
        </div>
      )}
    </div>
  )
}

export function useProductSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const search = useCallback((q: string) => {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (q.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.searchProducts(q)
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  const clear = useCallback(() => {
    setQuery('')
    setResults([])
    setLoading(false)
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }, [])

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [])

  return { query, results, loading, search, clear }
}

export { SearchDropdown }
