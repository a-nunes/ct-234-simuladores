import { Node } from '@features/prim/domain/entities/Node';
import { InvalidRootNodeError } from '@features/prim/domain/errors/InvalidRootNodeError';

/**
 * Validates that the root node exists in the graph.
 * @throws InvalidRootNodeError if root node is invalid
 */
export function validateRootNode(rootNode: number, nodes: Node[]): void {
  const nodeIds = nodes.map(n => n.id);
  if (!nodeIds.includes(rootNode)) {
    throw new InvalidRootNodeError(`Vértice raiz ${rootNode} não existe no grafo.`);
  }
}

