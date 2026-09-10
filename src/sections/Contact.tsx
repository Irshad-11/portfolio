import { useState, useEffect, useRef } from 'react'
import { Send, CheckCircle, Github, Linkedin, Twitter, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { trackMessageDraft } from '../lib/analytics'
import { useData } from '../context/DataContext'
import { useScrollReveal } from '../hooks/useScrollReveal'
import SectionHeading from '../components/SectionHeading'

export default function Contact() {
  const { profile } = useData()
  const ref = useScrollReveal('contact')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const hasDraftRef = useRef(false)

  // Track draft on page leave
  useEffect(() => {
    const handler = () => {
      if (hasDraftRef.current && !sent) {
        trackMessageDraft({
          nameProvided: form.name.length > 0,
          emailProvided: form.email.length > 0,
          messageLength: form.message.length,
        })
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [form, sent])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (value.length > 0) hasDraftRef.current = true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return toast.error('Please fill all fields')
    setSending(true)
    const { error } = await supabase.from('contact_messages').insert([form])
    if (error) {
      toast.error('Something went wrong. Try again.')
    } else {
      setSent(true)
      hasDraftRef.current = false
      toast.success('Message sent!')
    }
    setSending(false)
  }

  return (
    <section id="contact" ref={ref as React.RefObject<HTMLElement>} className="section-base">
      <div className="max-w-5xl mx-auto">
        <div className="reveal">
          <SectionHeading title="Get In Touch" subtitle="Have a project in mind? Let's build something great together." />
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Left info */}
          <div className="md:col-span-2 space-y-6 reveal-left">
            <p className="text-[color:var(--text-muted)] text-sm leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            {profile?.email && (
              <a href={`mailto:${profile.email}`}
                 className="flex items-center gap-3 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors group">
                <div className="w-9 h-9 glass rounded-lg flex items-center justify-center group-hover:border-[color:var(--accent)] transition-colors">
                  <Mail size={15} className="accent" />
                </div>
                {profile.email}
              </a>
            )}

            <div className="flex gap-3 pt-2">
              {profile?.github_url && (
                <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                   className="glass p-2.5 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-all">
                  <Github size={18} />
                </a>
              )}
              {profile?.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                   className="glass p-2.5 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-all">
                  <Linkedin size={18} />
                </a>
              )}
              {profile?.twitter_url && (
                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer"
                   className="glass p-2.5 rounded-lg text-[color:var(--text-muted)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] transition-all">
                  <Twitter size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3 reveal-right">
            {sent ? (
              <div className="glass rounded-xl p-10 text-center space-y-3">
                <CheckCircle size={40} className="accent mx-auto" />
                <h3 className="font-semibold text-[color:var(--text)]">Message sent!</h3>
                <p className="text-sm text-[color:var(--text-muted)]">I'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                        className="btn-outline text-xs mt-2">
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="admin-label">Name</label>
                    <input name="name" value={form.name} onChange={handleChange}
                           className="admin-input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="admin-label">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                           className="admin-input" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="admin-label">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                            rows={5} className="admin-input resize-none"
                            placeholder="Tell me about your project..." />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full gap-2 py-3">
                  <Send size={15} />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
