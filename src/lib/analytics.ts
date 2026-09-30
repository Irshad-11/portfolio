import { supabase } from './supabase'

/** Never record visits coming from the admin panel or its live-preview frame. */
const skip = () => typeof location !== 'undefined' && (location.pathname.startsWith('/admin') || location.pathname.startsWith('/__preview'))

// Get or create a persistent visitor ID stored in localStorage
export function getVisitorId(): string {
  const key = 'portfolio_visitor_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

// Track a page visit
export async function trackPageVisit(): Promise<void> {
  if (skip()) return
  try {
    const visitorId = getVisitorId()
    await supabase.from('page_visits').insert([{
      visitor_id: visitorId,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    }])
  } catch (_) {
    // Fail silently — analytics should never break the UI
  }
}

// Track a section becoming visible
export async function trackSectionVisit(sectionName: string): Promise<void> {
  if (skip()) return
  try {
    const visitorId = getVisitorId()
    await supabase.from('section_visits').insert([{
      visitor_id: visitorId,
      section_name: sectionName,
    }])
  } catch (_) {
    // Fail silently
  }
}

// Track a message draft (user typed but didn't send)
export async function trackMessageDraft(opts: {
  nameProvided: boolean
  emailProvided: boolean
  messageLength: number
}): Promise<void> {
  if (skip() || opts.messageLength < 10) return // Ignore very short drafts
  try {
    const visitorId = getVisitorId()
    await supabase.from('message_drafts').insert([{
      visitor_id: visitorId,
      name_provided: opts.nameProvided,
      email_provided: opts.emailProvided,
      message_length: opts.messageLength,
    }])
  } catch (_) {
    // Fail silently
  }
}