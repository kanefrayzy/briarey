export interface CartItem {
  id: number
  title: string
  airflow: string
  image: string
  extras: { name: string; qty: string }[]
  price: number
  qty: number
}

export const INITIAL_CART: CartItem[] = [
  {
    id: 1,
    title: 'Дымосос ДПЭ-7 (1ЦМ) ДПЭ-А-К-2,0',
    airflow: '1500 м3/час',
    image: '/images/product-1.png',
    extras: [
      { name: 'Шкаф для хранения оборудования', qty: '1 шт.' },
      { name: 'Стыковочный узел', qty: '2 шт.' },
      { name: 'Рукав всасывающий', qty: '1 шт.' },
      { name: 'Рукав напорный', qty: '2 шт.' },
    ],
    price: 48500,
    qty: 2,
  },
  {
    id: 2,
    title: 'Дымосос ДПЭ-7 (1ЦМ) ДПЭ-А-К-2,0',
    airflow: '1500 м3/час',
    image: '/images/product-1.png',
    extras: [
      { name: 'Шкаф для хранения оборудования', qty: '1 шт.' },
      { name: 'Стыковочный узел', qty: '2 шт.' },
      { name: 'Рукав всасывающий', qty: '1 шт.' },
      { name: 'Рукав напорный', qty: '2 шт.' },
    ],
    price: 48500,
    qty: 1,
  },
]
