import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetail from '@/components/catalog/ProductDetail'
import { api, storageUrl } from '@/lib/api'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const product = await api.getProduct(params.slug).catch(() => null)
  return {
    title: product ? `${product.name} — Бриарей` : 'Товар — Бриарей',
  }
}

export default async function ProductPage({ params }: Props) {
  const apiProduct = await api.getProduct(params.slug).catch(() => null)
  if (!apiProduct) notFound()

  // Map API product to the format expected by ProductDetail
  const product = {
    id: apiProduct.id,
    slug: apiProduct.slug,
    category: apiProduct.category?.name ?? '',
    categorySlug: apiProduct.category?.slug ?? '',
    badge: apiProduct.badge ?? '',
    name: apiProduct.name,
    airflow: '',
    price: apiProduct.price,
    image: storageUrl(apiProduct.image),
    thumbnails: apiProduct.images?.map(img => storageUrl(img.image)) ?? [storageUrl(apiProduct.image)],
    composition: apiProduct.composition_items?.map(c => c.text) ?? [],
    calculatorHint: apiProduct.calculator_hint ?? '',
    technicalDocUrl: apiProduct.technical_doc_url ?? undefined,
    specs: apiProduct.attribute_values?.map(av => ({
      key: av.category_attribute.key,
      label: av.category_attribute.name,
      value: av.value,
    })) ?? [],
    starterKit: apiProduct.starter_kit_items?.length
      ? {
          subtitle: 'Стартовый комплект',
          items: apiProduct.starter_kit_items.map(k => ({
            name: k.name,
            description: k.description,
            image: storageUrl(k.image),
            qty: k.qty,
          })),
        }
      : undefined,
    mainSpecs: apiProduct.main_specs?.map(s => ({
      title: s.title,
      columns: s.columns?.map(c => ({
        heading: c.heading,
        content: c.content,
      })) ?? [],
    })),
    extras: apiProduct.extras?.map(e => ({
      id: e.id,
      name: e.name,
      description: e.description,
      price: e.price,
      image: storageUrl(e.image),
    })) ?? [],
  }

  return (
    <>
      <Header />
      <main style={{paddingTop: 80 }}>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  )
}
