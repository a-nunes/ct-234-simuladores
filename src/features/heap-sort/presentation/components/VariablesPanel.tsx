import React from 'react';
import { HeapSortStep } from '@features/heap-sort/domain/entities/HeapSortStep';

interface VariablesPanelProps {
  currentStep: HeapSortStep | null;
}

/**
 * Panel displaying current algorithm variables (HUD).
 */
export const VariablesPanel: React.FC<VariablesPanelProps> = ({ currentStep }) => {
  if (!currentStep) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Variáveis</h3>
        <p className="text-gray-500 text-sm">Inicie a simulação para ver as variáveis</p>
      </div>
    );
  }

  const variables = currentStep.variables;
  const entries = Object.entries(variables);

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Variáveis</h3>
      
      {entries.length === 0 ? (
        <p className="text-gray-500 text-sm">Sem variáveis neste passo</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {entries.map(([name, value]) => (
            <div
              key={name}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
            >
              <span className="font-mono text-sm text-gray-600">{name}</span>
              <span className="font-mono font-bold text-green-600">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Message */}
      {currentStep && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-sm text-gray-700">
          {currentStep.message}
        </div>
      )}
    </div>
  );
};
