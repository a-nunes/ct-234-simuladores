import { Node } from '@features/dijkstra/domain/entities/Node';
import { InvalidSourceNodeError } from '@features/dijkstra/domain/errors/InvalidSourceNodeError';

export function validateSourceNode(sourceNode: number, nodes: Node[]): void {
  const nodeExists = nodes.some(n => n.id === sourceNode);
  
  if (!nodeExists) {
    throw new InvalidSourceNodeError(`Nó de origem inválido: ${sourceNode}. O nó não existe no grafo.`);
  }
}

