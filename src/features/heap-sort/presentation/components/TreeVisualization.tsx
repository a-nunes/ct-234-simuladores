import React from 'react';
import { HeapSortStep } from '@features/heap-sort/domain/entities/HeapSortStep';
import { getLeftChild, getRightChild } from '@features/heap-sort/data/algorithms/HeapAlgorithm';

interface TreeVisualizationProps {
  currentStep: HeapSortStep | null;
  originalArray: number[];
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
}

/**
 * Binary tree visualization component for the heap.
 * Shows nodes connected by edges with SVG.
 */
export const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  currentStep,
  originalArray,
  hoveredIndex,
  onHover
}) => {
  const array = currentStep?.array ?? originalArray;
  const heapSize = currentStep?.heapSize ?? array.length;

  // Calculate tree dimensions
  const depth = Math.ceil(Math.log2(array.length + 1));
  const nodeRadius = 22;
  const levelHeight = 70;
  const width = Math.pow(2, depth) * (nodeRadius * 2 + 10);
  const height = depth * levelHeight + nodeRadius * 2 + 20;

  // Calculate node positions
  const getNodePosition = (index: number): { x: number; y: number } => {
    const level = Math.floor(Math.log2(index + 1));
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const levelWidth = width / nodesInLevel;
    
    return {
      x: levelWidth * (positionInLevel + 0.5),
      y: level * levelHeight + nodeRadius + 10
    };
  };

  const getNodeColor = (index: number): string => {
    if (!currentStep) return '#60a5fa'; // blue-400

    // Sorted (outside heap)
    if (currentStep.sortedIndices.includes(index)) {
      return '#22c55e'; // green-500
    }

    // Swapping
    if (currentStep.swapping?.includes(index)) {
      return '#facc15'; // yellow-400
    }

    // Current node being sifted
    if (index === currentStep.currentIndex) {
      return '#ef4444'; // red-500
    }

    // Larger child
    if (index === currentStep.largerChild) {
      return '#f97316'; // orange-500
    }

    // In highlight path
    if (currentStep.highlightPath.includes(index)) {
      return '#a855f7'; // purple-500
    }

    // Hovered from array
    if (hoveredIndex === index) {
      return '#818cf8'; // indigo-400
    }

    // Outside heap
    if (index >= heapSize) {
      return '#d1d5db'; // gray-300
    }

    return '#60a5fa'; // blue-400
  };

  const getEdgeColor = (parentIndex: number, childIndex: number): string => {
    if (!currentStep) return '#94a3b8'; // slate-400

    // If both are in highlight path
    if (
      currentStep.highlightPath.includes(parentIndex) &&
      currentStep.highlightPath.includes(childIndex)
    ) {
      return '#f97316'; // orange-500
    }

    // If child is outside heap
    if (childIndex >= heapSize) {
      return '#d1d5db'; // gray-300
    }

    return '#94a3b8'; // slate-400
  };

  // Generate edges
  const edges: React.ReactElement[] = [];
  for (let i = 0; i < array.length; i++) {
    const parentPos = getNodePosition(i);
    const leftIndex = getLeftChild(i);
    const rightIndex = getRightChild(i);

    if (leftIndex < array.length) {
      const leftPos = getNodePosition(leftIndex);
      edges.push(
        <line
          key={`edge-${i}-${leftIndex}`}
          x1={parentPos.x}
          y1={parentPos.y}
          x2={leftPos.x}
          y2={leftPos.y}
          stroke={getEdgeColor(i, leftIndex)}
          strokeWidth={2}
        />
      );
    }

    if (rightIndex < array.length) {
      const rightPos = getNodePosition(rightIndex);
      edges.push(
        <line
          key={`edge-${i}-${rightIndex}`}
          x1={parentPos.x}
          y1={parentPos.y}
          x2={rightPos.x}
          y2={rightPos.y}
          stroke={getEdgeColor(i, rightIndex)}
          strokeWidth={2}
        />
      );
    }
  }

  // Generate nodes
  const nodes: React.ReactElement[] = [];
  for (let i = 0; i < array.length; i++) {
    const pos = getNodePosition(i);
    const isOutsideHeap = currentStep && i >= heapSize;
    const pointerLabel = currentStep?.pointers.find(p => p.index === i)?.label;

    nodes.push(
      <g
        key={`node-${i}`}
        onMouseEnter={() => onHover(i)}
        onMouseLeave={() => onHover(null)}
        style={{ cursor: 'pointer' }}
      >
        {/* Node circle */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r={nodeRadius}
          fill={getNodeColor(i)}
          stroke={hoveredIndex === i ? '#3730a3' : 'white'}
          strokeWidth={hoveredIndex === i ? 3 : 2}
          opacity={isOutsideHeap ? 0.5 : 1}
          className="transition-all duration-300"
        />
        {/* Value */}
        <text
          x={pos.x}
          y={pos.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {array[i]}
        </text>
        {/* Index label below */}
        <text
          x={pos.x}
          y={pos.y + nodeRadius + 12}
          textAnchor="middle"
          fill={isOutsideHeap ? '#9ca3af' : '#6b7280'}
          fontSize="10"
        >
          [{i}]
        </text>
        {/* Pointer label above */}
        {pointerLabel && (
          <text
            x={pos.x}
            y={pos.y - nodeRadius - 5}
            textAnchor="middle"
            fill="#dc2626"
            fontSize="12"
            fontWeight="bold"
          >
            {pointerLabel}
          </text>
        )}
      </g>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Representação em Árvore
        {currentStep && (
          <span className={`text-sm font-normal ml-2 px-2 py-0.5 rounded ${
            currentStep.phase === 'build' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {currentStep.phase === 'build' ? 'Build' : 'Extração'}
          </span>
        )}
      </h3>
      
      <div className="overflow-x-auto">
        <svg
          width={Math.max(width, 300)}
          height={height}
          className="mx-auto"
        >
          {/* Edges first (behind nodes) */}
          {edges}
          {/* Nodes on top */}
          {nodes}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-3 text-xs justify-center">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <span>No Heap</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Atual</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Maior Filho</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span>Trocando</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Ordenado</span>
        </div>
      </div>
    </div>
  );
};
