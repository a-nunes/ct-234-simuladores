import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';
import { InvalidGraphError } from '@features/dijkstra/domain/errors/InvalidGraphError';

export function validateGraph(nodes: Node[], edges: Edge[]): void {
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
    if (!nodes.some(n => n.id === edge.from)) {
      throw new InvalidGraphError(`Aresta com nó origem inválido: ${edge.from}`);
    }

    // Verifica se o nó destino existe
    if (!nodes.some(n => n.id === edge.to)) {
      throw new InvalidGraphError(`Aresta com nó destino inválido: ${edge.to}`);
    }

    // Verifica se não é uma aresta para si mesmo
    if (edge.from === edge.to) {
      throw new InvalidGraphError(`Aresta não pode conectar um nó a si mesmo: ${edge.from} -> ${edge.to}`);
    }

    // Valida pesos não-negativos
    if (edge.weight < 0) {
      throw new InvalidGraphError(`Aresta com peso negativo: ${edge.from} -> ${edge.to} (peso: ${edge.weight})`);
    }
  }
}

