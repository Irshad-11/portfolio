import type { RawPortfolio } from '../lib/types'

/** Insert or replace the draft in a list so the live preview shows it (always visible). */
export function mergeDraft<T extends { id: string }>(items: T[], draft: Partial<T>, force: Record<string, unknown> = {}): T[] {
  const id = draft.id || 'draft'
  const d = { created_at: new Date().toISOString(), sort_order: 99999, visible: true, ...draft, id, ...force } as unknown as T
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) return [...items, d]
  const next = [...items]
  next[idx] = d
  return next
}

export type PreviewSpec = {
  label: string
  view: import('../lib/preview').PreviewView
  focus?: string
  patch?: Partial<RawPortfolio>
}