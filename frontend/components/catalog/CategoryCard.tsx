import Image from 'next/image'
import Link from 'next/link'

export interface Category {
  label: string
  icon: string
}

interface CategoryCardProps extends Category {
  active: boolean
  onClick: () => void
  href?: string
}

export default function CategoryCard({ label, icon, active, onClick, href }: CategoryCardProps) {
  const inner = (
    <>
      <div className="w-8 h-8 relative flex-shrink-0">
        <Image src={icon} alt={label} fill className="object-contain" sizes="32px" />
      </div>
      <span
        className="text-[11px] leading-tight text-center"
        style={{ color: '#ffffff' }}
      >
        {label}
      </span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="flex flex-1 flex-col items-center gap-2 px-3 py-2 transition-colors hover:opacity-80 h-20"
        style={{ background: active ? '#202020' : 'transparent' }}
      >
        {inner}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-2 px-3 py-2 transition-colors hover:opacity-80 h-20"
      style={{ background: active ? '#202020' : 'transparent' }}
    >
      {inner}
    </button>
  )
}
