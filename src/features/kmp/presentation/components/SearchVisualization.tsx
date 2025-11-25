import React from 'react';
import { KMPStep, KMPSearchStep, isSearchStep } from '@features/kmp/domain/entities/KMPStep';

export interface SearchVisualizationProps {
  text: string;
  pattern: string;
  steps: KMPStep[];
  currentStepIndex: number;
  currentStep: KMPSearchStep;
}

/**
 * Visualization component for the search phase.
 * Shows the text with pattern alignments and comparison history.
 */
export const SearchVisualization: React.FC<SearchVisualizationProps> = ({
  text,
  pattern,
  steps,
  currentStepIndex,
  currentStep
}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 overflow-x-auto">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">P = {pattern}</p>
      </div>
      
      {/* Main text */}
      <div className="mb-8" style={{ minWidth: `${text.length * 40}px` }}>
        <div className="flex mb-1">
          {text.split('').map((_, idx) => (
            <div key={idx} style={{ width: '40px', minWidth: '40px' }} className="text-center text-xs text-gray-500 flex-shrink-0">
              {idx}
            </div>
          ))}
        </div>

        <div className="flex border-2 border-gray-400">
          {text.split('').map((char, idx) => {
            let bgColor = 'bg-white';
            
            if (currentStep.comparing && idx === currentStep.i) {
              bgColor = currentStep.match ? 'bg-green-100' : 'bg-red-100';
            }
            
            return (
              <div
                key={idx}
                style={{ width: '40px', height: '40px', minWidth: '40px' }}
                className={`flex items-center justify-center border border-gray-300 ${bgColor} font-mono flex-shrink-0`}
              >
                {char}
              </div>
            );
          })}
        </div>

        {/* Pointer i */}
        <div className="flex mt-1">
          {text.split('').map((_, idx) => (
            <div key={idx} style={{ width: '40px', minWidth: '40px' }} className="text-center text-xs font-semibold flex-shrink-0">
              {idx === currentStep.i && <span className="text-blue-600">↑ i</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Aligned patterns - ALL tested positions */}
      <div className="relative" style={{ minWidth: `${text.length * 40}px` }}>
        {(() => {
          // Group all comparisons by position
          const positionsMap = new Map<number, Array<{ index: number; stepNumber: number; match: boolean }>>();
          
          // Rebuild history of all positions up to current step
          for (let s = 0; s <= currentStepIndex; s++) {
            const step = steps[s];
            if (isSearchStep(step) && step.comparisons) {
              if (!positionsMap.has(step.position)) {
                positionsMap.set(step.position, []);
              }
              // Add new comparisons from this position
              step.comparisons.forEach(comp => {
                const existing = positionsMap.get(step.position)!;
                if (!existing.some(c => c.index === comp.index && c.stepNumber === comp.stepNumber)) {
                  existing.push(comp);
                }
              });
            }
          }
          
          // Sort positions
          const sortedPositions = Array.from(positionsMap.entries()).sort((a, b) => a[0] - b[0]);
          
          return sortedPositions.map(([position, comparisons], posIdx) => {
            const isCurrentPosition = position === currentStep.position;
            const verticalOffset = posIdx * 70; // Vertical spacing between rows
            
            return (
              <div key={position} className="absolute" style={{ top: `${verticalOffset}px`, left: 0, width: '100%' }}>
                {/* Comparison numbers above pattern */}
                <div 
                  className="flex absolute"
                  style={{ left: `${position * 40}px`, top: '-24px' }}
                >
                  {pattern.split('').map((_, idx) => {
                    const comparison = comparisons.find(c => c.index === idx);
                    return (
                      <div
                        key={idx}
                        style={{ width: '40px', minWidth: '40px' }}
                        className="text-center text-xs font-semibold flex-shrink-0"
                      >
                        {comparison ? (
                          <span className={comparison.match ? 'text-green-600' : 'text-red-600'}>
                            {comparison.stepNumber}
                          </span>
                        ) : ''}
                      </div>
                    );
                  })}
                </div>
                
                {/* Pattern */}
                <div 
                  className="flex absolute"
                  style={{ left: `${position * 40}px` }}
                >
                  {pattern.split('').map((char, idx) => {
                    let bgColor = 'bg-gray-100';
                    let textColor = 'text-gray-600';
                    let borderColor = 'border-gray-400';
                    let opacity = 'opacity-60';
                    
                    const hasComparison = comparisons.some(c => c.index === idx);
                    
                    if (hasComparison) {
                      const comparison = comparisons.find(c => c.index === idx);
                      if (comparison?.match) {
                        bgColor = 'bg-green-100';
                        textColor = 'text-green-800 font-semibold';
                        borderColor = 'border-green-400';
                      } else {
                        bgColor = 'bg-red-100';
                        textColor = 'text-red-600 font-semibold';
                        borderColor = 'border-red-400';
                      }
                    }
                    
                    // Highlight current position
                    if (isCurrentPosition) {
                      opacity = 'opacity-100';
                      if (idx < currentStep.j) {
                        bgColor = 'bg-green-100';
                        textColor = 'text-green-800 font-semibold';
                        borderColor = 'border-green-400';
                      } else if (currentStep.comparing && idx === currentStep.j) {
                        if (currentStep.match) {
                          bgColor = 'bg-green-100';
                          textColor = 'text-green-800 font-bold';
                          borderColor = 'border-green-500';
                        } else {
                          bgColor = 'bg-red-100';
                          textColor = 'text-red-600 font-bold';
                          borderColor = 'border-red-500';
                        }
                      }
                      
                      if (currentStep.found) {
                        bgColor = 'bg-green-200';
                        textColor = 'text-green-900 font-bold';
                        borderColor = 'border-green-600';
                      }
                    }
                    
                    return (
                      <div
                        key={idx}
                        style={{ width: '40px', height: '40px', minWidth: '40px' }}
                        className={`flex items-center justify-center border-2 ${borderColor} ${bgColor} ${textColor} ${opacity} font-mono flex-shrink-0`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                
                {/* Pointer j - only at current position */}
                {isCurrentPosition && (
                  <div 
                    className="flex absolute"
                    style={{ left: `${position * 40}px`, top: '44px' }}
                  >
                    {pattern.split('').map((_, idx) => (
                      <div key={idx} style={{ width: '40px', minWidth: '40px' }} className="text-center text-xs font-semibold flex-shrink-0">
                        {idx === currentStep.j && <span className="text-purple-600">↑ j</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          });
        })()}
        
        {/* Dynamic height based on number of positions */}
        <div style={{ height: `${Math.max(20, Array.from(new Set(
          steps.slice(0, currentStepIndex + 1)
            .filter(s => isSearchStep(s))
            .map(s => (s as KMPSearchStep).position)
        )).length * 70 + 20)}px` }}></div>
      </div>
    </div>
  );
};
