/* =============================================================
   DATABASE ROW TYPES
   ============================================================= */

export interface Profile {
  id: string
  name: string
  title: string
  tagline: string
  bio: string // rich HTML (plain text is also accepted)
  email: string
  phone?: string
  location: string
  avatar_url?: string
  resume_url?: string
  github_url?: string
  linkedin_url?: string
  twitter_url?: string
  website_url?: string
  years_experience: number
  projects_count: number
  clients_count: number
  // v3 — JSON configuration blocks (all optional, merged with defaults)
  links?: LinkItem[] | null
  hero?: Partial<HeroConfig> | null
  about?: Partial<AboutConfig> | null
  site?: Partial<SiteSettings> | null
  ribbon?: Partial<RibbonConfig> | null
  sections?: Partial<SectionsConfig> | null
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  icon?: string | null // simple-icons slug (e.g. "react") or "lucide:key"
  icon_url?: string | null // optional custom image URL (takes priority)
  sort_order: number
  visible: boolean
  created_at: string
}

export interface Expertise {
  id: string
  title: string
  category: string
  level: number // 1..5
  note?: string | null
  tags: string[]
  sort_order: number
  visible: boolean
  created_at: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issue_date?: string | null
  expiry_date?: string | null
  credential_id?: string | null
  credential_url?: string | null
  image_url?: string | null // the certificate itself
  badge_url?: string | null // issuer logo / badge
  description?: string | null // rich HTML
  skills: string[]
  sort_order: number
  visible: boolean
  created_at: string
}

export interface Achievement {
  id: string
  title: string
  summary?: string | null // short line for the list
  description?: string | null // legacy short text
  content?: string | null // rich HTML
  icon: string
  date?: string | null
  image_url?: string | null
  images: string[]
  sort_order: number
  visible: boolean
  created_at: string
}

export type ProjectStatus = 'live' | 'coming_soon' | 'wip'

export interface Project {
  id: string
  slug: string
  title: string
  description?: string | null
  long_description?: string | null // rich HTML
  tech_stack: string[]
  live_url?: string | null
  github_url?: string | null
  npm_url?: string | null
  image_url?: string | null
  images: string[]
  project_date?: string | null
  status: ProjectStatus
  featured: boolean
  sort_order: number
  visible: boolean
  created_at: string
}

export interface Experience {
  id: string
  company: string
  role: string
  period?: string | null
  location?: string | null
  website?: string | null
  description: string[]
  tech_stack: string[]
  sort_order: number
  visible: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null // rich HTML
  tags: string[]
  read_time: string
  image_url?: string | null
  published: boolean
  sort_order: number
  visible: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string | null
  company?: string | null
  company_url?: string | null
  avatar_url?: string | null
  content: string // rich HTML
  sort_order: number
  visible: boolean
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  created_at: string
}

export interface PageVisit {
  id: string
  visitor_id: string
  visitor_ip?: string
  user_agent?: string
  referrer?: string
  created_at: string
}

export interface SectionVisit {
  id: string
  visitor_id: string
  section_name: string
  created_at: string
}

export interface MessageDraft {
  id: string
  visitor_id?: string
  name_provided: boolean
  email_provided: boolean
  message_length: number
  created_at: string
}

/* =============================================================
   CONFIG BLOCKS (stored as JSON on the profile row)
   ============================================================= */

/** A link with an icon. Each placement can be toggled independently. */
export interface LinkItem {
  id: string
  label: string
  url: string
  icon: string // lucide key ("github") or brand ("si:whatsapp")
  hero: boolean
  about: boolean
  contact: boolean
  footer: boolean
}

export type CtaStyle = 'solid' | 'outline' | 'ghost' | 'link' | 'ticket'

export interface HeroCta {
  id: string
  label: string
  url: string // "#projects", "/projects", "https://…", "mailto:…" or "@resume"
  style: CtaStyle
  icon: string // '' for none
  enabled: boolean
  new_tab: boolean
}

export interface HeroSpec {
  id: string
  label: string
  value: string
}

export interface HeroConfig {
  eyebrow: string
  layout: 'split' | 'stacked'
  show_avatar: boolean
  show_specs: boolean
  specs: HeroSpec[]
  show_status: boolean
  status_text: string
  status_tone: 'open' | 'busy' | 'off'
  show_contacts: boolean
  show_clock: boolean
  timezone: string
  clock_label: string
  show_scroll: boolean
  ctas: HeroCta[]
}

export interface AboutImage {
  id: string
  url: string
  caption: string
}

export interface AboutStat {
  id: string
  value: string
  suffix: string
  label: string
  enabled: boolean
}

export interface AboutFact {
  id: string
  label: string
  value: string
}

export type SlideEffect = 'fade' | 'slide' | 'stack' | 'reveal'

export interface AboutConfig {
  show_images: boolean
  images: AboutImage[]
  effect: SlideEffect
  autoplay: boolean
  interval: number // seconds
  image_side: 'left' | 'right'
  show_facts: boolean
  facts: AboutFact[]
  show_location: boolean
  location_url: string
  show_links: boolean
  show_stats: boolean
  stats: AboutStat[]
}

export type RibbonStyle = 'accent' | 'ink' | 'outline'
export type RibbonSeparator = 'dot' | 'slash' | 'star' | 'diamond' | 'bar'

export interface RibbonItem {
  id: string
  text: string
}

export interface RibbonConfig {
  enabled: boolean
  position: 'after_hero' | 'before_footer' | 'both' | 'top'
  items: RibbonItem[]
  separator: RibbonSeparator
  style: RibbonStyle
  tilt: boolean
  double: boolean
  speed: number // seconds per loop (higher = slower)
  direction: 'left' | 'right'
  pause_on_hover: boolean
}

export interface SiteSettings {
  accent: string
  default_mode: 'dark' | 'light' | 'system'
  allow_toggle: boolean
  grid_enabled: boolean
  grid_size: number
  grid_interactive: boolean
  nav_cta_enabled: boolean
  nav_cta_label: string
  nav_cta_url: string
  footer_text: string
  seo_title: string
  seo_description: string
}

export type SectionKey =
  | 'about' | 'skills' | 'certifications' | 'achievements'
  | 'projects' | 'experience' | 'blog' | 'testimonials' | 'contact'

export interface SectionCfg {
  enabled: boolean
  title: string
  subtitle: string
}

export interface SectionsConfig {
  order: SectionKey[]
  items: Record<SectionKey, SectionCfg>
}

export interface SiteConfig {
  hero: HeroConfig
  about: AboutConfig
  site: SiteSettings
  ribbon: RibbonConfig
  sections: SectionsConfig
  links: LinkItem[]
}

/** A section that is enabled *and* has something to show. */
export interface ActiveSection {
  key: SectionKey
  title: string
  subtitle: string
  index: number // 1-based display number
  nav: string // short label for navigation
}

/** Everything the public site renders. */
export interface PortfolioData {
  profile: Profile | null
  config: SiteConfig
  sections: ActiveSection[]
  skills: Skill[]
  expertise: Expertise[]
  certifications: Certification[]
  achievements: Achievement[]
  projects: Project[]
  experience: Experience[]
  blogPosts: BlogPost[]
  testimonials: Testimonial[]
}

/** Raw data shape sent to the live-preview iframe. */
export interface RawPortfolio {
  profile: Profile | null
  skills: Skill[]
  expertise: Expertise[]
  certifications: Certification[]
  achievements: Achievement[]
  projects: Project[]
  experience: Experience[]
  blogPosts: BlogPost[]
  testimonials: Testimonial[]
}