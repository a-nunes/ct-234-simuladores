import { useState, useCallback } from 'react';
import { DivideConquerAlgorithm } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';
import { parseArrayInput } from '@features/divide-conquer-sort/data/validators/ArrayValidator';

export interface UseSimulatorConfigProps {
  initialArray?: number[];
  initialAlgorithm?: DivideConquerAlgorithm;
}

export interface UseSimulatorConfigReturn {
  array: number[];
  algorithm: DivideConquerAlgorithm;
  customArray: string;
  isRunning: boolean;
  setCustomArray: (value: string) => void;
  setAlgorithm: (algorithm: DivideConquerAlgorithm) => void;
  applyCustomConfig: () => void;
  setIsRunning: (running: boolean) => void;
  generateWorstCase: () => void;
  generateBestCase: () => void;
  generateRandomCase: () => void;
}

const DEFAULT_ARRAY = [38, 27, 43, 3, 9, 82, 10];

/**
 * Hook for managing simulator configuration.
 */
export function useSimulatorConfig({
  initialArray = DEFAULT_ARRAY,
  initialAlgorithm = 'merge'
}: UseSimulatorConfigProps = {}): UseSimulatorConfigReturn {
  const [array, setArray] = useState<number[]>(initialArray);
  const [algorithm, setAlgorithm] = useState<DivideConquerAlgorithm>(initialAlgorithm);
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
    // Worst case for Quick Sort: already sorted (with first element as pivot)
    // For Merge Sort, worst case is similar complexity
    const size = 8;
    const worst = Array.from({ length: size }, (_, i) => (i + 1) * 10);
    setArray(worst);
    setCustomArray(worst.join(', '));
    setIsRunning(false);
  }, []);

  const generateBestCase = useCallback(() => {
    // Best case: elements that divide evenly
    const best = [50, 25, 75, 12, 37, 62, 87, 6];
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
    generateRandomCase
  };
}
