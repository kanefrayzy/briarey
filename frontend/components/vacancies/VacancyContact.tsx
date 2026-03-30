import Image from 'next/image'
import Button from '@/components/Button'

export default function VacancyContact() {
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-12 md:pb-16 lg:pb-24">
      <div className="relative rounded-2xl overflow-hidden" style={{ height: 420 }}>
        {/* Фоновое изображение */}
        <Image
          src="/images/dealer/dealer.png"
          alt="Не нашли вакансию"
          fill
          className="object-cover"
        />
        {/* Затемнение */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Контент строго по центру */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-6 px-6">
          <h2 className="text-white text-2xl font-semibold leading-snug tracking-wider">
            Не нашли подходящую вакансию?
          </h2>
          <Button variant="catalog" href="#">
            Отправить резюме
          </Button>
        </div>
      </div>
    </section>
  )
}
