import Image from 'next/image'
import Button from '@/components/Button'
import HandshakeIcon from '@/components/icons/HandshakeIcon'
import { DealersPage, storageUrl } from '@/lib/api'

interface DealerHeroProps {
  data?: DealersPage
}

export default function DealerHero({ data }: DealerHeroProps) {
  const title = data?.hero_title || 'Наша продукция\nв вашем магазине'
  const description = data?.hero_description || 'Если вам близки ответственность, точность и системный подход — будем рады видеть вас в нашей команде.'
  const buttonText = data?.hero_button_text || 'Получить презентацию'
  const heroImage = data?.hero_image ? storageUrl(data.hero_image) : '/images/dealer/dealer.png'

  const CardContent = () => (
    <>
      <HandshakeIcon />
      <h2 className="text-white text-2xl md:text-3xl font-medium leading-snug" style={{ whiteSpace: 'pre-line' }}>
        {title}
      </h2>
      <p className="text-white/70 text-sm leading-relaxed">
        {description}
      </p>
      <Button variant="calculator" className="self-start mt-1">
        {buttonText}
      </Button>
    </>
  )
  return (
    <section className="max-w-[1440px] mx-auto pb-10 lg:pb-16">

      {/* ── МОБИЛЬНАЯ версия ── */}
      <div className="md:hidden">
        {/* Картинка — строго 268px */}
        <div className="relative w-full" style={{ height: 268 }}>
          <Image
            src={heroImage}
            alt="Дилерам БРИАРЕЙ"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Карточка: половина на изображении, половина ниже */}
        <div className="relative z-10 mx-auto flex flex-col gap-3 px-4 py-5 -mt-[130px]"
          style={{ width: '90%', background: '#3f3f3f' }}>
          <CardContent />
        </div>
      </div>

      {/* ── DESKTOP версия ── */}
      <div className="hidden md:block relative rounded-2xl overflow-hidden mx-4 md:mx-8 lg:mx-14" style={{ minHeight: 590 }}>
        <Image
          src={heroImage}
          alt="Дилерам БРИАРЕЙ"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" />
        <div
          className="absolute top-1/2 -translate-y-1/2 right-12 lg:right-16
                     w-[90%] max-w-[380px]
                     p-8 flex flex-col gap-4"
          style={{ background: '#3f3f3f' }}
        >
          <CardContent />
        </div>
      </div>

    </section>
  )
}
