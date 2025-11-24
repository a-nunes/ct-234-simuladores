import React, { useEffect, useCallback, useRef } from 'react';
import { useStepNavigation } from '@shared/graph-simulators/hooks/useStepNavigation';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { TopologicalSortStep } from '@features/topological-sort/domain/entities/TopologicalSortStep';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';

export interface UseTopologicalSortSimulatorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialDataStructure?: 'queue' | 'stack';
}

export interface UseTopologicalSortSimulatorReturn {
  // Config
  nodes: Node[];
  edges: Edge[];
  dataStructure: 'queue' | 'stack';
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setDataStructure: (dataStructure: 'queue' | 'stack') => void;
  generateRandomGraph: (n: number) => void;
  loadCustomGraph: () => void;

  // Navigation
  currentStepIndex: number;
  currentStep: TopologicalSortStep | null;
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
  _setSteps?: React.Dispatch<React.SetStateAction<TopologicalSortStep[]>>;
  _steps?: TopologicalSortStep[];
}

/**
 * Orchestrator hook that composes all other hooks.
 * Provides a unified API for the Topological Sort simulator.
 */
export function useTopologicalSortSimulator({
  initialNodes,
  initialEdges,
  initialDataStructure
}: UseTopologicalSortSimulatorProps): UseTopologicalSortSimulatorReturn {
  // Configuration hook
  const config = useSimulatorConfig({
    initialNodes,
    initialEdges,
    initialDataStructure
  });

  // Step generator hook - needs to regenerate when nodes/edges/dataStructure change
  const stepGenerator = useStepGenerator({
    nodes: config.nodes,
    edges: config.edges,
    dataStructure: config.dataStructure
  });

  // Navigation hook
  const navigation = useStepNavigation({
    steps: stepGenerator.steps,
    initialIndex: -1
  });

  // Track previous nodes, edges, and dataStructure to detect changes
  const prevNodesRef = useRef<Node[]>(config.nodes);
  const prevEdgesRef = useRef<Edge[]>(config.edges);
  const prevDataStructureRef = useRef<'queue' | 'stack'>(config.dataStructure);

  // Helper function to check if only positions changed
  const isOnlyPositionChange = useCallback((prevNodes: Node[], newNodes: Node[]) => {
    if (prevNodes.length !== newNodes.length) return false;
    
    for (let i = 0; i < prevNodes.length; i++) {
      const prevNode = prevNodes.find(n => n.id === newNodes[i].id);
      if (!prevNode) return false;
      // Check if anything other than x, y changed
      if (prevNode.label !== newNodes[i].label) return false;
    }
    return true;
  }, []);

  // Helper function to check if edges changed
  const edgesChanged = useCallback((prevEdges: Edge[], newEdges: Edge[]) => {
    if (prevEdges.length !== newEdges.length) return true;
    
    for (let i = 0; i < prevEdges.length; i++) {
      const found = newEdges.find(e => 
        e.from === prevEdges[i].from && 
        e.to === prevEdges[i].to
      );
      if (!found) return true;
    }
    return false;
  }, []);

  // Clear steps when config changes, but preserve if only positions changed
  useEffect(() => {
    const positionsOnly = isOnlyPositionChange(prevNodesRef.current, config.nodes);
    const edgesDidChange = edgesChanged(prevEdgesRef.current, config.edges);
    const dataStructureDidChange = prevDataStructureRef.current !== config.dataStructure;
    
    if (positionsOnly && !edgesDidChange && !dataStructureDidChange && stepGenerator.steps.length > 0) {
      // Only positions changed during execution - update in place
      stepGenerator.updateNodePositions(config.nodes);
    } else if (!positionsOnly || edgesDidChange || dataStructureDidChange) {
      // Structural changes - clear and reset
      stepGenerator.clearSteps();
      navigation.reset();
    }
    
    prevNodesRef.current = config.nodes;
    prevEdgesRef.current = config.edges;
    prevDataStructureRef.current = config.dataStructure;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.nodes, config.edges, config.dataStructure]);

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
    dataStructure: config.dataStructure,
    setNodes: config.setNodes,
    setEdges: config.setEdges,
    setDataStructure: config.setDataStructure,
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

