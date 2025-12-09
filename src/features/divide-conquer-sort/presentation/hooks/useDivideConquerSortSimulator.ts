import { useEffect, useCallback, useMemo } from 'react';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { DivideConquerSortStep, DivideConquerAlgorithm } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';
import { SortingStep } from '@shared/sorting/types';
import { useSortingSimulation } from '@shared/sorting/hooks/useSortingSimulation';
import { mapDivideConquerStep } from '@shared/sorting/mappers/toSortingSteps';

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
  setArraySize: (value: number) => void;

  // Navigation
  currentStepIndex: number;
  currentStep: SortingStep | null;
  rawStep: DivideConquerSortStep | null;
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

  const sortingSteps = useMemo<SortingStep[]>(() => stepGenerator.steps.map(mapDivideConquerStep), [stepGenerator.steps]);

  const simulation = useSortingSimulation({
    steps: sortingSteps
  });

  const rawStep = useMemo<DivideConquerSortStep | null>(() => {
    if (simulation.currentStepIndex < 0 || simulation.currentStepIndex >= stepGenerator.steps.length) return null;
    return stepGenerator.steps[simulation.currentStepIndex];
  }, [simulation.currentStepIndex, stepGenerator.steps]);

  // Clear steps when config changes
  useEffect(() => {
    if (!config.isRunning) {
      stepGenerator.clearSteps();
      simulation.reset();
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
