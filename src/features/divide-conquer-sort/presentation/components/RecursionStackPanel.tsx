import React from 'react';
import { DivideConquerSortStep } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';

interface RecursionStackPanelProps {
  currentStep: DivideConquerSortStep | null;
}

/**
 * Panel displaying the recursion call stack.
 * Shows the depth of recursion and current call hierarchy.
 */
export const RecursionStackPanel: React.FC<RecursionStackPanelProps> = ({ currentStep }) => {
  if (!currentStep) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Pilha de Recursão</h3>
        <p className="text-gray-500">Inicie a simulação para ver a pilha de recursão</p>
      </div>
    );
  }

  const stack = currentStep.recursionStack;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Pilha de Recursão</h3>
      
      {stack.length === 0 ? (
        <p className="text-gray-500">Pilha vazia</p>
      ) : (
        <div className="space-y-2">
          {stack.map((level, index) => {
            const isCurrentLevel = index === stack.length - 1;
            const indentation = level.depth * 16;
            
            return (
              <div
                key={index}
                className={`flex items-center p-2 rounded-lg transition-all ${
                  isCurrentLevel
                    ? 'bg-indigo-100 border-2 border-indigo-400'
                    : 'bg-gray-50 border border-gray-200'
                }`}
                style={{ marginLeft: `${indentation}px` }}
              >
                <div className="flex-1">
                  <span className={`font-mono text-sm ${isCurrentLevel ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>
                    {level.description}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  isCurrentLevel ? 'bg-indigo-200 text-indigo-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  Nível {level.depth}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {currentStep.currentRecursionDepth > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Profundidade atual:</span>
            <span className="font-bold text-indigo-600">{currentStep.currentRecursionDepth}</span>
          </div>
        </div>
      )}
    </div>
  );
};
