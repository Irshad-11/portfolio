import type {
  Profile, LinkItem, HeroConfig, AboutConfig, SiteSettings, RibbonConfig,
  SectionsConfig, SectionKey, SiteConfig, PortfolioData, RawPortfolio, ActiveSection,
} from './types'

export const uid = () => Math.random().toString(36).slice(2, 10)

export const SECTION_KEYS: SectionKey[] = [
  'about', 'skills', 'certifications', 'achievements',
  'projects', 'experience', 'blog', 'testimonials', 'contact',
]

export const SECTION_NAV: Record<SectionKey, string> = {
  about: 'About', skills: 'Skills', certifications: 'Certs', achievements: 'Awards',
  projects: 'Work', experience: 'Experience', blog: 'Writing', testimonials: 'Words', contact: 'Contact',
}

export const DEFAULT_SECTIONS: SectionsConfig = {
  order: [...SECTION_KEYS],
  items: {
    about:          { enabled: true, title: 'About', subtitle: '' },
    skills:         { enabled: true, title: 'Skills & Expertise', subtitle: 'The tools I work with, and the concepts underneath them.' },
    certifications: { enabled: true, title: 'Certifications', subtitle: 'Verified learning — open any entry for the full record.' },
    achievements:   { enabled: true, title: 'Achievements', subtitle: 'A running log of milestones.' },
    projects:       { enabled: true, title: 'Selected Work', subtitle: 'Things I have designed, built and shipped.' },
    experience:     { enabled: true, title: 'Experience', subtitle: '' },
    blog:           { enabled: true, title: 'Writing', subtitle: 'Notes on things I am learning and building.' },
    testimonials:   { enabled: true, title: 'Kind Words', subtitle: '' },
    contact:        { enabled: true, title: 'Contact', subtitle: 'Have a project, an internship or just a question? Say hello.' },
  },
}

export const DEFAULT_SITE: SiteSettings = {
  accent: '#2f6bd8',
  default_mode: 'light',
  allow_toggle: true,
  grid_enabled: true,
  grid_size: 56,
  grid_interactive: true,
  nav_cta_enabled: true,
  nav_cta_label: 'Contact',
  nav_cta_url: '#contact',
  footer_text: '',
  seo_title: '',
  seo_description: '',
}

export const DEFAULT_RIBBON: RibbonConfig = {
  enabled: true,
  position: 'after_hero',
  items: [
    { id: 'r1', text: 'Software Engineering' },
    { id: 'r2', text: 'University of Frontier Technology, Bangladesh' },
    { id: 'r3', text: 'Mymensingh, Bangladesh' },
    { id: 'r4', text: 'Open to opportunities' },
  ],
  separator: 'diamond',
  style: 'outline',
  tilt: false,
  double: false,
  speed: 38,
  direction: 'left',
  pause_on_hover: true,
}

export function defaultHero(p?: Partial<Profile> | null): HeroConfig {
  return {
    eyebrow: 'Software Engineering Student',
    layout: 'split',
    show_avatar: true,
    show_specs: true,
    specs: [
      { id: 's1', label: 'Base', value: p?.location || 'Mymensingh, Bangladesh' },
      { id: 's2', label: 'Studying', value: 'Software Engineering' },
      { id: 's3', label: 'University', value: 'University of Frontier Technology, Bangladesh' },
    ],
    show_status: true,
    status_text: 'Open to internships & collaboration',
    status_tone: 'open',
    show_contacts: true,
    show_clock: true,
    timezone: 'Asia/Dhaka',
    clock_label: 'Local time',
    show_scroll: true,
    ctas: [
      { id: 'c1', label: 'View my work', url: '#projects', style: 'solid', icon: 'arrow-down-right', enabled: true, new_tab: false },
      { id: 'c2', label: 'Get in touch', url: '#contact', style: 'outline', icon: '', enabled: true, new_tab: false },
    ],
  }
}

export function defaultAbout(p?: Partial<Profile> | null): AboutConfig {
  return {
    show_images: true,
    images: [],
    effect: 'fade',
    autoplay: true,
    interval: 5,
    image_side: 'left',
    show_facts: true,
    facts: [
      { id: 'f1', label: 'Education', value: 'B.Sc. Software Engineering' },
      { id: 'f2', label: 'University', value: 'University of Frontier Technology, Bangladesh' },
    ],
    show_location: true,
    location_url: '',
    show_links: true,
    show_stats: true,
    stats: [
      { id: 'st1', value: String(p?.years_experience ?? 4), suffix: '+', label: 'Years Experience', enabled: true },
      { id: 'st2', value: String(p?.projects_count ?? 20), suffix: '+', label: 'Projects Built', enabled: true },
      { id: 'st3', value: String(p?.clients_count ?? 15), suffix: '+', label: 'Happy Clients', enabled: true },
    ],
  }
}

