import { generateSteps } from '@features/topological-sort/data/stepGenerators/TopologicalSortStepGenerator';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';

describe('TopologicalSortStepGenerator', () => {
  const createNode = (id: number, label: string, x: number, y: number): Node => ({
    id,
    label,
    state: 'unvisited',
    x,
    y
  });

  describe('generateSteps', () => {
    it('should generate initial step', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 }
      ];

      const steps = generateSteps(nodes, edges, false);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[0].nodes).toBeDefined();
      expect(steps[0].edges).toBeDefined();
      expect(steps[0].indegree).toBeDefined();
      expect(steps[0].message).toContain('Inicializando');
    });

    it('should generate calculate-indegree step', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 }
      ];

      const steps = generateSteps(nodes, edges, false);
      const calcStep = steps.find(step => step.type === 'calculate-indegree');

      expect(calcStep).toBeDefined();
      expect(calcStep!.message).toContain('Grau de entrada calculado');
    });

    it('should generate enqueue-zero-indegree step', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 }
      ];

      const steps = generateSteps(nodes, edges, false);
      const enqueueStep = steps.find(step => step.type === 'enqueue-zero-indegree');

      expect(enqueueStep).toBeDefined();
      expect(enqueueStep!.message).toContain('Enfileirando');
    });

    it('should generate dequeue steps', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const steps = generateSteps(nodes, edges, false);
      const dequeueSteps = steps.filter(step => step.type === 'dequeue');

      expect(dequeueSteps.length).toBeGreaterThan(0);
      dequeueSteps.forEach(step => {
        expect(step.highlightedNode).toBeDefined();
        expect(step.message).toContain('Desenfileirar');
      });
    });

    it('should generate decrement-indegree steps', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const steps = generateSteps(nodes, edges, false);
      const reduceSteps = steps.filter(step => step.type === 'decrement-indegree');

      expect(reduceSteps.length).toBeGreaterThan(0);
      reduceSteps.forEach(step => {
        expect(step.highlightedEdge).toBeDefined();
        expect(step.message).toContain('Decrementando grau');
      });
    });

    it('should generate enqueue-new-zero steps', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const steps = generateSteps(nodes, edges, false);
      const enqueueNewSteps = steps.filter(step => step.type === 'enqueue-new-zero');

      expect(enqueueNewSteps.length).toBeGreaterThan(0);
      enqueueNewSteps.forEach(step => {
        expect(step.highlightedNode).toBeDefined();
        expect(step.message).toContain('Enfileirando');
      });
    });

    it('should generate final step for successful sort', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const steps = generateSteps(nodes, edges, false);
      const completeSteps = steps.filter(step => step.type === 'final');

      expect(completeSteps.length).toBeGreaterThan(0);
      const finalStep = completeSteps[completeSteps.length - 1];
      expect(finalStep.message).toContain('✅');
      expect(finalStep.message).toContain('Ordenação topológica concluída');
      expect(finalStep.topologicalOrder).toHaveLength(3);
    });

    it('should generate cycle-detected step for cyclic graph', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 0 } // Cycle
      ];

      const steps = generateSteps(nodes, edges, false);
      const cycleStep = steps.find(step => step.type === 'cycle-detected');

      expect(cycleStep).toBeDefined();
      expect(cycleStep!.message).toContain('⚠️');
      expect(cycleStep!.message).toContain('Grafo é cíclico!');
    });

    it('should mark nodes correctly with indegree', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const steps = generateSteps(nodes, edges, false);
      const calcStep = steps.find(step => step.type === 'calculate-indegree');

      expect(calcStep).toBeDefined();
      expect(calcStep!.indegree[0]).toBe(0);
      expect(calcStep!.indegree[1]).toBe(1);
      expect(calcStep!.indegree[2]).toBe(1);
    });

    it('should use queue (FIFO) when useStack is false', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200)
      ];
      const edges: Edge[] = [{ from: 0, to: 1 }];

      const steps = generateSteps(nodes, edges, false);

      expect(steps[0].dataStructure).toBe('queue');
      steps.forEach(step => {
        expect(step.dataStructure).toBe('queue');
      });
    });

    it('should use stack (LIFO) when useStack is true', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200)
      ];
      const edges: Edge[] = [{ from: 0, to: 1 }];

      const steps = generateSteps(nodes, edges, true);

      expect(steps[0].dataStructure).toBe('stack');
      steps.forEach(step => {
        expect(step.dataStructure).toBe('stack');
      });
    });

    it('should update queue correctly in each step', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const steps = generateSteps(nodes, edges, false);

      steps.forEach(step => {
        expect(Array.isArray(step.queue)).toBe(true);
      });
    });

    it('should build topological order progressively', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const steps = generateSteps(nodes, edges, false);
      
      // Topological order should grow
      let prevLength = 0;
      steps.forEach(step => {
        expect(step.topologicalOrder.length).toBeGreaterThanOrEqual(prevLength);
        prevLength = step.topologicalOrder.length;
      });
    });

    it('should mark processed nodes correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200)
      ];
      const edges: Edge[] = [{ from: 0, to: 1 }];

      const steps = generateSteps(nodes, edges, false);
      const completeSteps = steps.filter(step => step.type === 'final');
      
      if (completeSteps.length > 0) {
        const finalStep = completeSteps[completeSteps.length - 1];
        expect(finalStep.counter).toBe(2);
      }
    });

    it('should handle graph with multiple sources', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 2 },
        { from: 1, to: 2 }
      ];

      const steps = generateSteps(nodes, edges, false);
      const enqueueStep = steps.find(step => step.type === 'enqueue-zero-indegree');

      expect(enqueueStep).toBeDefined();
      expect(enqueueStep!.queue.length).toBe(2); // Both 0 and 1 have indegree 0
    });

    it('should handle graph with no edges', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200)
      ];
      const edges: Edge[] = [];

      const steps = generateSteps(nodes, edges, false);
      const completeSteps = steps.filter(step => step.type === 'final');

      expect(completeSteps.length).toBeGreaterThan(0);
      const finalStep = completeSteps[completeSteps.length - 1];
      expect(finalStep.topologicalOrder).toHaveLength(2);
    });

    it('should highlight edges during decrement-indegree', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200)
      ];
      const edges: Edge[] = [{ from: 0, to: 1 }];

      const steps = generateSteps(nodes, edges, false);
      const reduceSteps = steps.filter(step => step.type === 'decrement-indegree');

      reduceSteps.forEach(step => {
        expect(step.highlightedEdge).not.toBeNull();
        expect(step.edges.some(e => e.highlighted)).toBe(true);
      });
    });
  });
});

