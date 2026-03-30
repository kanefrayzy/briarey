import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import CartView from '@/components/cart/CartView'

export const metadata = {
  title: 'Корзина | БРИАРЕЙ',
  description: 'Ваша корзина — оформите заказ на оборудование БРИАРЕЙ.',
}

export default function CartPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeading title="Корзина" />
        <CartView />
      </main>
      <Footer />
    </>
  )
}
