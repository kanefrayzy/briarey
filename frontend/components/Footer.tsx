'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Button from './Button'
import FacebookIcon from './icons/FacebookIcon'
import YouTubeIcon from './icons/YouTubeIcon'
import InstagramIcon from './icons/InstagramIcon'
import TwitterIcon from './icons/TwitterIcon'
import type { SiteSettings } from '@/lib/api'
import { api } from '@/lib/api'

const navColumns = [
  {
    heading: 'Пресс служба',
    links: ['Новости', 'Вакансии'],
    hrefs: ['/news', '/vacancies'],
  },
  {
    heading: 'Информация',
    links: ['Вопросы', 'СНиПы', 'Законы'],
    hrefs: ['/certificates#faq', '/certificates', '/certificates'],
  },
  {
    heading: 'Оборудование',
    links: [
      'Дымососы',
      'Узел стыковочный',
      'Клапана сброса',
      'Доп. оборудование',
      'Шкаф хранения',
      'Двери противопожарные',
      'Установки сбора вещества',
    ],
    hrefs: [
      '/catalog/dymososy',
      '/catalog/uzel-stykovochnyj',
      '/catalog/klapana-sbrosa',
      '/catalog/dop-oborudovanie',
      '/catalog/shkafy-dlya-hraneniya',
      '/catalog/dveri-protivopozharnye',
      '/catalog/ustanovki-sbora-veshchestva',
    ],
  },
  {
    heading: 'Группа компаний',
    links: ['О компании', 'Диллерам'],
    hrefs: ['/about', '/dealers'],
  },
]

interface FooterProps {
  settings?: SiteSettings
}

