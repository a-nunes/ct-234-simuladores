import { useState, useCallback } from 'react';
import { useDragNodes } from '../../../../hooks/useDragNodes';
import { Node } from '@features/dijkstra/domain/entities/Node';
import { DijkstraStep } from '@features/dijkstra/domain/entities/DijkstraStep';

export interface UseGraphEditorProps {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  isSimulating: boolean;
  steps: DijkstraStep[];
  setSteps: (steps: DijkstraStep[]) => void;
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
 * Hook for managing graph editor functionality.
 * Handles node dragging and canvas expansion.
 */
export function useGraphEditor({
  nodes,
  setNodes,
  isSimulating,
  steps,
  setSteps
}: UseGraphEditorProps): UseGraphEditorReturn {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Wrap setNodes to match Dispatch<SetStateAction<Node[]>> signature
  const setNodesDispatch = useCallback((value: Node[] | ((prev: Node[]) => Node[])) => {
    if (typeof value === 'function') {
      setNodes(value(nodes));
    } else {
      setNodes(value);
    }
  }, [nodes, setNodes]);

  // Wrap setSteps to match Dispatch<SetStateAction<DijkstraStep[]>> signature
  const setStepsDispatch = useCallback((value: DijkstraStep[] | ((prev: DijkstraStep[]) => DijkstraStep[])) => {
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

