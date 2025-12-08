import React from 'react';
import { DivideConquerSortStep } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';

interface VariablesPanelProps {
  currentStep: DivideConquerSortStep | null;
}

/**
 * Panel displaying current algorithm variables (HUD - Heads Up Display).
 * Shows variables like i, j, m, pivot, l, r with flash animation on change.
 */
export const VariablesPanel: React.FC<VariablesPanelProps> = ({ currentStep }) => {
  if (!currentStep) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Variáveis</h3>
        <p className="text-gray-500">Inicie a simulação para ver as variáveis</p>
      </div>
    );
  }

  const variables = currentStep.variables;
  const entries = Object.entries(variables);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Variáveis</h3>
      
      {entries.length === 0 ? (
        <p className="text-gray-500">Sem variáveis neste passo</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {entries.map(([name, value]) => (
            <div
              key={name}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="font-mono text-gray-600">{name}</span>
              <span className="font-mono font-bold text-indigo-600">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
