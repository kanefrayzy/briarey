import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import ContactForm from '@/components/ContactForm'
import CalculatorQuiz from '@/components/calculator/CalculatorQuiz'

export const metadata: Metadata = {
  title: 'Калькулятор подбора дымососа — Бриарей',
  description:
    'Подберите дымосос для систем дымоудаления по объёму помещения, скорости удаления и конфигурации линий.',
}

export default function CalculatorPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#242424', paddingTop: 80 }}>
        <PageHeading title="Подбор дымососа" />

        {/* Описание */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-8">
          <p className="text-white/50 max-w-xl leading-relaxed">
            Ответьте на несколько вопросов — мы подберём оборудование под требования
            проекта и покажем реальные модели из каталога.
          </p>
        </div>

        {/* Квиз */}
        <section
          className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-20"
        >
          <div
            className="rounded-2xl p-6 md:p-10"
            style={{ background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <CalculatorQuiz />
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
