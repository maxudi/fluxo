import { Handle, Position } from 'reactflow'

function Lines({ text }) {
  const parts = String(text).split('\n')
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>{i > 0 && <br />}{part}</span>
      ))}
    </>
  )
}

/** Oval / Terminator node */
export function OvalNode({ data }) {
  const bg = data.color || '#0f3973'
  const textColor = data.textColor || 'white'
  return (
    <div
      style={{ background: bg, color: textColor, minWidth: 180 }}
      className="px-5 py-3 rounded-full text-center text-sm font-bold shadow-lg shadow-black/20 leading-snug border-2 border-white/20"
    >
      <Lines text={data.label} />
      {data.sub && <div className="text-[10px] font-normal opacity-80 mt-0.5 uppercase tracking-wide">{data.sub}</div>}
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-2 !h-2" />
    </div>
  )
}

/** Rectangle / Action node */
export function RectNode({ data }) {
  const bg = data.color || '#006bb5'
  const textColor = data.textColor || 'white'
  return (
    <div
      style={{ background: bg, color: textColor, minWidth: 200 }}
      className="px-4 py-3 rounded-lg text-center text-[13px] font-semibold shadow-lg shadow-black/15 leading-snug border border-white/10"
    >
      <Lines text={data.label} />
      {data.sub && <div className="text-[10px] font-normal opacity-75 mt-1 uppercase tracking-wide">{data.sub}</div>}
      <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-2 !h-2" />
      {data.sourceLeft && <Handle type="source" id="left" position={Position.Left} className="!bg-slate-400 !w-2 !h-2" />}
      {data.sourceRight && <Handle type="source" id="right" position={Position.Right} className="!bg-slate-400 !w-2 !h-2" />}
      {data.targetLeft && <Handle type="target" id="left" position={Position.Left} className="!bg-slate-400 !w-2 !h-2" />}
      {data.targetRight && <Handle type="target" id="right" position={Position.Right} className="!bg-slate-400 !w-2 !h-2" />}
    </div>
  )
}

/** Diamond / Decision node */
export function DiamondNode({ data }) {
  const bg = data.color || '#f97316'
  const textColor = data.textColor || 'white'
  const size = data.size || 130
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <div
        style={{
          background: bg,
          width: '100%',
          height: '100%',
          transform: 'rotate(45deg)',
          borderRadius: 6,
          position: 'absolute',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          border: '2px solid rgba(255,255,255,0.15)',
        }}
      />
      <div style={{ color: textColor }} className="relative z-10 text-center px-3 text-[11px] font-bold leading-snug">
        <Lines text={data.label} />
      </div>
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-2 !h-2" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="!bg-slate-500 !w-2 !h-2" />
      <Handle type="source" id="left" position={Position.Left} className="!bg-slate-500 !w-2 !h-2" />
      <Handle type="source" id="right" position={Position.Right} className="!bg-slate-500 !w-2 !h-2" />
    </div>
  )
}

/** Alert / Blocker node */
export function AlertNode({ data }) {
  return (
    <div
      style={{ background: '#ef4444', minWidth: 200 }}
      className="px-4 py-3 rounded-lg text-center text-[13px] font-bold text-white shadow-lg shadow-red-900/30 leading-tight border-2 border-red-300/30"
    >
      <div className="text-base mb-0.5">⚠</div>
      <Lines text={data.label} />
      {data.sub && <div className="text-[10px] font-normal opacity-80 mt-1 uppercase tracking-wide">{data.sub}</div>}
      <Handle type="target" position={Position.Top} className="!bg-red-300 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-red-300 !w-2 !h-2" />
      {data.targetLeft && <Handle type="target" id="left" position={Position.Left} className="!bg-red-300 !w-2 !h-2" />}
      {data.targetRight && <Handle type="target" id="right" position={Position.Right} className="!bg-red-300 !w-2 !h-2" />}
    </div>
  )
}

/** Info / Checklist node */
export function InfoNode({ data }) {
  return (
    <div className="px-4 py-3 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-left text-[12px] text-slate-600 shadow-sm" style={{ minWidth: 200 }}>
      {data.title && <p className="font-bold text-slate-800 mb-1.5 text-[13px]">{data.title}</p>}
      {data.items && (
        <ul className="space-y-1 pl-4 list-disc">
          {data.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
      <Handle type="target" position={Position.Top} className="!bg-slate-300 !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-slate-300 !w-2 !h-2" />
    </div>
  )
}

export const nodeTypes = {
  oval: OvalNode,
  rect: RectNode,
  diamond: DiamondNode,
  alert: AlertNode,
  info: InfoNode,
}
