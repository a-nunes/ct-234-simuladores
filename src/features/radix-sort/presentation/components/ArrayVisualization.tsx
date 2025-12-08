import React from 'react';
import { RadixSortStep } from '@features/radix-sort/domain/entities/RadixSortStep';

interface ArrayVisualizationProps {
  currentStep: RadixSortStep | null;
  originalArray: number[];
}

/**
 * Visualization component for the array in Radix Sort.
 * Shows elements with their current digit highlighted.
 */
export const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  currentStep,
  originalArray
}) => {
  const array = currentStep?.array ?? originalArray;
  const maxValue = Math.max(...array, 1);

  const getBarColor = (index: number): string => {
    if (!currentStep) return 'bg-blue-400';

    // Completed state
    if (currentStep.sortedIndices.includes(index)) {
      return 'bg-green-500';
    }

    // Current element being processed
    if (currentStep.currentElementIndex === index) {
      if (currentStep.type === 'distribute') {
        return 'bg-yellow-400 animate-pulse';
      }
      if (currentStep.type === 'collect') {
        return 'bg-purple-400 animate-pulse';
      }
    }

    return 'bg-blue-400';
  };

  const getDigitHighlight = (value: number): React.ReactNode => {
    if (!currentStep || !currentStep.currentDigitFactor) return null;
    
    const valueStr = value.toString().padStart(4, '0');
    const factor = currentStep.currentDigitFactor;
    const digitPosition = Math.log10(factor);
    const highlightIndex = valueStr.length - 1 - digitPosition;

    return (
      <span className="font-mono text-xs">
        {valueStr.split('').map((char, idx) => (
          <span
            key={idx}
            className={idx === highlightIndex ? 'bg-yellow-300 text-yellow-800 rounded px-0.5' : 'text-gray-400'}
          >
            {char}
          </span>
        ))}
      </span>
    );
  };

  const getPointerLabel = (index: number): string | null => {
    if (!currentStep) return null;
    const pointer = currentStep.pointers.find(p => p.index === index);
    return pointer?.label ?? null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Array Principal
        {currentStep?.currentDigitPosition && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            (Processando {currentStep.currentDigitPosition}º dígito)
          </span>
        )}
      </h3>

      {/* Array bars */}
      <div className="flex items-end justify-center gap-2 h-48 px-4">
        {array.map((value, index) => {
          const height = Math.max((value / maxValue) * 100, 15);
          const pointerLabel = getPointerLabel(index);

          return (
            <div key={index} className="flex flex-col items-center flex-1 max-w-20">
              {/* Pointer arrow */}
              {pointerLabel && (
                <div className="mb-1 text-sm text-blue-600 font-bold">
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

              {/* Digit highlight */}
              <div className="mt-1">
                {getDigitHighlight(value)}
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
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-gray-700 text-center">
          {currentStep.message}
        </div>
      )}
    </div>
  );
};
