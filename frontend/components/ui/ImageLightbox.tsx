'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface ImageLightboxProps {
  src: string
  alt: string
  onClose: () => void
}

/**
 * Универсальный лайтбокс для полноэкранного отображения изображений.
 * Закрывается по Escape, клику на фон или кнопку ✕.
 * Используется через portal — рендерится прямо в document.body.
 */
export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    // Закрытие по Escape
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    // Блокируем прокрутку страницы
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 animate-fadeIn"
      onClick={onClose}
    >
      {/* Кнопка закрытия */}
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors text-white text-xl"
        aria-label="Закрыть"
        onClick={(e) => { e.stopPropagation(); onClose() }}
      >
        ✕
      </button>

      {/* Изображение — клик не всплывает (не закрывает по клику на саму картинку) */}
      <div
        className="relative w-[90vw] h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain select-none"
          sizes="90vw"
          priority
        />
      </div>
    </div>,
    document.body,
  )
}
