import { useState, useCallback } from 'react';
import { parseArrayInput } from '@features/radix-sort/data/validators/ArrayValidator';

export interface UseSimulatorConfigProps {
  initialArray?: number[];
  initialBase?: number;
}

export interface UseSimulatorConfigReturn {
  array: number[];
  base: number;
  customArray: string;
  isRunning: boolean;
  setCustomArray: (value: string) => void;
  setBase: (base: number) => void;
  applyCustomConfig: () => void;
  setIsRunning: (running: boolean) => void;
  generateRandomCase: () => void;
  generateMultiDigitCase: () => void;
  generateSingleDigitCase: () => void;
}

const DEFAULT_ARRAY = [170, 45, 75, 90, 802, 24, 2, 66];

/**
 * Hook for managing Radix Sort simulator configuration.
 */
export function useSimulatorConfig({
  initialArray = DEFAULT_ARRAY,
  initialBase = 10
}: UseSimulatorConfigProps = {}): UseSimulatorConfigReturn {
  const [array, setArray] = useState<number[]>(initialArray);
  const [base, setBase] = useState<number>(initialBase);
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

  const generateRandomCase = useCallback(() => {
    const size = 8;
    const random = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
    setArray(random);
    setCustomArray(random.join(', '));
    setIsRunning(false);
  }, []);

  const generateMultiDigitCase = useCallback(() => {
    // Case with numbers of varying digit counts
    const multiDigit = [1234, 567, 89, 4321, 12, 999, 100, 50];
    setArray(multiDigit);
    setCustomArray(multiDigit.join(', '));
    setIsRunning(false);
  }, []);

  const generateSingleDigitCase = useCallback(() => {
    // Case with only single digit numbers (quick demo)
    const singleDigit = [3, 1, 4, 1, 5, 9, 2, 6];
    setArray(singleDigit);
    setCustomArray(singleDigit.join(', '));
    setIsRunning(false);
  }, []);

  return {
    array,
    base,
    customArray,
    isRunning,
    setCustomArray,
    setBase,
    applyCustomConfig,
    setIsRunning,
    generateRandomCase,
    generateMultiDigitCase,
    generateSingleDigitCase
  };
}
