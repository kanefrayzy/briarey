import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CatalogGrid from '@/components/catalog/CatalogGrid'
import SmartPickSection from '@/components/SmartPickSection'
import ContactForm from '@/components/ContactForm'
import { api } from '@/lib/api'

export const metadata = {
  title: 'Каталог оборудования',
  description: 'Каталог противопожарного оборудования от производителя ООО «Бриарей»: дымососы, узлы стыковочные, клапаны.',
  alternates: { canonical: '/catalog' },
}

export default async function CatalogPage() {
  const categories = await api.getCategories().catch(() => null)

  return (
    <>
      <Header />
      <main style={{ background: '#242424', paddingTop: 80 }}>
        <CatalogGrid apiCategories={categories ?? undefined} />
        <SmartPickSection />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
