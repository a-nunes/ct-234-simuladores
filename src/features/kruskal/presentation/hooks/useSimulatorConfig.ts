import { useState, useCallback } from 'react';
import { Node } from '@features/kruskal/domain/entities/Node';
import { Edge } from '@features/kruskal/domain/entities/Edge';
import { useGraph } from '../../../../contexts/GraphContext';
import { convertGraphToSimulator } from '../../../../utils/graphConverter';

export interface UseSimulatorConfigProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

export interface UseSimulatorConfigReturn {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  generateRandomGraph: (n: number) => void;
  loadCustomGraph: () => void;
  error: Error | null;
}

/**
 * Hook for managing simulator configuration.
 * Handles nodes, edges state, and graph generation/loading.
 */
export function useSimulatorConfig({
  initialNodes = [
    { id: 0, label: 'A', x: 150, y: 200 },
    { id: 1, label: 'B', x: 300, y: 100 },
    { id: 2, label: 'C', x: 450, y: 100 },
    { id: 3, label: 'D', x: 300, y: 300 },
    { id: 4, label: 'E', x: 450, y: 300 },
    { id: 5, label: 'F', x: 600, y: 200 },
  ],
  initialEdges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 3, weight: 2 },
    { from: 1, to: 2, weight: 3 },
    { from: 1, to: 3, weight: 1 },
    { from: 2, to: 4, weight: 5 },
    { from: 2, to: 5, weight: 6 },
    { from: 3, to: 4, weight: 7 },
    { from: 4, to: 5, weight: 2 },
  ]
}: UseSimulatorConfigProps): UseSimulatorConfigReturn {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
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
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });
      }
      
      const newEdges: Edge[] = [];
      const edgeSet = new Set<string>();
      
      // Garantir conectividade (árvore geradora)
      for (let i = 1; i < n; i++) {
        const from = Math.floor(Math.random() * i);
        const weight = Math.floor(Math.random() * 9) + 1;
        const edgeKey = from < i ? `${from}-${i}` : `${i}-${from}`;
        
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          newEdges.push({ 
            from: Math.min(from, i), 
            to: Math.max(from, i), 
            weight, 
            highlighted: false 
          });
        }
      }
      
      // Adicionar arestas extras (grafo não-orientado)
      const extraEdges = Math.floor(n * 0.5);
      for (let i = 0; i < extraEdges; i++) {
        const from = Math.floor(Math.random() * n);
        const to = Math.floor(Math.random() * n);
        const weight = Math.floor(Math.random() * 9) + 1;
        const edgeKey = from < to ? `${from}-${to}` : `${to}-${from}`;
        
        if (from !== to && !edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          newEdges.push({ 
            from: Math.min(from, to), 
            to: Math.max(from, to), 
            weight, 
            highlighted: false 
          });
        }
      }
      
      setNodes(newNodes);
      setEdges(newEdges);
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
      
      // Converte para os tipos específicos do Kruskal
      const kruskalNodes: Node[] = customNodes.map(n => ({
        id: n.id,
        label: n.label,
        x: n.x,
        y: n.y,
      }));

      const kruskalEdges: Edge[] = customEdges.map(e => ({
        from: e.from,
        to: e.to,
        weight: e.weight || 1, // Default weight if not specified
        highlighted: false,
      }));
      
      setNodes(kruskalNodes);
      setEdges(kruskalEdges);
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
    setNodes,
    setEdges,
    generateRandomGraph,
    loadCustomGraph,
    error
  };
}

