import { useEffect, useCallback } from 'react';
import { useStepNavigation } from './useStepNavigation';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';

export interface UseBinarySearchSimulatorProps {
  initialArray?: number[];
  initialSearchValue?: number;
}

export interface UseBinarySearchSimulatorReturn {
  // Config
  array: number[];
  searchValue: number;
  customArray: string;
  customSearch: string;
  setCustomArray: (value: string) => void;
  setCustomSearch: (value: string) => void;
  applyCustomConfig: () => void;

  // Navigation
  currentStepIndex: number;
  currentStep: BinarySearchStep | null;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;

  // Actions
  start: () => void;
  reset: () => void;
  next: () => void;
  previous: () => void;

  // State
  isRunning: boolean;
  error: Error | null;
}

/**
 * Orchestrator hook that composes all other hooks.
 * Provides a unified API for the binary search simulator.
 */
export function useBinarySearchSimulator({
  initialArray,
  initialSearchValue
}: UseBinarySearchSimulatorProps): UseBinarySearchSimulatorReturn {
  // Configuration hook
  const config = useSimulatorConfig({
    initialArray,
    initialSearchValue
  });

  // Step generator hook
  const stepGenerator = useStepGenerator({
    array: config.array,
    searchValue: config.searchValue
  });

  // Navigation hook
  const navigation = useStepNavigation({
    steps: stepGenerator.steps,
    initialIndex: -1
  });

  // Clear steps when config changes (matching original behavior)
  useEffect(() => {
    if (!config.isRunning) {
      stepGenerator.clearSteps();
      navigation.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.array, config.searchValue]);

  // Wrapper for applyCustomConfig that also resets
  const applyCustomConfig = useCallback(() => {
    config.applyCustomConfig();
    // Reset will be handled by the useEffect above
  }, [config]);

  // Start simulation
  const start = useCallback(() => {
    stepGenerator.generateSteps();
  }, [stepGenerator]);

  // Reset simulation
  const reset = useCallback(() => {
    stepGenerator.clearSteps();
    navigation.reset();
    config.setIsRunning(false);
  }, [stepGenerator, navigation, config]);

  // Update navigation when steps change - start at first step
  useEffect(() => {
    if (stepGenerator.steps.length > 0 && navigation.currentStepIndex === -1) {
      navigation.goToStep(0);
      config.setIsRunning(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepGenerator.steps.length]);

  // Sync isRunning state based on steps
  useEffect(() => {
    if (stepGenerator.steps.length === 0) {
      config.setIsRunning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepGenerator.steps.length]);

  return {
    // Config
    array: config.array,
    searchValue: config.searchValue,
    customArray: config.customArray,
    customSearch: config.customSearch,
    setCustomArray: config.setCustomArray,
    setCustomSearch: config.setCustomSearch,
    applyCustomConfig,

    // Navigation
    currentStepIndex: navigation.currentStepIndex,
    currentStep: navigation.currentStep,
    totalSteps: stepGenerator.steps.length,
    canGoNext: navigation.canGoNext,
    canGoPrevious: navigation.canGoPrevious,

    // Actions
    start,
    reset,
    next: navigation.next,
    previous: navigation.previous,

    // State
    isRunning: config.isRunning,
    error: config.error || stepGenerator.error
  };
}

