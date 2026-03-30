'use client'

import Link from 'next/link'
import { useState } from 'react'
import Button from './Button'
import PlusIcon from './icons/PlusIcon'
import MinusIcon from './icons/MinusIcon'
import type { Faq } from '@/lib/api'

const defaultFaqs = [
  {
    q: 'На каком расстоянии от пола и потолка монтировать узлы стыковочные?',
    a: 'Согласно нормативам, узлы стыковочные монтируются на высоте от 0,3 до 0,5 м от пола и не менее 0,2 м от потолка. Точные параметры зависят от типа объекта и требований проекта.',
  },
  {
    q: 'Есть ли пожарный сертификат на клапаны сброса избыточного давления КСИД?',
    a: 'Да, на все наши клапаны КСИД имеются пожарные сертификаты соответствия требованиям ГОСТ и технических регламентов. Документы предоставляются по запросу.',
  },
  {
    q: 'На каком расстоянии от пола и потолка монтировать узлы стыковочные?',
    a: 'Согласно нормативам, узлы стыковочные монтируются на высоте от 0,3 до 0,5 м от пола и не менее 0,2 м от потолка.',
  },
  {
    q: 'Как рукава соединяются между собой?',
    a: 'Рукава соединяются с помощью стыковочных муфт из нашей системы. Соединение герметично и обеспечивает необходимую производительность.',
  },
]

interface FAQSectionProps {
  faqs?: Faq[]
}

export default function FAQSection({ faqs: apiFaqs }: FAQSectionProps) {
  const items = apiFaqs?.length
    ? apiFaqs.map(f => ({ q: f.question, a: f.answer }))
    : defaultFaqs

  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 lg:pt-0 pb-10 md:pb-16">

      {/* ── MOBILE ── */}
      <div className="block md:hidden">
        <h2 className="text-2xl font-bold text-white tracking-wider mb-1">Частые вопросы</h2>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          Тут вы найдёте ответы на часто задаваемые вопросы
        </p>

        {/* Аккордеон без фона */}
        <div className="flex flex-col divide-y divide-white/10">
          {items.map((faq, i) => (
            <div key={i} className="py-4">
              <button
                className="w-full flex items-start justify-between gap-4 text-left text-white font-medium text-sm hover:text-white/80 transition-colors"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                aria-expanded={openIdx === i}
              >
                <span className="flex items-center gap-3">
                  <span className="text-white/30 font-medium w-6 flex-shrink-0 text-2xl lg:text-sm lg:font-bold">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-medium text-base leading-snug lg:text-sm">{faq.q}</span>
                </span>
                <span className="flex-shrink-0 mt-0.5">
                  {openIdx === i ? (
                    <MinusIcon width={28} height={28} />
                  ) : (
                    <PlusIcon width={28} height={28} />
                  )}
                </span>
              </button>
              {openIdx === i && (
                <p className="mt-3 ml-9 text-white/50 text-sm leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* Кнопка после аккордеона */}
        <div className="mt-6">
          <Button href="/faq" variant="catalog" className="!max-w-none w-full !justify-center py-4 text-base">
            Больше информации
          </Button>
        </div>
      </div>

      {/* ── DESKTOP (без изменений) ── */}
      <div className="hidden md:block">
        <div className="bg-[#2E2E2E] rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row gap-12 items-center">
          {/* Left: heading + button */}
          <div className="lg:w-96 flex-shrink-0 flex flex-col gap-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-wider">Частые вопросы</h2>
            <p className="text-brand-gray text-sm leading-relaxed">
              Тут вы найдёте ответы на часто задаваемые вопросы
            </p>
            <Button href="/faq" variant="catalog">Больше информации</Button>
          </div>

          {/* Right: accordion */}
          <div className="flex-1 flex flex-col gap-0 divide-y divide-white/10">
            {items.map((faq, i) => (
              <div key={i} className="py-5">
                <button
                  className="w-full flex items-start justify-between gap-4 text-left text-white font-medium text-base hover:text-white/80 transition-colors"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  aria-expanded={openIdx === i}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-brand-darkgray font-bold w-6 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-medium tracking-wide text-base">{faq.q}</span>
                  </span>
                  <span className="flex-shrink-0 mt-0.5">
                    {openIdx === i ? (
                      <MinusIcon width={20} height={20} />
                    ) : (
                      <PlusIcon width={20} height={20} />
                    )}
                  </span>
                </button>
                {openIdx === i && (
                  <p className="mt-3 ml-9 text-brand-gray text-sm leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}
