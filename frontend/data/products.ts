export interface StarterKitItem {
  name: string
  description: string
  image: string
  qty: string
}

export interface MainSpec {
  title: string
  columns: { heading: string; content: string[] }[]
}

export interface ProductExtra {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export interface Product {
  id: number
  slug: string
  category: string
  categorySlug?: string
  badge: string
  name: string
  airflow: string
  price: number
  image: string
  thumbnails: string[]
  composition: string[]
  calculatorHint: string
  technicalDocUrl?: string
  specs?: { key?: string; label: string; value: string }[]
  starterKit?: { subtitle: string; items: StarterKitItem[] }
  mainSpecs?: MainSpec[]
  extras: ProductExtra[]
}

export const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    slug: 'dymosos-dpe-7',
    category: 'Дымососы',
    badge: 'Газо- и дымоудаление после ПТ • среда до 120°C',
    name: 'Дымосос ДПЭ-7 (1ЦМ) ДПЭ-А-К-2,0',
    airflow: '1500 м³/час',
    price: 48500,
    image: '/images/product-1.png',
    thumbnails: [
      '/images/product-1.png',
      '/images/product-1.png',
      '/images/product-1.png',
    ],
    composition: [
      '+ рукав всасывающий — 5 м',
      '+ рукав напорный — 10 м',
    ],
    calculatorHint:
      'Если условия нестандартные или требуется расчёт под несколько помещений — воспользуйтесь калькулятором подбора.',
    technicalDocUrl: '#',
    specs: [
      { label: 'Габаритный размер', value: '310×500×470 мм (Д×Ш×В)' },
      { label: 'Масса', value: '15 кг' },
      { label: 'Электродвигатель', value: 'OBR200M-2K' },
      { label: 'Производительность', value: '1500 м³/час' },
    ],
    starterKit: {
      subtitle: 'Стартовый комплект. Длина рукавов может быть изменена ниже',
      items: [
        { name: 'Дымосос (основной товар)', description: 'Производительность: от 1500 м³/час.\nКол-во в наборе: 1 шт.', image: '/images/product-1.png', qty: '1 шт.' },
        { name: 'Рукав всасывающий РВ', description: 'Длина рукава: 5 м\nКол-во в наборе: 1 шт.', image: '/images/product-1.png', qty: '5 м' },
        { name: 'Рукав напорный РН', description: 'Длина рукава: 10 м\nКол-во в наборе: 1 шт.', image: '/images/product-1.png', qty: '10 м' },
      ],
    },
    mainSpecs: [
      {
        title: 'Назначение',
        columns: [
          {
            heading: 'Основное назначение:',
            content: [
              'Снижение концентрации огнетушащего вещества,',
              'снижение температуры дымовоздушной среды,',
              'нормализация воздушной среды после срабатывания',
              'системы пожаротушения.',
            ],
          },
          {
            heading: 'Дополнительное применение:',
            content: ['Нормализация воздушной среды при проведении сварочных работ.'],
          },
          {
            heading: 'Варианты изготовления:',
            content: [
              '• Общего назначения – из углеродистой стали с',
              'полимерным покрытием.',
              '• Коррозионностойкий – из нержавеющей стали',
              'марки 08X18H10.',
            ],
          },
        ],
      },
    ],
    extras: [
      {
        id: 1,
        name: 'Стартовый комплект',
        description: 'Стартовый комплект. Длина рукавов может быть изменена ниже',
        price: 12000,
        image: '/images/product-1.png',
      },
      {
        id: 2,
        name: 'Рукав всасывающий — 5 м',
        description: 'Дополнительный рукав для увеличения зоны работы',
        price: 3500,
        image: '/images/product-1.png',
      },
      {
        id: 3,
        name: 'Рукав напорный — 10 м',
        description: 'Дополнительный напорный рукав',
        price: 4200,
        image: '/images/product-1.png',
      },
    ],
  },
  {
    id: 2,
    slug: 'dymosos-dpe-8',
    category: 'Дымососы',
    badge: 'Газо- и дымоудаление после ПТ • среда до 140°C',
    name: 'Дымосос ДПЭ-8 (2ЦМ) ДПЭ-А-К-3,0',
    airflow: '2200 м³/час',
    price: 58500,
    image: '/images/product-1.png',
    thumbnails: [
      '/images/product-1.png',
      '/images/product-1.png',
      '/images/product-1.png',
    ],
    composition: [
      '+ рукав всасывающий — 5 м',
      '+ рукав напорный — 10 м',
      '+ рукав напорный — 10 м',
    ],
    calculatorHint:
      'Если условия нестандартные или требуется расчёт под несколько помещений — воспользуйтесь калькулятором подбора.',
    technicalDocUrl: '#',
    specs: [
      { label: 'Габаритный размер', value: '400×600×550 мм (Д×Ш×В)' },
      { label: 'Масса', value: '22 кг' },
      { label: 'Электродвигатель', value: 'OBR250M-4K' },
      { label: 'Производительность', value: '2200 м³/час' },
    ],
    starterKit: {
      subtitle: 'Стартовый комплект. Длина рукавов может быть изменена ниже',
      items: [
        { name: 'Дымосос (основной товар)', description: 'Производительность: от 2200 м³/час.\nКол-во в наборе: 1 шт.', image: '/images/product-1.png', qty: '1 шт.' },
        { name: 'Рукав всасывающий РВ', description: 'Длина рукава: 5 м\nКол-во в наборе: 1 шт.', image: '/images/product-1.png', qty: '5 м' },
        { name: 'Рукав напорный РН', description: 'Длина рукава: 10 м\nКол-во в наборе: 1 шт.', image: '/images/product-1.png', qty: '10 м' },
      ],
    },
    mainSpecs: [
      {
        title: 'Назначение',
        columns: [
          {
            heading: 'Основное назначение:',
            content: [
              'Снижение концентрации огнетушащего вещества,',
              'снижение температуры дымовоздушной среды,',
              'нормализация воздушной среды после срабатывания',
              'системы пожаротушения.',
            ],
          },
          {
            heading: 'Дополнительное применение:',
            content: ['Нормализация воздушной среды при проведении сварочных работ.'],
          },
          {
            heading: 'Варианты изготовления:',
            content: [
              '• Общего назначения – из углеродистой стали с',
              'полимерным покрытием.',
              '• Коррозионностойкий – из нержавеющей стали',
              'марки 08X18H10.',
            ],
          },
        ],
      },
    ],
    extras: [
      {
        id: 1,
        name: 'Стартовый комплект',
        description: 'Стартовый комплект. Длина рукавов может быть изменена ниже',
        price: 14000,
        image: '/images/product-1.png',
      },
      {
        id: 2,
        name: 'Рукав всасывающий — 5 м',
        description: 'Дополнительный рукав для увеличения зоны работы',
        price: 3800,
        image: '/images/product-1.png',
      },
      {
        id: 3,
        name: 'Рукав напорный — 10 м',
        description: 'Дополнительный напорный рукав',
        price: 4500,
        image: '/images/product-1.png',
      },
    ],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS_DATA.find((p) => p.slug === slug)
}
