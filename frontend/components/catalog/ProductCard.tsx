import Image from 'next/image'
import Link from 'next/link'
import Button from '../Button'
import SpeedIcon from '../icons/SpeedIcon'
import DownloadIcon from '../icons/DownloadIcon'

export interface Product {
  id: number
  name: string
  flow: string
  price: string
  image: string
  href?: string
  categorySlug?: string
  techDocUrl?: string
}

interface ProductCardProps extends Omit<Product, 'id'> {
  compact?: boolean
}

const DYMOSOS_SLUGS = ['dymososy', 'dymososy-dlya-pozharnyh-mashin']
const BLUR_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PC9zdmc+'

export default function ProductCard({ name, flow, price, image, compact, href, categorySlug, techDocUrl }: ProductCardProps) {
  const showFlow = !!(flow && categorySlug && DYMOSOS_SLUGS.includes(categorySlug))
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    href ? (
      <Link href={href} className="block h-full">{children}</Link>
    ) : (
      <>{children}</>
    )

  if (compact) {
    return (
      <Wrapper>
      <article
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{ background: '#2e2e2e', width: '160px', height: '280px', flexShrink: 0 }}
      >
        {/* Изображение */}
        <div className="w-full flex-shrink-0 relative bg-[#333]" style={{ aspectRatio: '4/3' }}>
          <Image src={image} alt={name} fill className="object-contain p-3" sizes="160px" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
        </div>

        {/* Информация */}
        <div className="p-3 flex flex-col gap-1.5 bg-black/40 flex-1">
          <h3 className="text-white font-bold text-[12px] leading-snug line-clamp-2">{name}</h3>

          {showFlow && (
            <div className="flex items-center gap-1">
              <SpeedIcon size={14} />
              <span className="text-white text-[11px]">{flow}</span>
            </div>
          )}

          <span className="text-white font-semibold text-[13px]">
            {price} <span className="font-normal text-[#7a563e]">₽</span>
          </span>

          <Button variant="calculator" className="!px-3 !py-1.5 !text-xs !rounded-lg w-full !max-w-none !justify-center mt-auto">
            Подробнее
          </Button>
        </div>
      </article>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
    <article
      className="rounded-2xl overflow-hidden flex flex-col cursor-pointer h-full"
      style={{ background: '#2e2e2e' }}
    >
      {/* Изображение */}
      <div className="w-full flex-shrink-0 relative bg-[#333]" style={{ aspectRatio: '4/3' }}>
        <Image src={image} alt={name} fill className="object-contain p-6" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" placeholder="blur" blurDataURL={BLUR_PLACEHOLDER} />
      </div>

      {/* Информация */}
      <div className="p-4 flex flex-col gap-3 bg-black/40 flex-1 min-h-[180px]">
        {/* Название + тех. документ */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-white font-bold text-[15px] leading-snug flex-1 min-w-0">{name}</h3>
          {techDocUrl && (
            <a
              href={techDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex-shrink-0 flex items-center gap-1 text-white/60 hover:text-white/50 transition-colors text-sm whitespace-nowrap"
            >
              тех. документ
              <DownloadIcon />
            </a>
          )}
          {!techDocUrl && (
            <button className="flex-shrink-0 flex items-center gap-1 text-white/60 hover:text-white/50 transition-colors text-sm whitespace-nowrap">
              тех. документ
              <DownloadIcon />
            </button>
          )}
        </div>

        {/* Производительность */}
        {showFlow && (
          <div className="flex items-center gap-1.5">
            <SpeedIcon />
            <span className="text-white text-[13px]">{flow}</span>
          </div>
        )}

        {/* Цена + В корзину */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-white font-semibold text-[18px]">
            {price} <span className="ml-2 font-normal text-[#7a563e]">₽</span>
          </span>
          <Button variant="calculator">Подробнее</Button>
        </div>
      </div>
    </article>
    </Wrapper>
  )
}


