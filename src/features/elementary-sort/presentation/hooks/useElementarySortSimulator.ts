import { useEffect, useCallback, useMemo } from 'react';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { ElementarySortStep, SortAlgorithm } from '@features/elementary-sort/domain/entities/ElementarySortStep';
import { useSortingSimulation } from '@shared/sorting/hooks/useSortingSimulation';
import { SortingStep } from '@shared/sorting/types';
import { toSortingStep } from '../mappers/toSortingStep';

export interface UseElementarySortSimulatorProps {
  initialArray?: number[];
  initialAlgorithm?: SortAlgorithm;
}

export interface UseElementarySortSimulatorReturn {
  // Config
  array: number[];
  algorithm: SortAlgorithm;
  customArray: string;
  setCustomArray: (value: string) => void;
  setAlgorithm: (algorithm: SortAlgorithm) => void;
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
 * Provides a unified API for the elementary sort simulator.
 */
export function useElementarySortSimulator({
  initialArray,
  initialAlgorithm
}: UseElementarySortSimulatorProps = {}): UseElementarySortSimulatorReturn {
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

  const sortingSteps = useMemo<SortingStep[]>(() => stepGenerator.steps.map(toSortingStep), [stepGenerator.steps]);

  // Shared simulation (play/pause/seek)
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
  }, [config.array, config.algorithm]);

  // Start playback once steps are available
  useEffect(() => {
    if (config.isRunning && stepGenerator.steps.length > 0) {
      simulation.goToStep(0);
      simulation.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.isRunning, stepGenerator.steps]);

  // Wrapper for applyCustomConfig that also resets
  const applyCustomConfig = useCallback(() => {
    config.applyCustomConfig();
  }, [config]);

  // Start action: generates steps and begins visualization
  const start = useCallback(() => {
    stepGenerator.generateSteps();
    config.setIsRunning(true);
  }, [stepGenerator, config]);

  // Reset action: clears everything
  const reset = useCallback(() => {
    stepGenerator.clearSteps();
    simulation.reset();
    config.setIsRunning(false);
  }, [stepGenerator, simulation, config]);

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
