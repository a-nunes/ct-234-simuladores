import { GenerateStepsUseCase } from '@features/prim/domain/usecases/GenerateSteps.usecase';
import { PrimConfig } from '@features/prim/domain/entities/PrimConfig';
import { Node } from '@features/prim/domain/entities/Node';
import { Edge } from '@features/prim/domain/entities/Edge';
import { InvalidGraphError } from '@shared/graph-simulators/errors/InvalidGraphError';
import { InvalidRootNodeError } from '@features/prim/domain/errors/InvalidRootNodeError';

describe('GenerateStepsUseCase', () => {
  const createNode = (id: number, label: string, x: number = 100, y: number = 200): Node => ({
    id,
    label,
    x,
    y
  });

  describe('execute', () => {
    it('should generate steps for a valid graph', () => {
      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B'),
          createNode(2, 'C')
        ],
        edges: [
          { from: 0, to: 1, weight: 1 },
          { from: 1, to: 2, weight: 2 }
        ],
        rootNode: 0
      };

      const steps = useCase.execute(config);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[steps.length - 1].type).toBe('final');
    });

    it('should throw InvalidGraphError for empty nodes', () => {
      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes: [],
        edges: [{ from: 0, to: 1, weight: 1 }],
        rootNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('pelo menos um vértice');
    });

    it('should throw InvalidGraphError for empty edges', () => {
      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes: [createNode(0, 'A'), createNode(1, 'B')],
        edges: [],
        rootNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('pelo menos uma aresta');
    });

    it('should throw InvalidRootNodeError for non-existent root node', () => {
      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes: [createNode(0, 'A'), createNode(1, 'B')],
        edges: [{ from: 0, to: 1, weight: 1 }],
        rootNode: 99
      };

      expect(() => useCase.execute(config)).toThrow(InvalidRootNodeError);
      expect(() => useCase.execute(config)).toThrow('não existe');
    });

    it('should throw InvalidGraphError for invalid edge references', () => {
      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes: [createNode(0, 'A')],
        edges: [{ from: 0, to: 99, weight: 1 }],
        rootNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('vértice inexistente');
    });

    it('should throw InvalidGraphError for self-loop edges', () => {
      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes: [createNode(0, 'A')],
        edges: [{ from: 0, to: 0, weight: 1 }],
        rootNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('si mesmo');
    });

    it('should throw InvalidGraphError for negative or zero weights', () => {
      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes: [createNode(0, 'A'), createNode(1, 'B')],
        edges: [{ from: 0, to: 1, weight: 0 }],
        rootNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('positivos');
    });

    it('should throw InvalidGraphError for duplicate node IDs', () => {
      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes: [createNode(0, 'A'), createNode(0, 'B')],
        edges: [{ from: 0, to: 1, weight: 1 }],
        rootNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('duplicado');
    });

    it('should generate correct MST for simple graph', () => {
      const useCase = new GenerateStepsUseCase();
      const config: PrimConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B'),
          createNode(2, 'C')
        ],
        edges: [
          { from: 0, to: 1, weight: 4 },
          { from: 1, to: 2, weight: 3 },
          { from: 0, to: 2, weight: 5 }
        ],
        rootNode: 0
      };

      const steps = useCase.execute(config);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.type).toBe('final');
      expect(finalStep.mstEdges).toHaveLength(2); // MST for 3 nodes has 2 edges
      expect(finalStep.totalCost).toBe(7); // 3 + 4
    });

    it('should work with different root nodes', () => {
      const useCase = new GenerateStepsUseCase();
      const nodes = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      // Test with root = 0
      const stepsRoot0 = useCase.execute({ nodes, edges, rootNode: 0 });
      expect(stepsRoot0.length).toBeGreaterThan(0);

      // Test with root = 1
      const stepsRoot1 = useCase.execute({ nodes, edges, rootNode: 1 });
      expect(stepsRoot1.length).toBeGreaterThan(0);

      // Both should produce MST with same cost
      const finalCost0 = stepsRoot0[stepsRoot0.length - 1].totalCost;
      const finalCost1 = stepsRoot1[stepsRoot1.length - 1].totalCost;
      expect(finalCost0).toBe(finalCost1);
    });
  });
});

