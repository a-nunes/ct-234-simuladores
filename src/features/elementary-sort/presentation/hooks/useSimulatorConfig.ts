import { useState, useCallback } from 'react';
import { SortAlgorithm } from '@features/elementary-sort/domain/entities/ElementarySortStep';
import { parseArrayInput } from '@features/elementary-sort/data/validators/ArrayValidator';

export interface UseSimulatorConfigProps {
  initialArray?: number[];
  initialAlgorithm?: SortAlgorithm;
}

export interface UseSimulatorConfigReturn {
  array: number[];
  algorithm: SortAlgorithm;
  customArray: string;
  isRunning: boolean;
  setCustomArray: (value: string) => void;
  setAlgorithm: (algorithm: SortAlgorithm) => void;
  applyCustomConfig: () => void;
  setIsRunning: (running: boolean) => void;
  generateWorstCase: () => void;
  generateBestCase: () => void;
  generateRandomCase: () => void;
  setArraySize: (size: number) => void;
}

const DEFAULT_ARRAY = [44, 55, 12, 42, 94, 18, 6, 67];

/**
 * Hook for managing simulator configuration.
 */
export function useSimulatorConfig({
  initialArray = DEFAULT_ARRAY,
  initialAlgorithm = 'bubble'
}: UseSimulatorConfigProps = {}): UseSimulatorConfigReturn {
  const [array, setArray] = useState<number[]>(initialArray);
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>(initialAlgorithm);
  const [customArray, setCustomArray] = useState(initialArray.join(', '));
  const [isRunning, setIsRunning] = useState(false);

  const applyCustomConfig = useCallback(() => {
    try {
      const parsed = parseArrayInput(customArray);
      setArray(parsed);
      setIsRunning(false);
    } catch (error) {
      // Error will be shown by the step generator
      console.error(error);
    }
  }, [customArray]);

  const generateWorstCase = useCallback(() => {
    // Worst case: descending order
    const size = 8;
    const worst = Array.from({ length: size }, (_, i) => (size - i) * 10);
    setArray(worst);
    setCustomArray(worst.join(', '));
    setIsRunning(false);
  }, []);

  const generateBestCase = useCallback(() => {
    // Best case: already sorted
    const size = 8;
    const best = Array.from({ length: size }, (_, i) => (i + 1) * 10);
    setArray(best);
    setCustomArray(best.join(', '));
    setIsRunning(false);
  }, []);

  const generateRandomCase = useCallback(() => {
    const size = 8;
    const random = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    setArray(random);
    setCustomArray(random.join(', '));
    setIsRunning(false);
  }, []);

  const setArraySize = useCallback((size: number) => {
    const safe = Math.max(3, Math.min(size, 50));
    const random = Array.from({ length: safe }, () => Math.floor(Math.random() * 100));
    setArray(random);
    setCustomArray(random.join(', '));
    setIsRunning(false);
  }, []);

  return {
    array,
    algorithm,
    customArray,
    isRunning,
    setCustomArray,
    setAlgorithm,
    applyCustomConfig,
    setIsRunning,
    generateWorstCase,
    generateBestCase,
    generateRandomCase,
    setArraySize
  };
}
