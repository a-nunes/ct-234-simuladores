import { useEffect, useCallback, useMemo } from 'react';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { RadixSortStep } from '@features/radix-sort/domain/entities/RadixSortStep';
import { SortingStep } from '@shared/sorting/types';
import { useSortingSimulation } from '@shared/sorting/hooks/useSortingSimulation';
import { mapRadixStep } from '@shared/sorting/mappers/toSortingSteps';

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
  setArraySize: (value: number) => void;

  // Navigation
  currentStepIndex: number;
  currentStep: SortingStep | null;
  rawStep: RadixSortStep | null;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;

  // Actions
  start: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;

  // State
  isRunning: boolean;
  isPlaying: boolean;
  speedMs: number;
  setSpeedMs: (value: number) => void;
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

  const sortingSteps = useMemo<SortingStep[]>(() => stepGenerator.steps.map(mapRadixStep), [stepGenerator.steps]);

  const simulation = useSortingSimulation({
    steps: sortingSteps
  });

  const rawStep = useMemo<RadixSortStep | null>(() => {
    if (simulation.currentStepIndex < 0 || simulation.currentStepIndex >= stepGenerator.steps.length) {
      return null;
    }
    return stepGenerator.steps[simulation.currentStepIndex];
  }, [simulation.currentStepIndex, stepGenerator.steps]);

  // Clear steps when config changes
  useEffect(() => {
    if (!config.isRunning) {
      stepGenerator.clearSteps();
      simulation.reset();
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
    simulation.goToStep(0);
    simulation.play();
  }, [stepGenerator, config, simulation]);

  // Reset action: clears everything
  const reset = useCallback(() => {
    stepGenerator.clearSteps();
    simulation.reset();
    config.setIsRunning(false);
  }, [stepGenerator, simulation, config]);

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
    setArraySize: config.setArraySize,

    // Navigation
    currentStepIndex: simulation.currentStepIndex,
    currentStep: simulation.currentStep,
    rawStep,
    totalSteps: simulation.totalSteps,
    canGoNext: simulation.currentStepIndex < simulation.totalSteps - 1,
    canGoPrevious: simulation.currentStepIndex > 0,

    // Actions
    start,
    play: simulation.play,
    pause: simulation.pause,
    reset,
    next: simulation.next,
    previous: simulation.previous,
    goToStep: simulation.goToStep,

    // State
    isRunning: config.isRunning,
    isPlaying: simulation.isPlaying,
    speedMs: simulation.speedMs,
    setSpeedMs: simulation.setSpeedMs,
    error: stepGenerator.error
  };
}
