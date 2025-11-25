import { InvalidGraphError } from '../../errors/InvalidGraphError';
import { GraphNode, GraphEdge } from '../directed/DirectedGraphValidator';

/**
 * Validates an undirected weighted graph.
 * Checks for:
 * - Non-empty nodes and edges
 * - Unique node IDs
 * - Valid edge references
 * - No self-loops
 * - Positive weights (if present)
 * - No duplicate edges (considering both directions)
 * 
 * @throws InvalidGraphError if graph is invalid
 */
export function validateUndirectedGraph<TNode extends GraphNode, TEdge extends GraphEdge>(
  nodes: TNode[],
  edges: TEdge[]
): void {
  if (!nodes || nodes.length === 0) {
    throw new InvalidGraphError('O grafo deve ter pelo menos um vértice.');
  }

  if (!edges || edges.length === 0) {
    throw new InvalidGraphError('O grafo deve ter pelo menos uma aresta.');
  }

  // Validate node IDs are unique
  const nodeIds = new Set<number>();
  for (const node of nodes) {
    if (nodeIds.has(node.id)) {
      throw new InvalidGraphError(`Vértice com ID duplicado: ${node.id}`);
    }
    nodeIds.add(node.id);
  }

  // Validate edges reference valid nodes
  for (const edge of edges) {
    if (!nodeIds.has(edge.from)) {
      throw new InvalidGraphError(`Aresta referencia vértice inexistente: ${edge.from}`);
    }
    if (!nodeIds.has(edge.to)) {
      throw new InvalidGraphError(`Aresta referencia vértice inexistente: ${edge.to}`);
    }
    if (edge.from === edge.to) {
      throw new InvalidGraphError('Arestas não podem conectar um vértice a si mesmo.');
    }
    if (edge.weight !== undefined && edge.weight <= 0) {
      throw new InvalidGraphError('Pesos das arestas devem ser positivos.');
    }
  }

  // Validate undirected graph (no duplicate edges)
  const edgeSet = new Set<string>();
  for (const edge of edges) {
    const key1 = `${edge.from}-${edge.to}`;
    const key2 = `${edge.to}-${edge.from}`;
    if (edgeSet.has(key1) || edgeSet.has(key2)) {
      throw new InvalidGraphError(`Aresta duplicada: {${edge.from}, ${edge.to}}`);
    }
    edgeSet.add(key1);
  }
}


