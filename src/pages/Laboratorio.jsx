import ReactFlow, { Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'
import { nodeTypes } from '../components/FlowNodes'
import FlowPage from '../components/FlowPage'
import { useEditableFlow } from '../hooks/useEditableFlow'

const DEFAULT_NODES = [
  // Entry
  {
    id: '1',
    type: 'oval',
    position: { x: 368, y: -74 },
    data: { label: 'Início no Laboratório Forense', sub: 'Evidência proveniente da Secretaria', color: '#0f3973' },
  },
  {
    id: '2',
    type: 'rect',
    position: { x: 359.5, y: 22.5 },
    data: { label: 'Conferência: Verificação de FAV,\nDecisão Judicial e Ofício de Remessa', color: '#334155' },
  },
  {
    id: '3',
    type: 'rect',
    position: { x: 337, y: 112.5 },
    data: { label: 'Registro Interno: Fotografia das Evidências /\nLacres + ID Único no Sistema', color: '#334155' },
  },
  // Main decision
  {
    id: '4',
    type: 'diamond',
    position: { x: 393, y: 289.5 },
    data: { label: 'Qual o Tipo de Evidência?', size: 150, color: '#f97316', textColor: 'white' },
  },

  // ─── Branch 1: Mídias ───
  {
    id: 'b1dec',
    type: 'diamond',
    position: { x: -148, y: 458 },
    data: { label: 'Dispositivo tem BitLocker?', size: 120, color: '#fef08a', textColor: '#1e293b' },
  },
  {
    id: 'b1bitlocker',
    type: 'alert',
    position: { x: -530, y: 650 },
    data: { label: 'Certifica Falta de\nDisponibilidade Técnica', sub: 'BitLocker ativo — extração inviável' },
  },
  {
    id: 'b1',
    type: 'rect',
    position: { x: -188, y: 658 },
    data: { label: 'Segue para Extração Padrão\n/ Imagem Forense Bit-a-Bit', sub: 'Mídias — HD, Pendrive, Notebook', color: '#006bb5' },
  },
  {
    id: 'b1end',
    type: 'oval',
    position: { x: -178, y: 796 },
    data: { label: 'Geração de Hash\nExtração Concluída', color: '#00a859' },
  },

  // ─── Branch 2: iPhone ───
  {
    id: 'b2a',
    type: 'rect',
    position: { x: 370, y: 592 },
    data: { label: 'Análise de Estado de Bloqueio:\nBFU (desligado), AFU (ligado)\nou Powerbank conectado', sub: 'iPhone (iOS)', color: '#334155' },
  },
  {
    id: 'b2state',
    type: 'diamond',
    position: { x: 417, y: 716 },
    data: { label: 'Estado do\ndispositivo?', size: 110, color: '#fef08a', textColor: '#1e293b' },
  },
  {
    id: 'b2bfu',
    type: 'alert',
    position: { x: -72, y: 860 },
    data: { label: 'Certifica Falta de\nDisponibilidade Técnica', sub: 'BFU — extração não suportada. Pode mudar com atualizações da Cellebrite.' },
  },
  {
    id: 'b2iosdec',
    type: 'diamond',
    position: { x: 728, y: 856 },
    data: { label: 'iOS suportado\npela Cellebrite?', size: 110, color: '#fef08a', textColor: '#1e293b' },
  },
  {
    id: 'b2nosupt',
    type: 'alert',
    position: { x: 240, y: 1040 },
    data: { label: 'Certifica Falta de\nDisponibilidade Técnica', sub: 'iOS não suportado pela versão atual da Cellebrite' },
  },
  {
    id: 'b2pwdec',
    type: 'diamond',
    position: { x: 730, y: 1032 },
    data: { label: 'Possui senha?\nFoi fornecida?', size: 110, color: '#fef08a', textColor: '#1e293b' },
  },
  {
    id: 'b2brute',
    type: 'rect',
    position: { x: 1080, y: 1254 },
    data: { label: 'Aplica Força Bruta /\nDicionário (Cellebrite)', sub: 'Senha desconhecida — se falhar → Certifica Falta Técnica', color: '#eab308', textColor: '#1e293b', sourceLeft: true },
  },
  {
    id: 'b2no',
    type: 'oval',
    position: { x: 550, y: 1308 },
    data: { label: 'Conecta Ferramenta\nCellebrite / GrayKey', color: '#006bb5' },
  },

  // ─── Branch 3: Android ───
  {
    id: 'b3dec',
    type: 'diamond',
    position: { x: 1190, y: 540 },
    data: { label: 'Possui senha?\nFoi fornecida?', size: 120, color: '#fef08a', textColor: '#1e293b' },
  },
  {
    id: 'b3yes',
    type: 'rect',
    position: { x: 912, y: 734 },
    data: { label: 'Aplica protocolo de\nForça Bruta / Dicionário', sub: 'Senha desconhecida — se falhar → Certifica Falta Técnica', color: '#eab308', textColor: '#1e293b' },
  },
  {
    id: 'b3no',
    type: 'rect',
    position: { x: 1448, y: 660 },
    data: { label: 'Sem senha / Senha Fornecida:\nConecta Cellebrite e inicia Extração', sub: 'Sem senha ou senha conhecida', color: '#00a859' },
  },
  {
    id: 'b3ok',
    type: 'oval',
    position: { x: 980, y: 982 },
    data: { label: 'Extração Física/Lógica\nConcluída (Android)', color: '#00a859' },
  },

  // ─── Merge / Output ───
  {
    id: 'out1',
    type: 'rect',
    position: { x: 360, y: 1420 },
    data: { label: 'Pós-Extração: Cadastra no sistema e finaliza\nos procedimentos administrativos da custódia', color: '#334155' },
  },
  {
    id: 'out2',
    type: 'diamond',
    position: { x: 426, y: 1542 },
    data: { label: 'Demanda é interna (GAECO) ou externa?', size: 145, color: '#f97316', textColor: 'white' },
  },
  {
    id: 'out3a',
    type: 'oval',
    position: { x: 200, y: 1760 },
    data: { label: 'Dados injetados diretamente\nna Rede Interna do GAECO', sub: 'Demanda Interna → Fase 5', color: '#0f3973' },
  },
  {
    id: 'out3b',
    type: 'rect',
    position: { x: 545, y: 1760 },
    data: { label: 'Secretaria emite aviso:\n"Pronto para Retirada"', sub: 'Demanda Externa', color: '#006bb5' },
  },
]

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep' },

  // decision branches
  { id: 'e4-b1', source: '4', sourceHandle: 'left', target: 'b1dec', type: 'smoothstep', label: 'Mídias', labelStyle: { fill: '#0f3973', fontWeight: 700, fontSize: 11 } },
  { id: 'e4-b2a', source: '4', sourceHandle: 'bottom', target: 'b2a', type: 'smoothstep', label: 'iPhone', labelStyle: { fill: '#334155', fontWeight: 700, fontSize: 11 } },
  { id: 'e4-b3dec', source: '4', sourceHandle: 'right', target: 'b3dec', type: 'smoothstep', label: 'Android', labelStyle: { fill: '#00a859', fontWeight: 700, fontSize: 11 } },

  // Mídias
  { id: 'eb1dec-no', source: 'b1dec', sourceHandle: 'bottom', target: 'b1', type: 'smoothstep', label: 'Não', labelStyle: { fill: '#15803d', fontWeight: 700, fontSize: 11 }, style: { stroke: '#00a859' } },
  { id: 'eb1dec-yes', source: 'b1dec', sourceHandle: 'left', target: 'b1bitlocker', type: 'smoothstep', label: 'Sim', labelStyle: { fill: '#b91c1c', fontWeight: 700, fontSize: 11 }, style: { stroke: '#ef4444' } },
  { id: 'eb1bitlocker-out1', source: 'b1bitlocker', target: 'out1', type: 'smoothstep', style: { stroke: '#ef4444', strokeDasharray: '5 5' } },
  { id: 'eb1-end', source: 'b1', target: 'b1end', type: 'smoothstep' },
  { id: 'eb1end-out1', source: 'b1end', target: 'out1', type: 'smoothstep' },

  // iPhone
  { id: 'eb2a-state', source: 'b2a', target: 'b2state', type: 'smoothstep' },
  { id: 'eb2state-bfu', source: 'b2state', sourceHandle: 'left', target: 'b2bfu', type: 'smoothstep', label: 'BFU', labelStyle: { fill: '#b91c1c', fontWeight: 700, fontSize: 11 }, style: { stroke: '#ef4444' } },
  { id: 'eb2state-afu', source: 'b2state', sourceHandle: 'right', target: 'b2iosdec', type: 'smoothstep', label: 'AFU / Powerbank', labelStyle: { fill: '#0f3973', fontWeight: 700, fontSize: 11 }, style: { stroke: '#006bb5' } },
  { id: 'eb2bfu-out1', source: 'b2bfu', target: 'out1', type: 'smoothstep', style: { stroke: '#ef4444', strokeDasharray: '5 5' } },
  { id: 'eb2ios-no', source: 'b2iosdec', sourceHandle: 'left', target: 'b2nosupt', type: 'smoothstep', label: 'Não suportado', labelStyle: { fill: '#b91c1c', fontWeight: 700, fontSize: 11 }, style: { stroke: '#ef4444' } },
  { id: 'eb2ios-yes', source: 'b2iosdec', sourceHandle: 'bottom', target: 'b2pwdec', type: 'smoothstep', label: 'Suportado', labelStyle: { fill: '#15803d', fontWeight: 700, fontSize: 11 }, style: { stroke: '#00a859' } },
  { id: 'eb2nosupt-out1', source: 'b2nosupt', target: 'out1', type: 'smoothstep', style: { stroke: '#ef4444', strokeDasharray: '5 5' } },
  { id: 'eb2pw-no', source: 'b2pwdec', sourceHandle: 'left', target: 'b2no', type: 'smoothstep', label: 'Sem senha / Fornecida', labelStyle: { fill: '#15803d', fontWeight: 700, fontSize: 11 }, style: { stroke: '#00a859' } },
  { id: 'eb2pw-yes', source: 'b2pwdec', sourceHandle: 'right', target: 'b2brute', type: 'smoothstep', label: 'Com senha desconhecida', labelStyle: { fill: '#b45309', fontWeight: 700, fontSize: 11 } },
  { id: 'eb2brute-no', source: 'b2brute', sourceHandle: 'left', target: 'b2no', type: 'smoothstep' },
  { id: 'eb2no-out1', source: 'b2no', target: 'out1', type: 'smoothstep' },

  // Android
  { id: 'eb3dec-yes', source: 'b3dec', sourceHandle: 'left', target: 'b3yes', type: 'smoothstep', label: 'Com senha desconhecida', labelStyle: { fill: '#b45309', fontWeight: 700, fontSize: 11 } },
  { id: 'eb3dec-no', source: 'b3dec', sourceHandle: 'right', target: 'b3no', type: 'smoothstep', label: 'Sem senha / Fornecida', labelStyle: { fill: '#15803d', fontWeight: 700, fontSize: 11 }, style: { stroke: '#00a859' } },
  { id: 'eb3yes-ok', source: 'b3yes', target: 'b3ok', type: 'smoothstep' },
  { id: 'eb3no-ok', source: 'b3no', target: 'b3ok', type: 'smoothstep' },
  { id: 'eb3ok-out1', source: 'b3ok', target: 'out1', type: 'smoothstep' },

  // Output
  { id: 'eout1-out2', source: 'out1', target: 'out2', type: 'smoothstep' },
  { id: 'eout2-3a', source: 'out2', sourceHandle: 'left', target: 'out3a', type: 'smoothstep', label: 'Interna', labelStyle: { fill: '#0f3973', fontWeight: 700, fontSize: 11 } },
  { id: 'eout2-3b', source: 'out2', sourceHandle: 'right', target: 'out3b', type: 'smoothstep', label: 'Externa', labelStyle: { fill: '#006bb5', fontWeight: 700, fontSize: 11 } },
]

export default function Laboratorio() {
  const { nodes, onNodesChange, saveLayout, resetLayout, isDirty, resetKey } = useEditableFlow('laboratorio', DEFAULT_NODES)
  return (
    <FlowPage
      phase={4}
      title="Processamento Técnico (Laboratório Forense)"
      subtitle="Triagem especializada, análise de estado de dispositivos e extração forense de dados"
      prevPath={{ to: '/secretaria', label: 'Fase 3: Secretaria' }}
      nextPath={{ to: '/analise', label: 'Fase 5: Análise' }}
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
        fitViewOptions={{ padding: 0.08 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant="dots" gap={20} color="#e2e8f0" />
        <Controls />
        <MiniMap nodeColor={(n) => n.data?.color || '#006bb5'} maskColor="rgba(248,250,252,0.7)" />
      </ReactFlow>
    </FlowPage>
  )
}
