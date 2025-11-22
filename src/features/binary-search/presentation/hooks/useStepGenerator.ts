import { useState, useCallback } from 'react';
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';
import { BinarySearchConfig } from '@features/binary-search/domain/entities/BinarySearchConfig';
import { GenerateStepsUseCase } from '@features/binary-search/domain/usecases/GenerateSteps.usecase';

export interface UseStepGeneratorProps {
  array: number[];
  searchValue: number;
}

export interface UseStepGeneratorReturn {
  steps: BinarySearchStep[];
  generateSteps: () => void;
  clearSteps: () => void;
  error: Error | null;
  isGenerating: boolean;
}

/**
 * Hook for generating steps using the use case.
 * Handles step generation and error handling.
 */
export function useStepGenerator({
  array,
  searchValue
}: UseStepGeneratorProps): UseStepGeneratorReturn {
  const [steps, setSteps] = useState<BinarySearchStep[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateSteps = useCallback(() => {
    try {
      setIsGenerating(true);
      setError(null);

      const useCase = new GenerateStepsUseCase();
      const config: BinarySearchConfig = {
        array,
        searchValue
      };

      const generatedSteps = useCase.execute(config);
      setSteps(generatedSteps);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao gerar steps');
      setError(error);
      setSteps([]);
    } finally {
      setIsGenerating(false);
    }
  }, [array, searchValue]);

  const clearSteps = useCallback(() => {
    setSteps([]);
    setError(null);
  }, []);

  return {
    steps,
    generateSteps,
    clearSteps,
    error,
    isGenerating
  };
}

