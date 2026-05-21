import { Link } from 'react-router-dom'

const COLORS = {
  start: '#0f3973',
  step: '#006bb5',
  darkStep: '#334155',
  decision: '#f97316',
  alert: '#ef4444',
  end: '#00a859',
}

const LEGEND = [
  { color: COLORS.start, label: 'Início da Cadeia' },
  { color: COLORS.step, label: 'Ação / Procedimento' },
  { color: COLORS.decision, label: 'Ponto de Decisão' },
  { color: COLORS.alert, label: 'Bloqueio / Retorno' },
  { color: COLORS.end, label: 'Conclusão Processual' },
]

const LANES = [
  {
    id: 1,
    title: 'Origem e Apreensão',
    path: '/origem',
    nodes: [
      { color: COLORS.start, label: 'Apreensão da Evidência pela PM', sub: 'Flagrante, Mandado ou Entrega' },
      { color: COLORS.decision, label: 'Qual a Origem da Demanda?', sub: 'Triagem Inicial' },
      { color: COLORS.darkStep, label: 'Direcionado ao Plantão da Polícia Civil', sub: 'Cenário: Flagrante' },
      { color: COLORS.darkStep, label: 'Direcionado ao Ministério Público / NIC', sub: 'Cenário: Mandado ou Espontânea' },
    ],
  },
  {
    id: 2,
    title: 'NIC — Núcleo de Inteligência',
    path: '/nic',
    nodes: [
      { color: COLORS.darkStep, label: 'Aciona Promotor Natural p/ requerer liberação ao Delegado', sub: 'Se veio da Pol. Civil' },
      { color: COLORS.darkStep, label: 'Peticiona na Justiça a liberação do vestígio', sub: 'Se Mandado de fora' },
      { color: COLORS.step, label: 'Recolhe a Evidência e monta o arquivo (FAV + Decisão)', sub: 'Regularização formal' },
      { color: COLORS.step, label: 'Encaminha o material à Secretaria do GAECO', sub: 'Envio para Custódia' },
    ],
  },
  {
    id: 3,
    title: 'Secretaria GAECO',
    path: '/secretaria',
    nodes: [
      { color: COLORS.step, label: 'Recebe a Evidência física do NIC', sub: 'Check-in' },
      { color: COLORS.decision, label: 'Possui FAV, Solicitação e Decisão Judicial?', sub: 'Auditoria de Entrada' },
      { color: COLORS.alert, label: 'BLOQUEADO: Retorna ao NIC para regularização formal', sub: 'Se incompleto' },
      { color: COLORS.step, label: 'Recebe o material processado e aciona o NIC', sub: 'Pós-Extração' },
    ],
  },
  {
    id: 4,
    title: 'Laboratório Forense',
    path: '/laboratorio',
    nodes: [
      { color: COLORS.step, label: 'Recebe a evidência com documentação validada', sub: 'Triagem Interna' },
      { color: COLORS.step, label: 'Realiza a Extração Forense dos Dados', sub: 'Procedimento Técnico' },
      { color: COLORS.step, label: 'Restitui a Evidência e envia Resultados para Secretaria', sub: 'Conclusão' },
    ],
  },
  {
    id: 5,
    title: 'Análise e Destinação',
    path: '/analise',
    nodes: [
      { color: COLORS.darkStep, label: 'NIC assume os dados e decide estratégia de análise', sub: 'Distribuição' },
      { color: COLORS.decision, label: 'Quem executará a análise final?', sub: 'Estratégia' },
      { color: COLORS.step, label: 'Análise realizada internamente pelo NIC', sub: 'Opção 1' },
      { color: COLORS.step, label: 'Compartilhado com Inteligências Parceiras', sub: '17ºBPM, 32ºBPM, CIAPE' },
      { color: COLORS.end, label: 'Agências dão ciência obrigatória ao NIC dos relatórios', sub: 'Fim do Processo' },
    ],
  },
]

function Node({ color, label, sub }) {
  const isDecision = color === COLORS.decision
  const isAlert = color === COLORS.alert

  return (
    <div className="flex items-center flex-shrink-0">
      <div
        style={{ background: color }}
        className={`
          px-4 py-2.5 text-white text-[12px] font-semibold leading-tight text-center shadow-md
          ${isDecision ? 'rounded-lg border-2 border-orange-300/40' : 'rounded-lg'}
          ${isAlert ? 'border-2 border-red-300/40' : ''}
          min-w-[160px] max-w-[220px]
        `}
      >
        <div>{label}</div>
        {sub && (
          <div className="text-[9px] font-normal opacity-80 mt-1 uppercase tracking-wide">{sub}</div>
        )}
      </div>
    </div>
  )
}

function Arrow() {
  return (
    <div className="flex-shrink-0 flex items-center text-slate-400 px-1">
      <svg width="28" height="14" viewBox="0 0 28 14">
        <line x1="0" y1="7" x2="20" y2="7" stroke="#94a3b8" strokeWidth="2" />
        <polygon points="20,4 28,7 20,10" fill="#94a3b8" />
      </svg>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="p-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Fluxo de Tramitação e Análise Digital de Evidências</h1>
        <p className="text-slate-500 text-sm mt-1">
          Esquema macroprocessual e integridade da cadeia de custódia no âmbito do GAECO
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2 text-[12px] font-semibold text-slate-600">
            <div className="w-4 h-4 rounded" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Swimlanes */}
      <div className="rounded-xl overflow-hidden border-2 border-slate-300 shadow-xl bg-slate-300 flex flex-col gap-0.5">
        {LANES.map((lane, laneIdx) => (
          <div key={lane.id} className="flex bg-white min-h-[110px]">
            {/* Lane header */}
            <Link
              to={lane.path}
              className="group flex-shrink-0 w-44 bg-slate-50 border-r-2 border-slate-300 flex flex-col items-center justify-center p-4 text-center font-bold text-slate-800 text-[12px] uppercase tracking-wide hover:bg-[#0f3973] hover:text-white transition-all duration-200 cursor-pointer select-none"
            >
              <span className="w-7 h-7 rounded-full bg-[#0f3973] group-hover:bg-white text-white group-hover:text-[#0f3973] flex items-center justify-center text-[11px] font-black mb-2 transition-all">
                {lane.id}
              </span>
              <span className="leading-snug">{lane.title}</span>
              <span className="mt-2 text-[8px] normal-case font-normal opacity-50 group-hover:opacity-80 tracking-normal">
                Ver detalhado →
              </span>
            </Link>

            {/* Lane content */}
            <div className="flex items-center px-5 py-4 gap-0 overflow-x-auto flex-1">
              {lane.nodes.map((node, i) => (
                <div key={i} className="flex items-center">
                  <Node {...node} />
                  {i < lane.nodes.length - 1 && <Arrow />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Info footer */}
      <p className="text-center text-slate-400 text-[11px] mt-4">
        Clique em qualquer cabeçalho de raia para abrir o subfluxo detalhado
      </p>
    </div>
  )
}
