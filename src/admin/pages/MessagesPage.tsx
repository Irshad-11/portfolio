import { useEffect, useState } from 'react'
import { Trash2, Mail, MailOpen, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'
import type { ContactMessage } from '../../lib/types'

export default function MessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    setItems(data ?? []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  const markRead = async (msg: ContactMessage) => {
    if (msg.read) return
    await supabase.from('contact_messages').update({ read: true }).eq('id', msg.id)
    setItems(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    if (selected?.id === msg.id) setSelected({ ...msg, read: true })
  }

  const del = async (id: string) => {
    if (!confirm('Delete message?')) return
    await supabase.from('contact_messages').delete().eq('id', id)
    toast.success('Deleted')
    if (selected?.id === id) setSelected(null)
    load()
  }

  const open = (msg: ContactMessage) => { setSelected(msg); markRead(msg) }
  const unread = items.filter(m => !m.read).length

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">
            Messages
            {unread > 0 && <span className="ml-2 text-sm font-normal bg-red-500 text-white px-2 py-0.5 rounded-full">{unread} new</span>}
          </h1>
          <p className="text-xs text-[color:var(--text-faint)] mt-0.5">{items.length} total messages</p>
        </div>
        <button onClick={load} className="text-[color:var(--text-faint)] hover:text-[color:var(--text)] transition-colors p-2"><RefreshCw size={16} /></button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32"><div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <Mail size={32} className="mx-auto text-[color:var(--text-faint)] mb-3 opacity-30" />
          <p className="text-[color:var(--text-faint)] text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-4">
          {/* List */}
          <div className="lg:col-span-2 space-y-2">
            {items.map(msg => (
              <button
                key={msg.id}
                onClick={() => open(msg)}
                className={`w-full text-left glass rounded-xl p-4 transition-all duration-200 ${
                  selected?.id === msg.id
                    ? 'border-[color:var(--accent)] bg-[color:var(--accent-subtle)]'
                    : 'glass-hover'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex-shrink-0 ${msg.read ? 'text-[color:var(--text-faint)]' : 'accent'}`}>
                    {msg.read ? <MailOpen size={14} /> : <Mail size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-medium truncate ${msg.read ? 'text-[color:var(--text-muted)]' : 'text-[color:var(--text)]'}`}>{msg.name}</p>
                      {!msg.read && <span className="w-2 h-2 accent-bg rounded-full flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-[color:var(--text-faint)] truncate">{msg.email}</p>
                    <p className="text-xs text-[color:var(--text-faint)] truncate mt-0.5 italic">{msg.message}</p>
                    <p className="text-[10px] text-[color:var(--text-faint)] mt-1.5 font-mono">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <div className="glass rounded-xl p-6 sticky top-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-[color:var(--text)]">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="accent text-sm hover:opacity-80 transition-opacity">{selected.email}</a>
                    <p className="text-xs text-[color:var(--text-faint)] mt-1 font-mono">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <a href={`mailto:${selected.email}?subject=Re: Your message`} className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1.5">
                      <Mail size={11} /> Reply
                    </a>
                    <button onClick={() => del(selected.id)} className="p-1.5 text-[color:var(--text-faint)] hover:text-red-400 border border-[color:var(--border)] rounded-lg transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4 border border-[color:var(--border)]">
                  <p className="text-sm text-[color:var(--text-muted)] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </div>
            ) : (
              <div className="glass rounded-xl p-12 text-center">
                <Mail size={28} className="mx-auto text-[color:var(--text-faint)] mb-3 opacity-30" />
                <p className="text-sm text-[color:var(--text-faint)]">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
