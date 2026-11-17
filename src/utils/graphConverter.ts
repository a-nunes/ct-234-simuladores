import { GraphDefinition } from '../components/GraphEditor';

// Tipos dos simuladores
export interface SimulatorNode {
  id: number;
  label: string;
  state: string;
  expl: number;
  comp: number;
  x: number;
  y: number;
  [key: string]: any; // Para propriedades específicas de cada simulador
}

export interface SimulatorEdge {
  from: number;
  to: number;
  type?: string;
  highlighted?: boolean;
  weight?: number;
  [key: string]: any;
}

/**
 * Converte um GraphDefinition para o formato usado pelos simuladores
 */
export const convertGraphToSimulator = (
  graph: GraphDefinition,
  additionalNodeProps: object = {},
  additionalEdgeProps: object = {}
): { nodes: SimulatorNode[]; edges: SimulatorEdge[] } => {
  
  // Os simuladores indexam arrays pelo id do vértice (adjList[edge.from] etc.).
  // No editor visual, apagar um vértice deixa "buracos" nos ids, então os ids
  // são renumerados para 0..n-1 e arestas com extremidades inexistentes são descartadas.
  const indexById = new Map<number, number>();
  graph.nodes.forEach((node, index) => indexById.set(node.id, index));

  const nodes: SimulatorNode[] = graph.nodes.map((node, index) => ({
    id: index,
    label: node.label,
    state: 'unvisited',
    expl: 0,
    comp: 0,
    x: node.x,
    y: node.y,
    ...additionalNodeProps
  }));

  const edges: SimulatorEdge[] = [];
  for (const edge of graph.edges) {
    const from = indexById.get(edge.from);
    const to = indexById.get(edge.to);
    if (from === undefined || to === undefined) continue;
    edges.push({
      from,
      to,
      type: 'none',
      highlighted: false,
      weight: edge.weight,
      ...additionalEdgeProps
    });
  }

  return { nodes, edges };
};

/**
 * Verifica se o grafo salvo é compatível com o simulador
 */
export const isGraphCompatible = (
  graph: GraphDefinition | null,
  requiredType: 'directed' | 'undirected',
  requiresWeights: boolean
): { compatible: boolean; message?: string } => {
  
  if (!graph) {
    return { compatible: false, message: 'Nenhum grafo salvo.' };
  }

  if (graph.nodes.length === 0) {
    return { compatible: false, message: 'O grafo não possui vértices.' };
  }

  if (graph.type !== requiredType) {
    const expected = requiredType === 'directed' ? 'direcionado' : 'não-direcionado';
    const actual = graph.type === 'directed' ? 'direcionado' : 'não-direcionado';
    return { 
      compatible: false, 
      message: `Este simulador requer um grafo ${expected}, mas o grafo salvo é ${actual}.` 
    };
  }

  if (requiresWeights && graph.weighted !== 'weighted') {
    return { 
      compatible: false, 
      message: 'Este simulador requer um grafo ponderado, mas o grafo salvo não possui pesos.' 
    };
  }

  return { compatible: true };
};
