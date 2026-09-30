import { ReactNode, useState } from 'react'
import { Eye } from 'lucide-react'
import LivePreview from './LivePreview'
import { Segmented } from './Fields'
import type { PreviewSpec } from '../lib'

interface Props {
  title: string
  subtitle?: string
  actions?: ReactNode
  form: ReactNode
  previews: PreviewSpec[]
}

/**
 * Two-pane editor: form on the left, live preview on the right (xl screens).
 * On smaller screens the preview opens as a full-screen sheet from a floating button.
 */
export default function EditorShell({ title, subtitle, actions, form, previews }: Props) {
  const [idx, setIdx] = useState(0)
  const [open, setOpen] = useState(false)
  const p = previews[Math.min(idx, previews.length - 1)]

  return (
    <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 xl:h-[calc(100vh-3rem)]">
      {/* Form column: on xl it scrolls on its own, so the sidebar and the preview never move */}
      <div className="min-w-0 xl:flex xl:flex-col xl:h-full xl:min-h-0">
        <div className="sticky top-14 lg:top-0 xl:static z-30 -mx-4 sm:-mx-6 xl:mx-0 px-4 sm:px-6 xl:px-0 py-3 flex items-center justify-between gap-3 border-b border-[color:var(--border)] bg-[color:var(--bg)] xl:shrink-0">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-[color:var(--text)] truncate">{title}</h1>
            {subtitle && <p className="text-xs text-[color:var(--text-faint)] truncate">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        </div>
        <div className="pt-5 space-y-5 xl:flex-1 xl:min-h-0 xl:overflow-y-auto xl:pr-3 xl:pb-6">
          {form}
          <div className="h-16 xl:hidden" />
        </div>
      </div>

      {/* Preview column: static on xl; a full-screen sheet on smaller screens */}
      <aside className={open
        ? 'fixed inset-0 z-[60] flex flex-col p-2 bg-[color:var(--bg)]'
        : 'hidden xl:flex flex-col xl:h-full min-h-0'}>
        <LivePreview view={p.view} focus={p.focus} patch={p.patch} className="flex-1" onClose={() => setOpen(false)}
          header={previews.length > 1 ? (
            <Segmented size="sm" value={String(idx)} onChange={v => setIdx(Number(v))} options={previews.map((x, i) => ({ value: String(i), label: x.label }))} />
          ) : undefined} />
      </aside>

      <button type="button" onClick={() => setOpen(true)} aria-label="Open live preview"
        className="xl:hidden fixed bottom-5 right-5 z-40 btn btn-solid !rounded-full !h-12 !px-5 shadow-xl shadow-black/40 gap-2">
        <Eye size={17} />Preview
      </button>
    </div>
  )
}