import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';
import { validateDirectedGraph } from '@shared/graph-simulators/validators/directed/DirectedGraphValidator';

/**
 * Validates a directed graph for topological sort algorithm.
 * Uses the shared directed graph validator.
 * Weights are not required for topological sort (they are ignored if present).
 */
export function validateGraph(nodes: Node[], edges: Edge[]): void {
  validateDirectedGraph(nodes, edges);
}


