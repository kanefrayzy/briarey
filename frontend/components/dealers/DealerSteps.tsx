import { DealerStep } from '@/lib/api'

const defaultSteps = [
  {
    num: '01',
    title: 'Обмен информацией',
    desc: 'Онлайн-калькулятор или консультация инженера.',
  },
  {
    num: '02',
    title: 'Считаем вашу выгоду',
    desc: 'Счёт или КП в течение рабочего дня.',
  },
  {
    num: '03',
    title: 'Заключаем договор',
    desc: 'Стандартные изделия — со склада.',
  },
]

interface DealerStepsProps {
  steps?: DealerStep[]
}

export default function DealerSteps({ steps: apiSteps }: DealerStepsProps) {
  const steps = apiSteps?.length
    ? apiSteps.map((s, i) => ({
        num: String(i + 1).padStart(2, '0'),
        title: s.title,
        desc: s.description,
      }))
    : defaultSteps
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 py-10 lg:py-16">
      <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {steps.map((step) => (
          <div key={step.num} className="flex flex-col gap-1 md:gap-2">
            <span
              className="text-[40px] md:text-[72px] lg:text-[100px] font-medium leading-none"
              style={{ color: '#637c8f' }}
            >
              {step.num}
            </span>
            <h3 className="text-white font-semibold text-xs md:text-base lg:text-lg leading-snug">{step.title}</h3>
            <p className="text-white/60 text-[11px] md:text-sm leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
