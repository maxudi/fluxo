import { Link } from 'react-router-dom'

export default function FlowPage({
  phase, title, subtitle, children, prevPath, nextPath,
  saveLayout, resetLayout, isDirty,
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-5 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="flex-shrink-0 bg-[#0f3973] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                Fase {phase}
              </span>
              <h1 className="text-lg font-bold text-slate-900 leading-tight truncate">{title}</h1>
            </div>
            <p className="text-xs text-slate-500 pl-[3.25rem]">{subtitle}</p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Edit toolbar */}
            {saveLayout && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-400 hidden sm:inline">✥ Arraste nós</span>
                <div className="w-px h-4 bg-slate-200 hidden sm:block" />
                <button
                  onClick={resetLayout}
                  className="text-[11px] text-slate-500 hover:text-red-600 font-medium transition-colors px-1"
                  title="Restaurar posições padrão"
                >
                  Redefinir
                </button>
                <button
                  onClick={saveLayout}
                  disabled={!isDirty}
                  title={isDirty ? 'Salvar posições atuais dos nós' : 'Sem alterações para salvar'}
                  className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                    isDirty
                      ? 'bg-[#0f3973] text-white hover:bg-blue-900 shadow-sm cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
                  Salvar Layout
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-2">
              {prevPath && (
                <Link
                  to={prevPath.to}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  ← {prevPath.label}
                </Link>
              )}
              {nextPath && (
                <Link
                  to={nextPath.to}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#006bb5] hover:bg-[#0f3973] rounded-lg transition-colors"
                >
                  {nextPath.label} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Flow canvas */}
      <div className="flex-1 relative">
        {children}
      </div>

      {/* Logos footer */}
      <LogosFooter />
    </div>
  )
}

const LOGOS = [
  { src: '/logos/mpmg.png', alt: 'MPMG — Ministério Público de Minas Gerais' },
  { src: '/logos/ppmg.png', alt: 'PPMG — Penitenciária de Minas Gerais' },
  { src: '/logos/pcmg.png', alt: 'Polícia Civil — Minas Gerais' },
  { src: '/logos/pmmg.png', alt: 'Polícia Militar — Minas Gerais' },
  { src: '/logos/gaeco.png', alt: 'GAECO — Regional Uberlândia' },
]

function LogoImg({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-8 max-w-[120px] object-contain opacity-70 hover:opacity-100 transition-opacity"
      onError={e => {
        e.currentTarget.style.display = 'none'
        e.currentTarget.nextSibling.style.display = 'block'
      }}
    />
  )
}

function LogosFooter() {
  return (
    <div className="flex-shrink-0 bg-white border-t border-slate-100 px-5 py-2 flex items-center gap-6">
      <span className="text-[9px] text-slate-400 uppercase tracking-widest whitespace-nowrap">Realização</span>
      <div className="flex items-center gap-6 flex-wrap">
        {LOGOS.map(({ src, alt }) => (
          <div key={src} className="flex items-center">
            <LogoImg src={src} alt={alt} />
            <span
              style={{ display: 'none' }}
              className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide"
            >
              {alt.split('—')[0].trim()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
