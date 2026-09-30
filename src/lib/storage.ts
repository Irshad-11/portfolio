import { supabase } from './supabase'

export const BUCKET = 'portfolio'

/** Downscale + re-encode raster images in the browser so pages stay light. */
async function compress(file: File, maxSide = 1800, quality = 0.86): Promise<Blob | File> {
  if (!/^image\/(jpe?g|png|webp)$/.test(file.type)) return file // keep svg / gif untouched
  try {
    const bmp = await createImageBitmap(file)
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
    const w = Math.round(bmp.width * scale)
    const h = Math.round(bmp.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bmp, 0, 0, w, h)
    const blob: Blob | null = await new Promise(res => canvas.toBlob(res, 'image/webp', quality))
    if (blob && blob.size < file.size) return blob
    return file
  } catch {
    return file
  }
}

/** Upload an image to Supabase Storage and return its public URL. */
export async function uploadImage(file: File, folder = 'misc'): Promise<string> {
  const body = await compress(file)
  const isWebp = body instanceof Blob && body.type === 'image/webp' && body !== file
  const ext = isWebp ? 'webp' : (file.name.split('.').pop() || 'png').toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, {
    cacheControl: '31536000',
    contentType: isWebp ? 'image/webp' : file.type,
    upsert: false,
  })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/* ---------- cleanup of removed images ---------- */

const CONTENT_TABLES = ['profile', 'skills', 'expertise', 'certifications', 'achievements', 'projects', 'experience', 'blog_posts', 'testimonials']
const MARK = `/storage/v1/object/public/${BUCKET}/`

/** Storage paths (inside our bucket) mentioned anywhere in `data` (rows, JSON, rich-text HTML). */
export function storagePaths(data: unknown): string[] {
  const text = typeof data === 'string' ? data : JSON.stringify(data ?? '')
  const out = new Set<string>()
  const re = new RegExp(MARK.replace(/[/.]/g, '\\$&') + '([^"\'\\s)\\\\?<>]+)', 'g')
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) out.add(decodeURIComponent(m[1]))
  return [...out]
}

/**
 * Delete files that were used by `before` but are no longer referenced by any saved row.
 * Fail-safe: if any table can't be read, nothing is deleted. Never throws.
 */
export async function pruneUnused(before: unknown): Promise<void> {
  try {
    const candidates = storagePaths(before)
    if (!candidates.length) return
    let all = ''
    for (const t of CONTENT_TABLES) {
      const { data, error } = await supabase.from(t).select('*')
      if (error) return
      all += JSON.stringify(data)
    }
    const stale = candidates.filter(p => !all.includes(p) && !all.includes(encodeURI(p)))
    if (stale.length) await supabase.storage.from(BUCKET).remove(stale)
  } catch { /* cleanup is best-effort */ }
}