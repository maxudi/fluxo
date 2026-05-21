import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from '../components/FlowNodes'
import FlowPage from '../components/FlowPage'
import { useEditableFlow } from '../hooks/useEditableFlow'

const DEFAULT_NODES = [
  {
    id: '1',
    type: 'oval',
    position: { x: 239, y: -1.6 },
    data: { label: 'Dados Extraídos Disponibilizados', sub: 'Proveniente do Laboratório', color: '#0f3973' },
  },
  {
    id: '2',
    type: 'rect',
    position: { x: 235, y: 145 },
    data: { label: 'NIC assume a posse dos dados e avalia\na capacidade operacional de análise', color: '#334155' },
  },
  {
    id: '3',
    type: 'diamond',
    position: { x: 279, y: 277 },
    data: { label: 'Qual a estratégia de análise?', size: 145, color: '#f97316', textColor: 'white' },
  },

  // Análise Interna
  {
    id: '4a',
    type: 'rect',
    position: { x: 60, y: 490 },
    data: { label: 'Próprio NIC realiza a análise do\nmaterial e elabora o relatório', sub: 'Análise Interna', color: '#006bb5' },
  },

  // Análise Compartilhada
  {
    id: '4b',
    type: 'rect',
    position: { x: 500, y: 490 },
    data: { label: 'Encaminha dados para as\nInteligências parceiras:\n17º BPM · 32º BPM · CIAPE', sub: 'Análise Compartilhada', color: '#006bb5' },
  },
  {
    id: '4c',
    type: 'rect',
    position: { x: 502, y: 624 },
    data: { label: 'Agências realizam análises\noperacionais locais', color: '#334155', textColor: 'white' },
  },

  // Retorno obrigatório
  {
    id: '5',
    type: 'rect',
    position: { x: 220, y: 760 },
    data: {
      label: 'CIÊNCIA OBRIGATÓRIA:\nAs Inteligências parceiras reportam\ntodas as análises e relatórios ao NIC',
      color: '#0f3973',
    },
  },
  {
    id: '6',
    type: 'oval',
    position: { x: 225, y: 902 },
    data: { label: 'Processo Concluído /\nRelatório Final Correlacionado', sub: 'Encerramento do ciclo', color: '#00a859' },
  },
]

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  {
    id: 'e3-4a',
    source: '3', sourceHandle: 'left', target: '4a',
    type: 'smoothstep',
    label: 'Interna',
    labelStyle: { fill: '#0f3973', fontWeight: 700, fontSize: 11 },
  },
  {
    id: 'e3-4b',
    source: '3', sourceHandle: 'right', target: '4b',
    type: 'smoothstep',
    label: 'Compartilhada',
    labelStyle: { fill: '#006bb5', fontWeight: 700, fontSize: 11 },
  },
  { id: 'e4b-4c', source: '4b', target: '4c', type: 'smoothstep' },
  { id: 'e4a-5', source: '4a', target: '5', type: 'smoothstep' },
  { id: 'e4c-5', source: '4c', target: '5', type: 'smoothstep' },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', style: { stroke: '#00a859', strokeWidth: 2 } },
]

export default function Analise() {
  const { nodes, onNodesChange, saveLayout, resetLayout, isDirty, resetKey } = useEditableFlow('analise', DEFAULT_NODES)
  return (
    <FlowPage
      phase={5}
      title="Análise de Dados e Destinação"
      subtitle="Processamento do conhecimento extraído, compartilhamento interagências e fechamento de ciclo"
      prevPath={{ to: '/laboratorio', label: 'Fase 4: Laboratório' }}
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
