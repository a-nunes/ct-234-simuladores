import { renderHook, act } from '@testing-library/react';
import { useStepNavigation } from '@features/binary-search/presentation/hooks/useStepNavigation';
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';

describe('useStepNavigation', () => {
  const mockSteps: BinarySearchStep[] = [
    {
      type: 'init',
      l: 0,
      r: 10,
      message: 'Initial step',
      callStack: []
    },
    {
      type: 'focus',
      l: 0,
      r: 10,
      message: 'Focus step',
      callStack: ['BinarySearch(0, 10)']
    },
    {
      type: 'found',
      l: 5,
      r: 5,
      q: 5,
      value: 23,
      message: 'Found',
      callStack: ['BinarySearch(0, 10)']
    }
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
});

