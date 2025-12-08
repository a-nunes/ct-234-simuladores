import { useState, useCallback } from 'react';
import { HeapSortStep } from '@features/heap-sort/domain/entities/HeapSortStep';
import { GenerateStepsUseCase } from '@features/heap-sort/domain/usecases/GenerateSteps.usecase';

export interface UseStepGeneratorProps {
  array: number[];
}

export interface UseStepGeneratorReturn {
  steps: HeapSortStep[];
  error: Error | null;
  generateSteps: () => void;
  clearSteps: () => void;
}

const generateStepsUseCase = new GenerateStepsUseCase();

/**
 * Hook for generating Heap Sort visualization steps.
 */
export function useStepGenerator({
  array
}: UseStepGeneratorProps): UseStepGeneratorReturn {
  const [steps, setSteps] = useState<HeapSortStep[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const generateSteps = useCallback(() => {
    try {
      setError(null);
      const newSteps = generateStepsUseCase.execute({ array });
      setSteps(newSteps);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      setSteps([]);
    }
  }, [array]);

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
