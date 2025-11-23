import { validateSourceNode } from '@features/dijkstra/data/validators/SourceNodeValidator';
import { InvalidSourceNodeError } from '@features/dijkstra/domain/errors/InvalidSourceNodeError';
import { Node } from '@features/dijkstra/domain/entities/Node';

describe('SourceNodeValidator', () => {
  const createNode = (id: number, label: string): Node => ({
    id,
    label,
    state: 'unvisited',
    dist: Infinity,
    pred: null,
    x: 100,
    y: 200
  });

  describe('validateSourceNode', () => {
    it('should accept valid source node', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];

      expect(() => validateSourceNode(0, nodes)).not.toThrow();
      expect(() => validateSourceNode(1, nodes)).not.toThrow();
    });

    it('should throw InvalidSourceNodeError for non-existent node', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];

      expect(() => validateSourceNode(5, nodes)).toThrow(InvalidSourceNodeError);
      expect(() => validateSourceNode(5, nodes)).toThrow('Nó de origem inválido: 5');
    });

    it('should throw InvalidSourceNodeError for negative node ID', () => {
      const nodes: Node[] = [
        createNode(0, 'A')
      ];

      expect(() => validateSourceNode(-1, nodes)).toThrow(InvalidSourceNodeError);
    });

    it('should accept source node in large graph', () => {
      const nodes: Node[] = Array.from({ length: 10 }, (_, i) => createNode(i, String.fromCharCode(65 + i)));

      expect(() => validateSourceNode(9, nodes)).not.toThrow();
    });
  });
});

