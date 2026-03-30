import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Бриарей — Противопожарное оборудование',
  description:
    'Производство и продажа противопожарного оборудования: дымососы, узлы стыковочные, клапаны. ООО «Бриарей».',
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
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
