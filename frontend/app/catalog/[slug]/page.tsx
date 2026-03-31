import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetail from '@/components/catalog/ProductDetail'
import CatalogGrid from '@/components/catalog/CatalogGrid'
import SmartPickSection from '@/components/SmartPickSection'
import ContactForm from '@/components/ContactForm'
import { api, storageUrl, productImageUrl } from '@/lib/api'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const product = await api.getProduct(params.slug).catch(() => null)
  if (product) return { title: `${product.name} — Бриарей` }
  const categoryData = await api.getCategoryProducts(params.slug).catch(() => null)
  if (categoryData) return { title: `${categoryData.category.name} — Каталог Бриарей` }
  return { title: 'Каталог — Бриарей' }
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

    return (
      <>
        <Header />
        <main style={{ paddingTop: 80 }}>
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

  // Если категория найдена — рендерим с её данными, иначе всё равно рендерим
  // каталог с нужным slug'ом (CatalogGrid сам подберёт нужную вкладку)
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
