import React from 'react';
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';

export interface CallStackPanelProps {
  currentStep: BinarySearchStep | null;
}

/**
 * Component for displaying the call stack.
 * Pure presentation component.
 */
export const CallStackPanel: React.FC<CallStackPanelProps> = ({ currentStep }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pilha de Chamadas</h2>

      {currentStep && currentStep.callStack.length > 0 ? (
        <div className="space-y-2">
          {currentStep.callStack.map((call, index) => (
            <div
              key={index}
              className="p-2 bg-gray-50 rounded border-l-4 border-blue-500 font-mono text-xs"
            >
              {call}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">A pilha de chamadas aparecerá aqui</p>
      )}
    </div>
  );
};

