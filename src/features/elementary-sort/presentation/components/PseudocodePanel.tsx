import React from 'react';
import { SortAlgorithm } from '@features/elementary-sort/domain/entities/ElementarySortStep';
import { BUBBLE_SORT_PSEUDOCODE } from '@features/elementary-sort/data/stepGenerators/BubbleSortStepGenerator';
import { SELECTION_SORT_PSEUDOCODE } from '@features/elementary-sort/data/stepGenerators/SelectionSortStepGenerator';
import { INSERTION_SORT_PSEUDOCODE } from '@features/elementary-sort/data/stepGenerators/InsertionSortStepGenerator';

interface PseudocodePanelProps {
  algorithm: SortAlgorithm;
  activeLine?: number;
}

const PSEUDOCODE_MAP: Record<SortAlgorithm, string[]> = {
  bubble: BUBBLE_SORT_PSEUDOCODE,
  selection: SELECTION_SORT_PSEUDOCODE,
  insertion: INSERTION_SORT_PSEUDOCODE
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
      
      <div className="font-mono text-sm bg-gray-900 rounded-lg p-4 overflow-x-auto">
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
              <span className="text-gray-500 w-8 text-right pr-3 select-none">
                {lineNumber}
              </span>
              <span className={`${isActive ? 'text-yellow-300' : 'text-gray-300'}`}>
                {line}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
