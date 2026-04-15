import Link from 'next/link'
import Image from 'next/image'
import { CalculatorCta, storageUrl } from '@/lib/api'

interface CalculatorCTAProps {
  data?: CalculatorCta
}

export default function CalculatorCTA({ data }: CalculatorCTAProps) {
  const title = data?.title || 'Подбор комплекта за'
  const highlight = data?.title_highlight || '2 минуты'
  const description = data?.description || 'Начните с удобного расчёта необходимого оборудования для вашего объекта! Онлайн-калькулятор или консультация инженера.'
  const buttonText = data?.button_text || 'Калькулятор'
  const buttonLink = data?.button_link || '/calculator'
  const image = data?.image ? storageUrl(data.image) : null

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-8">
      <div className="bg-[#2E2E2E] rounded-xl overflow-hidden flex flex-col lg:flex-row items-center gap-8 p-8 lg:p-12">
        {/* Image */}
        <div className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0 relative">
          {image ? (
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image src={image} alt={title} fill className="object-cover" sizes="384px" />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-[#3F3F3F] rounded-lg" />
          )}
        </div>

        {/* Text + CTA */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
            {title}<br />
            <span className="text-brand-blue">{highlight}</span>
          </h2>
          <p className="text-brand-gray text-base leading-relaxed max-w-[480px]">
            {description}
          </p>
          <div className="mt-2">
            <Link
              href={buttonLink}
              className="inline-flex bg-brand-golden hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
