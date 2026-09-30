import DOMPurify from 'dompurify'

/** True if the string already contains HTML tags. */
export const looksLikeHtml = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s)

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Turn legacy plain text into paragraphs. */
export function toHtml(input?: string | null): string {
  if (!input) return ''
  if (looksLikeHtml(input)) return input
  return input.split(/\n{2,}/).map(p => `<p>${esc(p).replace(/\n/g, '<br/>')}</p>`).join('')
}

let hooked = false
export function sanitize(html?: string | null): string {
  if (!html) return ''
  if (!hooked) {
    hooked = true
    DOMPurify.addHook('afterSanitizeAttributes', node => {
      if (node.tagName === 'A') {
        const href = node.getAttribute('href') || ''
        if (/^https?:/i.test(href)) {
          node.setAttribute('target', '_blank')
          node.setAttribute('rel', 'noopener noreferrer')
        }
      }
      if (node.tagName === 'IMG') {
        node.setAttribute('loading', 'lazy')
        node.setAttribute('decoding', 'async')
      }
    })
  }
  return DOMPurify.sanitize(toHtml(html), {
    ADD_ATTR: ['target', 'style'],
    FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input'],
  })
}

export function htmlToText(html?: string | null): string {
  if (!html) return ''
  return toHtml(html).replace(/<\/(p|h[1-6]|li|blockquote|div)>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim()
}

export function readingTime(html?: string | null): string {
  const words = htmlToText(html).split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 210))} min read`
}

export interface TocItem { id: string; text: string; level: 2 | 3 }

/** Adds ids to h2/h3 headings and returns a table of contents. */
export function withToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  if (typeof DOMParser === 'undefined' || !html) return { html, toc }
  const doc = new DOMParser().parseFromString(`<div id="r">${html}</div>`, 'text/html')
  const root = doc.getElementById('r')!
  const used = new Set<string>()
  root.querySelectorAll('h2, h3').forEach(h => {
    const text = (h.textContent || '').trim()
    if (!text) return
    let id = text.toLowerCase().replace(/[^a-z0-9ঀ-৿]+/g, '-').replace(/^-|-$/g, '') || 'section'
    let n = 2
    const base = id
    while (used.has(id)) id = `${base}-${n++}`
    used.add(id)
    h.id = id
    toc.push({ id, text, level: h.tagName === 'H2' ? 2 : 3 })
  })
  return { html: root.innerHTML, toc }
}

/** Extract the first N chars of readable text for excerpts. */
export const excerptOf = (html?: string | null, n = 180) => {
  const t = htmlToText(html)
  return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, '') + '…' : t
}

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9ঀ-৿]+/g, '-').replace(/^-+|-+$/g, '')