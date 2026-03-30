import SectionHeading from './SectionHeading'
import type { WorkStep } from '@/lib/api'

const defaultSteps = [
  {
    num: '01',
    title: 'Подбор оборудования',
    desc: 'Онлайн-калькулятор или консультация инженера.',
  },
  {
    num: '02',
    title: 'Коммерческое предложение',
    desc: 'Счёт или КП в течение рабочего дня.',
  },
  {
    num: '03',
    title: 'Производство и комплектация',
    desc: 'Стандартные изделия — со склада.',
  },
  {
    num: '04',
    title: 'Отгрузка и доставка по РФ',
    desc: 'Москва — бесплатно до ТК.',
  },
]

interface WorkSchemeProps {
  steps?: WorkStep[]
}

export default function WorkScheme({ steps: apiSteps }: WorkSchemeProps) {
  const items = apiSteps?.length
    ? apiSteps.map((s, i) => ({
        num: String(i + 1).padStart(2, '0'),
        title: s.title,
        desc: s.description,
      }))
    : defaultSteps
  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-14 py-12 lg:py-24">
      {/* Заголовок */}
      <SectionHeading
        title="Схема работы"
        subtitle="Реальный производитель"
        subtitleClass="text-brand-gray text-base text-right mt-2"
      />

      {/* Шаги */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((step) => (
          <div key={step.num} className="flex flex-col items-center lg:items-start gap-2 text-center lg:text-left">
            <span className="text-[64px] lg:text-[120px] font-medium leading-none" style={{ color: '#7a563e' }}>{step.num}</span>
            <h3 className="text-white font-semibold text-sm lg:text-base">{step.title}</h3>
            <p className="text-white/60 text-xs lg:text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
