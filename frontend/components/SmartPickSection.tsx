'use client'

import Image from 'next/image'
import Button from './Button'
import ScrollDownIcon from './icons/ScrollDownIcon'
import { storageUrl, type SmartPickSection as SmartPickData } from '@/lib/api'

interface SmartPickSectionProps {
  data?: SmartPickData
}

export default function SmartPickSection({ data }: SmartPickSectionProps) {
  const title = data?.title || 'Умный подбор\nоборудования'
  const description = data?.description || 'Онлайн-калькулятор учитывает параметры помещения и нормативы.\n    Точно просчитает ваш проект и предложит вам набор, необходимый\n    для вашего объекта'
  const buttonText = data?.button_text || 'Калькулятор'
  const buttonLink = data?.button_link || '/calculator'
  const image = data?.image ? storageUrl(data.image) : '/images/Phone.png'

  const scrollToNext = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="w-full">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-14 py-10 lg:py-20 flex flex-row lg:flex-row items-center justify-center gap-6 lg:gap-24">

        {/* ─── Левая часть ─── */}
        <div className="flex flex-col gap-4 lg:gap-6 max-w-[480px] w-full">
          <h2 className="text-2xl lg:text-[52px] font-bold text-white leading-[1.1]" style={{ whiteSpace: 'pre-line' }}>
            {title}
          </h2>

          <p className="text-white/55 text-xs lg:text-[15px] leading-relaxed lg:leading-loose">
            {description}
          </p>

          <Button href={buttonLink} variant="calculator">
            {buttonText}
          </Button>

          <button
            onClick={scrollToNext}
            className="hidden lg:block transition-opacity hover:opacity-70"
            aria-label="Перейти к следующей секции"
          >
            <ScrollDownIcon />
          </button>
        </div>

        {/* ─── Правая часть — телефон ─── */}
        <div
          className="flex-shrink-0 relative animate-bounce-slow"
          style={{ width: 'clamp(120px, 28vw, 300px)', height: 'clamp(216px, 50vw, 540px)' }}
        >
          <Image
            src={image}
            alt="Калькулятор оборудования"
            fill
            className="object-contain"
          />
        </div>

      </div>
    </section>
  )
}
