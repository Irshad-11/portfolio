interface Props {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ title, subtitle, align = 'center' }: Props) {
  const cls = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <div className={`mb-12 ${cls} max-w-2xl`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--text)] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[color:var(--text-muted)] text-base leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-[3px] w-12 rounded-full accent-bg ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  )
}
