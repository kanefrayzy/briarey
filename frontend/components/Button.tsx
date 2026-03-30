import Link from 'next/link'
import { ReactNode } from 'react'

type ButtonVariant = 'catalog' | 'calculator' | 'primary' | 'outline'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: ButtonVariant
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
  fullWidth?: boolean
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  catalog:    'bg-[#637c8f] hover:bg-[#506474] text-white',
  calculator: 'bg-[#7a563e] hover:bg-[#634531] text-white',
  primary:    'bg-brand-blue hover:bg-blue-700 text-white',
  outline:    'bg-transparent border border-white/30 hover:border-white text-white',
}

export default function Button({
  children,
  href,
  variant = 'primary',
  onClick,
  type = 'button',
  disabled,
  className = '',
  fullWidth,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center font-semibold px-6 py-3 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`
  const cls = `${base} ${VARIANT_CLASSES[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  )
}
