import { Node } from '@features/prim/domain/entities/Node';
import { Edge } from '@features/prim/domain/entities/Edge';
import { PrimStep, CandidateEdge, MSTEdge } from '@features/prim/domain/entities/PrimStep';

/**
 * Generates visualization steps for Prim algorithm.
 * Captures each step of the algorithm execution for visualization.
 */
export function generateSteps(
  nodes: Node[],
  edges: Edge[],
  rootNode: number
): PrimStep[] {
  const allSteps: PrimStep[] = [];
  const nodesCopy: Node[] = nodes.map(n => ({ ...n, isInTree: false, isRoot: false }));
  const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
  
  nodesCopy[rootNode].isRoot = true;
  
  const inTree = new Set<number>([rootNode]);
  const outTree = new Set<number>(nodes.map((_, i) => i).filter(i => i !== rootNode));
  const mstEdges: MSTEdge[] = [];
  let totalCost = 0;

  // Initial step
  allSteps.push({
    type: 'init',
    nodes: nodesCopy.map(n => ({ ...n, isInTree: n.id === rootNode })),
    edges: edgesCopy.map(e => ({ ...e })),
    message: `Iniciando Prim a partir de ${nodesCopy[rootNode].label}. U = {${nodesCopy[rootNode].label}}, V-U = {${Array.from(outTree).map(id => nodesCopy[id].label).join(', ')}}`,
    highlightedEdge: null,
    action: 'init',
    inTree: new Set(inTree),
    outTree: new Set(outTree),
    candidateEdges: [],
    mstEdges: [],
    totalCost: 0,
  });

  // Main loop
  while (outTree.size > 0) {
    // Find minimum cost edge between U and V-U
    let minEdge: { from: number; to: number; weight: number } | null = null;
    const candidateEdges: CandidateEdge[] = [];

    for (const edge of edges) {
      const inU = inTree.has(edge.from) && outTree.has(edge.to);
      const inV = inTree.has(edge.to) && outTree.has(edge.from);
      
      if (inU || inV) {
        const u = inU ? edge.from : edge.to;
        const v = inU ? edge.to : edge.from;
        candidateEdges.push({ from: u, to: v, weight: edge.weight });
        
        if (!minEdge || edge.weight < minEdge.weight) {
          minEdge = { from: u, to: v, weight: edge.weight };
        }
      }
    }

    if (!minEdge) break; // Disconnected graph

    allSteps.push({
      type: 'search',
      nodes: nodesCopy.map(n => ({ ...n, isInTree: inTree.has(n.id) })),
      edges: edgesCopy.map(e => ({ ...e })),
      message: `Buscando aresta mínima entre U e V-U. Candidatas: ${candidateEdges.length}`,
      highlightedEdge: null,
      action: 'search',
      inTree: new Set(inTree),
      outTree: new Set(outTree),
      candidateEdges: [...candidateEdges],
      mstEdges: [...mstEdges],
      totalCost,
    });

    // Highlight the chosen edge
    const edgeIndex = edgesCopy.findIndex(e => 
      (e.from === minEdge!.from && e.to === minEdge!.to) || 
      (e.from === minEdge!.to && e.to === minEdge!.from)
    );
    
    if (edgeIndex >= 0) {
      edgesCopy[edgeIndex].isEvaluating = true;
    }

    allSteps.push({
      type: 'select-min',
      nodes: nodesCopy.map(n => ({ ...n, isInTree: inTree.has(n.id) })),
      edges: edgesCopy.map(e => ({ ...e })),
      message: `Aresta mínima: {${nodesCopy[minEdge.from].label}, ${nodesCopy[minEdge.to].label}} com peso ${minEdge.weight}`,
      highlightedEdge: { from: minEdge.from, to: minEdge.to },
      action: 'select-min',
      inTree: new Set(inTree),
      outTree: new Set(outTree),
      candidateEdges: [...candidateEdges],
      mstEdges: [...mstEdges],
      totalCost,
    });

    // Add edge to MST
    mstEdges.push(minEdge);
    totalCost += minEdge.weight;
    
    if (edgeIndex >= 0) {
      edgesCopy[edgeIndex].isInMST = true;
      edgesCopy[edgeIndex].isEvaluating = false;
    }

    // Move v from V-U to U
    inTree.add(minEdge.to);
    outTree.delete(minEdge.to);
    nodesCopy[minEdge.to].isInTree = true;

    // Create message with updated outTree
    const outTreeLabels = Array.from(outTree).map(id => nodesCopy[id].label);
    const outTreeMessage = outTreeLabels.length > 0 ? outTreeLabels.join(', ') : 'vazio';

    allSteps.push({
      type: 'add-to-tree',
      nodes: nodesCopy.map(n => ({ ...n, isInTree: inTree.has(n.id) })),
      edges: edgesCopy.map(e => ({ ...e })),
      message: `✅ Adicionando à MST. ${nodesCopy[minEdge.to].label} agora está em U. Custo total: ${totalCost}. V-U = {${outTreeMessage}}`,
      highlightedEdge: { from: minEdge.from, to: minEdge.to },
      action: 'add-to-tree',
      inTree: new Set(inTree),
      outTree: new Set(outTree),
      candidateEdges: [...candidateEdges],
      mstEdges: [...mstEdges],
      totalCost,
    });
  }

  // Final step
  allSteps.push({
    type: 'final',
    nodes: nodesCopy.map(n => ({ ...n, isInTree: inTree.has(n.id) })),
    edges: edgesCopy.map(e => ({ ...e })),
    message: `✅ Prim finalizado! MST com ${mstEdges.length} arestas. Custo total: ${totalCost}`,
    highlightedEdge: null,
    action: 'final',
    inTree: new Set(inTree),
    outTree: new Set(outTree),
    candidateEdges: [],
    mstEdges: [...mstEdges],
    totalCost,
  });

  return allSteps;
}

