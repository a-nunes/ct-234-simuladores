import { validateGraph } from '@features/kruskal/data/validators/GraphValidator';
import { Node } from '@features/kruskal/domain/entities/Node';
import { Edge } from '@features/kruskal/domain/entities/Edge';
import { InvalidGraphError } from '@shared/graph-simulators/errors/InvalidGraphError';

describe('GraphValidator', () => {
  const createNode = (id: number, label: string): Node => ({
    id,
    label,
    x: 100,
    y: 200
  });

  describe('validateGraph', () => {
    it('should validate a valid undirected graph', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 3 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });

    it('should throw error for empty nodes array', () => {
      const nodes: Node[] = [];
      const edges: Edge[] = [{ from: 0, to: 1, weight: 1 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('pelo menos um vértice');
    });

    it('should throw error for empty edges array', () => {
      const nodes: Node[] = [createNode(0, 'A')];
      const edges: Edge[] = [];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('pelo menos uma aresta');
    });

    it('should throw error for duplicate node IDs', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(0, 'B')
      ];
      const edges: Edge[] = [{ from: 0, to: 1, weight: 1 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('duplicado');
    });

    it('should throw error for edge referencing non-existent node', () => {
      const nodes: Node[] = [createNode(0, 'A')];
      const edges: Edge[] = [{ from: 0, to: 99, weight: 1 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('vértice inexistente');
    });

    it('should throw error for self-loop', () => {
      const nodes: Node[] = [createNode(0, 'A')];
      const edges: Edge[] = [{ from: 0, to: 0, weight: 1 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('si mesmo');
    });

    it('should throw error for zero weight', () => {
      const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
      const edges: Edge[] = [{ from: 0, to: 1, weight: 0 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('positivos');
    });

    it('should throw error for negative weight', () => {
      const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
      const edges: Edge[] = [{ from: 0, to: 1, weight: -5 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('positivos');
    });

    it('should throw error for duplicate edges', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 0, to: 1, weight: 2 }
      ];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('duplicada');
    });

    it('should throw error for duplicate edges in reverse direction', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 0, weight: 2 }
      ];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('duplicada');
    });

    it('should validate graph with multiple valid edges', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C'),
        createNode(3, 'D')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 },
        { from: 2, to: 3, weight: 3 },
        { from: 0, to: 3, weight: 4 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });
  });
});

