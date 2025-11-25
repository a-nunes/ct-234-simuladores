import { useState, useCallback } from 'react';
import { KMPStep } from '@features/kmp/domain/entities/KMPStep';
import { KMPConfig } from '@features/kmp/domain/entities/KMPConfig';
import { GenerateStepsUseCase } from '@features/kmp/domain/usecases/GenerateSteps.usecase';
import { InvalidInputError } from '@features/kmp/domain/errors/InvalidInputError';

export interface UseStepGeneratorProps {
  config: KMPConfig;
}

export interface UseStepGeneratorReturn {
  steps: KMPStep[];
  failureTable: number[];
  error: string | null;
  isGenerated: boolean;
  generateSteps: () => void;
  clearSteps: () => void;
}

/**
 * Hook for generating steps using the GenerateStepsUseCase.
 */
export function useStepGenerator({
  config
}: UseStepGeneratorProps): UseStepGeneratorReturn {
  const [steps, setSteps] = useState<KMPStep[]>([]);
  const [failureTable, setFailureTable] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const generateSteps = useCallback(() => {
    try {
      const useCase = new GenerateStepsUseCase();
      const result = useCase.execute(config);
      
      setSteps(result.steps);
      setFailureTable(result.failureTable);
      setError(null);
      setIsGenerated(true);
    } catch (err) {
      if (err instanceof InvalidInputError) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao gerar os passos.');
      }
      setSteps([]);
      setFailureTable([]);
      setIsGenerated(false);
    }
  }, [config]);

  const clearSteps = useCallback(() => {
    setSteps([]);
    setFailureTable([]);
    setError(null);
    setIsGenerated(false);
  }, []);

  return {
    steps,
    failureTable,
    error,
    isGenerated,
    generateSteps,
    clearSteps
  };
}
