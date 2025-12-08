import { useState, useCallback } from 'react';
import { DivideConquerSortStep, DivideConquerAlgorithm } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';
import { GenerateStepsUseCase } from '@features/divide-conquer-sort/domain/usecases/GenerateSteps.usecase';

export interface UseStepGeneratorProps {
  array: number[];
  algorithm: DivideConquerAlgorithm;
}

export interface UseStepGeneratorReturn {
  steps: DivideConquerSortStep[];
  error: Error | null;
  generateSteps: () => void;
  clearSteps: () => void;
}

const generateStepsUseCase = new GenerateStepsUseCase();

/**
 * Hook for generating divide and conquer sorting visualization steps.
 */
export function useStepGenerator({
  array,
  algorithm
}: UseStepGeneratorProps): UseStepGeneratorReturn {
  const [steps, setSteps] = useState<DivideConquerSortStep[]>([]);
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
