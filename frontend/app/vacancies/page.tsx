import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import VacancyHero from '@/components/vacancies/VacancyHero'
import VacancyInfo from '@/components/vacancies/VacancyInfo'
import VacancyTeam from '@/components/vacancies/VacancyTeam'
import AdvantagesSection, { AdvantageItem } from '@/components/AdvantagesSection'
import VacancyGrid from '@/components/vacancies/VacancyGrid'
import VacancyContact from '@/components/vacancies/VacancyContact'
import {
  VacancyContractIcon,
  VacancySalaryIcon,
  VacancyScheduleIcon,
  VacancyGrowthIcon,
} from '@/components/icons/VacancyIcons'
import { api, storageUrl } from '@/lib/api'

export const metadata = {
  title: 'Вакансии',
  description: 'Работа в БРИАРЕЙ: официальное оформление, стабильная зарплата и понятный рабочий график на собственном производстве.',
  alternates: { canonical: '/vacancies' },
}

const WORK_ADVANTAGES: AdvantageItem[] = [
  {
    title: 'Официально с первого дня',
    desc: 'ТК РФ, оплачиваемый отпуск, больничные и предусмотренные законом гарантии.',
  },
  {
    title: 'Зарплата точно в срок',
    desc: 'Стабильная заработная плата и аванс без задержек. Понятные условия оплаты труда.',
  },
  {
    title: 'Работа по понятным правилам',
    desc: 'Нормированный рабочий день, обеденный перерыв, поставленные задачи и отлаженные процессы.',
  },
  {
    title: 'Помогаем стать профессионалом',
    desc: 'Обучение в процессе работы, помощь опытных коллег и возможность повышать квалификацию.',
  },
]

const WORK_ICONS = [
  <VacancyContractIcon key="contract" />,
  <VacancySalaryIcon key="salary" />,
  <VacancyScheduleIcon key="schedule" />,
  <VacancyGrowthIcon key="growth" />,
]

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
          title="Работать в БРИАРЕЙ"
          subtitle={<>Официально. Стабильно.<br />В команде профессионалов.</>}
          bgImagePosition="left top"
          items={WORK_ADVANTAGES}
          icons={WORK_ICONS}
        />
        <VacancyTeam />
        {vacancies.length > 0 && <VacancyGrid vacancies={vacancies} />}
        <VacancyContact hasVacancies={vacancies.length > 0} />
      </main>
      <Footer />
    </>
  )
}
