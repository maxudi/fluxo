import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LOGOS = [
  { src: '/logos/mpmg.png', alt: 'MPMG' },
  { src: '/logos/ppmg.png', alt: 'PPMG' },
  { src: '/logos/pcmg.png', alt: 'PCMG' },
  { src: '/logos/pmmg.png', alt: 'PMMG' },
  { src: '/logos/gaeco.png', alt: 'GAECO' },
]

function LogoImg({ src, alt }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
        {alt}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setErr(true)}
      className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
    />
  )
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao autenticar')
      } else {
        login(data.token, data.user)
        navigate('/', { replace: true })
      }
    } catch {
      setError('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center px-4 gap-8">
      {/* Logos institucionais */}
      <div className="flex items-center justify-center gap-8 flex-wrap max-w-lg">
        {LOGOS.map(l => (
          <LogoImg key={l.src} {...l} />
        ))}
      </div>

      {/* Card de login */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-[#0f3973] px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">GAECO</h1>
            <p className="text-blue-200 text-xs">Cadeia de Custódia Digital — Regional Uberlândia</p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Usuário
            </label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3973] focus:border-transparent transition"
              required
              disabled={loading}
              spellCheck={false}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f3973] focus:border-transparent transition"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0f3973] hover:bg-[#0c2d5e] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <p className="text-slate-600 text-xs">Sistema de uso interno — acesso restrito</p>
    </div>
  )
}
