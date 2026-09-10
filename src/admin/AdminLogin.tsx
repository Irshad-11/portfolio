import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin/dashboard', { replace: true })
    })
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast.error(error.message)
    else navigate('/admin/dashboard', { replace: true })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[color:var(--bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl accent-bg mb-4">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--text)]">Admin Panel</h1>
          <p className="text-sm text-[color:var(--text-muted)] mt-1">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="admin-label">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="admin-input" placeholder="admin@example.com" autoComplete="email"
            />
          </div>

          <div>
            <label className="admin-label">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)}
                className="admin-input pr-10" placeholder="••••••••" autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--text-faint)] hover:text-[color:var(--text-muted)]">
                {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full gap-2 py-3 mt-2">
            <Lock size={15} />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-[color:var(--text-faint)] mt-6">
          <a href="/" className="hover:text-[color:var(--accent)] transition-colors">← Back to portfolio</a>
        </p>
      </div>
    </div>
  )
}
