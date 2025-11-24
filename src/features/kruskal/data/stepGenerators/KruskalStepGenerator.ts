import { Node } from '@features/kruskal/domain/entities/Node';
import { Edge } from '@features/kruskal/domain/entities/Edge';
import { KruskalStep, SortedEdge, MSTEdge } from '@features/kruskal/domain/entities/KruskalStep';
import { makeSet, find, union } from '@features/kruskal/data/algorithms/UnionFind';

/**
 * Generates visualization steps for Kruskal algorithm.
 * Captures each step of the algorithm execution for visualization.
 */
export function generateSteps(
  nodes: Node[],
  edges: Edge[]
): KruskalStep[] {
  const allSteps: KruskalStep[] = [];
  const nodesCopy: Node[] = nodes.map(n => ({ ...n, isInMST: false }));
  const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
  
  // Initialize Union-Find
  const uf = makeSet(nodes.length);
  const mstEdges: MSTEdge[] = [];
  let totalCost = 0;
  let nextComponentId = 0;
  
  // Initial step
  allSteps.push({
    type: 'init',
    nodes: nodesCopy.map(n => ({ ...n })),
    edges: edgesCopy.map(e => ({ ...e })),
    message: 'Iniciando Kruskal. Criando componentes individuais para cada vértice (MAKE_SET).',
    highlightedEdge: null,
    action: 'init',
    sortedEdges: [],
    currentEdgeIndex: -1,
    unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
    mstEdges: [],
    totalCost: 0,
  });

  // Sort edges by weight
  const sortedEdges: SortedEdge[] = [...edges].sort((a, b) => a.weight - b.weight);
  
  allSteps.push({
    type: 'sort',
    nodes: nodesCopy.map(n => ({ ...n })),
    edges: edgesCopy.map(e => ({ ...e })),
    message: `Ordenando ${edges.length} arestas por peso crescente.`,
    highlightedEdge: null,
    action: 'sort',
    sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
    currentEdgeIndex: -1,
    mstEdges: [],
    totalCost: 0,
    unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
  });

  // Main loop
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const u = edge.from;
    const v = edge.to;
    
    const edgeIndex = edgesCopy.findIndex(e => 
      (e.from === u && e.to === v) || (e.from === v && e.to === u)
    );
    
    if (edgeIndex >= 0) {
      edgesCopy[edgeIndex].isEvaluating = true;
    }

    allSteps.push({
      type: 'evaluate',
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      message: `Avaliando aresta {${nodesCopy[u].label}, ${nodesCopy[v].label}} com peso ${edge.weight}`,
      highlightedEdge: { from: u, to: v },
      action: 'evaluate',
      sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
      currentEdgeIndex: i,
      mstEdges: [...mstEdges],
      totalCost,
      unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
    });

    // Check if u and v are in different components
    const rootU = find(uf, u);
    const rootV = find(uf, v);
    
    if (rootU !== rootV) {
      // Accept the edge
      union(uf, u, v);
      mstEdges.push({ from: u, to: v, weight: edge.weight });
      totalCost += edge.weight;
      
      // Determine componentId to use
      const uHasComponent = nodesCopy[u].componentId !== undefined;
      const vHasComponent = nodesCopy[v].componentId !== undefined;
      
      let componentIdToUse: number;
      
      if (uHasComponent && vHasComponent) {
        // Both have components: merge everything into u's component
        const oldComponentId = nodesCopy[v].componentId;
        const newComponentId = nodesCopy[u].componentId!;
        nodesCopy.forEach(node => {
          if (node.componentId === oldComponentId) {
            node.componentId = newComponentId;
          }
        });
        componentIdToUse = newComponentId;
      } else if (uHasComponent) {
        // Only u has component: v joins u's component
        nodesCopy[v].componentId = nodesCopy[u].componentId;
        nodesCopy[v].isInMST = true;
        componentIdToUse = nodesCopy[u].componentId!;
      } else if (vHasComponent) {
        // Only v has component: u joins v's component
        nodesCopy[u].componentId = nodesCopy[v].componentId;
        nodesCopy[u].isInMST = true;
        componentIdToUse = nodesCopy[v].componentId!;
      } else {
        // Neither has component: create new component
        componentIdToUse = nextComponentId++;
        nodesCopy[u].componentId = componentIdToUse;
        nodesCopy[v].componentId = componentIdToUse;
        nodesCopy[u].isInMST = true;
        nodesCopy[v].isInMST = true;
      }
      
      if (edgeIndex >= 0) {
        edgesCopy[edgeIndex].isInMST = true;
        edgesCopy[edgeIndex].isEvaluating = false;
      }

      allSteps.push({
        type: 'accept',
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        message: `✅ FIND(${nodesCopy[u].label}) ≠ FIND(${nodesCopy[v].label}). Adicionando à MST. UNION(${nodesCopy[u].label}, ${nodesCopy[v].label}). Custo total: ${totalCost}`,
        highlightedEdge: { from: u, to: v },
        action: 'accept',
        sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
        currentEdgeIndex: i,
        mstEdges: [...mstEdges],
        totalCost,
        unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
      });
    } else {
      // Reject the edge (would form a cycle)
      if (edgeIndex >= 0) {
        edgesCopy[edgeIndex].isRejected = true;
        edgesCopy[edgeIndex].isEvaluating = false;
      }

      allSteps.push({
        type: 'reject',
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        message: `❌ FIND(${nodesCopy[u].label}) = FIND(${nodesCopy[v].label}). Mesma componente! Rejeitando (formaria ciclo).`,
        highlightedEdge: { from: u, to: v },
        action: 'reject',
        sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
        currentEdgeIndex: i,
        mstEdges: [...mstEdges],
        totalCost,
        unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
      });

      // Remove rejected state after one step
      if (edgeIndex >= 0) {
        edgesCopy[edgeIndex].isRejected = false;
      }
    }
  }

  // Final step
  allSteps.push({
    type: 'final',
    nodes: nodesCopy.map(n => ({ ...n })),
    edges: edgesCopy.map(e => ({ ...e })),
    message: `✅ Kruskal finalizado! MST com ${mstEdges.length} arestas. Custo total: ${totalCost}`,
    highlightedEdge: null,
    action: 'final',
    sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
    currentEdgeIndex: sortedEdges.length,
    mstEdges: [...mstEdges],
    totalCost,
    unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
  });

  return allSteps;
}

