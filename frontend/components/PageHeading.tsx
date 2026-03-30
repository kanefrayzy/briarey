interface PageHeadingProps {
  title: string
}

export default function PageHeading({ title }: PageHeadingProps) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-14 pt-10 pb-6 lg:pt-16 lg:pb-8">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
        {title}
      </h1>
    </div>
  )
}
