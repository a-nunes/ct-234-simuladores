import React, { useEffect, useCallback } from 'react';
import { useStepNavigation } from './useStepNavigation';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { DijkstraStep } from '@features/dijkstra/domain/entities/DijkstraStep';
import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';

export interface UseDijkstraSimulatorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialSourceNode?: number;
}

export interface UseDijkstraSimulatorReturn {
  // Config
  nodes: Node[];
  edges: Edge[];
  sourceNode: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSourceNode: (sourceNode: number) => void;
  generateRandomGraph: (n: number) => void;
  loadCustomGraph: () => void;

  // Navigation
  currentStepIndex: number;
  currentStep: DijkstraStep | null;
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
  // Internal: for drag functionality
  _setSteps?: React.Dispatch<React.SetStateAction<DijkstraStep[]>>;
  _steps?: DijkstraStep[];
}

/**
 * Orchestrator hook that composes all other hooks.
 * Provides a unified API for the Dijkstra simulator.
 */
export function useDijkstraSimulator({
  initialNodes,
  initialEdges,
  initialSourceNode
}: UseDijkstraSimulatorProps): UseDijkstraSimulatorReturn {
  // Configuration hook
  const config = useSimulatorConfig({
    initialNodes,
    initialEdges,
    initialSourceNode
  });

  // Step generator hook - needs to regenerate when nodes/edges/sourceNode change
  const stepGenerator = useStepGenerator({
    nodes: config.nodes,
    edges: config.edges,
    sourceNode: config.sourceNode
  });

  // Navigation hook
  const navigation = useStepNavigation({
    steps: stepGenerator.steps,
    initialIndex: -1
  });

  // Clear steps when config changes
  useEffect(() => {
    stepGenerator.clearSteps();
    navigation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.nodes, config.edges, config.sourceNode]);

  // Start simulation
  const start = useCallback(() => {
    stepGenerator.generateSteps();
  }, [stepGenerator]);

  // Reset simulation
  const reset = useCallback(() => {
    stepGenerator.clearSteps();
    navigation.reset();
  }, [stepGenerator, navigation]);

  // Update navigation when steps change - start at first step
  useEffect(() => {
    if (stepGenerator.steps.length > 0 && navigation.currentStepIndex === -1) {
      navigation.goToStep(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepGenerator.steps.length]);

  const isRunning = stepGenerator.steps.length > 0;

  return {
    // Config
    nodes: config.nodes,
    edges: config.edges,
    sourceNode: config.sourceNode,
    setNodes: config.setNodes,
    setEdges: config.setEdges,
    setSourceNode: config.setSourceNode,
    generateRandomGraph: config.generateRandomGraph,
    loadCustomGraph: config.loadCustomGraph,

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
    isRunning,
    error: config.error || stepGenerator.error,
    // Internal: expose setSteps and steps for drag functionality
    _setSteps: stepGenerator.setSteps,
    _steps: stepGenerator.steps
  };
}

