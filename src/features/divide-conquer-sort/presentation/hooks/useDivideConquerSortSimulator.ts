import { useEffect, useCallback } from 'react';
import { useStepNavigation } from './useStepNavigation';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { DivideConquerSortStep, DivideConquerAlgorithm } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';

export interface UseDivideConquerSortSimulatorProps {
  initialArray?: number[];
  initialAlgorithm?: DivideConquerAlgorithm;
}

export interface UseDivideConquerSortSimulatorReturn {
  // Config
  array: number[];
  algorithm: DivideConquerAlgorithm;
  customArray: string;
  setCustomArray: (value: string) => void;
  setAlgorithm: (algorithm: DivideConquerAlgorithm) => void;
  applyCustomConfig: () => void;
  generateWorstCase: () => void;
  generateBestCase: () => void;
  generateRandomCase: () => void;

  // Navigation
  currentStepIndex: number;
  currentStep: DivideConquerSortStep | null;
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
 * Provides a unified API for the divide and conquer sort simulator.
 */
export function useDivideConquerSortSimulator({
  initialArray,
  initialAlgorithm
}: UseDivideConquerSortSimulatorProps = {}): UseDivideConquerSortSimulatorReturn {
  // Configuration hook
  const config = useSimulatorConfig({
    initialArray,
    initialAlgorithm
  });

  // Step generator hook
  const stepGenerator = useStepGenerator({
    array: config.array,
    algorithm: config.algorithm
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
  }, [config.array, config.algorithm]);

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
    algorithm: config.algorithm,
    customArray: config.customArray,
    setCustomArray: config.setCustomArray,
    setAlgorithm: config.setAlgorithm,
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
