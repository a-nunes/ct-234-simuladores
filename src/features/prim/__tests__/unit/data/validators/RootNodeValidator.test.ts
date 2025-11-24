import { validateRootNode } from '@features/prim/data/validators/RootNodeValidator';
import { Node } from '@features/prim/domain/entities/Node';
import { InvalidRootNodeError } from '@features/prim/domain/errors/InvalidRootNodeError';

describe('RootNodeValidator', () => {
  const createNode = (id: number, label: string): Node => ({
    id,
    label,
    x: 100,
    y: 200
  });

  describe('validateRootNode', () => {
    it('should validate existing root node', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];

      expect(() => validateRootNode(0, nodes)).not.toThrow();
      expect(() => validateRootNode(1, nodes)).not.toThrow();
      expect(() => validateRootNode(2, nodes)).not.toThrow();
    });

    it('should throw error for non-existent root node', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];

      expect(() => validateRootNode(99, nodes)).toThrow(InvalidRootNodeError);
      expect(() => validateRootNode(99, nodes)).toThrow('não existe');
    });

    it('should throw error for negative root node ID', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];

      expect(() => validateRootNode(-1, nodes)).toThrow(InvalidRootNodeError);
    });

    it('should validate root node with single node graph', () => {
      const nodes: Node[] = [createNode(0, 'A')];

      expect(() => validateRootNode(0, nodes)).not.toThrow();
    });

    it('should throw error when root node ID is out of bounds', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];

      expect(() => validateRootNode(3, nodes)).toThrow(InvalidRootNodeError);
      expect(() => validateRootNode(10, nodes)).toThrow(InvalidRootNodeError);
    });

    it('should validate when node IDs are not sequential', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(5, 'B'),
        createNode(10, 'C')
      ];

      expect(() => validateRootNode(0, nodes)).not.toThrow();
      expect(() => validateRootNode(5, nodes)).not.toThrow();
      expect(() => validateRootNode(10, nodes)).not.toThrow();
      expect(() => validateRootNode(1, nodes)).toThrow(InvalidRootNodeError);
    });

    it('should include root node ID in error message', () => {
      const nodes: Node[] = [createNode(0, 'A')];

      try {
        validateRootNode(99, nodes);
        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidRootNodeError);
        expect((error as Error).message).toContain('99');
      }
    });
  });
});

