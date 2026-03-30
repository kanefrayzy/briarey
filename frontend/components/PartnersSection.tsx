import Image from 'next/image'
import { storageUrl, type Partner } from '@/lib/api'

const defaultPartners = [
  { name: 'Партнёр 1', logo: '/images/partner-1.svg' },
  { name: 'Партнёр 2', logo: '/images/partner-2.svg' },
  { name: 'Партнёр 3', logo: '/images/partner-3.svg' },
  { name: 'Партнёр 4', logo: '/images/partner-4.svg' },
  { name: 'Партнёр 5', logo: '/images/partner-5.svg' },
  { name: 'Партнёр 6', logo: '/images/partner-6.svg' },
]

interface PartnersSectionProps {
  partners?: Partner[]
}

export default function PartnersSection({ partners: apiPartners }: PartnersSectionProps) {
  const items = apiPartners?.length
    ? apiPartners.map(p => ({ name: p.name, logo: storageUrl(p.logo), url: p.url }))
    : defaultPartners
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 pt-12 pb-4">

      {/* Заголовок вне блока — только мобилка */}
      <h2 className="block md:hidden text-2xl font-bold text-white mb-4 tracking-wider">Работаем с клиентами</h2>

      <div className="bg-[#2E2E2E] rounded-2xl p-6 md:p-8 lg:p-12">
        {/* Заголовок внутри блока — только десктоп */}
        <h2 className="hidden md:block text-2xl lg:text-4xl font-bold text-white mb-8 text-center tracking-wider">Работаем с клиентами</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {items.map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-center h-14 rounded-lg px-4"
            >
              <Image
                src={p.logo}
                alt={p.name}
                width={120}
                height={48}
                className="object-contain max-h-10 w-auto filter hover:brightness-100 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
