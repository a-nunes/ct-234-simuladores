import React from 'react';
import { DivideConquerSortStep } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';

interface ArrayVisualizationProps {
  currentStep: DivideConquerSortStep | null;
  originalArray: number[];
}

/**
 * Visualization component for the divide and conquer sorting array.
 * Displays bars with heights proportional to values.
 * Shows segments, pointers, comparisons, and sorted regions.
 */
export const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  currentStep,
  originalArray
}) => {
  const array = currentStep?.array ?? originalArray;
  const maxValue = Math.max(...array, 1);

  const getBarColor = (index: number): string => {
    if (!currentStep) return 'bg-indigo-400';

    // Sorted elements
    if (currentStep.sortedIndices.includes(index)) {
      return 'bg-green-500';
    }

    // Pivot element
    if (currentStep.pivotIndex === index) {
      return 'bg-purple-500';
    }

    // Swapping elements
    if (currentStep.swapping?.includes(index)) {
      return 'bg-yellow-400 animate-pulse';
    }

    // Comparing elements
    if (currentStep.comparing?.includes(index)) {
      return 'bg-red-400';
    }

    // Check if in a segment
    const segment = currentStep.segments.find(s => index >= s.start && index <= s.end);
    if (segment) {
      switch (segment.type) {
        case 'left':
          return 'bg-blue-400';
        case 'right':
          return 'bg-orange-400';
        case 'merged':
          return 'bg-teal-400';
        case 'current':
          return 'bg-indigo-400';
      }
    }

    return 'bg-gray-300';
  };

  const getPointerLabel = (index: number): string | null => {
    if (!currentStep) return null;
    const pointer = currentStep.pointers.find(p => p.index === index);
    return pointer?.label ?? null;
  };

  const getPointerColor = (index: number): string => {
    if (!currentStep) return 'text-gray-600';
    const pointer = currentStep.pointers.find(p => p.index === index);
    if (!pointer) return 'text-gray-600';

    switch (pointer.type) {
      case 'primary':
        return 'text-blue-600 font-bold';
      case 'secondary':
        return 'text-orange-600 font-bold';
      case 'pivot':
        return 'text-purple-600 font-bold';
      case 'left':
        return 'text-blue-600 font-bold';
      case 'right':
        return 'text-orange-600 font-bold';
      case 'mid':
        return 'text-teal-600 font-bold';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Visualização do Array</h3>
      
      {/* Auxiliary array (for Merge Sort) */}
      {currentStep?.auxiliaryArray && currentStep.auxiliaryArray.some(v => v !== undefined) && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <span className="text-sm text-gray-600 font-medium">Vetor Auxiliar: </span>
          <span className="font-mono text-indigo-600">
            [{currentStep.auxiliaryArray.filter(v => v !== undefined).join(', ')}]
          </span>
        </div>
      )}

      {/* Array bars */}
      <div className="flex items-end justify-center gap-2 h-64 px-4">
        {array.map((value, index) => {
          const height = Math.max((value / maxValue) * 100, 10);
          const pointerLabel = getPointerLabel(index);
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 max-w-16">
              {/* Pointer arrow */}
              {pointerLabel && (
                <div className={`mb-1 text-sm ${getPointerColor(index)}`}>
                  ↓ {pointerLabel}
                </div>
              )}
              
              {/* Bar */}
              <div
                className={`w-full rounded-t-lg transition-all duration-300 flex items-end justify-center ${getBarColor(index)}`}
                style={{ height: `${height}%` }}
              >
                <span className="text-white text-sm font-bold pb-1 drop-shadow">
                  {value}
                </span>
              </div>
              
              {/* Index label */}
              <div className="text-xs text-gray-500 mt-1">
                [{index}]
              </div>
            </div>
          );
        })}
      </div>

      {/* Message */}
      {currentStep && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-gray-700">{currentStep.message}</p>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-indigo-400 rounded"></div>
          <span>Atual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <span>Esquerda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <span>Direita</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Pivô</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span>Comparando</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span>Trocando</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Ordenado</span>
        </div>
      </div>
    </div>
  );
};
