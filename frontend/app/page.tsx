import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import SmokeOverlay from '@/components/SmokeOverlay'
import SliderSection from '@/components/SliderSection'
import SmartPickSection from '@/components/SmartPickSection'
import CatalogSection from '@/components/CatalogSection'
import AdvantagesSection from '@/components/AdvantagesSection'
import ProductionSection from '@/components/ProductionSection'
import WorkScheme from '@/components/WorkScheme'
import FAQSection from '@/components/FAQSection'
import PartnersSection from '@/components/PartnersSection'
import NewsSection from '@/components/NewsSection'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'
import { api } from '@/lib/api'


export default async function HomePage() {
  const [data, newsData, categories, products] = await Promise.all([
    api.getHome().catch(() => null),
    api.getNews(1, 4).catch(() => null),
    api.getCategories().catch(() => null),
    api.getProducts('dymososy').catch(() => null),
  ])

  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <HeroSection data={data?.hero} />

        {/* 2. Slider */}
        <SliderSection slides={data?.slides} />

        {/* 3. Smart Pick */}
        <SmartPickSection data={data?.smart_pick} />

        {/* 4. Catalog */}
        <CatalogSection apiCategories={categories ?? undefined} apiProducts={products ?? undefined} />

        {/* 4. Production */}
        <ProductionSection
          section={data?.production_section}
          features={data?.production_features}
        />


        {/* 3. Advantages */}
        <AdvantagesSection advantages={data?.advantages} />

        {/* 5. Work Scheme */}
        <WorkScheme steps={data?.work_steps} />

        {/* 6. Partners */}
        <PartnersSection partners={data?.partners} />

        {/* 7. FAQ */}
        <FAQSection faqs={data?.faqs} />

        {/* 8. News */}
        <NewsSection news={newsData?.data} />

        {/* 9. Contact form */}
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
