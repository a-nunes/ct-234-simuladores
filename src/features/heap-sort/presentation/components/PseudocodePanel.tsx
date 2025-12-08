import React from 'react';
import { HEAP_SORT_PSEUDOCODE, BUILD_PSEUDOCODE } from '@features/heap-sort/data/stepGenerators/HeapSortStepGenerator';
import { HeapSortStep } from '@features/heap-sort/domain/entities/HeapSortStep';

interface PseudocodePanelProps {
  currentStep: HeapSortStep | null;
}

/**
 * Panel displaying the algorithm pseudocode with active line highlighting.
 */
export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({ currentStep }) => {
  const activeLine = currentStep?.pseudocodeLine;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Pseudocódigo</h3>
      
      <div className="space-y-3">
        {/* Heap Sort main */}
        <div className="font-mono text-xs bg-gray-900 rounded-lg p-3 overflow-x-auto">
          {HEAP_SORT_PSEUDOCODE.map((line, index) => {
            const lineNumber = index + 1;
            const isActive = activeLine === lineNumber && lineNumber <= 7;
            
            return (
              <div
                key={`main-${index}`}
                className={`flex transition-colors ${isActive ? 'bg-yellow-500/30' : ''}`}
              >
                <span className="text-gray-500 w-5 text-right pr-2 select-none">
                  {lineNumber}
                </span>
                <span className={`${isActive ? 'text-yellow-300' : 'text-gray-300'}`}>
                  {line}
                </span>
              </div>
            );
          })}
        </div>

        {/* Build function */}
        <div className="font-mono text-xs bg-gray-800 rounded-lg p-3 overflow-x-auto">
          <div className="text-gray-400 mb-1">// Construção do Heap</div>
          {BUILD_PSEUDOCODE.map((line, index) => (
            <div key={`build-${index}`} className="flex">
              <span className="text-gray-500 w-5 text-right pr-2 select-none">
                {index + 1}
              </span>
              <span className="text-gray-300">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
