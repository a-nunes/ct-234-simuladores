import React from 'react';
import { DivideConquerAlgorithm } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';
import { MERGE_SORT_PSEUDOCODE } from '@features/divide-conquer-sort/data/stepGenerators/MergeSortStepGenerator';
import { QUICK_SORT_PSEUDOCODE } from '@features/divide-conquer-sort/data/stepGenerators/QuickSortStepGenerator';

interface PseudocodePanelProps {
  algorithm: DivideConquerAlgorithm;
  activeLine?: number;
}

const PSEUDOCODE_MAP: Record<DivideConquerAlgorithm, string[]> = {
  merge: MERGE_SORT_PSEUDOCODE,
  quick: QUICK_SORT_PSEUDOCODE
};

/**
 * Panel displaying the algorithm pseudocode with active line highlighting.
 */
export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({
  algorithm,
  activeLine
}) => {
  const pseudocode = PSEUDOCODE_MAP[algorithm];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Pseudocódigo</h3>
      
      <div className="font-mono text-xs bg-gray-900 rounded-lg p-4 overflow-x-auto max-h-80 overflow-y-auto">
        {pseudocode.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeLine === lineNumber;
          
          return (
            <div
              key={index}
              className={`flex transition-colors ${
                isActive ? 'bg-yellow-500/30' : ''
              }`}
            >
              <span className="text-gray-500 w-6 text-right pr-2 select-none flex-shrink-0">
                {lineNumber}
              </span>
              <span className={`${isActive ? 'text-yellow-300' : 'text-gray-300'} whitespace-pre`}>
                {line || ' '}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
