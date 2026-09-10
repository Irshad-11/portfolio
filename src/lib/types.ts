export interface Profile {
  id: string
  name: string
  title: string
  tagline: string
  bio: string
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
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string
  icon_url?: string
  sort_order: number
  visible: boolean
  created_at: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  issue_date?: string
  credential_url?: string
  badge_url?: string
  description?: string
  sort_order: number
  visible: boolean
  created_at: string
}

export interface Achievement {
  id: string
  title: string
  description?: string
  icon: string
  date?: string
  sort_order: number
  visible: boolean
  created_at: string
}

export type ProjectStatus = 'live' | 'coming_soon' | 'wip'

export interface Project {
  id: string
  slug: string
  title: string
  description?: string
  long_description?: string
  tech_stack: string[]
  live_url?: string
  github_url?: string
  npm_url?: string
  image_url?: string
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
  period?: string
  location?: string
  website?: string
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
  excerpt?: string
  content?: string
  tags: string[]
  read_time: string
  image_url?: string
  published: boolean
  sort_order: number
  visible: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  company_url?: string
  avatar_url?: string
  content: string
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

// Theme types
export type ThemeName = 'dark-red' | 'dark-indigo' | 'dark-cyan' | 'dark-amber' | 'dark-rose'

export interface ThemeConfig {
  name: ThemeName
  label: string
  accent: string
  preview: string
}

export const THEMES: ThemeConfig[] = [
  { name: 'dark-red',    label: 'Crimson',   accent: '#ef4444', preview: 'bg-red-500' },
  { name: 'dark-indigo', label: 'Indigo',    accent: '#6366f1', preview: 'bg-indigo-500' },
  { name: 'dark-cyan',   label: 'Cyan',      accent: '#06b6d4', preview: 'bg-cyan-500' },
  { name: 'dark-amber',  label: 'Amber',     accent: '#f59e0b', preview: 'bg-amber-500' },
  { name: 'dark-rose',   label: 'Rose',      accent: '#f43f5e', preview: 'bg-rose-500' },
]
