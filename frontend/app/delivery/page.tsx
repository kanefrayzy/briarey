import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PageHeading from '@/components/PageHeading'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Доставка',
  description: 'Условия доставки оборудования ООО «Бриарей»: по Москве и МО, транспортными компаниями по России и в ближнее зарубежье, самовывоз со склада в Раменском.',
  alternates: { canonical: '/delivery' },
}

const zones = [
  {
    title: 'Москва (в пределах МКАД)',
    text: 'Бесплатно — собственным автотранспортом компании.',
  },
  {
    title: 'Терминалы транспортных компаний в Москве',
    text: 'Бесплатная доставка до терминалов «Деловые Линии», ПЭК, «Байкал-Сервис» и аналогичных компаний.',
  },
  {
    title: 'Московская область',
    text: 'Условия оговариваются индивидуально. Доставка может быть бесплатной при благоприятном сочетании расстояния, суммы и объёма заказа.',
  },
  {
    title: 'Россия и ближнее зарубежье',
    text: 'Доставка транспортными компаниями по всей России, а также в Республику Беларусь, Республику Казахстан и др.',
  },
]

export default function DeliveryPage() {
  return (
    <>
      <Header />
      <main>
        <PageHeading title="Доставка" />

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-6">
          <p className="text-white/60 max-w-3xl leading-relaxed">
            Отгрузка и доставка осуществляются по рабочим дням; склад работает с 9:00 до 16:00.
            Ниже — основные условия доставки оборудования. По любым вопросам логистики свяжитесь
            с нами — поможем выбрать оптимальный способ под ваш заказ.
          </p>
        </section>

        <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {zones.map((z) => (
              <div
                key={z.title}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <h3 className="text-white font-semibold text-lg mb-2">{z.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{z.text}</p>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-6 mt-4"
            style={{ background: 'rgba(122,86,62,0.12)', border: '1px solid #7a563e' }}
          >
            <h3 className="text-white font-semibold text-lg mb-2">Самовывоз</h3>
            <p className="text-white/65 text-sm leading-relaxed">
              Возможен со склада в г. Раменское (Московская область) по рабочим дням с 9:00 до 16:00.
              Межтерминальная доставка «Москва — конечный пункт назначения» оплачивается получателем
              в терминале либо входит в стоимость оборудования по согласованию.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6 text-sm">
            <a href="tel:+74997137079" className="text-white/70 hover:text-white transition-colors">
              Логистика: <span className="text-white">+7 (499) 713-70-79</span>
            </a>
            <a href="mailto:info@briarey.ru" className="text-white/70 hover:text-white transition-colors">
              E-mail: <span className="text-white">info@briarey.ru</span>
            </a>
            <span className="text-white/70">
              Склад: <span className="text-white">МО, г. Раменское, ул. 100-й Свирской Дивизии, д.11</span>
            </span>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
