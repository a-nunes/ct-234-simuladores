import { renderHook, act } from '@testing-library/react';
import { useStepGenerator } from '@features/kruskal/presentation/hooks/useStepGenerator';
import { Node } from '@features/kruskal/domain/entities/Node';
import { Edge } from '@features/kruskal/domain/entities/Edge';

describe('useStepGenerator', () => {
  const createNode = (id: number, label: string): Node => ({
    id,
    label,
    x: 100,
    y: 200
  });

  it('should initialize with empty steps', () => {
    const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const edges: Edge[] = [{ from: 0, to: 1, weight: 5 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
    );

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerating).toBe(false);
  });

  it('should generate steps for valid graph', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 2 }
    ];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
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
    const edges: Edge[] = [{ from: 0, to: 1, weight: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('vértice');
  });

  it('should set error for invalid graph (empty edges)', () => {
    const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const edges: Edge[] = [];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('aresta');
  });

  it('should set error for invalid edge references', () => {
    const nodes: Node[] = [createNode(0, 'A')];
    const edges: Edge[] = [{ from: 0, to: 99, weight: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
  });

  it('should set error for self-loop', () => {
    const nodes: Node[] = [createNode(0, 'A')];
    const edges: Edge[] = [{ from: 0, to: 0, weight: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('si mesmo');
  });

  it('should set error for negative weight', () => {
    const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const edges: Edge[] = [{ from: 0, to: 1, weight: -5 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('positivos');
  });

  it('should clear steps', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 2 }
    ];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
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

  it('should set isGenerating to true during generation', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 2 }
    ];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
    );

    act(() => {
      result.current.generateSteps();
    });

    // After generation completes, isGenerating should be false
    expect(result.current.isGenerating).toBe(false);
  });

  it('should regenerate steps with new graph', () => {
    const initialNodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B')
    ];
    const initialEdges: Edge[] = [
      { from: 0, to: 1, weight: 1 }
    ];

    const { result, rerender } = renderHook(
      ({ nodes, edges }) => useStepGenerator({ nodes, edges }),
      { initialProps: { nodes: initialNodes, edges: initialEdges } }
    );

    act(() => {
      result.current.generateSteps();
    });

    const initialStepCount = result.current.steps.length;

    const newNodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const newEdges: Edge[] = [
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 2 }
    ];

    rerender({ nodes: newNodes, edges: newEdges });

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(initialStepCount);
  });

  it('should allow manual setting of steps', () => {
    const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const edges: Edge[] = [{ from: 0, to: 1, weight: 5 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
    );

    const mockSteps = [
      {
        type: 'init' as const,
        nodes: nodes,
        edges: edges,
        message: 'Test',
        highlightedEdge: null,
        action: 'init' as const,
        sortedEdges: [],
        currentEdgeIndex: -1,
        unionFind: { parent: [0, 1], rank: [0, 0] },
        mstEdges: [],
        totalCost: 0
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
      ({ nodes, edges }) => useStepGenerator({ nodes, edges }),
      { initialProps: { nodes: invalidNodes, edges: invalidEdges } }
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).toBeDefined();

    const validNodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const validEdges: Edge[] = [{ from: 0, to: 1, weight: 5 }];

    rerender({ nodes: validNodes, edges: validEdges });

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
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 2 }
    ];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps[0].type).toBe('init');
    expect(result.current.steps[0].nodes).toBeDefined();
    expect(result.current.steps[0].edges).toBeDefined();
    expect(result.current.steps[0].message).toBeDefined();
    expect(result.current.steps[0].unionFind).toBeDefined();
    expect(result.current.steps[0].mstEdges).toBeDefined();
  });
});

