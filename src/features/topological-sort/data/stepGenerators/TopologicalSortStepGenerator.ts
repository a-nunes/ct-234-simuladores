import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';
import { TopologicalSortStep } from '@features/topological-sort/domain/entities/TopologicalSortStep';
import { topologicalSort } from '../algorithms/TopologicalSortAlgorithm';

/**
 * Generates visualization steps for topological sort algorithm.
 * Converts algorithm execution into visualization steps.
 */
export function generateSteps(
  nodes: Node[],
  edges: Edge[],
  useStack: boolean = false
): TopologicalSortStep[] {
  const allSteps: TopologicalSortStep[] = [];
  const nodesCopy: Node[] = nodes.map(n => ({ 
    ...n, 
    state: 'unvisited' as const,
    indegree: undefined,
    topologicalOrder: undefined
  }));
  const edgesCopy: Edge[] = edges.map(e => ({ 
    ...e, 
    highlighted: false
  }));
  
  const n = nodes.length;
  
  // Run algorithm to get states
  const algorithmStates = topologicalSort(nodesCopy, edgesCopy, useStack);
  
  if (algorithmStates.length === 0) {
    return allSteps;
  }
  
  // Calculate initial indegree
  const initialIndegree: Record<number, number> = {};
  nodesCopy.forEach(node => {
    initialIndegree[node.id] = 0;
  });
  edges.forEach(edge => {
    initialIndegree[edge.to]++;
  });
  
  // Initial step: calculate indegree
  allSteps.push({
    type: 'init',
    nodes: nodesCopy.map(n => ({ ...n, indegree: initialIndegree[n.id] })),
    edges: edgesCopy.map(e => ({ ...e })),
    queue: [],
    indegree: { ...initialIndegree },
    topologicalOrder: [],
    counter: 0,
    message: `Inicializando ordenação topológica. Calculando grau de entrada para todos os vértices.`,
    highlightedNode: null,
    highlightedEdge: null,
    dataStructure: useStack ? 'stack' : 'queue'
  });
  
  // Step: calculate indegree
  allSteps.push({
    type: 'calculate-indegree',
    nodes: nodesCopy.map(n => ({ ...n, indegree: initialIndegree[n.id] })),
    edges: edgesCopy.map(e => ({ ...e })),
    queue: [],
    indegree: { ...initialIndegree },
    topologicalOrder: [],
    counter: 0,
    message: `Grau de entrada calculado para todos os vértices.`,
    highlightedNode: null,
    highlightedEdge: null,
    dataStructure: useStack ? 'stack' : 'queue'
  });
  
  // Find initial zero-indegree vertices
  const initialQueue: number[] = [];
  nodesCopy.forEach(node => {
    if (initialIndegree[node.id] === 0) {
      initialQueue.push(node.id);
    }
  });
  
  // Step: enqueue zero-indegree vertices
  if (initialQueue.length > 0) {
    allSteps.push({
      type: 'enqueue-zero-indegree',
      nodes: nodesCopy.map(n => ({ 
        ...n, 
        indegree: initialIndegree[n.id],
        state: initialQueue.includes(n.id) ? 'processing' as const : n.state
      })),
      edges: edgesCopy.map(e => ({ ...e })),
      queue: [...initialQueue],
      indegree: { ...initialIndegree },
      topologicalOrder: [],
      counter: 0,
      message: `Enfileirando vértices com grau de entrada 0: ${initialQueue.map(id => nodesCopy.find(n => n.id === id)?.label).join(', ')}`,
      highlightedNode: null,
      highlightedEdge: null,
      dataStructure: useStack ? 'stack' : 'queue'
    });
  }
  
  // Process algorithm states - map each state to visualization steps
  let currentProcessingVertex: number | null = null;
  
  for (let i = 1; i < algorithmStates.length; i++) {
    const prevState = algorithmStates[i - 1];
    const state = algorithmStates[i];
    
    // Update nodes with current indegree
    nodesCopy.forEach(node => {
      node.indegree = state.indegree[node.id];
    });
    
    // Check if a vertex was dequeued (topological order increased)
    if (state.topologicalOrder.length > prevState.topologicalOrder.length) {
      const dequeuedVertex = state.topologicalOrder[state.topologicalOrder.length - 1];
      currentProcessingVertex = dequeuedVertex;
      const nodeIndex = nodesCopy.findIndex(n => n.id === dequeuedVertex);
      
      if (nodeIndex >= 0) {
        nodesCopy[nodeIndex].state = 'processing';
        nodesCopy[nodeIndex].topologicalOrder = state.counter;
      }
      
      allSteps.push({
        type: 'dequeue',
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        queue: prevState.queue, // Queue before dequeue
        indegree: { ...state.indegree },
        topologicalOrder: [...state.topologicalOrder],
        counter: state.counter,
        message: `${useStack ? 'Desempilhar' : 'Desenfileirar'} vértice ${nodesCopy[nodeIndex]?.label}. f[${nodesCopy[nodeIndex]?.label}] = ${state.counter}`,
        highlightedNode: dequeuedVertex,
        highlightedEdge: null,
        dataStructure: useStack ? 'stack' : 'queue'
      });
      
      // Process vertex
      allSteps.push({
        type: 'process-vertex',
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        queue: [...state.queue],
        indegree: { ...state.indegree },
        topologicalOrder: [...state.topologicalOrder],
        counter: state.counter,
        message: `Processando vértice ${nodesCopy[nodeIndex]?.label}.`,
        highlightedNode: dequeuedVertex,
        highlightedEdge: null,
        dataStructure: useStack ? 'stack' : 'queue'
      });
      
      // Mark as processed
      if (nodeIndex >= 0) {
        nodesCopy[nodeIndex].state = 'processed';
      }
    } 
    // Check if indegree was decremented (for current processing vertex)
    else if (currentProcessingVertex !== null) {
      // Find which edge was processed by comparing indegree values
      const processingVertexId = currentProcessingVertex; // Capture for closure
      const outgoingEdges = edges.filter(e => e.from === processingVertexId);
      for (const edge of outgoingEdges) {
        const w = edge.to;
        const oldIndegree = prevState.indegree[w];
        const newIndegree = state.indegree[w];
        
        if (oldIndegree > newIndegree) {
          // Highlight edge
          const edgeIndex = edgesCopy.findIndex(e => e.from === edge.from && e.to === edge.to);
          if (edgeIndex >= 0) {
            edgesCopy[edgeIndex].highlighted = true;
          }
          
          allSteps.push({
            type: 'decrement-indegree',
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            queue: [...state.queue],
            indegree: { ...state.indegree },
            topologicalOrder: [...state.topologicalOrder],
            counter: state.counter,
            message: `Decrementando grau de entrada de ${nodesCopy.find(n => n.id === w)?.label}: ${oldIndegree} → ${newIndegree}`,
            highlightedNode: w,
            highlightedEdge: { from: processingVertexId, to: w },
            dataStructure: useStack ? 'stack' : 'queue'
          });
          
          // If indegree becomes 0, enqueue
          if (newIndegree === 0 && oldIndegree > 0) {
            const nodeIndex = nodesCopy.findIndex(n => n.id === w);
            if (nodeIndex >= 0) {
              nodesCopy[nodeIndex].state = 'processing';
            }
            
            allSteps.push({
              type: 'enqueue-new-zero',
              nodes: nodesCopy.map(n => ({ ...n })),
              edges: edgesCopy.map(e => ({ ...e })),
              queue: [...state.queue],
              indegree: { ...state.indegree },
              topologicalOrder: [...state.topologicalOrder],
              counter: state.counter,
              message: `Grau de entrada de ${nodesCopy.find(n => n.id === w)?.label} agora é 0. Enfileirando.`,
              highlightedNode: w,
              highlightedEdge: { from: processingVertexId, to: w },
              dataStructure: useStack ? 'stack' : 'queue'
            });
          }
          
          // Unhighlight edge
          if (edgeIndex >= 0) {
            edgesCopy[edgeIndex].highlighted = false;
          }
          
          // Only process one edge per state
          break;
        }
      }
    }
    
    // Reset current processing vertex when we move to next vertex
    if (i < algorithmStates.length - 1) {
      const nextState = algorithmStates[i + 1];
      if (nextState.topologicalOrder.length > state.topologicalOrder.length) {
        currentProcessingVertex = null;
      }
    }
  }
  
  // Check for cycles
  const finalState = algorithmStates[algorithmStates.length - 1];
  if (finalState.counter !== n) {
    allSteps.push({
      type: 'cycle-detected',
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      queue: [...finalState.queue],
      indegree: { ...finalState.indegree },
      topologicalOrder: [...finalState.topologicalOrder],
      counter: finalState.counter,
      message: `⚠️ Grafo é cíclico! Counter (${finalState.counter}) != n (${n}). Ordenação topológica não é possível.`,
      highlightedNode: null,
      highlightedEdge: null,
      dataStructure: useStack ? 'stack' : 'queue'
    });
  } else {
    // Final step
    const finalOrder = finalState.topologicalOrder;
    const orderLabels = finalOrder.map(id => nodesCopy.find(n => n.id === id)?.label).join(' → ');
    
    allSteps.push({
      type: 'final',
      nodes: nodesCopy.map(n => ({ 
        ...n, 
        state: 'processed' as const
      })),
      edges: edgesCopy.map(e => ({ ...e })),
      queue: [],
      indegree: { ...finalState.indegree },
      topologicalOrder: [...finalOrder],
      counter: finalState.counter,
      message: `✅ Ordenação topológica concluída! Ordem: ${orderLabels}`,
      highlightedNode: null,
      highlightedEdge: null,
      dataStructure: useStack ? 'stack' : 'queue'
    });
  }
  
  return allSteps;
}
