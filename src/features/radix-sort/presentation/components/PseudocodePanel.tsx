import React from 'react';
import { RADIX_SORT_PSEUDOCODE } from '@features/radix-sort/data/stepGenerators/RadixSortStepGenerator';

interface PseudocodePanelProps {
  activeLine?: number;
}

/**
 * Panel displaying the Radix Sort pseudocode with active line highlighting.
 */
export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({
  activeLine
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Pseudocódigo</h3>

      <div className="font-mono text-sm bg-gray-900 rounded-lg p-4 overflow-x-auto">
        {RADIX_SORT_PSEUDOCODE.map((line, index) => {
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
