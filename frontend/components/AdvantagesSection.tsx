import SectionHeading from './SectionHeading'
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
    title: 'Отгрузка базовых позиций 1–3 дня',
    desc: 'Основные позиции поддерживаем в наличии. Для базового оборудования — оперативная комплектация и отгрузка в течение 1–3 рабочих дней после оплаты счёта.',
    icon: <AdvantagesArrowIcon />,
  },
  {
    title: 'Высокая надежность в эксплуатации',
    desc: 'Оборудование рассчитано на интенсивную работу и реальные аварийные режимы. Проверенные решения, применяемые на промышленных и инженерных объектах.',
    icon: <AdvantagesShieldIcon />,
  },
  {
    title: 'Документация для проектировщиков',
    desc: 'Предоставляем технические материалы, BIM-модели и блоки AutoCAD для включения оборудования в проект.',
    icon: <AdvantagesCpuIcon />,
  },
  {
    title: 'Консультация по подбору оборудования',
    desc: 'Помогаем дистанционно подобрать оборудование под параметры объекта. Для предварительного расчёта доступен онлайн-калькулятор, для нестандартных задач — консультация специалиста.',
    icon: <AdvantagesCircleIcon />,
  },
]

export interface AdvantageItem {
  title: string
  desc: string
  icon?: ReactNode
  /** Кнопки под текстом карточки (например, «Рассчитать оборудование») */
  actions?: ReactNode
}

interface AdvantagesSectionProps {
  title?: string
  subtitle?: ReactNode | null
  /** Строка над заголовком — например, «15 лет производим оборудование…» */
  eyebrow?: ReactNode
  bgImagePosition?: string
  advantages?: Advantage[]
  /** Явный список карточек (страницы «Дилерам» и «Вакансии») */
  items?: AdvantageItem[]
  /** Свой набор иконок для явного списка */
  icons?: ReactNode[]
}

export default function AdvantagesSection({
  title = 'Преимущества компании',
  subtitle = <>Надёжные дымососы,<br />узлы, клапаны и системы</>,
  eyebrow,
  bgImagePosition = 'top center',
  advantages: apiAdvantages,
  items: explicitItems,
  icons,
}: AdvantagesSectionProps = {}) {
  const iconSet = icons?.length ? icons : DEFAULT_ICONS
  const items: AdvantageItem[] = explicitItems?.length
    ? explicitItems.map((item, i) => ({ ...item, icon: item.icon ?? iconSet[i % iconSet.length] }))
    : apiAdvantages?.length
      ? apiAdvantages.map((a, i) => ({ title: a.title, desc: a.description, icon: iconSet[i % iconSet.length] }))
      : defaultAdvantages
  return (
    <section
      className="relative bg-[#242424]"
      style={{ maxWidth: 1440, margin: '0 auto' }}
    >
      {/* Фоновая картинка только на десктопе */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none"
        style={{ background: `url('/images/hero-catalog.webp') ${bgImagePosition} no-repeat`, backgroundSize: 'contain' }}
      />

      <div className="relative max-w-[1440px] mx-auto px-4 lg:px-14 py-10 lg:py-24">

        {/* Надзаголовок */}
        {eyebrow && (
          <p className="text-white/50 text-sm md:text-base leading-relaxed mb-3 lg:mb-4 max-w-2xl">
            {eyebrow}
          </p>
        )}

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
                {adv.actions && <div className="flex flex-col gap-2 mt-1 md:mt-2">{adv.actions}</div>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

