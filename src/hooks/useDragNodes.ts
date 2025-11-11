import { useState, useCallback } from 'react';

interface Node {
  id: number;
  x: number;
  y: number;
  [key: string]: any;
}

interface SimulationStep {
  nodes: Node[];
  [key: string]: any;
}

export const useDragNodes = <N extends Node, S extends SimulationStep>(
  nodes: N[],
  setNodes: React.Dispatch<React.SetStateAction<N[]>>,
  isSimulating: boolean,
  steps: S[],
  setSteps: React.Dispatch<React.SetStateAction<S[]>>
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleNodeMouseDown = useCallback((nodeId: number, event: React.MouseEvent<SVGGElement>) => {
    event.preventDefault();
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const svgX = (event.clientX - rect.left) * scaleX;
    const svgY = (event.clientY - rect.top) * scaleY;

    setIsDragging(true);
    setDraggedNodeId(nodeId);
    setDragOffset({
      x: svgX - node.x,
      y: svgY - node.y
    });
  }, [nodes]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || draggedNodeId === null) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;

    const svgX = (event.clientX - rect.left) * scaleX;
    const svgY = (event.clientY - rect.top) * scaleY;

    const newX = svgX - dragOffset.x;
    const newY = svgY - dragOffset.y;

    // Atualiza a posição do nó
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === draggedNodeId 
          ? { ...node, x: newX, y: newY } as N
          : node
      )
    );

    // Atualiza também nos steps se estiver simulando
    if (isSimulating && steps.length > 0) {
      setSteps(prevSteps =>
        prevSteps.map(step => ({
          ...step,
          nodes: step.nodes.map(node =>
            node.id === draggedNodeId
              ? { ...node, x: newX, y: newY }
              : node
          )
        })) as S[]
      );
    }
  }, [isDragging, draggedNodeId, dragOffset, isSimulating, steps, setNodes, setSteps]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedNodeId(null);
  }, []);

  return {
    isDragging,
    handleNodeMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
