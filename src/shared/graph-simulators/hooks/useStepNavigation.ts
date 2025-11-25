import { useState, useMemo } from 'react';

/**
 * Base interface that all Step types must implement
 */
export interface BaseStep {
  message: string;
}

export interface UseStepNavigationProps<T extends BaseStep> {
  steps: T[];
  initialIndex?: number;
}

export interface UseStepNavigationReturn<T extends BaseStep> {
  currentStepIndex: number;
  currentStep: T | null;
  canGoNext: boolean;
  canGoPrevious: boolean;
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;
  reset: () => void;
}

/**
 * Generic hook for managing navigation between steps.
 * Handles step index, navigation controls, and current step retrieval.
 * 
 * @template T - The step type that extends BaseStep
 */
export function useStepNavigation<T extends BaseStep>({
  steps,
  initialIndex = -1
}: UseStepNavigationProps<T>): UseStepNavigationReturn<T> {
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


