/** Kept for compatibility — sections now use SectionShell in ui.tsx. */
export default function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-3 text-muted max-w-md">{subtitle}</p>}
    </div>
  )
}