import { validateGraph } from '@features/topological-sort/data/validators/GraphValidator';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';
import { InvalidGraphError } from '@shared/graph-simulators/errors/InvalidGraphError';

describe('GraphValidator', () => {
  const createNode = (id: number, label: string): Node => ({
    id,
    label,
    state: 'unvisited',
    x: 100,
    y: 200
  });

  describe('validateGraph', () => {
    it('should validate a valid directed graph', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });

    it('should throw error for empty nodes array', () => {
      const nodes: Node[] = [];
      const edges: Edge[] = [{ from: 0, to: 1 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('pelo menos um nó');
    });

    it.skip('should throw error for duplicate node IDs', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(0, 'B')
      ];
      const edges: Edge[] = [{ from: 0, to: 1 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('duplicado');
    });

    it('should throw error for edge referencing non-existent node', () => {
      const nodes: Node[] = [createNode(0, 'A')];
      const edges: Edge[] = [{ from: 0, to: 99 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('destino inválido');
    });

    it('should throw error for self-loop', () => {
      const nodes: Node[] = [createNode(0, 'A')];
      const edges: Edge[] = [{ from: 0, to: 0 }];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('si mesmo');
    });

    it('should allow graph with no edges', () => {
      const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
      const edges: Edge[] = [];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });

    it('should allow multiple edges from same source', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 0, to: 2 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });

    it('should allow multiple edges to same target', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 2 },
        { from: 1, to: 2 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });

    it.skip('should throw error for duplicate directed edges', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 0, to: 1 }
      ];

      expect(() => validateGraph(nodes, edges)).toThrow(InvalidGraphError);
      expect(() => validateGraph(nodes, edges)).toThrow('duplicada');
    });

    it('should allow bidirectional edges (not duplicate in directed graph)', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 0 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });

    it('should validate graph with multiple valid edges', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C'),
        createNode(3, 'D')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 0, to: 3 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });

    it('should validate disconnected components', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C'),
        createNode(3, 'D')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 2, to: 3 }
      ];

      expect(() => validateGraph(nodes, edges)).not.toThrow();
    });
  });
});

