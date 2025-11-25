import { useCallback } from 'react';
import { useSimulatorConfig, UseSimulatorConfigProps } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { useStepNavigation } from './useStepNavigation';
import { KMPStep } from '@features/kmp/domain/entities/KMPStep';

export interface UseKMPSimulatorProps extends UseSimulatorConfigProps {}

export interface UseKMPSimulatorReturn {
  // Config
  text: string;
  pattern: string;
  setText: (text: string) => void;
  setPattern: (pattern: string) => void;
  
  // Steps
  steps: KMPStep[];
  failureTable: number[];
  error: string | null;
  isRunning: boolean;
  
  // Navigation
  currentStepIndex: number;
  currentStep: KMPStep | null;
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
 * Orchestrator hook that composes all KMP simulator functionality.
 */
export function useKMPSimulator({
  initialText,
  initialPattern
}: UseKMPSimulatorProps = {}): UseKMPSimulatorReturn {
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
    failureTable: stepGeneratorHook.failureTable,
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
