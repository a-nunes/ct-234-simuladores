import { renderHook, act } from '@testing-library/react';
import { useStepGenerator } from '@features/topological-sort/presentation/hooks/useStepGenerator';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';

describe('useStepGenerator', () => {
  const createNode = (id: number, label: string): Node => ({
    id,
    label,
    state: 'unvisited',
    x: 100,
    y: 200
  });

  it('should initialize with empty steps', () => {
    const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const edges: Edge[] = [{ from: 0, to: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerating).toBe(false);
  });

  it('should generate steps for valid DAG', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const edges: Edge[] = [
      { from: 0, to: 1 },
      { from: 1, to: 2 }
    ];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerating).toBe(false);
  });

  it('should set error for invalid graph (empty nodes)', () => {
    const nodes: Node[] = [];
    const edges: Edge[] = [{ from: 0, to: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('pelo menos um nó');
  });

  it('should set error for invalid edge references', () => {
    const nodes: Node[] = [createNode(0, 'A')];
    const edges: Edge[] = [{ from: 0, to: 99 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
  });

  it('should set error for self-loop', () => {
    const nodes: Node[] = [createNode(0, 'A')];
    const edges: Edge[] = [{ from: 0, to: 0 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('si mesmo');
  });

  it('should generate steps with queue data structure', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B')
    ];
    const edges: Edge[] = [{ from: 0, to: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.steps[0].dataStructure).toBe('queue');
  });

  it('should generate steps with stack data structure', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B')
    ];
    const edges: Edge[] = [{ from: 0, to: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'stack' })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.steps[0].dataStructure).toBe('stack');
  });

  it('should clear steps', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const edges: Edge[] = [
      { from: 0, to: 1 },
      { from: 1, to: 2 }
    ];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(0);

    act(() => {
      result.current.clearSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should regenerate steps with different data structure', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const edges: Edge[] = [
      { from: 0, to: 1 },
      { from: 1, to: 2 }
    ];

    const { result, rerender } = renderHook(
      ({ nodes, edges, dataStructure }) => useStepGenerator({ nodes, edges, dataStructure }),
      { initialProps: { nodes, edges, dataStructure: 'queue' as const } }
    );

    act(() => {
      result.current.generateSteps();
    });

    const queueSteps = result.current.steps.length;
    expect(result.current.steps[0].dataStructure).toBe('queue');

    rerender({ nodes, edges, dataStructure: 'stack' as const });

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.steps[0].dataStructure).toBe('stack');
  });

  it('should allow manual setting of steps', () => {
    const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const edges: Edge[] = [{ from: 0, to: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    const mockSteps = [
      {
        type: 'init' as const,
        nodes: nodes,
        edges: edges,
        message: 'Test',
        highlightedNode: null,
        highlightedEdge: null,
        queue: [0],
        indegree: { 0: 0, 1: 1 },
        topologicalOrder: [],
        counter: 0,
        dataStructure: 'queue' as const
      }
    ];

    act(() => {
      result.current.setSteps(mockSteps);
    });

    expect(result.current.steps).toEqual(mockSteps);
  });

  it('should clear error when generating valid steps after error', () => {
    const invalidNodes: Node[] = [];
    const invalidEdges: Edge[] = [];

    const { result, rerender } = renderHook(
      ({ nodes, edges, dataStructure }) => useStepGenerator({ nodes, edges, dataStructure }),
      { initialProps: { nodes: invalidNodes, edges: invalidEdges, dataStructure: 'queue' as const } }
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).toBeDefined();

    const validNodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const validEdges: Edge[] = [{ from: 0, to: 1 }];

    rerender({ nodes: validNodes, edges: validEdges, dataStructure: 'queue' as const });

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.steps.length).toBeGreaterThan(0);
  });

  it('should generate steps with correct structure', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const edges: Edge[] = [
      { from: 0, to: 1 },
      { from: 1, to: 2 }
    ];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps[0].type).toBe('init');
    expect(result.current.steps[0].nodes).toBeDefined();
    expect(result.current.steps[0].edges).toBeDefined();
    expect(result.current.steps[0].message).toBeDefined();
    expect(result.current.steps[0].indegree).toBeDefined();
    expect(result.current.steps[0].queue).toBeDefined();
    expect(result.current.steps[0].topologicalOrder).toBeDefined();
  });

  it('should handle cyclic graphs', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const edges: Edge[] = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 0 } // Cycle
    ];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, dataStructure: 'queue' })
    );

    act(() => {
      result.current.generateSteps();
    });

    // Should still generate steps (cycle detection happens during generation)
    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });
});

