import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import PageHeading from '@/components/PageHeading'
import DealerHero from '@/components/dealers/DealerHero'
import DealerSteps from '@/components/dealers/DealerSteps'
import DealerPositioning from '@/components/dealers/DealerPositioning'
import AdvantagesSection, { AdvantageItem } from '@/components/AdvantagesSection'
import ContactForm from '@/components/ContactForm'
import { api } from '@/lib/api'

export const metadata = {
  title: 'Дилерам',
  description: 'Продукция БРИАРЕЙ в вашем ассортименте: оборудование для газо- и дымоудаления российского производства.',
  alternates: { canonical: '/dealers' },
}

const DEALER_ADVANTAGES: AdvantageItem[] = [
  {
    title: '95% ассортимента — собственное производство',
    desc: 'Контролируем основные этапы производства и качество оборудования. Партнёр работает напрямую с производителем, а не с промежуточным поставщиком.',
  },
  {
    title: 'Базовые позиции — отгрузка 1–3 дня',
    desc: 'Основные позиции поддерживаем в наличии. Для базового оборудования возможна оперативная комплектация и отгрузка после оплаты счёта.',
  },
  {
    title: 'Документация для проектировщиков',
    desc: 'Предоставляем технические материалы, BIM-модели и блоки AutoCAD для включения оборудования в проект.',
  },
  {
    title: 'Консультация по подбору оборудования',
    desc: 'Помогаем дистанционно подобрать оборудование под параметры объекта. Для предварительного расчёта доступен онлайн-калькулятор, для нестандартных задач — консультация специалиста.',
    actions: (
      <>
        <Button variant="calculator" href="/calculator" className="w-full md:w-auto md:self-start">
          Рассчитать оборудование
        </Button>
        <Button variant="outline" href="#contact-form" className="w-full md:w-auto md:self-start">
          Связаться со специалистом
        </Button>
      </>
    ),
  },
]

export default async function DealersPage() {
  const data = await api.getDealers().catch(() => null)

  return (
    <>
      <Header />
      <main>
        <PageHeading title="Дилерам" />
        <DealerHero data={data?.page} />
        <DealerPositioning />
        <DealerSteps steps={data?.steps} />
        <AdvantagesSection
          title="Станьте нашим дилером"
          eyebrow="15 лет производим оборудование для профессиональных систем газо- и дымоудаления"
          subtitle={<>Российское производство.<br />Партнёрство для профессионального рынка.</>}
          items={DEALER_ADVANTAGES}
        />
        <ContactForm
          title="Предложите сотрудничество"
          description="Если вы работаете с противопожарным, инженерным или промышленным оборудованием и видите потенциал продукции БРИАРЕЙ на своём рынке — расскажите, как вы предлагаете выстроить сотрудничество."
          messageLabel="Ваше предложение о сотрудничестве"
          messageHint="Регион работы, каналы продаж, предполагаемый объём, целевые клиенты и предлагаемая модель сотрудничества."
          submitLabel="Отправить предложение"
          showInn={false}
          lockedTopic="Дилерское сотрудничество"
          note="Рассматриваем каждое предложение индивидуально."
        />
      </main>
      <Footer />
    </>
  )
}
