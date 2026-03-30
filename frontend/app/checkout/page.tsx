import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import CatalogSection from '@/components/CatalogSection'

export const metadata = {
  title: 'Оформление заказа | БРИАРЕЙ',
  description: 'Оформите заказ на оборудование БРИАРЕЙ.',
}

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main style={{ background: '#242424' }}>
        <PageHeading title="Оформление заказа" />
        <CheckoutForm />
        <CatalogSection noBgImage />
      </main>
      <Footer />
    </>
  )
}
