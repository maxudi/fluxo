import { useState } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  {
    path: '/', label: 'Painel Geral', exact: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5 w-[18px] h-[18px] flex-shrink-0">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    path: '/origem', label: '1. Origem',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    path: '/nic', label: '2. NIC',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
        <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    path: '/secretaria', label: '3. Secretaria',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        <polyline points="12 11 12 17"/><polyline points="9 14 15 14"/>
      </svg>
    ),
  },
  {
    path: '/laboratorio', label: '4. Laboratório',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <path d="M9 3h6M10 3v6.4L6.4 16C5.3 18 6.6 21 9 21h6c2.4 0 3.7-3 2.6-5L14 9.4V3"/>
        <line x1="8.5" y1="16" x2="15.5" y2="16"/>
      </svg>
    ),
  },
  {
    path: '/analise', label: '5. Análise',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
]

const ADMIN_ITEM = {
  path: '/admin', label: 'Administração',
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] flex-shrink-0">
      <circle cx="12" cy="8" r="4"/>
      <path d="M20 21a8 8 0 1 0-16 0"/>
      <circle cx="19" cy="19" r="3"/>
      <line x1="19" y1="16" x2="19" y2="19"/>
      <line x1="19" y1="19" x2="22" y2="19"/>
    </svg>
  ),
}

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(true)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const navItems = user?.role === 'admin' ? [...NAV_ITEMS, ADMIN_ITEM] : NAV_ITEMS

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        style={{ width: open ? 224 : 56, transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)' }}
        className="flex-shrink-0 bg-[#0f172a] flex flex-col shadow-2xl z-20 overflow-hidden"
      >
        {/* Logo area */}
        <div className="px-3 py-5 border-b border-slate-700 flex items-center gap-3 min-h-[72px]">
          <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-[#0f3973] flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div style={{ opacity: open ? 1 : 0, transition: 'opacity 0.15s', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <p className="text-white font-bold text-sm tracking-wide leading-tight">GAECO</p>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">Cadeia de Custódia</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ path, label, icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              title={!open ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0f3973] text-white shadow-lg shadow-blue-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              {icon}
              <span style={{ opacity: open ? 1 : 0, transition: 'opacity 0.1s', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Footer badge */}
        <div className="px-3 py-4 border-t border-slate-700 overflow-hidden">
          <p style={{ opacity: open ? 1 : 0, transition: 'opacity 0.15s', whiteSpace: 'nowrap' }}
             className="text-slate-500 text-[10px] uppercase tracking-widest text-center">
            Mapeamento de Processos
          </p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 z-10 shadow-sm">
          {/* Toggle sidebar */}
          <button
            onClick={() => setOpen(o => !o)}
            title={open ? 'Ocultar menu' : 'Exibir menu'}
            className="flex-shrink-0 w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-md hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
          >
            <span style={{ width: 16, height: 2, background: 'currentColor', borderRadius: 1, display: 'block', transition: 'transform 0.2s', transform: open ? 'none' : 'translateY(4px) rotate(0deg)' }} />
            <span style={{ width: 16, height: 2, background: 'currentColor', borderRadius: 1, display: 'block', opacity: open ? 1 : 0, transition: 'opacity 0.15s' }} />
            <span style={{ width: 16, height: 2, background: 'currentColor', borderRadius: 1, display: 'block', transition: 'transform 0.2s', transform: open ? 'none' : 'translateY(-4px) rotate(0deg)' }} />
          </button>

          <Breadcrumb location={location} />
          <div className="ml-auto flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs text-slate-500 font-medium hidden sm:block">
              {user?.username}
            </span>
            <button
              onClick={handleLogout}
              title="Sair"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 font-medium transition-colors px-2 py-1.5 rounded-md hover:bg-red-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function Breadcrumb({ location }) {
  const paths = {
    '/': 'Painel Geral — Macrofluxo',
    '/origem': 'Fase 1 — Origem e Apreensão',
    '/nic': 'Fase 2 — Regularização e Custódia (NIC)',
    '/secretaria': 'Fase 3 — Protocolo e Triagem (Secretaria)',
    '/laboratorio': 'Fase 4 — Processamento Técnico (Laboratório)',
    '/analise': 'Fase 5 — Análise de Dados e Destinação',
  }
  const current = paths[location.pathname] || 'GAECO'
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="text-slate-400">GAECO</span>
      <span className="text-slate-300">/</span>
      <span className="font-semibold text-slate-800">{current}</span>
    </div>
  )
}
