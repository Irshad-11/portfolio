import { CSSProperties } from 'react'
import type { RibbonConfig, RibbonSeparator } from '../lib/types'

const SEP: Record<RibbonSeparator, string> = { dot: '●', slash: '/', star: '✦', diamond: '◆', bar: '|' }

function Track({ cfg, hidden, compact }: { cfg: RibbonConfig; hidden?: boolean; compact?: boolean }) {
  const items = cfg.items.filter(i => i.text.trim())
  const reps = Math.max(1, Math.ceil((compact ? 10 : 8) / Math.max(1, items.length)))
  const list = Array.from({ length: reps }).flatMap(() => items)
  return (
    <ul className="ribbon-group" aria-hidden={hidden || undefined}>
      {list.map((it, i) => (
        <li key={`${it.id}-${i}`} className="ribbon-item">
          <span>{it.text}</span>
          <span style={{ fontSize: cfg.separator === 'dot' ? '0.45em' : '0.9em', opacity: 0.75 }}>{SEP[cfg.separator]}</span>
        </li>
      ))}
    </ul>
  )
}

function Band({ cfg, className = '', reverse = false, compact = false }: { cfg: RibbonConfig; className?: string; reverse?: boolean; compact?: boolean }) {
  const dirRev = (cfg.direction === 'right') !== reverse
  return (
    <div className={`ribbon ribbon-${cfg.style} ${cfg.pause_on_hover ? 'pause' : ''} ${compact ? 'compact' : ''} ${className}`} role="marquee" aria-label={cfg.items.map(i => i.text).join(', ')}>
      <div className={`ribbon-track ${dirRev ? 'rev' : ''}`} style={{ '--speed': `${cfg.speed}s` } as CSSProperties}>
        <Track cfg={cfg} compact={compact} />
        <Track cfg={cfg} hidden compact={compact} />
      </div>
    </div>
  )
}

/** Scrolling ribbon banner — solid / inverted / outlined, optionally tilted or crossed. */
export default function Ribbon({ cfg, compact = false }: { cfg: RibbonConfig; compact?: boolean }) {
  if (!cfg.enabled || !cfg.items.some(i => i.text.trim())) return null
  if (compact) return <Band cfg={cfg} compact />
  const tilted = cfg.tilt || cfg.double
  return (
    <div className={`ribbon-stage ${tilted ? 'tilted' : ''}`}>
      <Band cfg={cfg} />
      {cfg.double && <Band cfg={{ ...cfg, style: cfg.style === 'accent' ? 'ink' : 'accent' }} className="ribbon-b" reverse />}
    </div>
  )
}