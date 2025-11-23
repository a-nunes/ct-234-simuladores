import { dijkstra } from '@features/dijkstra/data/algorithms/DijkstraAlgorithm';
import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';

describe('DijkstraAlgorithm', () => {
  const createNode = (id: number, label: string, x: number, y: number): Node => ({
    id,
    label,
    state: 'unvisited',
    dist: Infinity,
    pred: null,
    x,
    y
  });

  describe('dijkstra', () => {
    it('should find shortest paths in simple connected graph', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 3 }
      ];

      const result = dijkstra(nodes, edges, 0);

      expect(result.distances[0]).toBe(0);
      expect(result.distances[1]).toBe(5);
      expect(result.distances[2]).toBe(8);
      expect(result.predecessors[0]).toBeNull();
      expect(result.predecessors[1]).toBe(0);
      expect(result.predecessors[2]).toBe(1);
    });

    it('should handle disconnected graph', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 5 }
        // Node 2 is disconnected
      ];

      const result = dijkstra(nodes, edges, 0);

      expect(result.distances[0]).toBe(0);
      expect(result.distances[1]).toBe(5);
      expect(result.distances[2]).toBe(Infinity);
      expect(result.predecessors[2]).toBeNull();
    });

    it('should work with single node graph', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200)
      ];
      const edges: Edge[] = [];

      const result = dijkstra(nodes, edges, 0);

      expect(result.distances[0]).toBe(0);
      expect(result.predecessors[0]).toBeNull();
    });

    it('should find shortest path when multiple paths exist', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 10 },
        { from: 0, to: 2, weight: 5 },
        { from: 1, to: 2, weight: 2 }
      ];

      const result = dijkstra(nodes, edges, 0);

      // Direct path A->C (5) is shorter than A->B->C (10+2=12)
      expect(result.distances[2]).toBe(5);
      expect(result.predecessors[2]).toBe(0);
    });

    it('should handle graph with cycles', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 3 },
        { from: 1, to: 2, weight: 2 },
        { from: 2, to: 0, weight: 1 }
      ];

      const result = dijkstra(nodes, edges, 0);

      expect(result.distances[0]).toBe(0);
      expect(result.distances[1]).toBe(3);
      expect(result.distances[2]).toBe(5);
    });

    it('should handle graph with multiple edges to same node', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 2, weight: 10 },
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const result = dijkstra(nodes, edges, 0);

      // Path A->B->C (1+2=3) is shorter than A->C (10)
      expect(result.distances[2]).toBe(3);
      expect(result.predecessors[2]).toBe(1);
    });
  });
});

