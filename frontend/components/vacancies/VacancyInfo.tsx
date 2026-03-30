const columns = [
  {
    title: 'Производство и стандарты качества',
    text: 'Мы — компания, которая занимается производством и поставкой противопожарного оборудования. Наша миссия — повышать уровень безопасности и защищать жизни людей.',
  },
  {
    title: 'Опыт, разработки и отраслевые проекты',
    text: 'Если вам близки ответственность, точность и системный подход — будем рады видеть вас в нашей команде.',
  },
]

export default function VacancyInfo() {
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
