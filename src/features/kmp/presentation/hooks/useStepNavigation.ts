import { useState, useMemo } from 'react';
import { KMPStep } from '@features/kmp/domain/entities/KMPStep';

export interface UseStepNavigationProps {
  steps: KMPStep[];
  initialIndex?: number;
}

export interface UseStepNavigationReturn {
  currentStepIndex: number;
  currentStep: KMPStep | null;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;
  goToStart: () => void;
  goToEnd: () => void;
  reset: () => void;
}

/**
 * Hook for managing navigation between steps.
 * Handles step index, navigation controls, and current step retrieval.
 */
export function useStepNavigation({
  steps,
  initialIndex = 0
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

  const isAtStart = useMemo(() => {
    return currentStepIndex === 0;
  }, [currentStepIndex]);

  const isAtEnd = useMemo(() => {
    return currentStepIndex === steps.length - 1;
  }, [currentStepIndex, steps.length]);

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
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  };

  const goToStart = () => {
    setCurrentStepIndex(0);
  };

  const goToEnd = () => {
    if (steps.length > 0) {
      setCurrentStepIndex(steps.length - 1);
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
    isAtStart,
    isAtEnd,
    next,
    previous,
    goToStep,
    goToStart,
    goToEnd,
    reset
  };
}
