'use client'

import Image from 'next/image'
import Button from '@/components/Button'

interface VacancyContactProps {
  /** Есть ли сейчас открытые вакансии — от этого зависит текст */
  hasVacancies?: boolean
}

export default function VacancyContact({ hasVacancies = false }: VacancyContactProps) {
  const tellAboutYourself = () => {
    try {
      sessionStorage.setItem(
        'contactFormPrefill',
        JSON.stringify({
          topic: 'Другое',
          message: 'Здравствуйте! Хочу рассказать о себе и рассмотреть работу в БРИАРЕЙ. ',
        })
      )
    } catch {
      /* хранилище недоступно — форма просто откроется пустой */
    }
    window.location.href = '/#contact-form'
  }

  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-12 md:pb-16 lg:pb-24">
      <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 420 }}>
        {/* Фоновое изображение */}
        <Image
          src="/images/dealer/dealer.png"
          alt="Хотите работать с нами?"
          fill
          className="object-cover"
        />
        {/* Затемнение */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Контент строго по центру */}
        <div className="relative flex flex-col items-center justify-center text-center gap-5 px-6 py-16" style={{ minHeight: 420 }}>
          <h2 className="text-white text-2xl md:text-3xl font-semibold leading-snug tracking-wide">
            Хотите работать с нами?
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-xl">
            {hasVacancies
              ? 'Посмотрите открытые вакансии или расскажите о себе. Если сейчас подходящей позиции нет, мы сможем вернуться к вашему резюме, когда она появится.'
              : 'Открытых вакансий сейчас нет, но вы можете рассказать о себе. Мы вернёмся к вашему резюме, когда появится подходящая позиция.'}
          </p>
          <Button variant="catalog" onClick={tellAboutYourself}>
            Рассказать о себе
          </Button>
        </div>
      </div>
    </section>
  )
}
