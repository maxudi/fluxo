import { useState, useCallback, useRef, useEffect } from 'react'
import { applyNodeChanges } from 'reactflow'

export function useEditableFlow(pageKey, defaultNodes) {
  const storageKey = `gaeco-flow-${pageKey}`

  const [nodes, setNodes] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey))
      if (Array.isArray(saved) && saved.length > 0) {
        return defaultNodes.map(node => {
          const found = saved.find(s => s.id === node.id)
          return found ? { ...node, position: found.position } : node
        })
      }
    } catch { /* ignore */ }
    return defaultNodes
  })

  const nodesRef = useRef(nodes)
  useEffect(() => { nodesRef.current = nodes }, [nodes])

  const [isDirty, setIsDirty] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const onNodesChange = useCallback((changes) => {
    setNodes(nds => applyNodeChanges(changes, nds))
    if (changes.some(c => c.type === 'position' && !c.dragging)) {
      setIsDirty(true)
    }
  }, [])

  const saveLayout = useCallback(() => {
    const data = nodesRef.current.map(({ id, position }) => ({ id, position }))
    localStorage.setItem(storageKey, JSON.stringify(data))
    setIsDirty(false)
  }, [storageKey])

  const resetLayout = useCallback(() => {
    localStorage.removeItem(storageKey)
    setNodes(defaultNodes)
    setIsDirty(false)
    setResetKey(k => k + 1)
  }, [defaultNodes, storageKey])

  return { nodes, onNodesChange, saveLayout, resetLayout, isDirty, resetKey }
}
