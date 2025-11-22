import { useState, useCallback } from 'react';
import { parseArray, parseSearchValue, validateArray } from '@features/binary-search/data/validators/ArrayValidator';
import { InvalidArrayError, InvalidSearchValueError } from '@features/binary-search/domain/errors/InvalidArrayError';

export interface UseSimulatorConfigProps {
  initialArray?: number[];
  initialSearchValue?: number;
}

export interface UseSimulatorConfigReturn {
  array: number[];
  searchValue: number;
  customArray: string;
  customSearch: string;
  setCustomArray: (value: string) => void;
  setCustomSearch: (value: string) => void;
  applyCustomConfig: () => void;
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
  error: Error | null;
}

/**
 * Hook for managing simulator configuration.
 * Handles array and search value state, custom input parsing, and validation.
 */
export function useSimulatorConfig({
  initialArray = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78],
  initialSearchValue = 23
}: UseSimulatorConfigProps): UseSimulatorConfigReturn {
  const [array, setArray] = useState<number[]>(initialArray);
  const [searchValue, setSearchValue] = useState<number>(initialSearchValue);
  const [customArray, setCustomArray] = useState<string>(
    initialArray.join(',')
  );
  const [customSearch, setCustomSearch] = useState<string>(
    initialSearchValue.toString()
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const applyCustomConfig = useCallback(() => {
    try {
      setError(null);
      
      // Parse inputs
      const newArray = parseArray(customArray);
      const newSearch = parseSearchValue(customSearch);

      // Sort array to ensure it's in ascending order (before validation)
      const sortedArray = [...newArray].sort((a, b) => a - b);

      // Validate sorted array (check for empty array, etc.)
      validateArray(sortedArray);

      setArray(sortedArray);
      setSearchValue(newSearch);
      
      // Update custom inputs to match sorted array
      setCustomArray(sortedArray.join(','));
      
      // Reset running state when config changes (matching original behavior)
      setIsRunning(false);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Erro ao processar entrada!';
      
      setError(new Error(errorMessage));
      
      // Show alert for user feedback (matching original behavior)
      alert(errorMessage);
    }
  }, [customArray, customSearch]);

  return {
    array,
    searchValue,
    customArray,
    customSearch,
    setCustomArray,
    setCustomSearch,
    applyCustomConfig,
    isRunning,
    setIsRunning,
    error
  };
}

