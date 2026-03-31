import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import AboutBlock from '@/components/about/AboutBlock'
import SliderSection from '@/components/SliderSection'
import ProductionSection from '@/components/ProductionSection'
import AboutPhotoSlider from '@/components/about/AboutPhotoSlider'
import AdvantagesSection from '@/components/AdvantagesSection'
import ContactForm from '@/components/ContactForm'
import { api, storageUrl } from '@/lib/api'

export const metadata = {
  title: 'О компании | БРИАРЕЙ',
  description:
    'ООО «БРИАРЕЙ» — ведущий российский производитель оборудования газодымоудаления. ISO 9001, собственное производство, патенты.',
}

export default async function AboutPage() {
  const [data, homeData] = await Promise.all([
    api.getAbout().catch(() => null),
    api.getHome().catch(() => null),
  ])

  const aboutData = data?.page ? {
    videoUrl: data.page.video_url || undefined,
    posterUrl: data.page.poster_image ? storageUrl(data.page.poster_image) : undefined,
    columns: [
      { title: data.page.column_1_title, text: data.page.column_1_text },
      { title: data.page.column_2_title, text: data.page.column_2_text },
    ],
  } : {}

  const photos = data?.photos?.length
    ? data.photos.map(p => ({ src: storageUrl(p.image), alt: p.alt || 'Производство БРИАРЕЙ' }))
    : undefined

  return (
    <>
      <Header />
      <main>
        {/* 1. Заголовок страницы — только на desktop */}
        <div className="hidden md:block">
          <PageHeading title="О компании" />
        </div>

        {/* 2–3. Видео-блок + слайдер — только на desktop */}
        <div className="hidden md:block">
          <AboutBlock
            videoUrl={aboutData.videoUrl}
            posterUrl={aboutData.posterUrl}
            columns={aboutData.columns}
          />
          <SliderSection showSmoke={false} slides={homeData?.slides} />
        </div>

        {/* 4. Производство */}
        <ProductionSection
          section={homeData?.production_section}
          features={homeData?.production_features}
          hideButton
        />

        {/* 5. Фотослайдер производства */}
        <AboutPhotoSlider photos={photos} />

        {/* 6. Преимущества компании */}
        <AdvantagesSection advantages={homeData?.advantages} />

        {/* 7. Заявка */}
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
