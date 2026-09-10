import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Users, Eye, TrendingUp, MessageSquare, Clock, RefreshCw } from 'lucide-react'

interface DayVisit { date: string; views: number }
interface SectionStat { section: string; visits: number }

const ACCENT = 'var(--accent)'

export default function StatisticsPage() {
  const [totalViews, setTotalViews] = useState(0)
  const [uniqueVisitors, setUniqueVisitors] = useState(0)
  const [dailyData, setDailyData] = useState<DayVisit[]>([])
  const [sectionData, setSectionData] = useState<SectionStat[]>([])
  const [messagesSent, setMessagesSent] = useState(0)
  const [messageDrafts, setMessageDrafts] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  const load = async () => {
    setLoading(true)

    const [pvRes, uvRes, svRes, msRes, mdRes] = await Promise.all([
      supabase.from('page_visits').select('id, created_at', { count: 'exact' }),
      supabase.from('page_visits').select('visitor_id'),
      supabase.from('section_visits').select('section_name, created_at'),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      supabase.from('message_drafts').select('id', { count: 'exact', head: true }),
    ])

    setTotalViews(pvRes.count ?? 0)

    // Unique visitors
    if (uvRes.data) {
      const unique = new Set(uvRes.data.map(v => v.visitor_id))
      setUniqueVisitors(unique.size)
    }

    // Daily visits for last 30 days
    if (pvRes.data) {
      const byDay: Record<string, number> = {}
      const now = new Date()
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        byDay[d.toISOString().slice(0, 10)] = 0
      }
      pvRes.data.forEach(v => {
        const day = v.created_at.slice(0, 10)
        if (day in byDay) byDay[day]++
      })
      setDailyData(
        Object.entries(byDay).map(([date, views]) => ({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views,
        }))
      )
    }

    // Section popularity
    if (svRes.data) {
      const bySec: Record<string, number> = {}
      svRes.data.forEach(v => {
        bySec[v.section_name] = (bySec[v.section_name] ?? 0) + 1
      })
      setSectionData(
        Object.entries(bySec)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([section, visits]) => ({ section, visits }))
      )
    }

    setMessagesSent(msRes.count ?? 0)
    setMessageDrafts(mdRes.count ?? 0)
    setLastRefresh(new Date())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const conversionRate = messagesSent + messageDrafts > 0
    ? Math.round((messagesSent / (messagesSent + messageDrafts)) * 100)
    : 0

  const pieData = [
    { name: 'Sent', value: messagesSent, color: '#10b981' },
    { name: 'Abandoned', value: messageDrafts, color: 'var(--accent)' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Statistics</h1>
          <p className="text-xs text-[color:var(--text-faint)] mt-0.5">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <button onClick={load} disabled={loading}
                className="flex items-center gap-1.5 text-sm btn-outline py-2 px-3 disabled:opacity-50">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Page Views', value: totalViews, icon: Eye, color: 'text-cyan-400' },
          { label: 'Unique Visitors', value: uniqueVisitors, icon: Users, color: 'text-purple-400' },
          { label: 'Messages Sent', value: messagesSent, icon: MessageSquare, color: 'text-emerald-400' },
          { label: 'Abandoned Drafts', value: messageDrafts, icon: Clock, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass rounded-xl p-4">
            <Icon size={18} className={`${color} mb-3`} />
            <p className="text-2xl font-bold text-[color:var(--text)]">
              {loading ? <span className="w-12 h-6 bg-white/5 rounded animate-pulse inline-block" /> : value}
            </p>
            <p className="text-xs text-[color:var(--text-muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Daily visitors chart */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={15} className="accent" />
          <h2 className="text-sm font-semibold text-[color:var(--text)]">Page Views — Last 30 Days</h2>
        </div>
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin" />
          </div>
        ) : dailyData.every(d => d.views === 0) ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-xs text-[color:var(--text-faint)]">No visitor data yet. Data appears after visitors load your portfolio.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#52525b', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis tick={{ fill: '#52525b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                itemStyle={{ color: '#f5f5f5' }}
                labelStyle={{ color: '#a1a1aa' }}
              />
              <Line
                type="monotone" dataKey="views" stroke={ACCENT}
                strokeWidth={2} dot={false} activeDot={{ r: 4, fill: ACCENT }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Section popularity */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[color:var(--text)] mb-5">Most Visited Sections</h2>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-[color:var(--border)] border-t-[color:var(--accent)] rounded-full animate-spin" />
            </div>
          ) : sectionData.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-xs text-[color:var(--text-faint)] text-center">No section visit data yet.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={sectionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#52525b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="section" tick={{ fill: '#a1a1aa', fontSize: 10 }} tickLine={false} axisLine={false} width={75} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                  itemStyle={{ color: '#f5f5f5' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="visits" fill={ACCENT} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Message conversion */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[color:var(--text)] mb-1">Contact Form Conversion</h2>
          <p className="text-xs text-[color:var(--text-faint)] mb-4">
            Users who started typing vs those who actually sent a message
          </p>
          <div className="flex items-center gap-6">
            <PieChart width={130} height={130}>
              <Pie data={pieData} cx={60} cy={60} innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div className="space-y-3 flex-1">
              <div className="text-center glass rounded-xl p-3">
                <p className="text-3xl font-black text-[color:var(--text)]">{conversionRate}%</p>
                <p className="text-xs text-[color:var(--text-faint)]">Conversion Rate</p>
              </div>
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-2 text-xs text-[color:var(--text-muted)]">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  {d.name}: <span className="font-semibold text-[color:var(--text)]">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info note */}
      <p className="text-xs text-[color:var(--text-faint)] text-center">
        Visitors are tracked by a unique ID stored in their browser. Section visits are recorded when each section becomes visible.
        Abandoned drafts are tracked when a visitor types in the contact form but navigates away without sending.
      </p>
    </div>
  )
}
