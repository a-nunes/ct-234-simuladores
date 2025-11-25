import { InvalidGraphError } from '../../errors/InvalidGraphError';

/**
 * Base interface for nodes in graph validators
 */
export interface GraphNode {
  id: number;
  [key: string]: any;
}

/**
 * Base interface for edges in graph validators
 */
export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
  [key: string]: any;
}

/**
 * Validates a directed graph.
 * Checks for:
 * - Non-empty nodes
 * - Unique node IDs
 * - Valid edge references
 * - No self-loops
 * - Non-negative weights (if present)
 * 
 * @throws InvalidGraphError if graph is invalid
 */
export function validateDirectedGraph<TNode extends GraphNode, TEdge extends GraphEdge>(
  nodes: TNode[],
  edges: TEdge[]
): void {
  // Valida nós não vazios
  if (nodes.length === 0) {
    throw new InvalidGraphError('O grafo deve ter pelo menos um nó');
  }

  // Valida IDs únicos
  const nodeIds = new Set<number>();
  for (const node of nodes) {
    if (nodeIds.has(node.id)) {
      throw new InvalidGraphError(`Nó com ID duplicado: ${node.id}`);
    }
    nodeIds.add(node.id);
  }

  // Valida arestas válidas
  for (const edge of edges) {
    // Verifica se o nó origem existe
    if (!nodeIds.has(edge.from)) {
      throw new InvalidGraphError(`Aresta com nó origem inválido: ${edge.from}`);
    }

    // Verifica se o nó destino existe
    if (!nodeIds.has(edge.to)) {
      throw new InvalidGraphError(`Aresta com nó destino inválido: ${edge.to}`);
    }

    // Verifica se não é uma aresta para si mesmo
    if (edge.from === edge.to) {
      throw new InvalidGraphError(`Aresta não pode conectar um nó a si mesmo: ${edge.from} -> ${edge.to}`);
    }

    // Valida pesos não-negativos (se presente)
    if (edge.weight !== undefined && edge.weight < 0) {
      throw new InvalidGraphError(`Aresta com peso negativo: ${edge.from} -> ${edge.to} (peso: ${edge.weight})`);
    }
  }
}


