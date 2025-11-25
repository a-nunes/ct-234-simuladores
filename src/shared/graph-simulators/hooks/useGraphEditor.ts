import { useState, useCallback } from 'react';
import { useDragNodes } from '../../../hooks/useDragNodes';

/**
 * Base interface for nodes that can be dragged
 */
export interface DraggableNode {
  id: number;
  x: number;
  y: number;
  [key: string]: any;
}

/**
 * Base interface for steps that contain nodes
 */
export interface StepWithNodes {
  nodes: DraggableNode[];
  [key: string]: any;
}

export interface UseGraphEditorProps<TNode extends DraggableNode, TStep extends StepWithNodes> {
  nodes: TNode[];
  setNodes: (nodes: TNode[]) => void;
  isSimulating: boolean;
  steps: TStep[];
  setSteps: (steps: TStep[]) => void;
}

export interface UseGraphEditorReturn {
  isDragging: boolean;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  handleNodeMouseDown: (nodeId: number, event: React.MouseEvent<SVGGElement>) => void;
  handleMouseMove: (event: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseUp: () => void;
}

/**
 * Generic hook for managing graph editor functionality.
 * Handles node dragging and canvas expansion.
 * 
 * @template TNode - The node type that extends DraggableNode
 * @template TStep - The step type that extends StepWithNodes
 */
export function useGraphEditor<TNode extends DraggableNode, TStep extends StepWithNodes>({
  nodes,
  setNodes,
  isSimulating,
  steps,
  setSteps
}: UseGraphEditorProps<TNode, TStep>): UseGraphEditorReturn {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Wrap setNodes to match Dispatch<SetStateAction<TNode[]>> signature
  const setNodesDispatch = useCallback((value: TNode[] | ((prev: TNode[]) => TNode[])) => {
    if (typeof value === 'function') {
      setNodes(value(nodes));
    } else {
      setNodes(value);
    }
  }, [nodes, setNodes]);

  // Wrap setSteps to match Dispatch<SetStateAction<TStep[]>> signature
  const setStepsDispatch = useCallback((value: TStep[] | ((prev: TStep[]) => TStep[])) => {
    if (typeof value === 'function') {
      setSteps(value(steps));
    } else {
      setSteps(value);
    }
  }, [steps, setSteps]);

  const { isDragging, handleNodeMouseDown, handleMouseMove, handleMouseUp } = useDragNodes(
    nodes,
    setNodesDispatch,
    isSimulating,
    steps,
    setStepsDispatch
  );

  return {
    isDragging,
    isExpanded,
    setIsExpanded,
    handleNodeMouseDown,
    handleMouseMove,
    handleMouseUp
  };
}


