'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

export interface CartExtra {
  id: number
  name: string
  price: number
  qty: number
}

export interface CartSpec {
  key: string
  label: string
  value: string
}

export interface CartItem {
  productId: number
  slug: string
  name: string
  image: string | null
  price: number
  qty: number
  extras: CartExtra[]
  specs?: CartSpec[]
  configuration?: { suction_length: number; exhaust_length: number; hoseCost: number }
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, qty: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'briarey_cart'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch { /* quota exceeded — ignore */ }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    setItems(loadCart())
    setLoaded(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (loaded) saveCart(items)
  }, [items, loaded])

  const addItem = useCallback((item: Omit<CartItem, 'qty'> & { qty?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId)
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, qty: i.qty + (item.qty ?? 1), extras: item.extras }
            : i
        )
      }
      return [...prev, { ...item, qty: item.qty ?? 1 }]
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }, [])

  const updateQty = useCallback((productId: number, qty: number) => {
    if (qty < 1) return
    setItems(prev => prev.map(i => (i.productId === productId ? { ...i, qty } : i)))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = items.reduce((s, i) => {
    const extrasSum = i.extras.reduce((es, e) => es + e.price * e.qty, 0)
    const hoseCost = i.configuration?.hoseCost ?? 0
    return s + (i.price + extrasSum + hoseCost) * i.qty
  }, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
