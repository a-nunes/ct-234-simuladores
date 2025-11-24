import { generateSteps } from '@features/kruskal/data/stepGenerators/KruskalStepGenerator';
import { Node } from '@features/kruskal/domain/entities/Node';
import { Edge } from '@features/kruskal/domain/entities/Edge';

describe('KruskalStepGenerator', () => {
  const createNode = (id: number, label: string, x: number, y: number): Node => ({
    id,
    label,
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
        { from: 0, to: 1, weight: 5 }
      ];

      const steps = generateSteps(nodes, edges);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[0].nodes).toBeDefined();
      expect(steps[0].edges).toBeDefined();
      expect(steps[0].unionFind).toBeDefined();
      expect(steps[0].message).toContain('Iniciando Kruskal');
    });

    it('should generate sort step', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 3 },
        { from: 0, to: 2, weight: 7 }
      ];

      const steps = generateSteps(nodes, edges);
      const sortStep = steps.find(step => step.type === 'sort');

      expect(sortStep).toBeDefined();
      expect(sortStep!.sortedEdges).toBeDefined();
      expect(sortStep!.sortedEdges).toHaveLength(3);
      expect(sortStep!.message).toContain('Ordenando');
      
      // Verify edges are sorted by weight
      const weights = sortStep!.sortedEdges.map(e => e.weight);
      expect(weights).toEqual([3, 5, 7]);
    });

    it('should generate evaluate steps', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 5 }
      ];

      const steps = generateSteps(nodes, edges);
      const evaluateSteps = steps.filter(step => step.type === 'evaluate');

      expect(evaluateSteps.length).toBeGreaterThan(0);
      evaluateSteps.forEach(step => {
        expect(step.highlightedEdge).toBeDefined();
        expect(step.message).toContain('Avaliando aresta');
      });
    });

    it('should generate accept steps when edges do not form cycle', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges);
      const acceptSteps = steps.filter(step => step.type === 'accept');

      expect(acceptSteps.length).toBe(2); // Both edges should be accepted
      acceptSteps.forEach(step => {
        expect(step.message).toContain('✅');
        expect(step.message).toContain('Adicionando à MST');
        expect(step.mstEdges.length).toBeGreaterThan(0);
      });
    });

    it('should generate reject steps when edge would form cycle', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 },
        { from: 0, to: 2, weight: 5 } // This would form a cycle
      ];

      const steps = generateSteps(nodes, edges);
      const rejectSteps = steps.filter(step => step.type === 'reject');

      expect(rejectSteps.length).toBeGreaterThan(0);
      rejectSteps.forEach(step => {
        expect(step.message).toContain('❌');
        expect(step.message).toContain('Rejeitando');
        expect(step.message).toContain('formaria ciclo');
      });
    });

    it('should generate final step with correct MST', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 4 },
        { from: 1, to: 2, weight: 3 },
        { from: 0, to: 2, weight: 5 }
      ];

      const steps = generateSteps(nodes, edges);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.type).toBe('final');
      expect(finalStep.mstEdges).toHaveLength(2); // MST for 3 nodes has 2 edges
      expect(finalStep.totalCost).toBe(7); // 3 + 4
      expect(finalStep.message).toContain('✅');
      expect(finalStep.message).toContain('finalizado');
    });

    it('should update union-find state correctly in each step', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges);

      steps.forEach(step => {
        expect(step.unionFind).toBeDefined();
        expect(step.unionFind.parent).toHaveLength(3);
        expect(step.unionFind.rank).toHaveLength(3);
      });
    });

    it('should mark nodes as in MST correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges);
      const finalStep = steps[steps.length - 1];

      // All nodes should be in MST in final step
      finalStep.nodes.forEach(node => {
        expect(node.isInMST).toBe(true);
      });
    });

    it('should mark edges as in MST correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 },
        { from: 0, to: 2, weight: 5 }
      ];

      const steps = generateSteps(nodes, edges);
      const finalStep = steps[steps.length - 1];

      const mstEdgeCount = finalStep.edges.filter(e => e.isInMST).length;
      expect(mstEdgeCount).toBe(2); // MST for 3 nodes has 2 edges
    });

    it('should track total cost correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200),
        createNode(3, 'D', 400, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 },
        { from: 2, to: 3, weight: 3 }
      ];

      const steps = generateSteps(nodes, edges);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.totalCost).toBe(6); // 1 + 2 + 3
    });

    it('should handle graph with multiple edges correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200),
        createNode(3, 'D', 400, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 10 },
        { from: 0, to: 2, weight: 6 },
        { from: 0, to: 3, weight: 5 },
        { from: 1, to: 3, weight: 15 },
        { from: 2, to: 3, weight: 4 }
      ];

      const steps = generateSteps(nodes, edges);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[steps.length - 1].type).toBe('final');
      
      const finalStep = steps[steps.length - 1];
      expect(finalStep.mstEdges).toHaveLength(3); // MST for 4 nodes has 3 edges
    });

    it('should process edges in sorted order', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 1, to: 2, weight: 3 },
        { from: 0, to: 2, weight: 7 }
      ];

      const steps = generateSteps(nodes, edges);
      const evaluateSteps = steps.filter(step => step.type === 'evaluate');

      // First evaluated edge should be the one with weight 3
      expect(evaluateSteps[0].currentEdgeIndex).toBe(0);
      expect(evaluateSteps[0].sortedEdges[0].weight).toBe(3);
    });

    it('should assign component IDs correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges);
      const finalStep = steps[steps.length - 1];

      // All nodes should have the same componentId in final step
      const componentIds = finalStep.nodes
        .map(n => n.componentId)
        .filter(id => id !== undefined);
      
      const uniqueComponentIds = new Set(componentIds);
      expect(uniqueComponentIds.size).toBe(1);
    });
  });
});

