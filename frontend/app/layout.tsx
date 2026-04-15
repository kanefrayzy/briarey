import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://briarey.ru'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Бриарей — Противопожарное оборудование',
    template: '%s | Бриарей',
  },
  description:
    'Производство и продажа противопожарного оборудования: дымососы, узлы стыковочные, клапаны. ООО «Бриарей».',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Бриарей',
    title: 'Бриарей — Противопожарное оборудование',
    description:
      'Производство и продажа противопожарного оборудования: дымососы, узлы стыковочные, клапаны. ООО «Бриарей».',
    url: SITE_URL,
    images: [{ url: '/images/og-cover.png', width: 1200, height: 630, alt: 'Бриарей — Противопожарное оборудование' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Бриарей — Противопожарное оборудование',
    description:
      'Производство и продажа противопожарного оборудования: дымососы, узлы стыковочные, клапаны.',
  },
  alternates: {
    canonical: '/',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ООО «Бриарей»',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.svg`,
  description: 'Производство противопожарного оборудования: дымососы, узлы стыковочные, клапаны сброса.',
  address: [
    {
      '@type': 'PostalAddress',
      addressLocality: 'Раменское',
      addressRegion: 'Московская область',
      postalCode: '140104',
      streetAddress: 'ул. 100-й Свирской Дивизии, д.11',
      addressCountry: 'RU',
    },
    {
      '@type': 'PostalAddress',
      addressLocality: 'Раменское',
      addressRegion: 'Московская область',
      streetAddress: 'Молодёжная улица, 26В',
      addressCountry: 'RU',
    },
  ],
  telephone: ['+7 (499) 713-70-79', '+7 (901) 183-70-79'],
  email: 'info@briarey.ru',
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body
        className={`${poppins.variable} font-sans bg-brand-bg text-white antialiased`}
        style={{
          backgroundImage: 'url(/images/hero-decor.svg)',
          backgroundSize: '100% auto',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'top center',
        }}
      >
        <CartProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
