import React, { useEffect, useCallback, useRef } from 'react';
import { useStepNavigation } from '@shared/graph-simulators/hooks/useStepNavigation';
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepGenerator } from './useStepGenerator';
import { PrimStep } from '@features/prim/domain/entities/PrimStep';
import { Node } from '@features/prim/domain/entities/Node';
import { Edge } from '@features/prim/domain/entities/Edge';

export interface UsePrimSimulatorProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  initialRootNode?: number;
}

export interface UsePrimSimulatorReturn {
  // Config
  nodes: Node[];
  edges: Edge[];
  rootNode: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setRootNode: (rootNode: number) => void;
  generateRandomGraph: (n: number) => void;
  loadCustomGraph: () => void;

  // Navigation
  currentStepIndex: number;
  currentStep: PrimStep | null;
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
  _setSteps?: React.Dispatch<React.SetStateAction<PrimStep[]>>;
  _steps?: PrimStep[];
}

/**
 * Orchestrator hook that composes all other hooks.
 * Provides a unified API for the Prim simulator.
 */
export function usePrimSimulator({
  initialNodes,
  initialEdges,
  initialRootNode
}: UsePrimSimulatorProps): UsePrimSimulatorReturn {
  // Configuration hook
  const config = useSimulatorConfig({
    initialNodes,
    initialEdges,
    initialRootNode
  });

  // Step generator hook - needs to regenerate when nodes/edges/rootNode change
  const stepGenerator = useStepGenerator({
    nodes: config.nodes,
    edges: config.edges,
    rootNode: config.rootNode
  });

  // Navigation hook
  const navigation = useStepNavigation({
    steps: stepGenerator.steps,
    initialIndex: -1
  });

  // Track previous nodes, edges, and rootNode to detect changes
  const prevNodesRef = useRef<Node[]>(config.nodes);
  const prevEdgesRef = useRef<Edge[]>(config.edges);
  const prevRootNodeRef = useRef<number>(config.rootNode);

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
        e.to === prevEdges[i].to && 
        e.weight === prevEdges[i].weight
      );
      if (!found) return true;
    }
    return false;
  }, []);

  // Clear steps when config changes, but preserve if only positions changed
  useEffect(() => {
    const positionsOnly = isOnlyPositionChange(prevNodesRef.current, config.nodes);
    const edgesDidChange = edgesChanged(prevEdgesRef.current, config.edges);
    const rootNodeDidChange = prevRootNodeRef.current !== config.rootNode;
    
    if (positionsOnly && !edgesDidChange && !rootNodeDidChange && stepGenerator.steps.length > 0) {
      // Only positions changed during execution - update in place
      stepGenerator.updateNodePositions(config.nodes);
    } else if (!positionsOnly || edgesDidChange || rootNodeDidChange) {
      // Structural changes - clear and reset
      stepGenerator.clearSteps();
      navigation.reset();
    }
    
    prevNodesRef.current = config.nodes;
    prevEdgesRef.current = config.edges;
    prevRootNodeRef.current = config.rootNode;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.nodes, config.edges, config.rootNode]);

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
    rootNode: config.rootNode,
    setNodes: config.setNodes,
    setEdges: config.setEdges,
    setRootNode: config.setRootNode,
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

