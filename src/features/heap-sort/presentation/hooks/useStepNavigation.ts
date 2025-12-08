import { useState, useCallback, useMemo } from 'react';
import { HeapSortStep } from '@features/heap-sort/domain/entities/HeapSortStep';

export interface UseStepNavigationProps {
  steps: HeapSortStep[];
  initialIndex?: number;
}

export interface UseStepNavigationReturn {
  currentStepIndex: number;
  currentStep: HeapSortStep | null;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;
  reset: () => void;
}

/**
 * Hook for managing step-by-step navigation through Heap Sort steps.
 */
export function useStepNavigation({
  steps,
  initialIndex = -1
}: UseStepNavigationProps): UseStepNavigationReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialIndex);

  const currentStep = useMemo(() => {
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
      return steps[currentStepIndex];
    }
    return null;
  }, [currentStepIndex, steps]);

  const totalSteps = steps.length;
  const canGoNext = currentStepIndex < totalSteps - 1;
  const canGoPrevious = currentStepIndex > 0;

  const next = useCallback(() => {
    if (canGoNext) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [canGoNext]);

  const previous = useCallback(() => {
    if (canGoPrevious) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [canGoPrevious]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
    }
  }, [totalSteps]);

  const reset = useCallback(() => {
    setCurrentStepIndex(-1);
  }, []);

  return {
    currentStepIndex,
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    next,
    previous,
    goToStep,
    reset
  };
}
