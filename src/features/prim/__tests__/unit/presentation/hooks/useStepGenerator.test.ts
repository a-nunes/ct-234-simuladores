import { renderHook, act } from '@testing-library/react';
import { useStepGenerator } from '@features/prim/presentation/hooks/useStepGenerator';
import { Node } from '@features/prim/domain/entities/Node';
import { Edge } from '@features/prim/domain/entities/Edge';

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
      useStepGenerator({ nodes, edges, rootNode: 0 })
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
      useStepGenerator({ nodes, edges, rootNode: 0 })
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
      useStepGenerator({ nodes, edges, rootNode: 0 })
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
      useStepGenerator({ nodes, edges, rootNode: 0 })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('aresta');
  });

  it('should set error for invalid root node', () => {
    const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const edges: Edge[] = [{ from: 0, to: 1, weight: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, rootNode: 99 })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('não existe');
  });

  it('should set error for invalid edge references', () => {
    const nodes: Node[] = [createNode(0, 'A')];
    const edges: Edge[] = [{ from: 0, to: 99, weight: 1 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, rootNode: 0 })
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
      useStepGenerator({ nodes, edges, rootNode: 0 })
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
      useStepGenerator({ nodes, edges, rootNode: 0 })
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
      useStepGenerator({ nodes, edges, rootNode: 0 })
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

  it('should regenerate steps with different root node', () => {
    const nodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B'),
      createNode(2, 'C')
    ];
    const edges: Edge[] = [
      { from: 0, to: 1, weight: 1 },
      { from: 1, to: 2, weight: 2 }
    ];

    const { result, rerender } = renderHook(
      ({ nodes, edges, rootNode }) => useStepGenerator({ nodes, edges, rootNode }),
      { initialProps: { nodes, edges, rootNode: 0 } }
    );

    act(() => {
      result.current.generateSteps();
    });

    const stepsRoot0 = result.current.steps.length;

    rerender({ nodes, edges, rootNode: 1 });

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(0);
    // Different root may produce different number of steps
  });

  it('should allow manual setting of steps', () => {
    const nodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const edges: Edge[] = [{ from: 0, to: 1, weight: 5 }];

    const { result } = renderHook(() =>
      useStepGenerator({ nodes, edges, rootNode: 0 })
    );

    const mockSteps = [
      {
        type: 'init' as const,
        nodes: nodes,
        edges: edges,
        message: 'Test',
        highlightedEdge: null,
        action: 'init' as const,
        inTree: new Set([0]),
        outTree: new Set([1]),
        candidateEdges: [],
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
      ({ nodes, edges, rootNode }) => useStepGenerator({ nodes, edges, rootNode }),
      { initialProps: { nodes: invalidNodes, edges: invalidEdges, rootNode: 0 } }
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).toBeDefined();

    const validNodes: Node[] = [createNode(0, 'A'), createNode(1, 'B')];
    const validEdges: Edge[] = [{ from: 0, to: 1, weight: 5 }];

    rerender({ nodes: validNodes, edges: validEdges, rootNode: 0 });

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
      useStepGenerator({ nodes, edges, rootNode: 0 })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps[0].type).toBe('init');
    expect(result.current.steps[0].nodes).toBeDefined();
    expect(result.current.steps[0].edges).toBeDefined();
    expect(result.current.steps[0].message).toBeDefined();
    expect(result.current.steps[0].inTree).toBeDefined();
    expect(result.current.steps[0].outTree).toBeDefined();
    expect(result.current.steps[0].mstEdges).toBeDefined();
  });
});

