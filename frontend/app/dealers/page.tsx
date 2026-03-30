import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import DealerHero from '@/components/dealers/DealerHero'
import DealerSteps from '@/components/dealers/DealerSteps'
import AdvantagesSection from '@/components/AdvantagesSection'
import ContactForm from '@/components/ContactForm'
import { api } from '@/lib/api'

export const metadata = {
  title: 'Дилерам | БРИАРЕЙ',
  description: 'Станьте дилером БРИАРЕЙ — ведущего производителя оборудования газодымоудаления.',
}

export default async function DealersPage() {
  const data = await api.getDealers().catch(() => null)

  return (
    <>
      <Header />
      <main>
        <PageHeading title="Дилерам" />
        <DealerHero data={data?.page} />
        <DealerSteps steps={data?.steps} />
        <AdvantagesSection
          title="Станьте нашим дилером"
          subtitle={<>Надёжное оборудование,<br />выгодные условия партнёрства</>}
        />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
