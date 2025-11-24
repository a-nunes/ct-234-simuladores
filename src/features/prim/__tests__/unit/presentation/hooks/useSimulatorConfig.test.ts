import { renderHook, act } from '@testing-library/react';
import { useSimulatorConfig } from '@features/prim/presentation/hooks/useSimulatorConfig';
import { Node } from '@features/prim/domain/entities/Node';
import { Edge } from '@features/prim/domain/entities/Edge';
import { useGraph } from '../../../../../../contexts/GraphContext';

// Mock the GraphContext
jest.mock('../../../../../../contexts/GraphContext', () => ({
  useGraph: jest.fn()
}));
jest.mock('../../../../../../utils/graphConverter', () => ({
  convertGraphToSimulator: jest.fn()
}));

const mockUseGraph = useGraph as jest.MockedFunction<typeof useGraph>;
const { convertGraphToSimulator } = require('../../../../../../utils/graphConverter');

describe('useSimulatorConfig', () => {
  beforeEach(() => {
    mockUseGraph.mockReturnValue({
      savedGraph: null,
      setSavedGraph: jest.fn(),
      clearSavedGraph: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createNode = (id: number, label: string): Node => ({
    id,
    label,
    x: 100,
    y: 200
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    expect(result.current.nodes.length).toBeGreaterThan(0);
    expect(result.current.edges.length).toBeGreaterThan(0);
    expect(result.current.rootNode).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should initialize with custom nodes, edges, and root node', () => {
    const customNodes: Node[] = [
      createNode(0, 'A'),
      createNode(1, 'B')
    ];
    const customEdges: Edge[] = [
      { from: 0, to: 1, weight: 5 }
    ];

    const { result } = renderHook(() =>
      useSimulatorConfig({
        initialNodes: customNodes,
        initialEdges: customEdges,
        initialRootNode: 1
      })
    );

    expect(result.current.nodes).toEqual(customNodes);
    expect(result.current.edges).toEqual(customEdges);
    expect(result.current.rootNode).toBe(1);
  });

  it('should update nodes when setNodes is called', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    const newNodes: Node[] = [
      createNode(0, 'X'),
      createNode(1, 'Y')
    ];

    act(() => {
      result.current.setNodes(newNodes);
    });

    expect(result.current.nodes).toEqual(newNodes);
  });

  it('should update edges when setEdges is called', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    const newEdges: Edge[] = [
      { from: 0, to: 1, weight: 10 }
    ];

    act(() => {
      result.current.setEdges(newEdges);
    });

    expect(result.current.edges).toEqual(newEdges);
  });

  it('should update root node when setRootNode is called', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setRootNode(2);
    });

    expect(result.current.rootNode).toBe(2);
  });

  it('should generate random graph', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.generateRandomGraph(5);
    });

    expect(result.current.nodes.length).toBe(5);
    expect(result.current.edges.length).toBeGreaterThan(0);
    expect(result.current.rootNode).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should generate connected graph', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.generateRandomGraph(5);
    });

    // A connected graph with n nodes should have at least n-1 edges
    expect(result.current.edges.length).toBeGreaterThanOrEqual(4);
  });

  it('should generate graph with valid weights', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.generateRandomGraph(5);
    });

    result.current.edges.forEach(edge => {
      expect(edge.weight).toBeGreaterThan(0);
      expect(edge.weight).toBeLessThanOrEqual(9);
    });
  });

  it('should generate graph with unique node labels', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.generateRandomGraph(5);
    });

    const labels = result.current.nodes.map(n => n.label);
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(labels.length);
  });

  it('should generate graph with nodes in circular layout', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.generateRandomGraph(4);
    });

    // All nodes should have valid x, y coordinates
    result.current.nodes.forEach(node => {
      expect(node.x).toBeGreaterThan(0);
      expect(node.y).toBeGreaterThan(0);
    });
  });

  it('should reset root node to 0 when generating random graph', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setRootNode(3);
    });

    expect(result.current.rootNode).toBe(3);

    act(() => {
      result.current.generateRandomGraph(5);
    });

    expect(result.current.rootNode).toBe(0);
  });

  it('should load custom graph when savedGraph exists', () => {
    const mockSavedGraph = {
      nodes: [
        { id: 0, label: 'X', x: 100, y: 200 },
        { id: 1, label: 'Y', x: 200, y: 200 }
      ],
      edges: [
        { from: 0, to: 1, weight: 5 }
      ],
      type: 'undirected' as const,
      weighted: 'weighted' as const
    };

    mockUseGraph.mockReturnValue({
      savedGraph: mockSavedGraph,
      setSavedGraph: jest.fn(),
      clearSavedGraph: jest.fn()
    });

    convertGraphToSimulator.mockReturnValue({
      nodes: [
        { id: 0, label: 'X', x: 100, y: 200 },
        { id: 1, label: 'Y', x: 200, y: 200 }
      ],
      edges: [
        { from: 0, to: 1, weight: 5 }
      ]
    });

    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.loadCustomGraph();
    });

    expect(result.current.nodes).toHaveLength(2);
    expect(result.current.edges).toHaveLength(1);
  });

  it('should set error when loading custom graph but no savedGraph exists', () => {
    mockUseGraph.mockReturnValue({
      savedGraph: null,
      setSavedGraph: jest.fn(),
      clearSavedGraph: jest.fn()
    });

    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.loadCustomGraph();
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('Nenhum grafo salvo');
  });

  it('should clear error when generating valid graph after error', () => {
    mockUseGraph.mockReturnValue({
      savedGraph: null,
      setSavedGraph: jest.fn(),
      clearSavedGraph: jest.fn()
    });

    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.loadCustomGraph(); // This should set error
    });

    expect(result.current.error).toBeDefined();

    act(() => {
      result.current.generateRandomGraph(5); // This should clear error
    });

    expect(result.current.error).toBeNull();
  });
});

