import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';

export interface DijkstraResult {
  distances: number[];
  predecessors: (number | null)[];
}

/**
 * Algoritmo de Dijkstra puro (sem side effects, sem logs).
 * Retorna apenas as distâncias e predecessores.
 */
export function dijkstra(
  nodes: Node[],
  edges: Edge[],
  sourceNode: number
): DijkstraResult {
  const n = nodes.length;
  const distances: number[] = new Array(n).fill(Infinity);
  const predecessors: (number | null)[] = new Array(n).fill(null);
  const visited: boolean[] = new Array(n).fill(false);

  // Inicialização
  distances[sourceNode] = 0;

  // Lista de adjacências
  const adjList: { to: number; weight: number }[][] = new Array(n).fill(null).map(() => []);
  edges.forEach(edge => {
    adjList[edge.from].push({ to: edge.to, weight: edge.weight });
  });

  // Loop principal
  for (let i = 0; i < n; i++) {
    // Encontra o vértice não visitado com menor distância
    let minDist = Infinity;
    let u = -1;

    for (let j = 0; j < n; j++) {
      if (!visited[j] && distances[j] < minDist) {
        minDist = distances[j];
        u = j;
      }
    }

    // Se não há mais vértices alcançáveis, termina
    if (u === -1 || distances[u] === Infinity) {
      break;
    }

    visited[u] = true;

    // Relaxa as arestas
    for (const neighbor of adjList[u]) {
      const v = neighbor.to;
      const weight = neighbor.weight;
      const newDist = distances[u] + weight;

      if (newDist < distances[v]) {
        distances[v] = newDist;
        predecessors[v] = u;
      }
    }
  }

  return { distances, predecessors };
}

