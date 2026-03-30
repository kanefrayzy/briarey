import { ReactNode } from 'react'

interface SectionHeadingProps {
  title: string
  subtitle?: ReactNode
  /** items-baseline (default) | items-start */
  align?: 'baseline' | 'start'
  /** tailwind margin-bottom class, default mb-12 */
  mb?: string
  /** override title classes */
  titleClass?: string
  /** override subtitle classes */
  subtitleClass?: string
}

export default function SectionHeading({
  title,
  subtitle,
  align = 'baseline',
  mb = 'mb-12',
  titleClass = 'text-3xl lg:text-4xl font-bold text-white',
  subtitleClass = 'text-white/60 text-base text-right mt-2',
}: SectionHeadingProps) {
  return (
    <div className={`flex ${align === 'baseline' ? 'items-baseline' : 'items-start'} justify-between ${mb}`}>
      <h2 className={titleClass}>{title}</h2>
      {subtitle && <p className={`hidden md:block ${subtitleClass}`}>{subtitle}</p>}
    </div>
  )
}
