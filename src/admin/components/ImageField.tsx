import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '../../lib/storage'
import { uid } from '../../lib/defaults'

async function safeUpload(file: File, folder: string): Promise<string | null> {
  if (!file.type.startsWith('image/')) { toast.error(`${file.name} is not an image`); return null }
  try { return await uploadImage(file, folder) } catch (e) {
    toast.error(`Upload failed: ${(e as Error).message}. Did you run the storage part of the SQL migration?`)
    return null
  }
}

/** Single image: upload from device or paste a URL. */
export function ImageField({ value, onChange, folder = 'misc', label, hint, aspect = '16 / 10', contain = false }: {
  value?: string | null; onChange: (v: string) => void; folder?: string; label?: string; hint?: string; aspect?: string; contain?: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const pick = async (f?: File | null) => {
    if (!f) return
    setBusy(true)
    const url = await safeUpload(f, folder)
    setBusy(false)
    if (url) onChange(url)
  }
  return (
    <div>
      {label && <label className="admin-label">{label}</label>}
      <div className="flex gap-3">
        <button type="button" onClick={() => input.current?.click()}
          onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); pick(e.dataTransfer.files?.[0]) }}
          className="relative w-36 shrink-0 overflow-hidden rounded-lg border border-dashed border-[color:var(--border-hover)] bg-white/[0.03] hover:border-[color:var(--accent)] transition-colors flex items-center justify-center text-[color:var(--text-faint)]"
          style={{ aspectRatio: aspect }} aria-label="Upload image">
          {value ? <img src={value} alt="" className={`w-full h-full ${contain ? 'object-contain p-1' : 'object-cover'}`} /> : busy ? null : <ImagePlus size={20} />}
          {busy && <span className="absolute inset-0 flex items-center justify-center bg-black/50"><Loader2 size={18} className="animate-spin text-white" /></span>}
        </button>
        <div className="flex-1 min-w-0 space-y-2">
          <input ref={input} type="file" accept="image/*" hidden onChange={e => { pick(e.target.files?.[0]); e.target.value = '' }} />
          <input className="admin-input" placeholder="…or paste an image URL" value={value || ''} onChange={e => onChange(e.target.value)} />
          <div className="flex gap-2">
            <button type="button" onClick={() => input.current?.click()} className="btn-outline !h-8 !px-3 !text-xs !rounded-md !normal-case !tracking-normal !font-sans">Upload</button>
            {value && <button type="button" onClick={() => onChange('')} className="text-xs text-red-400/80 hover:text-red-400 px-2">Remove</button>}
          </div>
        </div>
      </div>
      {hint && <p className="text-[11px] text-[color:var(--text-faint)] mt-1.5">{hint}</p>}
    </div>
  )
}

export interface GalleryItem { id: string; url: string; caption?: string }

/** Multiple images: bulk upload, reorder, optional captions. */
export function GalleryField({ items, onChange, folder = 'misc', label, hint, captions = false }: {
  items: GalleryItem[]; onChange: (v: GalleryItem[]) => void; folder?: string; label?: string; hint?: string; captions?: boolean
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(0)

  const add = async (files: FileList | null) => {
    if (!files?.length) return
    const list = Array.from(files)
    setBusy(b => b + list.length)
    const added: GalleryItem[] = []
    for (const f of list) {
      const url = await safeUpload(f, folder)
      setBusy(b => b - 1)
      if (url) added.push({ id: uid(), url, caption: '' })
    }
    if (added.length) onChange([...items, ...added])
  }
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const n = [...items]; [n[i], n[j]] = [n[j], n[i]]; onChange(n)
  }
  const upd = (id: string, p: Partial<GalleryItem>) => onChange(items.map(x => (x.id === id ? { ...x, ...p } : x)))

  return (
    <div>
      {label && <label className="admin-label">{label}</label>}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={e => { add(e.target.files); e.target.value = '' }} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((it, i) => (
          <div key={it.id} className="rounded-lg border border-[color:var(--border)] overflow-hidden bg-white/[0.02]">
            <div className="relative aspect-[4/3] bg-black/30 group">
              <img src={it.url} alt="" className="w-full h-full object-cover" />
              <span className="absolute top-1.5 left-1.5 text-[10px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">{i + 1}</span>
              <button type="button" onClick={() => onChange(items.filter(x => x.id !== it.id))} className="absolute top-1.5 right-1.5 p-1.5 rounded-md bg-black/70 text-white hover:bg-red-600" aria-label="Remove image"><Trash2 size={12} /></button>
              <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-md bg-black/70 text-white disabled:opacity-30" aria-label="Move earlier"><ArrowLeft size={12} /></button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1.5 rounded-md bg-black/70 text-white disabled:opacity-30" aria-label="Move later"><ArrowRight size={12} /></button>
              </div>
            </div>
            {captions && <input className="admin-input !rounded-none !border-0 !border-t !text-xs" placeholder="Caption (optional)" value={it.caption || ''} onChange={e => upd(it.id, { caption: e.target.value })} />}
          </div>
        ))}
        {Array.from({ length: busy }).map((_, k) => (
          <div key={`b${k}`} className="aspect-[4/3] rounded-lg border border-dashed border-[color:var(--border-hover)] flex items-center justify-center"><Loader2 size={18} className="animate-spin text-[color:var(--text-faint)]" /></div>
        ))}
        <button type="button" onClick={() => input.current?.click()}
          onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); add(e.dataTransfer.files) }}
          className="aspect-[4/3] rounded-lg border border-dashed border-[color:var(--border-hover)] flex flex-col items-center justify-center gap-1.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-colors">
          <ImagePlus size={20} />Add images
        </button>
      </div>
      {hint && <p className="text-[11px] text-[color:var(--text-faint)] mt-1.5">{hint}</p>}
    </div>
  )
}

/** Gallery for plain string[] columns. */
export function StringGallery({ values, onChange, ...rest }: { values: string[]; onChange: (v: string[]) => void; folder?: string; label?: string; hint?: string }) {
  const items = (values || []).map((url, i) => ({ id: `${i}-${url}`, url }))
  return <GalleryField {...rest} items={items} onChange={v => onChange(v.map(x => x.url))} />
}