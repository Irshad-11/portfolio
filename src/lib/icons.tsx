import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Github, Linkedin, Twitter, Facebook, Instagram, Youtube, Twitch, Dribbble, Figma, Gitlab,
  Codepen, Slack, Mail, Phone, Globe, MapPin, Link2, FileText, Send, MessageCircle, MessageSquare,
  Download, ExternalLink, ArrowUpRight, ArrowRight, ArrowDownRight, Briefcase, GraduationCap, Award,
  Trophy, Star, Heart, Code2, Terminal, Cpu, Database, Server, Cloud, Smartphone, Laptop, Monitor,
  BookOpen, Calendar, Clock, User, Users, Building2, Rocket, Zap, Shield, Lock, Key, Camera, Video,
  Music, Mic, Coffee, Lightbulb, Target, Flag, Bookmark, Newspaper, Rss, Share2, Paperclip, Layers,
  Puzzle, Wrench, Settings, Sparkles, Compass, Map as MapIcon, Navigation, Home, Palette, PenTool, Pencil, Hash,
  AtSign, Languages, Medal, BadgeCheck, Contact, Eye, Braces, GitBranch, Package, Box, Binary,
  Network, Bug, TestTube, ScrollText, Crown, Gem, Flame, Leaf, Sun, Moon, Check,
} from 'lucide-react'

/** Curated lucide icons the admin can choose from. */
export const ICON_MAP: Record<string, LucideIcon> = {
  github: Github, linkedin: Linkedin, twitter: Twitter, facebook: Facebook, instagram: Instagram,
  youtube: Youtube, twitch: Twitch, dribbble: Dribbble, figma: Figma, gitlab: Gitlab, codepen: Codepen,
  slack: Slack, mail: Mail, phone: Phone, globe: Globe, 'map-pin': MapPin, link: Link2, 'file-text': FileText,
  send: Send, 'message-circle': MessageCircle, 'message-square': MessageSquare, download: Download,
  'external-link': ExternalLink, 'arrow-up-right': ArrowUpRight, 'arrow-right': ArrowRight,
  'arrow-down-right': ArrowDownRight, briefcase: Briefcase, 'graduation-cap': GraduationCap, award: Award,
  trophy: Trophy, star: Star, heart: Heart, code: Code2, terminal: Terminal, cpu: Cpu, database: Database,
  server: Server, cloud: Cloud, smartphone: Smartphone, laptop: Laptop, monitor: Monitor, 'book-open': BookOpen,
  calendar: Calendar, clock: Clock, user: User, users: Users, building: Building2, rocket: Rocket, zap: Zap,
  shield: Shield, lock: Lock, key: Key, camera: Camera, video: Video, music: Music, mic: Mic, coffee: Coffee,
  lightbulb: Lightbulb, target: Target, flag: Flag, bookmark: Bookmark, newspaper: Newspaper, rss: Rss,
  share: Share2, paperclip: Paperclip, layers: Layers, puzzle: Puzzle, wrench: Wrench, settings: Settings,
  sparkles: Sparkles, compass: Compass, map: MapIcon, navigation: Navigation, home: Home, palette: Palette,
  'pen-tool': PenTool, pencil: Pencil, hash: Hash, 'at-sign': AtSign, languages: Languages, medal: Medal,
  'badge-check': BadgeCheck, contact: Contact, eye: Eye, braces: Braces, 'git-branch': GitBranch,
  package: Package, box: Box, binary: Binary, network: Network, bug: Bug, 'test-tube': TestTube,
  scroll: ScrollText, crown: Crown, gem: Gem, flame: Flame, leaf: Leaf, sun: Sun, moon: Moon, check: Check,
}
export const ICON_KEYS = Object.keys(ICON_MAP)

