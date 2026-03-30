import Image from 'next/image'
import Button from '@/components/Button'
import type { Vacancy } from '@/data/vacancies'

function VacancyCard({ title, salary, duties, image, link }: Omit<Vacancy, 'id'>) {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-[#333333]">
      {/* Фото */}
      <div className="relative w-full" style={{ height: 220 }}>
        <Image src={image} alt={title} fill className="object-cover p-4 rounded-3xl" />
      </div>

      {/* Контент */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="text-white font-bold text-lg leading-snug">{title}</h3>

        <p className="text-sm">
          <span className="text-white font-medium">Зарплата: </span>
          <span className="font-medium text-base text-[#7A563E]">{salary}</span>
        </p>

        <div className="flex flex-col gap-1">
          <p className="text-white text-sm font-bold">Обязанности:</p>
          <p className="text-white/60 text-sm leading-relaxed">{duties}</p>
        </div>

        <div className="mt-auto pt-2">
          <Button variant="calculator" href={link}>
            Перейти к вакансии
          </Button>
        </div>
      </div>
    </div>
  )
}

interface VacancyGridProps {
  vacancies: Vacancy[]
}

export default function VacancyGrid({ vacancies }: VacancyGridProps) {
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 py-10 lg:py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vacancies.map((v) => (
          <VacancyCard key={v.id} {...v} />
        ))}
      </div>
    </section>
  )
}
