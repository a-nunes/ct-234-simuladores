import { useEffect, useCallback } from 'react';
import { useStepNavigation } from './useStepNavigation';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { HeapSortStep } from '@features/heap-sort/domain/entities/HeapSortStep';

export interface UseHeapSortSimulatorProps {
  initialArray?: number[];
}

export interface UseHeapSortSimulatorReturn {
  // Config
  array: number[];
  customArray: string;
  setCustomArray: (value: string) => void;
  applyCustomConfig: () => void;
  generateWorstCase: () => void;
  generateBestCase: () => void;
  generateRandomCase: () => void;

  // Navigation
  currentStepIndex: number;
  currentStep: HeapSortStep | null;
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
 * Provides a unified API for the Heap Sort simulator.
 */
export function useHeapSortSimulator({
  initialArray
}: UseHeapSortSimulatorProps = {}): UseHeapSortSimulatorReturn {
  // Configuration hook
  const config = useSimulatorConfig({
    initialArray
  });

  // Step generator hook
  const stepGenerator = useStepGenerator({
    array: config.array
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
  }, [config.array]);

  // Wrapper for applyCustomConfig
  const applyCustomConfig = useCallback(() => {
    config.applyCustomConfig();
  }, [config]);

  // Start action
  const start = useCallback(() => {
    stepGenerator.generateSteps();
    config.setIsRunning(true);
    navigation.goToStep(0);
  }, [stepGenerator, config, navigation]);

  // Reset action
  const reset = useCallback(() => {
    stepGenerator.clearSteps();
    navigation.reset();
    config.setIsRunning(false);
  }, [stepGenerator, navigation, config]);

  return {
    // Config
    array: config.array,
    customArray: config.customArray,
    setCustomArray: config.setCustomArray,
    applyCustomConfig,
    generateWorstCase: config.generateWorstCase,
    generateBestCase: config.generateBestCase,
    generateRandomCase: config.generateRandomCase,

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
