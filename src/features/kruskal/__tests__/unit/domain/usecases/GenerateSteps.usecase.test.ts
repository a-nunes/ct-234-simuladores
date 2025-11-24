import { GenerateStepsUseCase } from '@features/kruskal/domain/usecases/GenerateSteps.usecase';
import { KruskalConfig } from '@features/kruskal/domain/entities/KruskalConfig';
import { Node } from '@features/kruskal/domain/entities/Node';
import { Edge } from '@features/kruskal/domain/entities/Edge';
import { InvalidGraphError } from '@shared/graph-simulators/errors/InvalidGraphError';

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
      const config: KruskalConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B'),
          createNode(2, 'C')
        ],
        edges: [
          { from: 0, to: 1, weight: 1 },
          { from: 1, to: 2, weight: 2 }
        ]
      };

      const steps = useCase.execute(config);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[steps.length - 1].type).toBe('final');
    });

    it('should throw InvalidGraphError for empty nodes', () => {
      const useCase = new GenerateStepsUseCase();
      const config: KruskalConfig = {
        nodes: [],
        edges: [{ from: 0, to: 1, weight: 1 }]
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('pelo menos um vértice');
    });

    it('should throw InvalidGraphError for empty edges', () => {
      const useCase = new GenerateStepsUseCase();
      const config: KruskalConfig = {
        nodes: [createNode(0, 'A'), createNode(1, 'B')],
        edges: []
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('pelo menos uma aresta');
    });

    it('should throw InvalidGraphError for invalid edge references', () => {
      const useCase = new GenerateStepsUseCase();
      const config: KruskalConfig = {
        nodes: [createNode(0, 'A')],
        edges: [{ from: 0, to: 99, weight: 1 }]
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('vértice inexistente');
    });

    it('should throw InvalidGraphError for self-loop edges', () => {
      const useCase = new GenerateStepsUseCase();
      const config: KruskalConfig = {
        nodes: [createNode(0, 'A')],
        edges: [{ from: 0, to: 0, weight: 1 }]
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('si mesmo');
    });

    it('should throw InvalidGraphError for negative or zero weights', () => {
      const useCase = new GenerateStepsUseCase();
      const config: KruskalConfig = {
        nodes: [createNode(0, 'A'), createNode(1, 'B')],
        edges: [{ from: 0, to: 1, weight: 0 }]
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('positivos');
    });

    it('should throw InvalidGraphError for duplicate node IDs', () => {
      const useCase = new GenerateStepsUseCase();
      const config: KruskalConfig = {
        nodes: [createNode(0, 'A'), createNode(0, 'B')],
        edges: [{ from: 0, to: 1, weight: 1 }]
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('duplicado');
    });

    it('should generate correct MST for simple graph', () => {
      const useCase = new GenerateStepsUseCase();
      const config: KruskalConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B'),
          createNode(2, 'C')
        ],
        edges: [
          { from: 0, to: 1, weight: 4 },
          { from: 1, to: 2, weight: 3 },
          { from: 0, to: 2, weight: 5 }
        ]
      };

      const steps = useCase.execute(config);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.type).toBe('final');
      expect(finalStep.mstEdges).toHaveLength(2); // MST for 3 nodes has 2 edges
      expect(finalStep.totalCost).toBe(7); // 3 + 4
    });
  });
});

