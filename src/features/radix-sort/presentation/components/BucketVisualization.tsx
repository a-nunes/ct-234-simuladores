import React from 'react';
import { Bucket } from '@features/radix-sort/domain/entities/RadixSortStep';

interface BucketVisualizationProps {
  buckets: Bucket[];
  highlightedBucket?: number;
  currentElement?: number;
  phase: 'distribute' | 'collect' | 'idle';
}

/**
 * Visualization component for the Radix Sort buckets (queues).
 * Shows numbered buckets 0-9 with elements inside.
 */
export const BucketVisualization: React.FC<BucketVisualizationProps> = ({
  buckets,
  highlightedBucket,
  currentElement,
  phase
}) => {
  const getBucketColor = (digit: number): string => {
    if (highlightedBucket === digit) {
      if (phase === 'distribute') {
        return 'border-yellow-500 bg-yellow-50';
      }
      if (phase === 'collect') {
        return 'border-purple-500 bg-purple-50';
      }
    }
    return 'border-gray-300 bg-gray-50';
  };

  const getHeaderColor = (digit: number): string => {
    if (highlightedBucket === digit) {
      if (phase === 'distribute') {
        return 'bg-yellow-500 text-white';
      }
      if (phase === 'collect') {
        return 'bg-purple-500 text-white';
      }
    }
    return 'bg-gray-200 text-gray-700';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Baldes (Queues)
        {phase === 'distribute' && (
          <span className="ml-2 text-sm font-normal text-yellow-600">← Distribuindo</span>
        )}
        {phase === 'collect' && (
          <span className="ml-2 text-sm font-normal text-purple-600">→ Coletando</span>
        )}
      </h3>

      <div className="grid grid-cols-5 gap-3">
        {buckets.map((bucket) => (
          <div
            key={bucket.digit}
            className={`border-2 rounded-lg transition-all duration-300 ${getBucketColor(bucket.digit)}`}
          >
            {/* Bucket header (digit label) */}
            <div
              className={`text-center font-bold py-1 rounded-t transition-colors ${getHeaderColor(bucket.digit)}`}
            >
              {bucket.digit}
            </div>

            {/* Bucket content (elements) */}
            <div className="min-h-[80px] p-2 flex flex-col gap-1">
              {bucket.elements.length === 0 ? (
                <div className="text-gray-400 text-xs text-center mt-2">vazio</div>
              ) : (
                bucket.elements.map((element, idx) => (
                  <div
                    key={`${element}-${idx}`}
                    className={`text-center py-1 px-2 rounded text-sm font-mono transition-all ${
                      highlightedBucket === bucket.digit && 
                      currentElement === element &&
                      idx === bucket.elements.length - 1 &&
                      phase === 'distribute'
                        ? 'bg-yellow-400 text-yellow-900 animate-pulse'
                        : highlightedBucket === bucket.digit && 
                          currentElement === element &&
                          idx === 0 &&
                          phase === 'collect'
                          ? 'bg-purple-400 text-purple-900 animate-pulse'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {element}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-gray-600">Distribuindo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-400 rounded"></div>
          <span className="text-gray-600">Coletando</span>
        </div>
      </div>
    </div>
  );
};
