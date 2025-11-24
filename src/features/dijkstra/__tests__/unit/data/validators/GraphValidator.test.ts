import { validateGraph } from '@features/dijkstra/data/validators/GraphValidator';
import { InvalidGraphError } from '@shared/graph-simulators/errors/InvalidGraphError';
import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';

describe('GraphValidator', () => {
  const createNode = (id: number, label: string): Node => ({
    id,
    label,
    state: 'unvisited',
    dist: Infinity,
    pred: null,
    x: 100,
    y: 200
  });

  describe('validateGraph', () => {
    it('should accept valid graph', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 5 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });

    it('should reject empty nodes array', () => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('O grafo deve ter pelo menos um nó');
    });

    it('should reject duplicate node IDs', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(0, 'B')
      ];
      const edges: Edge[] = [];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('Nó com ID duplicado: 0');
    });

    it('should reject edge with invalid source node', () => {
      const nodes: Node[] = [
        createNode(0, 'A')
      ];
      const edges: Edge[] = [
        { from: 5, to: 0, weight: 1 }
      ];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('Aresta com nó origem inválido: 5');
    });

    it('should reject edge with invalid destination node', () => {
      const nodes: Node[] = [
        createNode(0, 'A')
      ];
      const edges: Edge[] = [
        { from: 0, to: 5, weight: 1 }
      ];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('Aresta com nó destino inválido: 5');
    });

    it('should reject self-loop edge', () => {
      const nodes: Node[] = [
        createNode(0, 'A')
      ];
      const edges: Edge[] = [
        { from: 0, to: 0, weight: 1 }
      ];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('Aresta não pode conectar um nó a si mesmo');
    });

    it('should reject edge with negative weight', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: -5 }
      ];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('Aresta com peso negativo');
    });

    it('should accept edge with zero weight', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 0 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });

    it('should accept graph with multiple edges', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 3 },
        { from: 0, to: 2, weight: 10 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });
  });
});

