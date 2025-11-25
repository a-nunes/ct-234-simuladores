import React from 'react';
import { BoyerMooreStep } from '@features/boyer-moore/domain/entities/BoyerMooreStep';

export interface TextVisualizationProps {
  text: string;
  pattern: string;
  steps: BoyerMooreStep[];
  currentStepIndex: number;
}

/**
 * Visualization of the text and pattern alignment during the algorithm execution.
 */
export const TextVisualization: React.FC<TextVisualizationProps> = ({
  text,
  pattern,
  steps,
  currentStepIndex
}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 overflow-x-auto">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">P = {pattern}</p>
      </div>

      {/* Main text */}
      <div className="mb-8" style={{ minWidth: `${text.length * 40}px` }}>
        {/* Index line */}
        <div className="flex mb-1">
          {text.split('').map((_, idx) => (
            <div
              key={idx}
              style={{ width: '40px', minWidth: '40px' }}
              className="text-center text-xs text-gray-500 flex-shrink-0"
            >
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Text characters line */}
        <div className="flex border-2 border-gray-400">
          {text.split('').map((char, idx) => (
            <div
              key={idx}
              style={{ width: '40px', height: '40px', minWidth: '40px' }}
              className="flex items-center justify-center border border-gray-300 bg-white font-mono flex-shrink-0"
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* Steps visualization */}
      <div className="space-y-4" style={{ minWidth: `${text.length * 40}px` }}>
        {steps.slice(0, currentStepIndex + 1).map((step, stepIdx) => (
          <div key={stepIdx} className="relative">
            {/* Step numbers for current step only */}
            {stepIdx === currentStepIndex && (
              <div
                className="flex absolute"
                style={{ left: `${step.position * 40}px`, top: '-20px' }}
              >
                {pattern.split('').map((_, idx) => {
                  const comparison = step.comparisons.find(c => c.index === idx);
                  return (
                    <div
                      key={idx}
                      style={{ width: '40px', minWidth: '40px' }}
                      className="text-center text-xs text-blue-600 font-semibold flex-shrink-0"
                    >
                      {comparison ? comparison.stepNumber : ""}
                    </div>
                  );
                })}
              </div>
            )}

            <div
              className={`flex absolute ${stepIdx === currentStepIndex ? 'ring-2 ring-blue-500' : ''}`}
              style={{ left: `${step.position * 40}px` }}
            >
              {pattern.split('').map((char, idx) => {
                const comparison = step.comparisons.find(c => c.index === idx);
                let bgColor = 'bg-gray-100';
                let textColor = 'text-gray-400';

                if (comparison) {
                  if (comparison.match) {
                    bgColor = 'bg-green-100';
                    textColor = 'text-green-800 font-semibold';
                  } else {
                    bgColor = 'bg-red-100';
                    textColor = 'text-red-600 font-bold';
                  }
                }

                return (
                  <div
                    key={idx}
                    style={{ width: '40px', height: '40px', minWidth: '40px' }}
                    className={`flex items-center justify-center border-2 flex-shrink-0 ${
                      stepIdx === currentStepIndex ? 'border-blue-500' : 'border-gray-400'
                    } ${bgColor} ${textColor} font-mono`}
                  >
                    {char}
                  </div>
                );
              })}
            </div>

            <div className="h-10 mb-1"></div>

            <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
              <span className={`font-medium ${stepIdx === currentStepIndex ? 'text-blue-600 font-bold' : ''}`}>
                {stepIdx + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
