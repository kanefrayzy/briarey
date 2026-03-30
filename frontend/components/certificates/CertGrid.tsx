import Image from 'next/image'
import CertDownloadIcon from '@/components/icons/CertDownloadIcon'

export interface Certificate {
  id: number
  title: string
  image: string
  file: string
}

function CertCard({ title, image, file }: Omit<Certificate, 'id'>) {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-[#2a2a2a]">
      {/* Превью */}
      <div className="relative w-full bg-[#333333]" style={{ aspectRatio: '4/3' }}>
        <Image src={image} alt={title} fill className="object-contain p-3" />
      </div>

      {/* Текст и ссылка */}
      <div className="p-4 flex flex-col gap-3 bg-[#191919] h-full">
        <h3 className="text-white font-bold text-sm md:text-base leading-snug">{title}</h3>
        <a
          href={file}
          download
          className="flex items-center gap-1 text-white/70 text-sm hover:text-white transition-colors"
        >
          <CertDownloadIcon />
          <span>Скачать сертификат</span>
        </a>
      </div>
    </div>
  )
}

interface CertGridProps {
  certs: Certificate[]
}

export default function CertGrid({ certs }: CertGridProps) {
  return (
    <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pb-12 md:pb-16 lg:pb-24">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {certs.map((cert) => (
          <CertCard key={cert.id} {...cert} />
        ))}
      </div>
    </section>
  )
}
