import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import CertHero from '@/components/certificates/CertHero'
import CertInfo from '@/components/certificates/CertInfo'
import CertGrid from '@/components/certificates/CertGrid'
import { api, storageUrl } from '@/lib/api'

export const metadata = {
  title: 'Сертификаты и информация',
  description: 'Сертификаты и декларации соответствия продукции Бриарей.',
  alternates: { canonical: '/certificates' },
}

export default async function CertificatesPage() {
  const data = await api.getCertificates().catch(() => null)

  const certs = data?.certificates?.map(c => ({
    id: c.id,
    title: c.title,
    image: storageUrl(c.image),
    file: storageUrl(c.file),
  })) ?? []

  return (
    <>
      <Header />
      <main>
        <PageHeading title="Информация" />
        <CertHero />
        <CertInfo />
        <CertGrid certs={certs} />
      </main>
      <Footer />
    </>
  )
}
