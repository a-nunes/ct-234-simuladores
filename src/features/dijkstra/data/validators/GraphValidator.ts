import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';
import { validateDirectedGraph } from '@shared/graph-simulators/validators/directed/DirectedGraphValidator';

/**
 * Validates a directed graph for Dijkstra algorithm.
 * Uses the shared directed graph validator.
 */
export function validateGraph(nodes: Node[], edges: Edge[]): void {
  validateDirectedGraph(nodes, edges);
}

