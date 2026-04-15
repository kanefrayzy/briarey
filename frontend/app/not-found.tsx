import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        className="flex flex-col items-center justify-center text-center px-4"
        style={{ background: '#242424', paddingTop: 120, paddingBottom: 120, minHeight: '70vh' }}
      >
        <h1 className="text-white text-6xl lg:text-8xl font-bold mb-4">404</h1>
        <p className="text-white/60 text-lg lg:text-xl mb-8 max-w-md">
          Страница не найдена. Возможно, она была удалена или вы перешли по неверной ссылке.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button href="/" variant="calculator">
            На главную
          </Button>
          <Button href="/catalog" variant="outline">
            Каталог оборудования
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
