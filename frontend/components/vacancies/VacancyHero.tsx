import Image from 'next/image'
import PersonIcon from '@/components/icons/PersonIcon'

const CardContent = () => (
  <>
    <PersonIcon />
    <h2 className="text-white text-2xl md:text-3xl font-medium leading-snug">
      Работа в команде<br />профессионалов
    </h2>
    <p className="text-white/70 text-sm leading-relaxed">
      Мы создаём надёжное оборудование для безопасности людей. Ищем тех, кто разделяет наши ценности — ответственность, точность и системный подход.
    </p>
  </>
)

export default function VacancyHero() {
  return (
    <section className="max-w-[1440px] mx-auto pb-4 lg:pb-6">

      {/* ── МОБИЛЬНАЯ версия ── */}
      <div className="md:hidden">
        <div className="relative w-full" style={{ height: 268 }}>
          <Image
            src="/images/vacancy.png"
            alt="Вакансии БРИАРЕЙ"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        <div
          className="relative z-10 mx-auto flex flex-col gap-3 px-4 py-5 -mt-[130px]"
          style={{ width: '90%', background: '#3f3f3f' }}
        >
          <CardContent />
        </div>
      </div>

      {/* ── DESKTOP версия ── */}
      <div
        className="hidden md:block relative rounded-2xl overflow-hidden mx-4 md:mx-8 lg:mx-14"
        style={{ minHeight: 590 }}
      >
        <Image
          src="/images/vacancy.png"
          alt="Вакансии БРИАРЕЙ"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" />
        <div
          className="absolute top-1/2 -translate-y-1/2 right-12 lg:right-16
                     w-[90%] max-w-[380px] p-8 flex flex-col gap-4"
          style={{ background: '#3f3f3f' }}
        >
          <CardContent />
        </div>
      </div>

    </section>
  )
}
