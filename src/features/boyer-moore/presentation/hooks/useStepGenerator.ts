import { useState, useCallback } from 'react';
import { BoyerMooreStep } from '@features/boyer-moore/domain/entities/BoyerMooreStep';
import { BoyerMooreConfig, BadCharTable } from '@features/boyer-moore/domain/entities/BoyerMooreConfig';
import { GenerateStepsUseCase } from '@features/boyer-moore/domain/usecases/GenerateSteps.usecase';
import { InvalidInputError } from '@features/boyer-moore/domain/errors/InvalidInputError';

export interface UseStepGeneratorProps {
  config: BoyerMooreConfig;
}

export interface UseStepGeneratorReturn {
  steps: BoyerMooreStep[];
  badCharTable: BadCharTable;
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
  const [steps, setSteps] = useState<BoyerMooreStep[]>([]);
  const [badCharTable, setBadCharTable] = useState<BadCharTable>({});
  const [error, setError] = useState<string | null>(null);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const generateSteps = useCallback(() => {
    try {
      const useCase = new GenerateStepsUseCase();
      const result = useCase.execute(config);
      
      setSteps(result.steps);
      setBadCharTable(result.badCharTable);
      setError(null);
      setIsGenerated(true);
    } catch (err) {
      if (err instanceof InvalidInputError) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao gerar os passos.');
      }
      setSteps([]);
      setBadCharTable({});
      setIsGenerated(false);
    }
  }, [config]);

  const clearSteps = useCallback(() => {
    setSteps([]);
    setBadCharTable({});
    setError(null);
    setIsGenerated(false);
  }, []);

  return {
    steps,
    badCharTable,
    error,
    isGenerated,
    generateSteps,
    clearSteps
  };
}
