import { Node } from '@features/kruskal/domain/entities/Node';
import { Edge } from '@features/kruskal/domain/entities/Edge';
import { validateUndirectedGraph } from '@shared/graph-simulators/validators/undirected/UndirectedGraphValidator';

/**
 * Validates an undirected weighted graph for Kruskal algorithm.
 * Uses the shared undirected graph validator.
 * @throws InvalidGraphError if graph is invalid
 */
export function validateGraph(nodes: Node[], edges: Edge[]): void {
  validateUndirectedGraph(nodes, edges);
}

