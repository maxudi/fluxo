import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from '../components/FlowNodes'
import FlowPage from '../components/FlowPage'
import { useEditableFlow } from '../hooks/useEditableFlow'

const DEFAULT_NODES = [
  {
    id: '1',
    type: 'oval',
    position: { x: 298.3, y: -30.2 },
    data: { label: 'Evidência Identificada / Retida', sub: 'Origem da Fase 1', color: '#64748b' },
  },
  {
    id: '2',
    type: 'diamond',
    position: { x: 327.5, y: 101.4 },
    data: { label: 'Qual a origem atual do vestígio?', size: 145, color: '#f97316', textColor: 'white' },
  },

  // Caminho 1: Polícia Civil
  {
    id: '3a',
    type: 'rect',
    position: { x: -316.1, y: 360.4 },
    data: { label: 'NIC vai até o Promotor Natural do caso', sub: 'Polícia Civil (Flagrante)', color: '#006bb5' },
  },
  {
    id: '3b',
    type: 'rect',
    position: { x: -333.2, y: 471.2 },
    data: { label: 'Promotor expede requerimento ao Delegado', color: '#006bb5' },
  },
  {
    id: '3c',
    type: 'rect',
    position: { x: -329.9, y: 591.2 },
    data: { label: 'NIC recolhe a evidência física na Polícia Civil', color: '#334155' },
  },

  // Caminho 2: Cumprimento de Mandado
  {
    id: '4a',
    type: 'diamond',
    position: { x: 345, y: 350 },
    data: { label: 'Qual a origem do Mandado?', size: 120, color: '#f97316', textColor: 'white' },
  },
  {
    id: '4b',
    type: 'rect',
    position: { x: 0.5, y: 472.1 },
    data: { label: 'Evidência já está sob controle direto do GAECO', sub: 'Mandado GAECO', color: '#334155' },
  },
  {
    id: '4c',
    type: 'rect',
    position: { x: 490, y: 530 },
    data: { label: 'NIC peticiona / requer liberação na Justiça', sub: 'Outros / Just. Militar', color: '#006bb5' },
  },
  {
    id: '4d',
    type: 'rect',
    position: { x: 475.4, y: 627.1 },
    data: { label: 'Apoiado por decisão judicial, recolhe o vestígio', color: '#334155' },
  },

  // Caminho 3: Entrega Espontânea
  {
    id: '5a',
    type: 'rect',
    position: { x: 680, y: 370 },
    data: { label: 'NIC recebe o vestígio diretamente no MP', sub: 'Entrega Espontânea', color: '#006bb5' },
  },
  {
    id: '5b',
    type: 'rect',
    position: { x: 693.5, y: 468.1 },
    data: { label: 'Garante a integridade inicial do item', color: '#334155' },
  },

  // Junção
  {
    id: '6',
    type: 'rect',
    position: { x: 293.9, y: 726.1 },
    data: { label: 'NIC junta a documentação base:\nFAV + Solicitação + Decisão Judicial', sub: 'Gargalo de saída obrigatório', color: '#334155' },
  },
  {
    id: '7',
    type: 'oval',
    position: { x: 267.5, y: 860 },
    data: { label: 'Encaminhar para a Secretaria do GAECO', sub: 'Vai para Fase 3', color: '#00a859' },
  },
]

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3a', source: '2', sourceHandle: 'left', target: '3a', type: 'smoothstep', label: 'Polícia Civil', labelStyle: { fill: '#334155', fontWeight: 700, fontSize: 11 } },
  { id: 'e3a-3b', source: '3a', target: '3b', type: 'smoothstep' },
  { id: 'e3b-3c', source: '3b', target: '3c', type: 'smoothstep' },
  { id: 'e3c-6', source: '3c', target: '6', type: 'smoothstep' },
  { id: 'e2-4a', source: '2', sourceHandle: 'bottom', target: '4a', type: 'smoothstep', label: 'Mandado', labelStyle: { fill: '#f97316', fontWeight: 700, fontSize: 11 } },
  { id: 'e4a-4b', source: '4a', sourceHandle: 'left', target: '4b', type: 'smoothstep', label: 'GAECO', labelStyle: { fill: '#334155', fontWeight: 700, fontSize: 11 } },
  { id: 'e4a-4c', source: '4a', sourceHandle: 'right', target: '4c', type: 'smoothstep', label: 'Outros', labelStyle: { fill: '#334155', fontWeight: 700, fontSize: 11 } },
  { id: 'e4b-6', source: '4b', target: '6', type: 'smoothstep' },
  { id: 'e4c-4d', source: '4c', target: '4d', type: 'smoothstep' },
  { id: 'e4d-6', source: '4d', target: '6', type: 'smoothstep' },
  { id: 'e2-5a', source: '2', sourceHandle: 'right', target: '5a', type: 'smoothstep', label: 'Espontânea', labelStyle: { fill: '#00a859', fontWeight: 700, fontSize: 11 }, style: { stroke: '#00a859' } },
  { id: 'e5a-5b', source: '5a', target: '5b', type: 'smoothstep' },
  { id: 'e5b-6', source: '5b', target: '6', type: 'smoothstep' },
  { id: 'e6-7', source: '6', target: '7', type: 'smoothstep' },
]

export default function Nic() {
  const { nodes, onNodesChange, saveLayout, resetLayout, isDirty, resetKey } = useEditableFlow('nic', DEFAULT_NODES)
  return (
    <FlowPage
      phase={2}
      title="Regularização e Custódia (NIC)"
      subtitle="Ações do Núcleo de Inteligência para arrecadar e legalizar a entrada do vestígio"
      prevPath={{ to: '/origem', label: 'Fase 1: Origem' }}
      nextPath={{ to: '/secretaria', label: 'Fase 3: Secretaria' }}
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
        fitViewOptions={{ padding: 0.1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant="dots" gap={20} color="#e2e8f0" />
        <Controls />
        <MiniMap nodeColor={(n) => n.data?.color || '#006bb5'} maskColor="rgba(248,250,252,0.7)" />
      </ReactFlow>
    </FlowPage>
  )
}
