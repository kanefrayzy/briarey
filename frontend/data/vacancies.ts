export interface Vacancy {
  id: number
  title: string
  salary: string
  duties: string
  image: string
  link: string
}

export const VACANCIES: Vacancy[] = [
  {
    id: 1,
    title: 'Инженер',
    salary: 'от 70 000 руб.',
    duties: 'Оперативная комплектация и отправка оборудования со склада. Сокращение сроков реализации проекта и простоев на объекте.',
    image: '/images/vacancy.png',
    link: '#',
  },
  {
    id: 2,
    title: 'Инженер',
    salary: 'от 70 000 руб.',
    duties: 'Оперативная комплектация и отправка оборудования со склада. Сокращение сроков реализации проекта и простоев на объекте.',
    image: '/images/vacancy.png',
    link: '#',
  },
  {
    id: 3,
    title: 'Инженер',
    salary: 'от 70 000 руб.',
    duties: 'Оперативная комплектация и отправка оборудования со склада. Сокращение сроков реализации проекта и простоев на объекте.',
    image: '/images/vacancy.png',
    link: '#',
  },
]
