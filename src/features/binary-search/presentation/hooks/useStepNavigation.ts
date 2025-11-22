import { useState, useMemo } from 'react';
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';

export interface UseStepNavigationProps {
  steps: BinarySearchStep[];
  initialIndex?: number;
}

export interface UseStepNavigationReturn {
  currentStepIndex: number;
  currentStep: BinarySearchStep | null;
  canGoNext: boolean;
  canGoPrevious: boolean;
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;
  reset: () => void;
}

/**
 * Hook for managing navigation between steps.
 * Handles step index, navigation controls, and current step retrieval.
 */
export function useStepNavigation({
  steps,
  initialIndex = -1
}: UseStepNavigationProps): UseStepNavigationReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(initialIndex);

  const currentStep = useMemo(() => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) {
      return null;
    }
    return steps[currentStepIndex];
  }, [steps, currentStepIndex]);

  const canGoNext = useMemo(() => {
    return currentStepIndex < steps.length - 1;
  }, [currentStepIndex, steps.length]);

  const canGoPrevious = useMemo(() => {
    return currentStepIndex > 0;
  }, [currentStepIndex]);

  const next = () => {
    if (canGoNext) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const previous = () => {
    if (canGoPrevious) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= -1 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const reset = () => {
    setCurrentStepIndex(initialIndex);
  };

  return {
    currentStepIndex,
    currentStep,
    canGoNext,
    canGoPrevious,
    next,
    previous,
    goToStep,
    reset
  };
}

