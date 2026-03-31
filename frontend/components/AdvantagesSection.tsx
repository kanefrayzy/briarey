import SectionHeading from './SectionHeading'
import Image from 'next/image'
import { ReactNode } from 'react'
import AdvantagesArrowIcon from './icons/AdvantagesArrowIcon'
import AdvantagesShieldIcon from './icons/AdvantagesShieldIcon'
import AdvantagesCpuIcon from './icons/AdvantagesCpuIcon'
import AdvantagesCircleIcon from './icons/AdvantagesCircleIcon'
import type { Advantage } from '@/lib/api'

const DEFAULT_ICONS = [
  <AdvantagesArrowIcon key="arrow" />,
  <AdvantagesShieldIcon key="shield" />,
  <AdvantagesCpuIcon key="cpu" />,
  <AdvantagesCircleIcon key="circle" />,
]

const defaultAdvantages = [
  {
    title: 'Быстрая отгрузка 1–3 дня',
    desc: 'Оперативная комплектация и отправка оборудования со склада. Сокращение сроков реализации проекта и простоев на объекте.',
    icon: <AdvantagesArrowIcon />,
  },
  {
    title: 'Высокая надежность в эксплуатации',
    desc: 'Оборудование рассчитано на интенсивную работу и реальные аварийные режимы. Проверенные решения, применяемые на промышленных и инженерных объектах.',
    icon: <AdvantagesShieldIcon />,
  },
  {
    title: 'Поддержка проектировщиков (Revit/AutoCAD)',
    desc: 'Предоставляем модели, схемы и технические данные для включения в проект. Упрощаем работу проектных организаций и ускоряем согласование.',
    icon: <AdvantagesCpuIcon />,
  },
  {
    title: 'Инженерная консультация / нестандартные решения',
    desc: 'Помогаем подобрать оборудование под конкретный объект и требования СП. Разбираем нестандартные ситуации и даём практические рекомендации.',
    icon: <AdvantagesCircleIcon />,
  },
]

interface AdvantagesSectionProps {
  title?: string
  subtitle?: ReactNode | null
  bgImagePosition?: string
  advantages?: Advantage[]
}

export default function AdvantagesSection({
  title = 'Преимущества компании',
  subtitle = <>Отказоустойчивые дымососы,<br />узлы, клапаны и системы</>,
  bgImagePosition = 'top center',
  advantages: apiAdvantages,
}: AdvantagesSectionProps = {}) {
  const items = apiAdvantages?.length
    ? apiAdvantages.map((a, i) => ({ title: a.title, desc: a.description, icon: DEFAULT_ICONS[i % DEFAULT_ICONS.length] }))
    : defaultAdvantages
  return (
    <section
      className="relative bg-[#242424]"
      style={{ maxWidth: 1440, margin: '0 auto' }}
    >
      {/* Фоновая картинка только на десктопе */}
      <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/hero-catalog.png"
          fill
          className="object-contain"
          style={{ objectPosition: bgImagePosition }}
          alt=""
          aria-hidden
        />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-4 lg:px-14 py-10 lg:py-24">

        {/* Заголовок */}
        <SectionHeading
          title={title}
          subtitle={subtitle}
          align="start"
          mb="mb-8 lg:mb-12"
          titleClass="text-2xl lg:text-5xl font-bold text-white leading-tight"
          subtitleClass="text-white text-base text-right mt-2 leading-relaxed"
        />

        {/* Карточки */}
        <div className="flex flex-col md:flex-row">
          {items.map((adv, i) => (
            <div
              key={adv.title}
              className={[
                'flex-1 p-5 md:p-6 flex flex-col gap-4 md:justify-between min-h-[265px] md:h-[480px]',
                i === 0                     ? 'rounded-t-xl md:rounded-none md:rounded-l-[10px]' : '',
                i === items.length - 1 ? 'rounded-b-xl md:rounded-none md:rounded-r-[10px]' : '',
              ].join(' ')}
              style={{ background: i % 2 === 0 ? '#1D1D1D' : '#2e2e2e' }}
            >
              <div className="w-[37px] h-[37px] md:w-auto md:h-auto [&>svg]:w-full [&>svg]:h-full md:[&>svg]:w-auto md:[&>svg]:h-auto">{adv.icon}</div>
              <div className="flex flex-col gap-1.5 md:gap-3">
                <h3 className="text-white font-medium lg:font-bold text-base md:text-xl leading-snug md:leading-relaxed">{adv.title}</h3>
                <p className="text-white/50 text-[12px] md:text-[18px] leading-relaxed md:leading-loose">{adv.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

