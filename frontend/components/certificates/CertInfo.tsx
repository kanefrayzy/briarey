const columns = [
  {
    title: 'Производство и стандарты качества',
    text: 'При выборе оборудования дымоудаления важно убедиться, что изделие прослужит долго и не подведёт в нужный момент. Для этого существует сертификация противопожарного оборудования дымоудаления.',
  },
  {
    title: 'Опыт, разработки и отраслевые проекты',
    text: 'На все оборудование Бриарей имеются действующие сертификаты соответствия нормативным документам. Также есть дополнительное оборудование, на которое не предусмотрена обязательная сертификация. Для таких позиций в этом разделе есть отказные письма.',
  },
]

export default function CertInfo() {
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 py-8 lg:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="text-white font-bold text-lg md:text-xl lg:text-2xl leading-snug">{col.title}</h3>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">{col.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
