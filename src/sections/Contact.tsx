import { useEffect, useRef, useState } from 'react'
import { Send, Check, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { trackMessageDraft } from '../lib/analytics'
import { useData } from '../context/DataContext'
import { SectionShell, ActionLink } from '../components/ui'
import { DynamicIcon } from '../lib/icons'

export default function Contact() {
  const { profile, config, sections } = useData()
  const sec = sections.find(s => s.key === 'contact')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [trap, setTrap] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const draft = useRef(false)

  useEffect(() => {
    const onLeave = () => {
      if (draft.current && !sent) trackMessageDraft({ nameProvided: !!form.name, emailProvided: !!form.email, messageLength: form.message.length })
    }
    window.addEventListener('beforeunload', onLeave)
    return () => window.removeEventListener('beforeunload', onLeave)
  }, [form, sent])

  if (!sec) return null
  const links = config.links.filter(l => l.contact)
  const h = config.hero

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    if (e.target.value) draft.current = true
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (trap) return
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return toast.error('Please fill in all fields')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error('That email address looks off')
    setSending(true)
    const { error } = await supabase.from('contact_messages').insert([form])
    setSending(false)
    if (error) return toast.error('Something went wrong. Please try again.')
    setSent(true); draft.current = false
    toast.success('Message sent')
  }

  const copy = async () => {
    if (!profile?.email) return
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* ignore */ }
  }

  return (
    <SectionShell id="contact" index={sec.index} title={sec.title} subtitle={sec.subtitle}>
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="reveal-left lg:col-span-5 space-y-10">
          {h.show_status && (
            <p className={`mono !normal-case inline-flex items-center gap-3 tone-${h.status_tone}`}>
              <span className="pill-dot" /><span className="text-ink">{h.status_text}</span>
            </p>
          )}
          {profile?.email && (
            <div>
              <p className="label mb-3">Email</p>
              <div className="flex items-center gap-3 flex-wrap">
                <a href={`mailto:${profile.email}`} className="font-display font-semibold text-ink text-lg sm:text-2xl u-link break-all">{profile.email}</a>
                <button onClick={copy} className="icon-btn !w-9 !h-9" aria-label="Copy email">{copied ? <Check size={15} /> : <Copy size={15} />}</button>
              </div>
            </div>
          )}
          {profile?.phone && (
            <div><p className="label mb-3">Phone</p><a href={`tel:${profile.phone}`} className="text-ink text-lg u-link">{profile.phone}</a></div>
          )}
          {links.length > 0 && (
            <div>
              <p className="label mb-3">Find me on</p>
              <ul className="ledger">
                {links.map(l => (
                  <li key={l.id}>
                    <ActionLink href={l.url} className="group flex items-center gap-4 py-3.5 text-muted hover:text-ink transition-colors">
                      <span className="text-[color:var(--accent)]"><DynamicIcon name={l.icon} size={17} /></span>
                      <span className="flex-1">{l.label}</span>
                      <span className="mono text-faint group-hover:text-[color:var(--accent)] transition-colors">↗</span>
                    </ActionLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="reveal-right lg:col-span-7">
          {sent ? (
            <div className="marks border border-line p-10 sm:p-14 text-center" style={{ background: 'var(--bg)' }}>
              <span className="mx-auto w-14 h-14 border border-[color:var(--accent)] text-[color:var(--accent)] flex items-center justify-center"><Check size={26} /></span>
              <h3 className="font-display font-semibold text-ink text-2xl mt-6">Message received.</h3>
              <p className="text-muted mt-2">Thanks for reaching out — I&apos;ll reply as soon as I can.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }} className="btn btn-outline mt-8">Send another</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="border border-line rounded p-5 sm:p-6 space-y-5" style={{ background: 'var(--bg)' }}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label htmlFor="c-name" className="label block mb-2">Name</label><input id="c-name" name="name" value={form.name} onChange={change} className="field" placeholder="Your name" autoComplete="name" required /></div>
                <div><label htmlFor="c-email" className="label block mb-2">Email</label><input id="c-email" name="email" type="email" value={form.email} onChange={change} className="field" placeholder="you@example.com" autoComplete="email" required /></div>
              </div>
              <div><label htmlFor="c-msg" className="label block mb-2">Message</label><textarea id="c-msg" name="message" value={form.message} onChange={change} className="field" placeholder="Tell me about your project or idea…" required /></div>
              <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)} className="hidden" aria-hidden />
              <button type="submit" disabled={sending} className="btn btn-solid w-full sm:w-auto"><Send size={15} />{sending ? 'Sending…' : 'Send message'}</button>
            </form>
          )}
        </div>
      </div>
    </SectionShell>
  )
}