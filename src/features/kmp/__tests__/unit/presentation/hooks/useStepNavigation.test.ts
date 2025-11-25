import { renderHook, act } from '@testing-library/react';
import { useStepNavigation } from '@features/kmp/presentation/hooks/useStepNavigation';
import { KMPStep, KMPPreprocessStep, KMPSearchStep } from '@features/kmp/domain/entities/KMPStep';

describe('useStepNavigation', () => {
  const mockPreprocessStep: KMPPreprocessStep = {
    phase: 'preprocess',
    type: 'init',
    i: 1,
    j: 0,
    comparing: false,
    match: null,
    failureTable: [0],
    message: 'Preprocess init'
  };

  const mockSearchStep1: KMPSearchStep = {
    phase: 'search',
    type: 'init',
    i: 0,
    j: 0,
    position: 0,
    comparing: false,
    match: null,
    comparisonCount: 0,
    message: 'Search init',
    found: false,
    usedFailure: false,
    comparisons: []
  };

  const mockSearchStep2: KMPSearchStep = {
    phase: 'search',
    type: 'found',
    i: 5,
    j: 5,
    position: 0,
    comparing: true,
    match: true,
    comparisonCount: 6,
    message: 'Pattern found',
    found: true,
    usedFailure: false,
    comparisons: []
  };

  const mockSteps: KMPStep[] = [mockPreprocessStep, mockSearchStep1, mockSearchStep2];

  it('should initialize with initialIndex', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.currentStep).toEqual(mockPreprocessStep);
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
    expect(result.current.currentStep).toEqual(mockSearchStep1);
  });

  it('should navigate to previous step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 1 })
    );

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
    expect(result.current.isAtEnd).toBe(true);

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
    expect(result.current.isAtStart).toBe(true);

    act(() => {
      result.current.previous();
    });

    expect(result.current.currentStepIndex).toBe(0);
  });

  it('should reset to initial index', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.currentStepIndex).toBe(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.currentStepIndex).toBe(0);
  });

  it('should go to specific step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.currentStepIndex).toBe(2);
    expect(result.current.currentStep).toEqual(mockSearchStep2);
  });

  it('should go to start', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 2 })
    );

    act(() => {
      result.current.goToStart();
    });

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.isAtStart).toBe(true);
  });

  it('should go to end', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    act(() => {
      result.current.goToEnd();
    });

    expect(result.current.currentStepIndex).toBe(mockSteps.length - 1);
    expect(result.current.isAtEnd).toBe(true);
  });

  it('should return null for currentStep when index is out of bounds', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: -1 })
    );

    expect(result.current.currentStep).toBeNull();
  });

  it('should handle empty steps array', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: [], initialIndex: 0 })
    );

    expect(result.current.currentStep).toBeNull();
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrevious).toBe(false);
  });
});
