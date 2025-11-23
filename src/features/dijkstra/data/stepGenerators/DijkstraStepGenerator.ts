import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';
import { DijkstraStep, FinalDistance } from '@features/dijkstra/domain/entities/DijkstraStep';
import { PriorityQueueItem } from '@features/dijkstra/domain/entities/PriorityQueueItem';

/**
 * Generates visualization steps for Dijkstra algorithm.
 * Captures each step of the algorithm execution for visualization.
 */
export function generateSteps(
  nodes: Node[],
  edges: Edge[],
  sourceNode: number
): DijkstraStep[] {
  const allSteps: DijkstraStep[] = [];
  const nodesCopy: Node[] = nodes.map(n => ({ 
    ...n, 
    dist: Infinity, 
    pred: null, 
    state: 'unvisited' as const,
    isSource: false,
    isInQueue: false
  }));
  const edgesCopy: Edge[] = edges.map(e => ({ 
    ...e, 
    highlighted: false, 
    isInPath: false,
    isRelaxing: false
  }));
  
  // Inicialização
  nodesCopy[sourceNode].dist = 0;
  nodesCopy[sourceNode].isSource = true;
  
  // Fila de prioridade (conjunto S no pseudocódigo)
  const pq: PriorityQueueItem[] = nodesCopy.map(n => ({
    nodeId: n.id,
    nodeLabel: n.label,
    dist: n.dist,
  }));
  
  // Lista de adjacências
  const adjList: { to: number; weight: number }[][] = new Array(nodes.length).fill(null).map(() => []);
  edges.forEach(edge => {
    adjList[edge.from].push({ to: edge.to, weight: edge.weight });
  });
  
  // Ordena adjacências lexicograficamente (por label do nó destino)
  adjList.forEach(neighbors => {
    neighbors.sort((a, b) => nodesCopy[a.to].label.localeCompare(nodesCopy[b.to].label));
  });

  allSteps.push({
    type: 'init',
    nodes: nodesCopy.map(n => ({ ...n })),
    edges: edgesCopy.map(e => ({ ...e })),
    priorityQueue: [...pq],
    message: `Inicializando Dijkstra a partir de ${nodesCopy[sourceNode].label}. dist[${nodesCopy[sourceNode].label}] = 0, demais = ∞`,
    highlightedNode: sourceNode,
    highlightedEdge: null,
    action: 'init',
    currentNode: null,
    relaxingEdge: null,
  });

  // Loop principal
  while (pq.length > 0) {
    // Extrai mínimo (vértice com menor distância)
    pq.sort((a, b) => a.dist - b.dist);
    const minItem = pq.shift()!;
    const j = minItem.nodeId;
    
    // Se a distância é infinita, os vértices restantes são inalcançáveis
    if (nodesCopy[j].dist === Infinity) {
      allSteps.push({
        type: 'unreachable',
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        priorityQueue: [...pq],
        message: `Fila contém apenas vértices inalcançáveis. Algoritmo finalizado.`,
        highlightedNode: null,
        highlightedEdge: null,
        action: 'unreachable',
        currentNode: null,
        relaxingEdge: null,
      });
      break;
    }

    nodesCopy[j].state = 'visiting';
    
    allSteps.push({
      type: 'extract-min',
      nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
      edges: edgesCopy.map(e => ({ ...e })),
      priorityQueue: [...pq],
      message: `EXTRAIR_MÍNIMO: Selecionando ${nodesCopy[j].label} com dist = ${nodesCopy[j].dist}`,
      highlightedNode: j,
      highlightedEdge: null,
      action: 'extract-min',
      currentNode: j,
      relaxingEdge: null,
    });

    // Itera sobre os vizinhos
    for (const neighbor of adjList[j]) {
      const w = neighbor.to;
      const weight = neighbor.weight;
      
      // Destaca a aresta sendo avaliada
      const edgeIndex = edgesCopy.findIndex(e => e.from === j && e.to === w);
      if (edgeIndex >= 0) {
        edgesCopy[edgeIndex].highlighted = true;
      }

      allSteps.push({
        type: 'evaluate-edge',
        nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
        edges: edgesCopy.map(e => ({ ...e })),
        priorityQueue: [...pq],
        message: `Avaliando arco <${nodesCopy[j].label}, ${nodesCopy[w].label}> com custo ${weight}`,
        highlightedNode: null,
        highlightedEdge: { from: j, to: w },
        action: 'evaluate-edge',
        currentNode: j,
        relaxingEdge: null,
      });

      // Relaxamento
      const newDist = nodesCopy[j].dist + weight;
      if (nodesCopy[w].dist > newDist) {
        const oldDist = nodesCopy[w].dist;
        nodesCopy[w].dist = newDist;
        nodesCopy[w].pred = j;
        
        // Atualiza a fila de prioridade (DecreaseKey)
        const pqIndex = pq.findIndex(item => item.nodeId === w);
        if (pqIndex >= 0) {
          pq[pqIndex].dist = newDist;
        }

        if (edgeIndex >= 0) {
          edgesCopy[edgeIndex].isRelaxing = true;
        }

        allSteps.push({
          type: 'relax',
          nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
          edges: edgesCopy.map(e => ({ ...e })),
          priorityQueue: [...pq],
          message: `✅ RELAXAMENTO: dist[${nodesCopy[w].label}] = ${oldDist === Infinity ? '∞' : oldDist} → ${newDist}. pred[${nodesCopy[w].label}] = ${nodesCopy[j].label}`,
          highlightedNode: w,
          highlightedEdge: { from: j, to: w },
          action: 'relax',
          currentNode: j,
          relaxingEdge: { from: j, to: w, oldDist, newDist },
        });

        if (edgeIndex >= 0) {
          edgesCopy[edgeIndex].isRelaxing = false;
        }
      } else {
        allSteps.push({
          type: 'no-relax',
          nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
          edges: edgesCopy.map(e => ({ ...e })),
          priorityQueue: [...pq],
          message: `❌ Sem melhoria: dist[${nodesCopy[w].label}] = ${nodesCopy[w].dist} ≤ ${newDist}`,
          highlightedNode: null,
          highlightedEdge: { from: j, to: w },
          action: 'no-relax',
          currentNode: j,
          relaxingEdge: null,
        });
      }

      if (edgeIndex >= 0) {
        edgesCopy[edgeIndex].highlighted = false;
      }
    }

    nodesCopy[j].state = 'visited';
    
    allSteps.push({
      type: 'finish-node',
      nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
      edges: edgesCopy.map(e => ({ ...e })),
      priorityQueue: [...pq],
      message: `${nodesCopy[j].label} processado. Distância final: ${nodesCopy[j].dist}`,
      highlightedNode: j,
      highlightedEdge: null,
      action: 'finish-node',
      currentNode: null,
      relaxingEdge: null,
    });
  }

  // Marca os caminhos mínimos
  const finalDistances: FinalDistance[] = [];
  
  for (let i = 0; i < nodesCopy.length; i++) {
    if (i !== sourceNode && nodesCopy[i].dist !== Infinity) {
      const path: number[] = [];
      let current: number | null = i;
      
      while (current !== null) {
        path.unshift(current);
        current = nodesCopy[current].pred;
      }
      
      // Marca arestas do caminho
      for (let j = 0; j < path.length - 1; j++) {
        const edgeIndex = edgesCopy.findIndex(e => e.from === path[j] && e.to === path[j + 1]);
        if (edgeIndex >= 0) {
          edgesCopy[edgeIndex].isInPath = true;
        }
      }
      
      finalDistances.push({ nodeId: i, dist: nodesCopy[i].dist, path });
    }
  }

  allSteps.push({
    type: 'final',
    nodes: nodesCopy.map(n => ({ ...n, isInQueue: false })),
    edges: edgesCopy.map(e => ({ ...e })),
    priorityQueue: [],
    message: `✅ Algoritmo de Dijkstra concluído! Distâncias mínimas calculadas a partir de ${nodesCopy[sourceNode].label}.`,
    highlightedNode: null,
    highlightedEdge: null,
    action: 'final',
    currentNode: null,
    relaxingEdge: null,
    finalDistances,
  });

  return allSteps;
}