export default function Footer({ settings: settingsProp }: FooterProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [settings, setSettings] = useState<SiteSettings | undefined>(settingsProp)

  useEffect(() => {
    if (!settingsProp) {
      api.getSiteSettings().then(s => setSettings(s)).catch(() => {})
    }
  }, [settingsProp])

  const phone1 = settings?.phone_1 || '+7 (499) 713-70-79'
  const phone2 = settings?.phone_2 || '+7 (901) 183-70-79'
  const contactEmail = settings?.email || 'info@briarey.ru'
  const companyName = settings?.company_name || 'ООО «Бриарей»'
  const inn = settings?.inn || '5040108803'
  const ogrn = settings?.ogrn || '1115040008016'
  const okpo = settings?.okpo || '92662134'
  const workHours = settings?.work_hours || 'ПН–ПТ — с 8:00 до 17:00'

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await api.subscribe(email)
      setSubscribed(true)
      setEmail('')
    } catch { /* silent */ }
  }

  return (
    <footer id="footer-contacts" style={{ background: '#1a1a1a' }} className="overflow-x-hidden">

      {/* ===== MOBILE ===== */}
      <div className="flex md:hidden flex-col px-4 pt-10 pb-6 gap-8">

        {/* Newsletter */}
        <div className="flex flex-col items-center text-center gap-4">
          <h3 className="text-white text-xl font-medium leading-snug">
            Подпишитесь на интересные новости<br />в сфере пожарной безопасности
          </h3>
          <form className="flex flex-col w-full gap-2" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш Email"
              className="w-full bg-white/10 rounded-md px-4 py-3 text-white text-sm text-center placeholder:text-white/40 focus:outline-none"
            />
            <Button type="submit" variant="catalog" className="w-full">
              {subscribed ? 'Вы подписаны!' : 'Подписаться'}
            </Button>
          </form>
        </div>

        {/* Logo + social */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/">
            <Image src="/images/logo.svg" alt="Бриарей" width={140} height={42} className="h-12 w-auto" />
          </Link>
          <div className="flex gap-3">
            <SocialLink href="#" label="Facebook"><FacebookIcon /></SocialLink>
            <SocialLink href="#" label="YouTube"><YouTubeIcon /></SocialLink>
            <SocialLink href="#" label="Instagram"><InstagramIcon /></SocialLink>
            <SocialLink href="#" label="Twitter"><TwitterIcon /></SocialLink>
          </div>
        </div>

        {/* Nav 2-col */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {navColumns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-2">
              <h4 className="text-white text-sm font-semibold mb-1">{col.heading}</h4>
              <nav className="flex flex-col gap-2">
                {col.links.map((link, i) => (
                  <Link key={link} href={col.hrefs[i]} className="text-white/50 text-sm hover:text-white transition-colors">
                    {link}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Company info */}
        <div className="flex flex-col gap-2 text-xs text-white/40 leading-relaxed">
          <p>
            Производство противопожарного оборудования ООО «Бриарей»<br />
            ИНН 5040108803<br />
            ОГРН 1115040008016<br />
            ОКПО 92662134
          </p>
          <div className="flex flex-col gap-1 text-white/50">
            <span>Тел: <a href="tel:74997137079" className="hover:text-white transition-colors">+7 (499) 713-70-79</a></span>
            <span>Тел: <a href="tel:79011837079" className="hover:text-white transition-colors">+7 (901) 183-70-79</a></span>
            <span>e-mail: <a href="mailto:info@briarey.ru" className="hover:text-white transition-colors">info@briarey.ru</a></span>
          </div>
          <div className="flex flex-col gap-2 text-white/50 text-xs">
            <a href="https://yandex.com/maps/-/CPfKzPl6" target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 hover:text-white transition-colors">
              <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
              <span>Производство: 140104, Московская область, г. Раменское, ул. 100-й Свирской Дивизии, д.11</span>
            </a>
            <a href="https://yandex.com/maps/-/CPfKvXI0" target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 hover:text-white transition-colors">
              <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
              <span>Офис: Молодёжная улица, 26В, Раменское, Московская область</span>
            </a>
          </div>
          <p className="text-white/30">График работы:<br />{workHours}</p>
        </div>
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:block max-w-[1440px] mx-auto px-8 py-14">

        {/* Newsletter */}
        <div className="flex flex-col items-center text-center gap-6 pb-12">
          <h3 className="text-white text-2xl md:text-3xl font-medium leading-relaxed">
            Подпишитесь на интересные новости<br />в сфере пожарной безопасности
          </h3>
          <form className="flex w-full max-w-[460px] gap-2" onSubmit={handleSubscribe}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш Email"
              className="flex-1 bg-white/10 rounded-md px-4 py-3 text-white text-sm placeholder:text-white/40 focus:outline-none"
            />
            <Button type="submit" variant="catalog">
              {subscribed ? 'Вы подписаны!' : 'Подписаться'}
            </Button>
          </form>
        </div>

        <div className="flex gap-12 lg:gap-16">
          {/* Company info */}
          <div className="flex flex-col gap-4 min-w-[200px] max-w-[220px] shrink-0">
            <Link href="/">
              <Image src="/images/logo.svg" alt="Бриарей" width={140} height={42} className="h-12 w-auto" />
            </Link>
            <p className="text-white/40 text-xs leading-relaxed">
              Производство противопожарного<br />
              оборудования {companyName}<br />
              ИНН {inn}<br />
              ОГРН {ogrn}<br />
              ОКПО {okpo}
            </p>
            <div className="flex flex-col gap-1 text-white/50 text-xs">
              <span>Тел: <a href={`tel:${phone1.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors">{phone1}</a></span>
              <span>Тел: <a href={`tel:${phone2.replace(/[^\d+]/g, '')}`} className="hover:text-white transition-colors">{phone2}</a></span>
              <span>e-mail: <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">{contactEmail}</a></span>
            </div>
            <div className="flex flex-col gap-2 text-white/50 text-xs">
              <a href="https://yandex.com/maps/-/CPfKzPl6" target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 hover:text-white transition-colors">
                <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                <span>Производство: 140104, Московская область, г. Раменское, ул. 100-й Свирской Дивизии, д.11</span>
              </a>
              <a href="https://yandex.com/maps/-/CPfKvXI0" target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 hover:text-white transition-colors">
                <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                <span>Офис: Молодёжная улица, 26В, Раменское, Московская область</span>
              </a>
            </div>
            <Link href="/certificates" className="text-white/70 text-base underline hover:text-white transition-colors">
              Скачать реквизиты
            </Link>
            <p className="text-white/30 text-xs">
              График работы:<br />
              {workHours}
            </p>
          </div>

          {/* Nav columns */}
          <div className="flex flex-1 justify-between flex-wrap gap-y-8">
            {navColumns.map((col, colIdx) => (
              <div key={col.heading} className="flex flex-col gap-3 min-w-[130px]">
                <h4 className="text-white text-base font-semibold mb-1">{col.heading}</h4>
                <nav className="flex flex-col gap-2">
                  {col.links.map((link, i) => (
                    <Link key={link} href={col.hrefs[i]} className="text-white/50 text-sm hover:text-white transition-colors">
                      {link}
                    </Link>
                  ))}
                </nav>
                {colIdx === 0 && (
                  <div className="flex gap-3 mt-3">
                    <SocialLink href="#" label="Facebook"><FacebookIcon /></SocialLink>
                    <SocialLink href="#" label="YouTube"><YouTubeIcon /></SocialLink>
                    <SocialLink href="#" label="Instagram"><InstagramIcon /></SocialLink>
                    <SocialLink href="#" label="Twitter"><TwitterIcon /></SocialLink>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-5 flex justify-center">
          <span className="text-white/30 text-xs">
            Сделано в{' '}
            <a href="https://nikstudio.pro" className="text-[#AC7F5E] hover:text-[#c49a72] transition-colors">
              дизайн-бюро Славы Никитина
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center text-white hover:opacity-70 transition-opacity"
    >
      {children}
    </a>
  )
}

