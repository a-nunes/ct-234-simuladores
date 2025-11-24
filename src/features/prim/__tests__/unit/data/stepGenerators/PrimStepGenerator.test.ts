import { generateSteps } from '@features/prim/data/stepGenerators/PrimStepGenerator';
import { Node } from '@features/prim/domain/entities/Node';
import { Edge } from '@features/prim/domain/entities/Edge';

describe('PrimStepGenerator', () => {
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

      const steps = generateSteps(nodes, edges, 0);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[0].nodes).toBeDefined();
      expect(steps[0].edges).toBeDefined();
      expect(steps[0].inTree).toBeDefined();
      expect(steps[0].outTree).toBeDefined();
      expect(steps[0].message).toContain('Iniciando Prim');
    });

    it('should mark root node correctly in initial step', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges, 1);
      const initStep = steps[0];

      const rootNode = initStep.nodes.find(n => n.id === 1);
      expect(rootNode?.isRoot).toBe(true);
      expect(rootNode?.isInTree).toBe(true);
    });

    it('should generate search steps', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges, 0);
      const searchSteps = steps.filter(step => step.type === 'search');

      expect(searchSteps.length).toBeGreaterThan(0);
      searchSteps.forEach(step => {
        expect(step.candidateEdges).toBeDefined();
        expect(step.message).toContain('Buscando aresta mínima');
      });
    });

    it('should generate select-min steps', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges, 0);
      const selectMinSteps = steps.filter(step => step.type === 'select-min');

      expect(selectMinSteps.length).toBeGreaterThan(0);
      selectMinSteps.forEach(step => {
        expect(step.highlightedEdge).toBeDefined();
        expect(step.message).toContain('Aresta mínima');
      });
    });

    it('should generate add-to-tree steps', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges, 0);
      const addSteps = steps.filter(step => step.type === 'add-to-tree');

      expect(addSteps.length).toBeGreaterThan(0);
      addSteps.forEach(step => {
        expect(step.message).toContain('✅');
        expect(step.message).toContain('Adicionando à MST');
        expect(step.mstEdges.length).toBeGreaterThan(0);
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

      const steps = generateSteps(nodes, edges, 0);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.type).toBe('final');
      expect(finalStep.mstEdges).toHaveLength(2); // MST for 3 nodes has 2 edges
      expect(finalStep.totalCost).toBe(7); // 3 + 4
      expect(finalStep.message).toContain('✅');
      expect(finalStep.message).toContain('finalizado');
    });

    it('should update inTree and outTree sets correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges, 0);

      // Initial: inTree = {0}, outTree = {1, 2}
      expect(steps[0].inTree.size).toBe(1);
      expect(steps[0].outTree.size).toBe(2);

      // Final: inTree = {0, 1, 2}, outTree = {}
      const finalStep = steps[steps.length - 1];
      expect(finalStep.inTree.size).toBe(3);
      expect(finalStep.outTree.size).toBe(0);
    });

    it('should mark nodes as in tree correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges, 0);
      const finalStep = steps[steps.length - 1];

      // All nodes should be in tree in final step
      finalStep.nodes.forEach(node => {
        expect(node.isInTree).toBe(true);
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

      const steps = generateSteps(nodes, edges, 0);
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

      const steps = generateSteps(nodes, edges, 0);
      const finalStep = steps[steps.length - 1];

      expect(finalStep.totalCost).toBe(6); // 1 + 2 + 3
    });

    it('should select minimum weight edge at each step', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 5 },
        { from: 0, to: 2, weight: 3 },
        { from: 1, to: 2, weight: 7 }
      ];

      const steps = generateSteps(nodes, edges, 0);
      const selectMinSteps = steps.filter(step => step.type === 'select-min');

      // First edge selected should be the one with weight 3
      expect(selectMinSteps[0].highlightedEdge).toBeDefined();
      const firstEdge = edges.find(e =>
        (e.from === selectMinSteps[0].highlightedEdge!.from && e.to === selectMinSteps[0].highlightedEdge!.to) ||
        (e.from === selectMinSteps[0].highlightedEdge!.to && e.to === selectMinSteps[0].highlightedEdge!.from)
      );
      expect(firstEdge?.weight).toBe(3);
    });

    it('should handle disconnected graph gracefully', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200),
        createNode(3, 'D', 400, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 2, to: 3, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges, 0);
      const finalStep = steps[steps.length - 1];

      // Should only include nodes reachable from root
      const nodesInTree = finalStep.nodes.filter(n => n.isInTree);
      expect(nodesInTree.length).toBeLessThan(4);
    });

    it('should generate correct MST for complete graph', () => {
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

      const steps = generateSteps(nodes, edges, 0);

      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[steps.length - 1].type).toBe('final');

      const finalStep = steps[steps.length - 1];
      expect(finalStep.mstEdges).toHaveLength(3); // MST for 4 nodes has 3 edges
    });

    it('should handle different root nodes correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 1, to: 2, weight: 2 }
      ];

      const stepsRoot0 = generateSteps(nodes, edges, 0);
      const stepsRoot1 = generateSteps(nodes, edges, 1);

      // Both should produce MST with same cost
      const finalCost0 = stepsRoot0[stepsRoot0.length - 1].totalCost;
      const finalCost1 = stepsRoot1[stepsRoot1.length - 1].totalCost;
      expect(finalCost0).toBe(finalCost1);
    });

    it('should show candidate edges in search steps', () => {
      const nodes: Node[] = [
        createNode(0, 'A', 100, 200),
        createNode(1, 'B', 200, 200),
        createNode(2, 'C', 300, 200)
      ];
      const edges: Edge[] = [
        { from: 0, to: 1, weight: 1 },
        { from: 0, to: 2, weight: 3 },
        { from: 1, to: 2, weight: 2 }
      ];

      const steps = generateSteps(nodes, edges, 0);
      const searchSteps = steps.filter(step => step.type === 'search');

      searchSteps.forEach(step => {
        expect(step.candidateEdges.length).toBeGreaterThan(0);
      });
    });
  });
});

