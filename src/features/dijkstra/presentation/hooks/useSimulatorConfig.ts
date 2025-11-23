import { useState, useCallback } from 'react';
import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';
import { useGraph } from '../../../../contexts/GraphContext';
import { convertGraphToSimulator } from '../../../../utils/graphConverter';

export interface UseSimulatorConfigProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialSourceNode?: number;
}

export interface UseSimulatorConfigReturn {
  nodes: Node[];
  edges: Edge[];
  sourceNode: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSourceNode: (sourceNode: number) => void;
  generateRandomGraph: (n: number) => void;
  loadCustomGraph: () => void;
  error: Error | null;
}

/**
 * Hook for managing simulator configuration.
 * Handles nodes, edges, source node state, and graph generation/loading.
 */
export function useSimulatorConfig({
  initialNodes = [
    { id: 0, label: 'A', state: 'unvisited', dist: Infinity, pred: null, x: 100, y: 200 },
    { id: 1, label: 'B', state: 'unvisited', dist: Infinity, pred: null, x: 250, y: 100 },
    { id: 2, label: 'C', state: 'unvisited', dist: Infinity, pred: null, x: 400, y: 100 },
    { id: 3, label: 'D', state: 'unvisited', dist: Infinity, pred: null, x: 250, y: 300 },
    { id: 4, label: 'E', state: 'unvisited', dist: Infinity, pred: null, x: 400, y: 300 },
    { id: 5, label: 'F', state: 'unvisited', dist: Infinity, pred: null, x: 550, y: 200 },
  ],
  initialEdges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 3, weight: 2 },
    { from: 1, to: 2, weight: 3 },
    { from: 1, to: 3, weight: 1 },
    { from: 3, to: 1, weight: 1 },
    { from: 3, to: 4, weight: 7 },
    { from: 2, to: 4, weight: 2 },
    { from: 2, to: 5, weight: 5 },
    { from: 4, to: 5, weight: 1 },
  ],
  initialSourceNode = 0
}: UseSimulatorConfigProps): UseSimulatorConfigReturn {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [sourceNode, setSourceNode] = useState<number>(initialSourceNode);
  const [error, setError] = useState<Error | null>(null);

  const { savedGraph } = useGraph();

  const generateRandomGraph = useCallback((n: number) => {
    try {
      setError(null);
      const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const newNodes: Node[] = [];
      
      const centerX = 350;
      const centerY = 200;
      const radius = Math.min(150, 100 + n * 8);
      
      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * i) / n - Math.PI / 2;
        newNodes.push({
          id: i,
          label: labels[i % labels.length],
          state: 'unvisited',
          dist: Infinity,
          pred: null,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });
      }
      
      const newEdges: Edge[] = [];
      const edgeSet = new Set<string>();
      
      // Garantir conectividade (árvore geradora)
      for (let i = 1; i < n; i++) {
        const from = Math.floor(Math.random() * i);
        const weight = Math.floor(Math.random() * 9) + 1; // 1-9
        const edgeKey = `${from}-${i}`;
        
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          newEdges.push({ from, to: i, weight, highlighted: false });
        }
      }
      
      // Adicionar arestas extras (grafo direcionado)
      const extraEdges = Math.floor(n * 0.8);
      for (let i = 0; i < extraEdges; i++) {
        const from = Math.floor(Math.random() * n);
        const to = Math.floor(Math.random() * n);
        const weight = Math.floor(Math.random() * 9) + 1;
        const edgeKey = `${from}-${to}`;
        
        if (from !== to && !edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          newEdges.push({ from, to, weight, highlighted: false });
        }
      }
      
      setNodes(newNodes);
      setEdges(newEdges);
      setSourceNode(0);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erro ao gerar grafo aleatório!';
      setError(new Error(errorMessage));
    }
  }, []);

  const loadCustomGraph = useCallback(() => {
    try {
      setError(null);
      if (!savedGraph) {
        setError(new Error('Nenhum grafo salvo'));
        return;
      }

      const { nodes: customNodes, edges: customEdges } = convertGraphToSimulator(savedGraph);
      
      // Converte para os tipos específicos do Dijkstra
      const dijkstraNodes: Node[] = customNodes.map(n => ({
        id: n.id,
        label: n.label,
        state: 'unvisited' as const,
        dist: Infinity,
        pred: null,
        x: n.x,
        y: n.y,
        isSource: false
      }));

      const dijkstraEdges: Edge[] = customEdges.map(e => ({
        from: e.from,
        to: e.to,
        weight: e.weight || 1, // Default weight if not specified
        highlighted: false,
        isInPath: false
      }));
      
      setNodes(dijkstraNodes);
      setEdges(dijkstraEdges);
      setSourceNode(0);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erro ao carregar grafo customizado!';
      setError(new Error(errorMessage));
    }
  }, [savedGraph]);

  return {
    nodes,
    edges,
    sourceNode,
    setNodes,
    setEdges,
    setSourceNode,
    generateRandomGraph,
    loadCustomGraph,
    error
  };
}

