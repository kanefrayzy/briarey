import Image from 'next/image'
import Button from './Button'
import SmokeOverlay from './SmokeOverlay'

export default function HeroSection() {
  return (
    <>
      {/* ══ МОБИЛЬНАЯ ВЕРСИЯ (< md) ══ */}
      <section
        className="block md:hidden relative w-full"
        style={{
          minHeight: '380px',
          marginTop: '-64px',
          backgroundImage: 'url(/images/fon.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* dym.gif — на всю ширину, левее, поднят выше */}
        <div className="absolute z-0 overflow-hidden" style={{ top: '0', left: 0, right: 0, bottom: 0 }}>
          {/* <video
            src="/images/dymosos_1.webm"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '-240px top' }}
          /> */}
          <Image
            src="/images/dym.gif"
            alt="Дымосос Бриарей"
            fill
            className="object-cover"
            style={{ objectPosition: '-240px top' }}
            priority
          />
        </div>



        {/* перекрывашка снизу */}
        <SmokeOverlay position="bottom" zIndex={2} />

        {/* отступ под хедером */}
        <div style={{ height: '96px' }} />

        {/* контент — подбор комплекта, правая сторона */}
        <div className="relative z-10 flex justify-end px-5 pb-7">
          <div className="flex flex-col gap-2.5 max-w-[220px]">
            <h2 className="text-white text-xl font-semibold leading-snug">
              Подбор комплекта за 2 минуты
            </h2>
            <p className="text-white/75 text-sm leading-relaxed">
              Начните с удобного расчёта необходимого оборудования для вашего объекта!
            </p>
            <div className="mt-1 flex">
              <Button href="/calculator" variant="calculator">Калькулятор</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ДЕСКТОПНАЯ ВЕРСИЯ (md+) ══ */}
      <section
        className="hidden md:block relative w-full"
        style={{
          height: '100vh',
          minHeight: '580px',
          marginTop: '-96px',
          paddingTop: '96px',
          backgroundImage: 'url(/images/fon.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'visible',
        }}
      >

        {/* dym.gif — full background */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* <video
            src="/images/dymosos_1.webm"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-center"
          /> */}
          <Image
            src="/images/dym.gif"
            alt="Дымосос Бриарей"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Перекрывашка — белый дым плавно растворяется книзу */}
        <SmokeOverlay position="bottom" />

        {/* Большой логотип */}
        <div className="absolute top-[128px] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <Image
            src="/images/logo.svg"
            alt="Бриарей"
            width={610}
            height={126}
            className="w-72 lg:w-[380px] xl:w-[610px] h-auto"
            priority
          />
        </div>

        {/* Left + right content */}
        <div className="relative z-20 h-full max-w-[1440px] mx-auto px-14 flex items-center justify-between">

          {/* Left: title + button */}
          <div className="flex flex-col gap-4 max-w-[360px]">
            <div className="flex flex-col gap-2">
              <h1 className="text-[46px] font-bold text-white leading-tight">
                Системы<br />газодымоудаления
              </h1>
              <p className="text-white/80 text-2xl">Производство и продажа</p>
            </div>
            <div className="pt-1">
              <Button href="/catalog" variant="catalog">Каталог</Button>
            </div>
          </div>

          {/* Right: calculator card */}
          <div className="flex flex-col gap-4 w-full max-w-[450px] p-8 bg-[#292B32]/25 backdrop-blur-md rounded-2xl shadow-2xl text-left">
            <h2 className="max-w-xs text-white text-4xl font-semibold leading-tight">
              Подбор комплекта за 2 минуты
            </h2>
            <p className="max-w-xs text-white/90 text-base leading-tight">
              Начните с удобного расчёта необходимого оборудования для вашего объекта!
            </p>
            <Button href="/calculator" variant="calculator">Калькулятор</Button>
          </div>
        </div>
      </section>
    </>
  )
}
