import { useState, useCallback } from 'react';
import { parseArrayInput } from '@features/heap-sort/data/validators/ArrayValidator';

export interface UseSimulatorConfigProps {
  initialArray?: number[];
}

export interface UseSimulatorConfigReturn {
  array: number[];
  customArray: string;
  isRunning: boolean;
  setCustomArray: (value: string) => void;
  applyCustomConfig: () => void;
  setIsRunning: (running: boolean) => void;
  generateWorstCase: () => void;
  generateBestCase: () => void;
  generateRandomCase: () => void;
}

const DEFAULT_ARRAY = [4, 10, 3, 5, 1, 8, 7, 2, 9, 6];

/**
 * Hook for managing Heap Sort simulator configuration.
 */
export function useSimulatorConfig({
  initialArray = DEFAULT_ARRAY
}: UseSimulatorConfigProps = {}): UseSimulatorConfigReturn {
  const [array, setArray] = useState<number[]>(initialArray);
  const [customArray, setCustomArray] = useState(initialArray.join(', '));
  const [isRunning, setIsRunning] = useState(false);

  const applyCustomConfig = useCallback(() => {
    try {
      const parsed = parseArrayInput(customArray);
      setArray(parsed);
      setIsRunning(false);
    } catch (error) {
      console.error(error);
    }
  }, [customArray]);

  const generateWorstCase = useCallback(() => {
    // For heap sort, worst case is similar to average - random array
    const size = 10;
    const worst = Array.from({ length: size }, (_, i) => i + 1);
    setArray(worst);
    setCustomArray(worst.join(', '));
    setIsRunning(false);
  }, []);

  const generateBestCase = useCallback(() => {
    // Best case: already a max-heap
    const best = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
    setArray(best);
    setCustomArray(best.join(', '));
    setIsRunning(false);
  }, []);

  const generateRandomCase = useCallback(() => {
    const size = 10;
    const random = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setArray(random);
    setCustomArray(random.join(', '));
    setIsRunning(false);
  }, []);

  return {
    array,
    customArray,
    isRunning,
    setCustomArray,
    applyCustomConfig,
    setIsRunning,
    generateWorstCase,
    generateBestCase,
    generateRandomCase
  };
}