/** Derive links from the legacy columns when the new `links` JSON is empty. */
export function legacyLinks(p?: Partial<Profile> | null): LinkItem[] {
  if (!p) return []
  const out: LinkItem[] = []
  const add = (label: string, url: string | undefined | null, icon: string, hero = true) => {
    if (url) out.push({ id: uid(), label, url, icon, hero, about: true, contact: true, footer: true })
  }
  add('Email', p.email ? `mailto:${p.email}` : '', 'mail')
  add('GitHub', p.github_url, 'github')
  add('LinkedIn', p.linkedin_url, 'linkedin')
  add('Twitter', p.twitter_url, 'twitter')
  add('Website', p.website_url, 'globe', false)
  return out
}

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

/** Shallow-per-key merge: objects merge, arrays/primitives replace. */
export function merge<T extends object>(base: T, over?: unknown): T {
  if (!isObj(over)) return base
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
  for (const k of Object.keys(over)) {
    const v = over[k]
    if (v === undefined || v === null) continue
    const b = (base as Record<string, unknown>)[k]
    out[k] = isObj(b) && isObj(v) ? merge(b, v) : v
  }
  return out as T
}

export function buildConfig(p: Profile | null): SiteConfig {
  const sections = merge(DEFAULT_SECTIONS, p?.sections)
  // make sure every key exists exactly once in `order`
  const seen = new Set<SectionKey>()
  const order = (sections.order || []).filter(k => SECTION_KEYS.includes(k) && !seen.has(k) && !!seen.add(k))
  SECTION_KEYS.forEach(k => { if (!seen.has(k)) order.push(k) })
  sections.order = order

  const links = Array.isArray(p?.links) && p!.links!.length ? (p!.links as LinkItem[]) : legacyLinks(p)

  return {
    hero: merge(defaultHero(p), p?.hero),
    about: merge(defaultAbout(p), p?.about),
    site: merge(DEFAULT_SITE, p?.site),
    ribbon: merge(DEFAULT_RIBBON, p?.ribbon),
    sections,
    links,
  }
}

const bySort = <T extends { sort_order: number; created_at: string }>(a: T, b: T) =>
  (a.sort_order ?? 0) - (b.sort_order ?? 0) || (a.created_at || '').localeCompare(b.created_at || '')

/** Turn raw rows into what the public site renders (filters hidden items). */
export function buildData(raw: RawPortfolio): PortfolioData {
  const config = buildConfig(raw.profile)
  const skills = raw.skills.filter(s => s.visible !== false).sort(bySort)
  const expertise = raw.expertise.filter(s => s.visible !== false).sort(bySort)
  const certifications = raw.certifications.filter(s => s.visible !== false).sort(bySort)
  const achievements = raw.achievements.filter(s => s.visible !== false).sort(bySort)
  const projects = raw.projects.filter(s => s.visible !== false).sort(bySort)
  const experience = raw.experience.filter(s => s.visible !== false).sort(bySort)
  const blogPosts = raw.blogPosts
    .filter(s => s.visible !== false && s.published !== false)
    .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
  const testimonials = raw.testimonials.filter(s => s.visible !== false).sort(bySort)

  const has: Record<SectionKey, boolean> = {
    about: !!raw.profile,
    skills: skills.length + expertise.length > 0,
    certifications: certifications.length > 0,
    achievements: achievements.length > 0,
    projects: projects.length > 0,
    experience: experience.length > 0,
    blog: blogPosts.length > 0,
    testimonials: testimonials.length > 0,
    contact: true,
  }

  const sections: ActiveSection[] = []
  config.sections.order.forEach(key => {
    const c = config.sections.items[key]
    if (c.enabled && has[key]) {
      sections.push({ key, title: c.title, subtitle: c.subtitle, index: sections.length + 1, nav: SECTION_NAV[key] })
    }
  })

  return {
    profile: raw.profile, config, sections,
    skills, expertise, certifications, achievements, projects, experience, blogPosts, testimonials,
  }
}

export const EMPTY_RAW: RawPortfolio = {
  profile: null, skills: [], expertise: [], certifications: [], achievements: [],
  projects: [], experience: [], blogPosts: [], testimonials: [],
}