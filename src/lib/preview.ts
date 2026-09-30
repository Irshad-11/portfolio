import type { RawPortfolio } from './types'

/** Views the live-preview iframe can render. */
export type PreviewView =
  | 'home' | 'hero' | 'about' | 'skills' | 'certifications' | 'achievements'
  | 'projects' | 'experience' | 'blog' | 'testimonials' | 'contact' | 'ribbon'
  | 'project' | 'post' | 'certificate' | 'achievement'

export interface PreviewMessage {
  source: 'irshad-admin'
  type: 'data'
  view: PreviewView
  focus?: string // id/slug of the item for detail views
  mode: 'dark' | 'light'
  payload: RawPortfolio
}

export const PREVIEW_READY = { source: 'irshad-preview', type: 'ready' } as const