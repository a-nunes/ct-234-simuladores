import { useCallback } from 'react';
import { useSimulatorConfig, UseSimulatorConfigProps } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { useStepNavigation } from './useStepNavigation';
import { BoyerMooreStep } from '@features/boyer-moore/domain/entities/BoyerMooreStep';
import { BadCharTable } from '@features/boyer-moore/domain/entities/BoyerMooreConfig';

export interface UseBoyerMooreSimulatorProps extends UseSimulatorConfigProps {}

export interface UseBoyerMooreSimulatorReturn {
  // Config
  text: string;
  pattern: string;
  setText: (text: string) => void;
  setPattern: (pattern: string) => void;
  
  // Steps
  steps: BoyerMooreStep[];
  badCharTable: BadCharTable;
  error: string | null;
  isRunning: boolean;
  
  // Navigation
  currentStepIndex: number;
  currentStep: BoyerMooreStep | null;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  
  // Actions
  simulate: () => void;
  reset: () => void;
  next: () => void;
  previous: () => void;
  goToStart: () => void;
  goToEnd: () => void;
}

/**
 * Orchestrator hook that composes all Boyer-Moore simulator functionality.
 */
export function useBoyerMooreSimulator({
  initialText,
  initialPattern
}: UseBoyerMooreSimulatorProps = {}): UseBoyerMooreSimulatorReturn {
  // Config hook
  const configHook = useSimulatorConfig({
    initialText,
    initialPattern
  });

  // Step generator hook
  const stepGeneratorHook = useStepGenerator({
    config: configHook.config
  });

  // Navigation hook
  const navigationHook = useStepNavigation({
    steps: stepGeneratorHook.steps,
    initialIndex: 0
  });

  // Actions
  const simulate = useCallback(() => {
    stepGeneratorHook.generateSteps();
    navigationHook.reset();
  }, [stepGeneratorHook, navigationHook]);

  const reset = useCallback(() => {
    stepGeneratorHook.clearSteps();
    navigationHook.reset();
  }, [stepGeneratorHook, navigationHook]);

  return {
    // Config
    text: configHook.text,
    pattern: configHook.pattern,
    setText: configHook.setText,
    setPattern: configHook.setPattern,
    
    // Steps
    steps: stepGeneratorHook.steps,
    badCharTable: stepGeneratorHook.badCharTable,
    error: stepGeneratorHook.error,
    isRunning: stepGeneratorHook.isGenerated,
    
    // Navigation
    currentStepIndex: navigationHook.currentStepIndex,
    currentStep: navigationHook.currentStep,
    canGoNext: navigationHook.canGoNext,
    canGoPrevious: navigationHook.canGoPrevious,
    isAtStart: navigationHook.isAtStart,
    isAtEnd: navigationHook.isAtEnd,
    
    // Actions
    simulate,
    reset,
    next: navigationHook.next,
    previous: navigationHook.previous,
    goToStart: navigationHook.goToStart,
    goToEnd: navigationHook.goToEnd
  };
}
