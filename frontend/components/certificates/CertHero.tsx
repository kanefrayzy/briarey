import Image from 'next/image'
import DocumentIcon from '@/components/icons/DocumentIcon'

const CardContent = () => (
  <>
    <DocumentIcon />
    <h2 className="text-white text-2xl md:text-3xl font-medium leading-snug">
      Наша продукция<br />в вашем магазине
    </h2>
    <p className="text-white/70 text-sm leading-relaxed">
      Когда мы говорим о качестве нашего оборудования — это не просто слова, а факт, подтверждённый специальными тестированиями, на основании которых нам выданы подтверждающие документы.
    </p>
  </>
)

export default function CertHero() {
  return (
    <section className="max-w-[1440px] mx-auto pb-4 lg:pb-6">

      {/* ── МОБИЛЬНАЯ версия ── */}
      <div className="md:hidden">
        <div className="relative w-full" style={{ height: 268 }}>
          <Image src="/images/dealer/dealer.png" alt="Сертификаты БРИАРЕЙ" fill className="object-cover object-top" priority />
        </div>
        <div className="relative z-10 mx-auto flex flex-col gap-3 px-4 py-5 -mt-[110px]"
          style={{ width: '90%', background: '#3f3f3f' }}>
          <CardContent />
        </div>
      </div>

      {/* ── DESKTOP версия ── */}
      <div className="hidden md:block relative rounded-2xl overflow-hidden mx-4 md:mx-8 lg:mx-14" style={{ minHeight: 590 }}>
        <Image src="/images/dealer/dealer.png" alt="Сертификаты БРИАРЕЙ" fill className="object-cover" priority />
        <div className="absolute inset-0" />
        <div
          className="absolute top-1/2 -translate-y-1/2 right-12 lg:right-16 w-[90%] max-w-[340px] p-8 flex flex-col gap-4"
          style={{ background: '#3f3f3f' }}
        >
          <CardContent />
        </div>
      </div>

    </section>
  )
}
