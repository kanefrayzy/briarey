/**
 * SmokeOverlay — плавный дымовой переход между секциями.
 *
 * position="bottom"  — дым уходит вниз (конец HeroSection)
 * position="top"     — дым приходит сверху (начало SliderSection)
 */

interface Props {
  position: 'bottom' | 'top'
  /** Высота перекрывашки, по умолчанию bottom=55%, top=38% */
  height?: string
  /** z-index обёртки */
  zIndex?: number
}

export default function SmokeOverlay({ position, height, zIndex }: Props) {
  const defaultHeight = position === 'bottom' ? '55%' : '38%'
  const h = height ?? defaultHeight
  const z = zIndex ?? (position === 'bottom' ? 11 : 20)

  const isBottom = position === 'bottom'

  return (
    <div
      className="absolute pointer-events-none select-none left-0 right-0"
      style={{
        ...(isBottom ? { bottom: 0 } : { top: 0 }),
        height: h,
        zIndex: z,
      }}
    >
      {/* линейный градиент */}
      <div
        className="absolute inset-0"
        style={{
          background: isBottom
            ? 'linear-gradient(to bottom, transparent 0%, rgba(240,240,240,0.25) 28%, rgba(240,240,240,0.72) 52%, rgba(240,240,240,0.97) 75%, #f0f0f0 100%)'
            : 'linear-gradient(to bottom, #f0f0f0 0%, rgba(240,240,240,0.88) 20%, rgba(240,240,240,0.45) 55%, transparent 100%)',
        }}
      />
      {/* радиальное дымовое облако — сферическая форма */}
      <div
        className="absolute inset-x-0"
        style={{
          ...(isBottom ? { bottom: 0 } : { top: 0 }),
          height: isBottom ? '80%' : '90%',
          background: isBottom
            ? 'radial-gradient(ellipse 60% 90% at 50% 100%, rgba(255,255,255,0.98) 0%, rgba(240,240,240,0.75) 40%, transparent 75%)'
            : 'radial-gradient(ellipse 60% 90% at 50% 0%, rgba(255,255,255,0.98) 0%, rgba(240,240,240,0.75) 40%, transparent 75%)',
          borderRadius: isBottom ? '50% 50% 0 0 / 80% 80% 0 0' : '0 0 50% 50% / 0 0 80% 80%',
          filter: 'blur(22px)',
        }}
      />
    </div>
  )
}
