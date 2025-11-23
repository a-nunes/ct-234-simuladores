import { renderHook, act } from '@testing-library/react';
import { useStepNavigation } from '@features/dijkstra/presentation/hooks/useStepNavigation';
import { DijkstraStep } from '@features/dijkstra/domain/entities/DijkstraStep';

describe('useStepNavigation', () => {
  const createMockStep = (type: string, index: number): DijkstraStep => ({
    type: type as any,
    nodes: [],
    edges: [],
    priorityQueue: [],
    message: `Step ${index}`,
    highlightedNode: null,
    highlightedEdge: null,
    action: type,
    currentNode: null,
    relaxingEdge: null
  });

  const mockSteps: DijkstraStep[] = [
    createMockStep('init', 0),
    createMockStep('extract-min', 1),
    createMockStep('relax', 2),
    createMockStep('final', 3)
  ];

  it('should initialize with initialIndex', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: -1 })
    );

    expect(result.current.currentStepIndex).toBe(-1);
    expect(result.current.currentStep).toBeNull();
  });

  it('should navigate to next step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.canGoNext).toBe(true);

    act(() => {
      result.current.next();
    });

    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.canGoNext).toBe(true);
  });

  it('should navigate to previous step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 1 })
    );

    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.canGoPrevious).toBe(true);

    act(() => {
      result.current.previous();
    });

    expect(result.current.currentStepIndex).toBe(0);
  });

  it('should not go beyond last step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: mockSteps.length - 1 })
    );

    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.next();
    });

    expect(result.current.currentStepIndex).toBe(mockSteps.length - 1);
  });

  it('should not go before first step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    expect(result.current.canGoPrevious).toBe(false);

    act(() => {
      result.current.previous();
    });

    expect(result.current.currentStepIndex).toBe(0);
  });

  it('should reset to initial index', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: -1 })
    );

    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.currentStepIndex).toBe(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.currentStepIndex).toBe(-1);
  });

  it('should go to specific step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: -1 })
    );

    act(() => {
      result.current.goToStep(1);
    });

    expect(result.current.currentStepIndex).toBe(1);
    expect(result.current.currentStep).toEqual(mockSteps[1]);
  });

  it('should return current step correctly', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    expect(result.current.currentStep).toEqual(mockSteps[0]);
  });

  it('should handle empty steps array', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: [], initialIndex: -1 })
    );

    expect(result.current.currentStepIndex).toBe(-1);
    expect(result.current.currentStep).toBeNull();
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrevious).toBe(false);
  });

  it('should handle goToStep with invalid index', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    act(() => {
      result.current.goToStep(-2); // Invalid: less than -1
    });

    expect(result.current.currentStepIndex).toBe(0); // Should not change

    act(() => {
      result.current.goToStep(100); // Invalid: beyond array length
    });

    expect(result.current.currentStepIndex).toBe(0); // Should not change
  });
});

