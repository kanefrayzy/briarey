const columns = [
  {
    title: 'Стабильная производственная компания',
    text: 'БРИАРЕЙ 15 лет разрабатывает и производит противопожарное оборудование. У нас собственное производство, отлаженные рабочие процессы и понятные задачи.',
  },
  {
    title: 'Работа и развитие',
    text: 'Ценим ответственность и желание работать. Помогаем освоиться на новом месте, обучаем в процессе работы и поддерживаем профессиональный рост сотрудников.',
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
