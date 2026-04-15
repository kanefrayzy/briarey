import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import VacancyHero from '@/components/vacancies/VacancyHero'
import VacancyInfo from '@/components/vacancies/VacancyInfo'
import AdvantagesSection from '@/components/AdvantagesSection'
import VacancyGrid from '@/components/vacancies/VacancyGrid'
import VacancyContact from '@/components/vacancies/VacancyContact'
import { api, storageUrl } from '@/lib/api'

export const metadata = {
  title: 'Вакансии',
  description: 'Открытые вакансии в компании Бриарей — производителе оборудования газодымоудаления.',
  alternates: { canonical: '/vacancies' },
}

export default async function VacanciesPage() {
  const data = await api.getVacancies().catch(() => null)

  const vacancies = data?.vacancies?.map(v => ({
    id: v.id,
    title: v.title,
    salary: v.salary,
    duties: v.duties,
    image: storageUrl(v.image),
    link: v.link ?? '#',
  })) ?? []

  return (
    <>
      <Header />
      <main>
        <PageHeading title="Вакансии" />
        <VacancyHero />
        <VacancyInfo />
        <AdvantagesSection
          title="Станьте нашим дилером"
          subtitle={null}
          bgImagePosition="left top"
        />
        <VacancyGrid vacancies={vacancies} />
        <VacancyContact />
      </main>
      <Footer />
    </>
  )
}
