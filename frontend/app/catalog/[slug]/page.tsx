import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetail from '@/components/catalog/ProductDetail'
import CatalogGrid from '@/components/catalog/CatalogGrid'
import SmartPickSection from '@/components/SmartPickSection'
import ContactForm from '@/components/ContactForm'
import { api, storageUrl, productImageUrl } from '@/lib/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://briarey.ru'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await api.getProduct(params.slug).catch(() => null)
  if (product) {
    const desc = product.badge || `${product.name} — купить от ${product.price?.toLocaleString('ru-RU')} ₽. Производство ООО «Бриарей».`
    const image = productImageUrl(product.slug, product.image)
    return {
      title: product.name,
      description: desc,
      alternates: { canonical: `/catalog/${params.slug}` },
      openGraph: {
        type: 'website',
        title: product.name,
        description: desc,
        url: `${SITE_URL}/catalog/${params.slug}`,
        images: [{ url: image, alt: product.name }],
      },
    }
  }
  const categoryData = await api.getCategoryProducts(params.slug).catch(() => null)
  if (categoryData) {
    const desc = `${categoryData.category.name} — каталог оборудования от производителя ООО «Бриарей».`
    return {
      title: `${categoryData.category.name} — Каталог`,
      description: desc,
      alternates: { canonical: `/catalog/${params.slug}` },
      openGraph: {
        type: 'website',
        title: `${categoryData.category.name} — Каталог Бриарей`,
        description: desc,
        url: `${SITE_URL}/catalog/${params.slug}`,
      },
    }
  }
  return { title: 'Страница не найдена' }
}

export default async function CatalogSlugPage({ params }: Props) {
  const { slug } = params

  // 1. Пробуем загрузить как продукт
  const apiProduct = await api.getProduct(slug).catch(() => null)

  if (apiProduct) {
    const product = {
      id: apiProduct.id,
      slug: apiProduct.slug,
      category: apiProduct.category?.name ?? '',
      categorySlug: apiProduct.category?.slug ?? '',
      badge: apiProduct.badge ?? '',
      name: apiProduct.name,
      airflow: '',
      price: apiProduct.price,
      image: productImageUrl(apiProduct.slug, apiProduct.image),
      thumbnails: [productImageUrl(apiProduct.slug, apiProduct.image)],
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

    const productJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: `${SITE_URL}${product.image}`,
      description: apiProduct.badge || product.name,
      brand: { '@type': 'Brand', name: 'Бриарей' },
      manufacturer: { '@type': 'Organization', name: 'ООО «Бриарей»' },
      offers: {
        '@type': 'Offer',
        url: `${SITE_URL}/catalog/${slug}`,
        priceCurrency: 'RUB',
        price: product.price,
        availability: 'https://schema.org/InStock',
      },
    }

    return (
      <>
        <Header />
        <main style={{ paddingTop: 80 }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
          />
          <ProductDetail product={product} />
        </main>
        <Footer />
      </>
    )
  }

  // 2. Пробуем загрузить как категорию
  const [categoryData, allCategories] = await Promise.all([
    api.getCategoryProducts(slug).catch(() => null),
    api.getCategories().catch(() => null),
  ])

  // Если ни продукт, ни категория не найдены — 404
  if (!categoryData) {
    notFound()
  }

  return (
    <>
      <Header />
      <main style={{ background: '#242424', paddingTop: 80 }}>
        <CatalogGrid
          apiCategories={allCategories ?? undefined}
          initialCategorySlug={slug}
          initialProducts={categoryData?.products}
        />
        <SmartPickSection />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
