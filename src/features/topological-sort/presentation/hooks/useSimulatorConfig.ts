import { useState, useCallback } from 'react';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';
import { useGraph } from '../../../../contexts/GraphContext';
import { convertGraphToSimulator } from '../../../../utils/graphConverter';

export interface UseSimulatorConfigProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialDataStructure?: 'queue' | 'stack';
}

export interface UseSimulatorConfigReturn {
  nodes: Node[];
  edges: Edge[];
  dataStructure: 'queue' | 'stack';
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setDataStructure: (dataStructure: 'queue' | 'stack') => void;
  generateRandomGraph: (n: number) => void;
  loadCustomGraph: () => void;
  error: Error | null;
}

/**
 * Hook for managing simulator configuration.
 * Handles nodes, edges, data structure state, and graph generation/loading.
 */
export function useSimulatorConfig({
  initialNodes = [
    { id: 0, label: 'A', state: 'unvisited', x: 100, y: 200 },
    { id: 1, label: 'B', state: 'unvisited', x: 250, y: 100 },
    { id: 2, label: 'C', state: 'unvisited', x: 400, y: 100 },
    { id: 3, label: 'D', state: 'unvisited', x: 250, y: 300 },
    { id: 4, label: 'E', state: 'unvisited', x: 400, y: 300 },
  ],
  initialEdges = [
    { from: 0, to: 1 },
    { from: 0, to: 3 },
    { from: 1, to: 2 },
    { from: 3, to: 4 },
    { from: 2, to: 4 },
  ],
  initialDataStructure = 'queue'
}: UseSimulatorConfigProps): UseSimulatorConfigReturn {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [dataStructure, setDataStructure] = useState<'queue' | 'stack'>(initialDataStructure);
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
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });
      }
      
      // Generate a DAG (Directed Acyclic Graph) for topological sort
      const newEdges: Edge[] = [];
      const edgeSet = new Set<string>();
      
      // Create a topological ordering first
      const ordering = Array.from({ length: n }, (_, i) => i);
      // Shuffle to create random DAG
      for (let i = ordering.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ordering[i], ordering[j]] = [ordering[j], ordering[i]];
      }
      
      // Add edges only from lower indices to higher indices (ensures DAG)
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          // Randomly add edges (30% chance)
          if (Math.random() < 0.3) {
            const from = ordering[i];
            const to = ordering[j];
            const edgeKey = `${from}-${to}`;
            
            if (!edgeSet.has(edgeKey)) {
              edgeSet.add(edgeKey);
              newEdges.push({ from, to, highlighted: false });
            }
          }
        }
      }
      
      // Ensure at least some edges
      if (newEdges.length === 0 && n > 1) {
        newEdges.push({ from: ordering[0], to: ordering[1], highlighted: false });
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
      
      // Convert to topological sort types
      const topoNodes: Node[] = customNodes.map(n => ({
        id: n.id,
        label: n.label,
        state: 'unvisited' as const,
        x: n.x,
        y: n.y,
      }));

      const topoEdges: Edge[] = customEdges.map(e => ({
        from: e.from,
        to: e.to,
        highlighted: false
      }));
      
      setNodes(topoNodes);
      setEdges(topoEdges);
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
    dataStructure,
    setNodes,
    setEdges,
    setDataStructure,
    generateRandomGraph,
    loadCustomGraph,
    error
  };
}








