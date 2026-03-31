/**
 * SmokeOverlay — плавный дымовой переход между секциями.
 *
 * position="bottom"  — дым уходит вниз (конец HeroSection)
 * position="top"     — дым приходит сверху (начало SliderSection)
 */

interface Props {
  position: 'bottom' | 'top'
  height?: string
  zIndex?: number
}

export default function SmokeOverlay({ position, height, zIndex }: Props) {
  const defaultHeight = position === 'bottom' ? '40%' : '30%'
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
        overflow: 'hidden',
      }}
    >
      {/* 1. Базовый линейный градиент с плавным S-образным затуханием */}
      <div
        className="absolute inset-0"
        style={{
          background: isBottom
            ? 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.62) 65%, rgba(255,255,255,0.92) 82%, #fff 100%)'
            : 'linear-gradient(to bottom, #fff 0%, rgba(255,255,255,0.88) 18%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.12) 72%, transparent 100%)',
        }}
      />
      {/* 2. Большое центральное облако — основа «клубления» */}
      <div
        className="absolute inset-x-0"
        style={{
          ...(isBottom ? { bottom: '-20%' } : { top: '-20%' }),
          height: '90%',
          background: isBottom
            ? 'radial-gradient(ellipse 110% 80% at 50% 100%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 35%, rgba(255,255,255,0.15) 65%, transparent 100%)'
            : 'radial-gradient(ellipse 110% 80% at 50% 0%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 35%, rgba(255,255,255,0.15) 65%, transparent 100%)',
          filter: 'blur(28px)',
        }}
      />
      {/* 3. Левое смещённое облако — асимметрия */}
      <div
        className="absolute"
        style={{
          ...(isBottom ? { bottom: '-10%' } : { top: '-10%' }),
          left: '-10%',
          width: '70%',
          height: '75%',
          background: isBottom
            ? 'radial-gradient(ellipse 100% 90% at 30% 100%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 45%, transparent 80%)'
            : 'radial-gradient(ellipse 100% 90% at 30% 0%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 45%, transparent 80%)',
          filter: 'blur(36px)',
        }}
      />
      {/* 4. Правое смещённое облако — противовес */}
      <div
        className="absolute"
        style={{
          ...(isBottom ? { bottom: '-5%' } : { top: '-5%' }),
          right: '-5%',
          width: '55%',
          height: '65%',
          background: isBottom
            ? 'radial-gradient(ellipse 90% 85% at 70% 100%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.25) 50%, transparent 80%)'
            : 'radial-gradient(ellipse 90% 85% at 70% 0%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.25) 50%, transparent 80%)',
          filter: 'blur(30px)',
        }}
      />
      {/* 5. Мелкие «клочки» дыма ближе к краю */}
      <div
        className="absolute inset-x-0"
        style={{
          ...(isBottom ? { bottom: 0 } : { top: 0 }),
          height: '35%',
          background: isBottom
            ? 'radial-gradient(ellipse 45% 70% at 20% 100%, rgba(255,255,255,0.5) 0%, transparent 70%), radial-gradient(ellipse 35% 60% at 75% 100%, rgba(255,255,255,0.45) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 45% 70% at 20% 0%, rgba(255,255,255,0.5) 0%, transparent 70%), radial-gradient(ellipse 35% 60% at 75% 0%, rgba(255,255,255,0.45) 0%, transparent 70%)',
          filter: 'blur(14px)',
        }}
      />
    </div>
  )
}


