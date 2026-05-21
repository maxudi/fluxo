import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from '../components/FlowNodes'
import FlowPage from '../components/FlowPage'
import { useEditableFlow } from '../hooks/useEditableFlow'

const DEFAULT_NODES = [
  {
    id: '1',
    type: 'oval',
    position: { x: 256.5, y: 28.8 },
    data: { label: 'Apreensão da Evidência', sub: 'Policial Militar — Ponto de entrada do processo' },
  },
  {
    id: '2',
    type: 'diamond',
    position: { x: 320, y: 160 },
    data: { label: 'Qual a modalidade da ocorrência?', size: 145, color: '#f97316', textColor: 'white' },
  },
  // Flagrante
  {
    id: '3',
    type: 'rect',
    position: { x: -150.4, y: 400 },
    data: { label: 'Encaminhamento ao Plantão da Polícia Civil', sub: 'Flagrante', color: '#334155', targetLeft: true },
  },
  {
    id: '4',
    type: 'oval',
    position: { x: -110.8, y: 531.2 },
    data: { label: 'Aguardando NIC', sub: 'Vai para Fase 2', color: '#64748b' },
  },
  // Mandado
  {
    id: '5',
    type: 'rect',
    position: { x: 253.9, y: 400 },
    data: { label: 'Pode ir para a Polícia Civil ou Direto para o MP', sub: 'Cumprimento de Mandado', color: '#334155' },
  },
  {
    id: '6',
    type: 'oval',
    position: { x: 302.4, y: 532.5 },
    data: { label: 'Aguardando NIC', sub: 'Vai para Fase 2', color: '#64748b' },
  },
  // Espontânea
  {
    id: '7',
    type: 'rect',
    position: { x: 654.7, y: 403.7 },
    data: { label: 'Entrega Direta no Ministério Público', sub: 'Entrega Espontânea', color: '#334155', targetRight: true },
  },
  {
    id: '8',
    type: 'oval',
    position: { x: 672.2, y: 528.8 },
    data: { label: 'Aguardando NIC', sub: 'Vai para Fase 2', color: '#64748b' },
  },
]

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', sourceHandle: 'left', target: '3', type: 'smoothstep', label: 'Flagrante', labelStyle: { fill: '#0f3973', fontWeight: 700, fontSize: 11 }, style: { stroke: '#334155' } },
  { id: 'e2-5', source: '2', sourceHandle: 'bottom', target: '5', type: 'smoothstep', label: 'Mandado', labelStyle: { fill: '#0f3973', fontWeight: 700, fontSize: 11 } },
  { id: 'e2-7', source: '2', sourceHandle: 'right', target: '7', type: 'smoothstep', label: 'Espontânea', labelStyle: { fill: '#00a859', fontWeight: 700, fontSize: 11 }, style: { stroke: '#00a859' } },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep' },
  { id: 'e7-8', source: '7', target: '8', type: 'smoothstep' },
]

export default function Origem() {
  const { nodes, onNodesChange, saveLayout, resetLayout, isDirty, resetKey } = useEditableFlow('origem', DEFAULT_NODES)
  return (
    <FlowPage
      phase={1}
      title="Origem e Apreensão da Evidência"
      subtitle="Mapeamento da entrada de vestígios e canais iniciais de distribuição por modalidade jurídica"
      prevPath={{ to: '/', label: 'Painel Geral' }}
      nextPath={{ to: '/nic', label: 'Fase 2: NIC' }}
      saveLayout={saveLayout}
      resetLayout={resetLayout}
      isDirty={isDirty}
    >
      <ReactFlow
        key={resetKey}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant="dots" gap={20} color="#e2e8f0" />
        <Controls />
        <MiniMap nodeColor={(n) => n.data?.color || '#006bb5'} maskColor="rgba(248,250,252,0.7)" />
      </ReactFlow>
    </FlowPage>
  )
}
