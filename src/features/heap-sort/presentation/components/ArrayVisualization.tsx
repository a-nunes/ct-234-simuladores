import React from 'react';
import { HeapSortStep } from '@features/heap-sort/domain/entities/HeapSortStep';

interface ArrayVisualizationProps {
  currentStep: HeapSortStep | null;
  originalArray: number[];
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
}

/**
 * Visualization component for the heap array.
 * Shows bars with heights proportional to values.
 */
export const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  currentStep,
  originalArray,
  hoveredIndex,
  onHover
}) => {
  const array = currentStep?.array ?? originalArray;
  const heapSize = currentStep?.heapSize ?? array.length;
  const maxValue = Math.max(...array, 1);

  const getBarColor = (index: number): string => {
    if (!currentStep) return 'bg-blue-400';

    // Sorted elements (outside heap)
    if (currentStep.sortedIndices.includes(index)) {
      return 'bg-green-500';
    }

    // Swapping elements
    if (currentStep.swapping?.includes(index)) {
      return 'bg-yellow-400 animate-pulse';
    }

    // Highlighted path (sift path)
    if (currentStep.highlightPath.includes(index)) {
      if (index === currentStep.currentIndex) {
        return 'bg-red-500';
      }
      if (index === currentStep.largerChild) {
        return 'bg-orange-400';
      }
      return 'bg-purple-400';
    }

    // Hovered from tree
    if (hoveredIndex === index) {
      return 'bg-indigo-400';
    }

    // Outside heap (being extracted)
    if (index >= heapSize) {
      return 'bg-gray-300';
    }

    return 'bg-blue-400';
  };

  const getPointerLabel = (index: number): string | null => {
    if (!currentStep) return null;
    const pointer = currentStep.pointers.find(p => p.index === index);
    return pointer?.label ?? null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Representação em Vetor
        {currentStep && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            (Heap size: {heapSize})
          </span>
        )}
      </h3>
      
      <div className="flex items-end justify-center gap-1 h-32">
        {array.map((value, index) => {
          const height = Math.max((value / maxValue) * 100, 15);
          const pointerLabel = getPointerLabel(index);
          const isOutsideHeap = currentStep && index >= heapSize;
          
          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 max-w-12"
              onMouseEnter={() => onHover(index)}
              onMouseLeave={() => onHover(null)}
            >
              {/* Pointer arrow */}
              {pointerLabel && (
                <div className="mb-1 text-xs font-bold text-red-600">
                  ↓{pointerLabel}
                </div>
              )}
              
              {/* Bar */}
              <div
                className={`w-full rounded-t transition-all duration-300 flex items-end justify-center cursor-pointer
                  ${getBarColor(index)} ${isOutsideHeap ? 'opacity-60' : ''}`}
                style={{ height: `${height}%` }}
              >
                <span className="text-white text-xs font-bold pb-0.5 drop-shadow">
                  {value}
                </span>
              </div>
              
              {/* Index label */}
              <div className={`text-xs mt-1 ${isOutsideHeap ? 'text-gray-400' : 'text-gray-600'}`}>
                {index}
              </div>
            </div>
          );
        })}
      </div>

      {/* Heap boundary indicator */}
      {currentStep && heapSize < array.length && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          ← Heap ({heapSize} elementos) | Ordenado ({array.length - heapSize}) →
        </div>
      )}
    </div>
  );
};
