import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from '../components/FlowNodes'
import FlowPage from '../components/FlowPage'
import { useEditableFlow } from '../hooks/useEditableFlow'

const DEFAULT_NODES = [
  {
    id: '1',
    type: 'oval',
    position: { x: 304.9, y: 14.6 },
    data: { label: 'Material Entregue pelo NIC', sub: 'Entrada na Secretaria', color: '#64748b' },
  },
  {
    id: '2',
    type: 'rect',
    position: { x: 215, y: 145 },
    data: { label: 'Secretaria realiza a conferência dos documentos obrigatórios', color: '#006bb5' },
  },
  {
    id: '3',
    type: 'info',
    position: { x: 296.9, y: 261.4 },
    data: {
      title: 'Requisitos Exigidos pelo Lab:',
      items: ['FAV preenchida e assinada', 'Solicitação Formal de Exame', 'Decisão Judicial de quebra de sigilo'],
    },
  },
  {
    id: '4',
    type: 'diamond',
    position: { x: 318.9, y: 418.2 },
    data: { label: 'Toda a documentação está em conformidade?', size: 155, color: '#f97316', textColor: 'white' },
  },
  // Caminho NÃO
  {
    id: '5a',
    type: 'alert',
    position: { x: 40, y: 650 },
    data: { label: 'BLOQUEIO DE FLUXO:\nDevolução imediata ao NIC', sub: 'Se incompleto' },
  },
  {
    id: '5b',
    type: 'oval',
    position: { x: 50, y: 785 },
    data: { label: 'Aguardando Correção', sub: 'Retorna para Fase 2', color: '#94a3b8', textColor: '#1e293b' },
  },
  // Caminho SIM
  {
    id: '6a',
    type: 'rect',
    position: { x: 503.9, y: 644.6 },
    data: { label: 'Protocolar e Encaminhar ao Laboratório Forense', color: '#00a859' },
  },
  {
    id: '6b',
    type: 'oval',
    position: { x: 556.6, y: 788.6 },
    data: { label: 'Processamento Técnico', sub: 'Vai para Fase 4', color: '#2563eb' },
  },
]

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },
  {
    id: 'e4-5a',
    source: '4', sourceHandle: 'left', target: '5a',
    type: 'smoothstep',
    label: 'NÃO',
    labelStyle: { fill: '#b91c1c', fontWeight: 800, fontSize: 12 },
    style: { stroke: '#ef4444', strokeWidth: 2 },
  },
  { id: 'e5a-5b', source: '5a', target: '5b', type: 'smoothstep', style: { stroke: '#ef4444' } },
  {
    id: 'e4-6a',
    source: '4', sourceHandle: 'right', target: '6a',
    type: 'smoothstep',
    label: 'SIM',
    labelStyle: { fill: '#15803d', fontWeight: 800, fontSize: 12 },
    style: { stroke: '#00a859', strokeWidth: 2 },
  },
  { id: 'e6a-6b', source: '6a', target: '6b', type: 'smoothstep', style: { stroke: '#00a859' } },
]

export default function Secretaria() {
  const { nodes, onNodesChange, saveLayout, resetLayout, isDirty, resetKey } = useEditableFlow('secretaria', DEFAULT_NODES)
  return (
    <FlowPage
      phase={3}
      title="Protocolo e Triagem (Secretaria GAECO)"
      subtitle="Validação formal dos requisitos da Cadeia de Custódia — Gatekeeper do processo"
      prevPath={{ to: '/nic', label: 'Fase 2: NIC' }}
      nextPath={{ to: '/laboratorio', label: 'Fase 4: Laboratório' }}
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
        fitViewOptions={{ padding: 0.12 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant="dots" gap={20} color="#e2e8f0" />
        <Controls />
        <MiniMap nodeColor={(n) => n.data?.color || '#006bb5'} maskColor="rgba(248,250,252,0.7)" />
      </ReactFlow>
    </FlowPage>
  )
}
