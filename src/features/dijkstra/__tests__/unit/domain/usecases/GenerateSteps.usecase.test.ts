import { GenerateStepsUseCase } from '@features/dijkstra/domain/usecases/GenerateSteps.usecase';
import { DijkstraConfig } from '@features/dijkstra/domain/entities/DijkstraConfig';
import { InvalidGraphError } from '@shared/graph-simulators/errors/InvalidGraphError';
import { InvalidSourceNodeError } from '@features/dijkstra/domain/errors/InvalidSourceNodeError';

describe('GenerateStepsUseCase', () => {
  let useCase: GenerateStepsUseCase;

  beforeEach(() => {
    useCase = new GenerateStepsUseCase();
  });

  describe('execute', () => {
    const createValidConfig = (): DijkstraConfig => ({
      nodes: [
        { id: 0, label: 'A', state: 'unvisited', dist: Infinity, pred: null, x: 100, y: 200 },
        { id: 1, label: 'B', state: 'unvisited', dist: Infinity, pred: null, x: 200, y: 100 },
        { id: 2, label: 'C', state: 'unvisited', dist: Infinity, pred: null, x: 300, y: 200 }
      ],
      edges: [
        { from: 0, to: 1, weight: 4 },
        { from: 1, to: 2, weight: 3 }
      ],
      sourceNode: 0
    });

    it('should generate steps correctly for valid graph', () => {
      const config = createValidConfig();
      const steps = useCase.execute(config);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[0].nodes).toBeDefined();
      expect(steps[0].edges).toBeDefined();
      expect(steps[0].priorityQueue).toBeDefined();
    });

    it('should throw InvalidGraphError for empty nodes', () => {
      const config: DijkstraConfig = {
        nodes: [],
        edges: [],
        sourceNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('O grafo deve ter pelo menos um nó');
    });

    it('should throw InvalidGraphError for duplicate node IDs', () => {
      const config: DijkstraConfig = {
        nodes: [
          { id: 0, label: 'A', state: 'unvisited', dist: Infinity, pred: null, x: 100, y: 200 },
          { id: 0, label: 'B', state: 'unvisited', dist: Infinity, pred: null, x: 200, y: 100 }
        ],
        edges: [],
        sourceNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('Nó com ID duplicado');
    });

    it('should throw InvalidGraphError for invalid edge source', () => {
      const config: DijkstraConfig = {
        nodes: [
          { id: 0, label: 'A', state: 'unvisited', dist: Infinity, pred: null, x: 100, y: 200 }
        ],
        edges: [
          { from: 5, to: 0, weight: 1 }
        ],
        sourceNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('Aresta com nó origem inválido');
    });

    it('should throw InvalidGraphError for invalid edge destination', () => {
      const config: DijkstraConfig = {
        nodes: [
          { id: 0, label: 'A', state: 'unvisited', dist: Infinity, pred: null, x: 100, y: 200 }
        ],
        edges: [
          { from: 0, to: 5, weight: 1 }
        ],
        sourceNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('Aresta com nó destino inválido');
    });

    it('should throw InvalidGraphError for negative edge weight', () => {
      const config: DijkstraConfig = {
        nodes: [
          { id: 0, label: 'A', state: 'unvisited', dist: Infinity, pred: null, x: 100, y: 200 },
          { id: 1, label: 'B', state: 'unvisited', dist: Infinity, pred: null, x: 200, y: 100 }
        ],
        edges: [
          { from: 0, to: 1, weight: -1 }
        ],
        sourceNode: 0
      };

      expect(() => useCase.execute(config)).toThrow(InvalidGraphError);
      expect(() => useCase.execute(config)).toThrow('Aresta com peso negativo');
    });

    it('should throw InvalidSourceNodeError for invalid source node', () => {
      const config: DijkstraConfig = {
        nodes: [
          { id: 0, label: 'A', state: 'unvisited', dist: Infinity, pred: null, x: 100, y: 200 }
        ],
        edges: [],
        sourceNode: 5
      };

      expect(() => useCase.execute(config)).toThrow(InvalidSourceNodeError);
      expect(() => useCase.execute(config)).toThrow('Nó de origem inválido');
    });

    it('should generate final step with finalDistances', () => {
      const config = createValidConfig();
      const steps = useCase.execute(config);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.type).toBe('final');
      expect(finalStep.finalDistances).toBeDefined();
    });

    it('should generate steps for simple connected graph', () => {
      const config: DijkstraConfig = {
        nodes: [
          { id: 0, label: 'A', state: 'unvisited', dist: Infinity, pred: null, x: 100, y: 200 },
          { id: 1, label: 'B', state: 'unvisited', dist: Infinity, pred: null, x: 200, y: 200 }
        ],
        edges: [
          { from: 0, to: 1, weight: 5 }
        ],
        sourceNode: 0
      };

      const steps = useCase.execute(config);
      expect(steps.length).toBeGreaterThan(0);
      
      // Should have init, extract-min, evaluate-edge, relax, finish-node, and final steps
      const stepTypes = steps.map(s => s.type);
      expect(stepTypes).toContain('init');
      expect(stepTypes).toContain('final');
    });
  });
});