/** Brand icons (simple-icons slugs verified against the pinned version). */
export const BRAND_CATALOG: { slug: string; label: string }[] = [
  { slug: 'whatsapp', label: 'WhatsApp' }, { slug: 'telegram', label: 'Telegram' }, { slug: 'discord', label: 'Discord' },
  { slug: 'x', label: 'X' }, { slug: 'facebook', label: 'Facebook' }, { slug: 'instagram', label: 'Instagram' },
  { slug: 'youtube', label: 'YouTube' }, { slug: 'tiktok', label: 'TikTok' }, { slug: 'reddit', label: 'Reddit' },
  { slug: 'threads', label: 'Threads' }, { slug: 'bluesky', label: 'Bluesky' }, { slug: 'pinterest', label: 'Pinterest' },
  { slug: 'twitch', label: 'Twitch' }, { slug: 'spotify', label: 'Spotify' }, { slug: 'gmail', label: 'Gmail' },
  { slug: 'github', label: 'GitHub' }, { slug: 'gitlab', label: 'GitLab' }, { slug: 'bitbucket', label: 'Bitbucket' },
  { slug: 'stackoverflow', label: 'Stack Overflow' }, { slug: 'leetcode', label: 'LeetCode' }, { slug: 'codeforces', label: 'Codeforces' },
  { slug: 'codechef', label: 'CodeChef' }, { slug: 'hackerrank', label: 'HackerRank' }, { slug: 'geeksforgeeks', label: 'GeeksforGeeks' },
  { slug: 'kaggle', label: 'Kaggle' }, { slug: 'medium', label: 'Medium' }, { slug: 'devdotto', label: 'DEV' },
  { slug: 'hashnode', label: 'Hashnode' }, { slug: 'substack', label: 'Substack' }, { slug: 'behance', label: 'Behance' },
  { slug: 'dribbble', label: 'Dribbble' }, { slug: 'figma', label: 'Figma' }, { slug: 'fiverr', label: 'Fiverr' },
  { slug: 'upwork', label: 'Upwork' }, { slug: 'googlescholar', label: 'Google Scholar' }, { slug: 'researchgate', label: 'ResearchGate' },
  { slug: 'orcid', label: 'ORCID' }, { slug: 'npm', label: 'npm' }, { slug: 'replit', label: 'Replit' },
]

const SI_VERSION = '16.33.0'
export const brandUrl = (slug: string) => `https://cdn.jsdelivr.net/npm/simple-icons@${SI_VERSION}/icons/${slug}.svg`

const okCache = new Map<string, boolean>()

/** Monochrome brand icon painted with currentColor. Falls back to a link icon if the slug is unknown. */
export function BrandIcon({ slug, size = 18, className = '' }: { slug: string; size?: number; className?: string }) {
  const [ok, setOk] = useState<boolean>(okCache.get(slug) ?? true)
  useEffect(() => {
    if (okCache.has(slug)) { setOk(okCache.get(slug)!); return }
    const img = new Image()
    img.onload = () => { okCache.set(slug, true); setOk(true) }
    img.onerror = () => { okCache.set(slug, false); setOk(false) }
    img.src = brandUrl(slug)
  }, [slug])
  if (!ok) return <Link2 size={size} className={className} />
  const url = `url("${brandUrl(slug)}")`
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size, height: size,
        WebkitMaskImage: url, maskImage: url,
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center', maskPosition: 'center',
        WebkitMaskSize: 'contain', maskSize: 'contain',
      }}
    />
  )
}

/** Renders a lucide key, a brand ("si:slug"), or an emoji / short text. */
export function DynamicIcon({ name, size = 18, className = '' }: { name?: string | null; size?: number; className?: string }) {
  if (!name) return null
  if (name.startsWith('si:')) return <BrandIcon slug={name.slice(3)} size={size} className={className} />
  const Ico = ICON_MAP[name.replace(/^lucide:/, '')]
  if (Ico) return <Ico size={size} className={className} strokeWidth={1.75} />
  // emoji or plain text
  return <span className={className} style={{ fontSize: size, lineHeight: 1 }} aria-hidden>{name}</span>
}

/** Image icon for skills: custom URL > brand slug > lucide key. */
export function SkillIcon({ icon, iconUrl, name, size = 28 }: { icon?: string | null; iconUrl?: string | null; name: string; size?: number }) {
  if (iconUrl) return <img src={iconUrl} alt="" width={size} height={size} loading="lazy" decoding="async" style={{ width: size, height: size, objectFit: 'contain' }} />
  if (icon) return <DynamicIcon name={icon.includes(':') ? icon : `si:${icon}`} size={size} />
  return (
    <span className="font-display font-bold flex items-center justify-center border border-line" style={{ width: size, height: size, fontSize: size * 0.45 }}>
      {name.slice(0, 2).toUpperCase()}
    </span>
  )
}