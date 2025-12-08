import { useState, useCallback } from 'react';
import { RadixSortStep } from '@features/radix-sort/domain/entities/RadixSortStep';
import { GenerateStepsUseCase } from '@features/radix-sort/domain/usecases/GenerateSteps.usecase';

export interface UseStepGeneratorProps {
  array: number[];
  base: number;
}

export interface UseStepGeneratorReturn {
  steps: RadixSortStep[];
  error: Error | null;
  generateSteps: () => void;
  clearSteps: () => void;
}

const generateStepsUseCase = new GenerateStepsUseCase();

/**
 * Hook for generating Radix Sort visualization steps.
 */
export function useStepGenerator({
  array,
  base
}: UseStepGeneratorProps): UseStepGeneratorReturn {
  const [steps, setSteps] = useState<RadixSortStep[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const generateSteps = useCallback(() => {
    try {
      setError(null);
      const newSteps = generateStepsUseCase.execute({ array, base });
      setSteps(newSteps);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      setSteps([]);
    }
  }, [array, base]);

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
