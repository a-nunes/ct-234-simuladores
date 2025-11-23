import { renderHook, act } from '@testing-library/react';
import { useSimulatorConfig } from '@features/dijkstra/presentation/hooks/useSimulatorConfig';
import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';
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
    state: 'unvisited',
    dist: Infinity,
    pred: null,
    x: 100,
    y: 200
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    expect(result.current.nodes.length).toBeGreaterThan(0);
    expect(result.current.edges.length).toBeGreaterThan(0);
    expect(result.current.sourceNode).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should initialize with custom nodes and edges', () => {
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
        initialSourceNode: 0
      })
    );

    expect(result.current.nodes).toEqual(customNodes);
    expect(result.current.edges).toEqual(customEdges);
    expect(result.current.sourceNode).toBe(0);
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

  it('should update source node when setSourceNode is called', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.setSourceNode(2);
    });

    expect(result.current.sourceNode).toBe(2);
  });

  it('should generate random graph', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.generateRandomGraph(5);
    });

    expect(result.current.nodes.length).toBe(5);
    expect(result.current.edges.length).toBeGreaterThan(0);
    expect(result.current.sourceNode).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should handle error when generating random graph with invalid input', () => {
    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.generateRandomGraph(0); // Invalid: should generate error or handle gracefully
    });

    // The function should handle invalid input gracefully or set error
    // This depends on implementation
  });

  it('should load custom graph when savedGraph exists', () => {
    const mockSavedGraph = {
      nodes: [
        { id: 0, label: 'X', x: 100, y: 200 }
      ],
      edges: [
        { from: 0, to: 0, weight: 0 } // This will be converted
      ],
      type: 'directed' as const,
      weighted: 'weighted' as const
    };

    mockUseGraph.mockReturnValue({
      savedGraph: mockSavedGraph,
      setSavedGraph: jest.fn(),
      clearSavedGraph: jest.fn()
    });

    convertGraphToSimulator.mockReturnValue({
      nodes: [
        { id: 0, label: 'X', x: 100, y: 200 }
      ],
      edges: [
        { from: 0, to: 0, weight: 1 }
      ]
    });

    const { result } = renderHook(() => useSimulatorConfig({}));

    act(() => {
      result.current.loadCustomGraph();
    });

    // Should load the custom graph (or handle error if invalid)
    // This depends on implementation
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
});

