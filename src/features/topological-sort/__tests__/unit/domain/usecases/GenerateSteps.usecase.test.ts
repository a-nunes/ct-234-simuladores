import { GenerateStepsUseCase } from '@features/topological-sort/domain/usecases/GenerateSteps.usecase';
import { TopologicalSortConfig } from '@features/topological-sort/domain/entities/TopologicalSortConfig';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';
import { InvalidGraphError } from '@shared/graph-simulators/errors/InvalidGraphError';

describe('GenerateStepsUseCase', () => {
  const createNode = (id: number, label: string, x: number = 100, y: number = 200): Node => ({
    id,
    label,
    state: 'unvisited',
    x,
    y
  });

  describe('execute', () => {
    it('should generate steps for a valid DAG', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B'),
          createNode(2, 'C')
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 }
        ],
        dataStructure: 'queue'
      };

      const steps = useCase.execute(config);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
    });

    it('should throw InvalidGraphError for empty nodes', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [],
        edges: [{ from: 0, to: 1 }],
        dataStructure: 'queue'
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('pelo menos um nó');
    });

    it('should throw InvalidGraphError for invalid edge references', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [createNode(0, 'A')],
        edges: [{ from: 0, to: 99 }],
        dataStructure: 'queue'
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('nó destino inválido');
    });

    it('should throw InvalidGraphError for self-loop edges', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [createNode(0, 'A')],
        edges: [{ from: 0, to: 0 }],
        dataStructure: 'queue'
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('si mesmo');
    });

    it('should throw InvalidGraphError for duplicate node IDs', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [createNode(0, 'A'), createNode(0, 'B')],
        edges: [{ from: 0, to: 1 }],
        dataStructure: 'queue'
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('duplicado');
    });

    it('should work with queue data structure', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B'),
          createNode(2, 'C')
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 }
        ],
        dataStructure: 'queue'
      };

      const steps = useCase.execute(config);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].dataStructure).toBe('queue');
    });

    it('should work with stack data structure', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B'),
          createNode(2, 'C')
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 }
        ],
        dataStructure: 'stack'
      };

      const steps = useCase.execute(config);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].dataStructure).toBe('stack');
    });

    it('should generate topological order for simple DAG', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B'),
          createNode(2, 'C')
        ],
        edges: [
          { from: 0, to: 1 },
          { from: 1, to: 2 }
        ],
        dataStructure: 'queue'
      };

      const steps = useCase.execute(config);
      const completedSteps = steps.filter(s => s.type === 'final');

      expect(completedSteps.length).toBeGreaterThan(0);
      const finalStep = completedSteps[completedSteps.length - 1];
      expect(finalStep.topologicalOrder).toHaveLength(3);
    });

    it('should handle graph with no edges', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B')
        ],
        edges: [],
        dataStructure: 'queue'
      };

      // Graph with no edges is still valid for topological sort
      // but validator requires at least one node
      const steps = useCase.execute(config);
      expect(steps.length).toBeGreaterThan(0);
    });

    it('should handle DAG with multiple sources', () => {
      const useCase = new GenerateStepsUseCase();
      const config: TopologicalSortConfig = {
        nodes: [
          createNode(0, 'A'),
          createNode(1, 'B'),
          createNode(2, 'C')
        ],
        edges: [
          { from: 0, to: 2 },
          { from: 1, to: 2 }
        ],
        dataStructure: 'queue'
      };

      const steps = useCase.execute(config);
      expect(steps.length).toBeGreaterThan(0);
    });
  });
});

