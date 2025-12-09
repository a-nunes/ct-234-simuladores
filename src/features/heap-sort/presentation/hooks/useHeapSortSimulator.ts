import { useEffect, useCallback, useMemo } from 'react';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { HeapSortStep } from '@features/heap-sort/domain/entities/HeapSortStep';
import { SortingStep } from '@shared/sorting/types';
import { useSortingSimulation } from '@shared/sorting/hooks/useSortingSimulation';
import { mapHeapStep } from '@shared/sorting/mappers/toSortingSteps';

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
  setArraySize: (value: number) => void;

  // Navigation
  currentStepIndex: number;
  currentStep: SortingStep | null;
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

  const sortingSteps = useMemo<SortingStep[]>(() => stepGenerator.steps.map(mapHeapStep), [stepGenerator.steps]);

  const simulation = useSortingSimulation({
    steps: sortingSteps
  });

  // Clear steps when config changes
  useEffect(() => {
    if (!config.isRunning) {
      stepGenerator.clearSteps();
      simulation.reset();
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
    simulation.goToStep(0);
    simulation.play();
  }, [stepGenerator, config, simulation]);

  // Reset action
  const reset = useCallback(() => {
    stepGenerator.clearSteps();
    simulation.reset();
    config.setIsRunning(false);
  }, [stepGenerator, simulation, config]);

  return {
    // Config
    array: config.array,
    customArray: config.customArray,
    setCustomArray: config.setCustomArray,
    applyCustomConfig,
    generateWorstCase: config.generateWorstCase,
    generateBestCase: config.generateBestCase,
    generateRandomCase: config.generateRandomCase,
    setArraySize: config.setArraySize,

    // Navigation
    currentStepIndex: simulation.currentStepIndex,
    currentStep: simulation.currentStep,
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
