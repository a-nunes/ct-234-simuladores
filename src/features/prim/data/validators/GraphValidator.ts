import { Node } from '@features/prim/domain/entities/Node';
import { Edge } from '@features/prim/domain/entities/Edge';
import { validateUndirectedGraph } from '@shared/graph-simulators/validators/undirected/UndirectedGraphValidator';

/**
 * Validates an undirected weighted graph for Prim algorithm.
 * Uses the shared undirected graph validator.
 * @throws InvalidGraphError if graph is invalid
 */
export function validateGraph(nodes: Node[], edges: Edge[]): void {
  validateUndirectedGraph(nodes, edges);
}

