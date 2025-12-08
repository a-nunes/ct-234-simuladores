import { useState, useCallback } from 'react';
import { ElementarySortStep, SortAlgorithm } from '@features/elementary-sort/domain/entities/ElementarySortStep';
import { GenerateStepsUseCase } from '@features/elementary-sort/domain/usecases/GenerateSteps.usecase';

export interface UseStepGeneratorProps {
  array: number[];
  algorithm: SortAlgorithm;
}

export interface UseStepGeneratorReturn {
  steps: ElementarySortStep[];
  error: Error | null;
  generateSteps: () => void;
  clearSteps: () => void;
}

const generateStepsUseCase = new GenerateStepsUseCase();

/**
 * Hook for generating sorting visualization steps.
 */
export function useStepGenerator({
  array,
  algorithm
}: UseStepGeneratorProps): UseStepGeneratorReturn {
  const [steps, setSteps] = useState<ElementarySortStep[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const generateSteps = useCallback(() => {
    try {
      setError(null);
      const newSteps = generateStepsUseCase.execute({ array, algorithm });
      setSteps(newSteps);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      setSteps([]);
    }
  }, [array, algorithm]);

  const clearSteps = useCallback(() => {
    setSteps([]);
    setError(null);
  }, []);

  return {
    steps,
    error,
    generateSteps,
    clearSteps
  };
}
