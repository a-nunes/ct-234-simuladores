import { useEffect, useCallback } from 'react';
import { useStepNavigation } from './useStepNavigation';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { RadixSortStep } from '@features/radix-sort/domain/entities/RadixSortStep';

export interface UseRadixSortSimulatorProps {
  initialArray?: number[];
  initialBase?: number;
}

export interface UseRadixSortSimulatorReturn {
  // Config
  array: number[];
  base: number;
  customArray: string;
  setCustomArray: (value: string) => void;
  setBase: (base: number) => void;
  applyCustomConfig: () => void;
  generateRandomCase: () => void;
  generateMultiDigitCase: () => void;
  generateSingleDigitCase: () => void;

  // Navigation
  currentStepIndex: number;
  currentStep: RadixSortStep | null;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;

  // Actions
  start: () => void;
  reset: () => void;
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;

  // State
  isRunning: boolean;
  error: Error | null;
}

/**
 * Orchestrator hook that composes all focused hooks.
 * Provides a unified API for the Radix Sort simulator.
 */
export function useRadixSortSimulator({
  initialArray,
  initialBase
}: UseRadixSortSimulatorProps = {}): UseRadixSortSimulatorReturn {
  // Configuration hook
  const config = useSimulatorConfig({
    initialArray,
    initialBase
  });

  // Step generator hook
  const stepGenerator = useStepGenerator({
    array: config.array,
    base: config.base
  });

  // Navigation hook
  const navigation = useStepNavigation({
    steps: stepGenerator.steps,
    initialIndex: -1
  });

  // Clear steps when config changes
  useEffect(() => {
    if (!config.isRunning) {
      stepGenerator.clearSteps();
      navigation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.array, config.base]);

  // Wrapper for applyCustomConfig that also resets
  const applyCustomConfig = useCallback(() => {
    config.applyCustomConfig();
  }, [config]);

  // Start action: generates steps and begins visualization
  const start = useCallback(() => {
    stepGenerator.generateSteps();
    config.setIsRunning(true);
    navigation.goToStep(0);
  }, [stepGenerator, config, navigation]);

  // Reset action: clears everything
  const reset = useCallback(() => {
    stepGenerator.clearSteps();
    navigation.reset();
    config.setIsRunning(false);
  }, [stepGenerator, navigation, config]);

  return {
    // Config
    array: config.array,
    base: config.base,
    customArray: config.customArray,
    setCustomArray: config.setCustomArray,
    setBase: config.setBase,
    applyCustomConfig,
    generateRandomCase: config.generateRandomCase,
    generateMultiDigitCase: config.generateMultiDigitCase,
    generateSingleDigitCase: config.generateSingleDigitCase,

    // Navigation
    currentStepIndex: navigation.currentStepIndex,
    currentStep: navigation.currentStep,
    totalSteps: navigation.totalSteps,
    canGoNext: navigation.canGoNext,
    canGoPrevious: navigation.canGoPrevious,

    // Actions
    start,
    reset,
    next: navigation.next,
    previous: navigation.previous,
    goToStep: navigation.goToStep,

    // State
    isRunning: config.isRunning,
    error: stepGenerator.error
  };
}
