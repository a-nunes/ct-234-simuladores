import { topologicalSort } from '@features/topological-sort/data/algorithms/TopologicalSortAlgorithm';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';

describe('TopologicalSortAlgorithm', () => {
  const createNode = (id: number, label: string): Node => ({
    id,
    label,
    state: 'unvisited',
    x: 100,
    y: 200
  });

  describe('topologicalSort', () => {
    it('should return algorithm states for simple DAG', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, false);

      expect(states.length).toBeGreaterThan(0);
      expect(states[0].indegree).toBeDefined();
      expect(states[0].queue).toBeDefined();
      expect(states[0].topologicalOrder).toBeDefined();
    });

    it('should calculate indegree correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, false);
      const initialState = states[0];

      expect(initialState.indegree[0]).toBe(0);
      expect(initialState.indegree[1]).toBe(1);
      expect(initialState.indegree[2]).toBe(1);
    });

    it('should enqueue nodes with indegree 0', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 2 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, false);
      const initialState = states[0];

      expect(initialState.queue).toContain(0);
      expect(initialState.queue).toContain(1);
      expect(initialState.queue.length).toBe(2);
    });

    it('should process nodes in FIFO order with queue', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 2 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, false);
      const finalState = states[states.length - 1];

      // With queue (FIFO), should process 0 before 1
      expect(finalState.topologicalOrder[0]).toBe(0);
      expect(finalState.topologicalOrder[1]).toBe(1);
    });

    it('should process nodes in LIFO order with stack', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 2 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, true);
      const finalState = states[states.length - 1];

      // With stack (LIFO), should process 1 before 0
      expect(finalState.topologicalOrder[0]).toBe(1);
      expect(finalState.topologicalOrder[1]).toBe(0);
    });

    it('should track processed nodes correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, false);

      // Find state after processing first node
      let stateAfterFirst = null;
      for (const state of states) {
        if (state.processedNodes.size === 1) {
          stateAfterFirst = state;
          break;
        }
      }

      expect(stateAfterFirst).not.toBeNull();
      expect(stateAfterFirst!.processedNodes.has(0)).toBe(true);
    });

    it('should decrement indegree correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, false);
      
      // After processing node 0, indegree of node 1 should be 0
      let foundDecrement = false;
      for (let i = 0; i < states.length; i++) {
        if (states[i].processedNodes.has(0) && states[i].indegree[1] === 0) {
          foundDecrement = true;
          break;
        }
      }

      expect(foundDecrement).toBe(true);
    });

    it('should produce complete topological order', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, false);
      const finalState = states[states.length - 1];

      expect(finalState.topologicalOrder).toHaveLength(3);
      expect(finalState.topologicalOrder).toContain(0);
      expect(finalState.topologicalOrder).toContain(1);
      expect(finalState.topologicalOrder).toContain(2);
    });

    it('should handle graph with no edges', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B')
      ];
      const edges: Edge[] = [];

      const states = topologicalSort(nodes, edges, false);
      const finalState = states[states.length - 1];

      // All nodes have indegree 0, so all should be in topological order
      expect(finalState.topologicalOrder).toHaveLength(2);
    });

    it('should handle complex DAG', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C'),
        createNode(3, 'D')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 3 }
      ];

      const states = topologicalSort(nodes, edges, false);
      const finalState = states[states.length - 1];

      expect(finalState.topologicalOrder).toHaveLength(4);
      // Node 0 should come before 1, 2, and 3
      const index0 = finalState.topologicalOrder.indexOf(0);
      const index1 = finalState.topologicalOrder.indexOf(1);
      const index2 = finalState.topologicalOrder.indexOf(2);
      const index3 = finalState.topologicalOrder.indexOf(3);
      
      expect(index0).toBeLessThan(index1);
      expect(index0).toBeLessThan(index2);
      expect(index1).toBeLessThan(index3);
      expect(index2).toBeLessThan(index3);
    });

    it('should detect cyclic graph (incomplete topological order)', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 0 } // Creates cycle
      ];

      const states = topologicalSort(nodes, edges, false);
      const finalState = states[states.length - 1];

      // With a cycle, not all nodes will be in topological order
      expect(finalState.topologicalOrder.length).toBeLessThan(3);
      expect(finalState.counter).toBeLessThan(3);
    });

    it('should increment counter correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, false);
      const finalState = states[states.length - 1];

      expect(finalState.counter).toBe(3);
    });

    it('should maintain queue/stack correctly', () => {
      const nodes: Node[] = [
        createNode(0, 'A'),
        createNode(1, 'B'),
        createNode(2, 'C')
      ];
      const edges: Edge[] = [
        { from: 0, to: 1 },
        { from: 1, to: 2 }
      ];

      const states = topologicalSort(nodes, edges, false);

      // Check that queue is properly managed
      states.forEach(state => {
        expect(Array.isArray(state.queue)).toBe(true);
      });
    });
  });
});

