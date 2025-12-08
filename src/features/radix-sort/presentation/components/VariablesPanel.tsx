import React from 'react';
import { RadixSortStep } from '@features/radix-sort/domain/entities/RadixSortStep';

interface VariablesPanelProps {
  currentStep: RadixSortStep | null;
}

/**
 * Panel displaying current algorithm variables (HUD).
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
              <span className="font-mono font-bold text-cyan-600">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Current digit info */}
      {currentStep.currentDigitPosition && (
        <div className="mt-4 p-3 bg-cyan-50 rounded-lg border border-cyan-200">
          <div className="text-sm text-cyan-700">
            <strong>Dígito atual:</strong> Posição {currentStep.currentDigitPosition}
            {currentStep.currentDigitFactor && (
              <span className="ml-2">(fator = {currentStep.currentDigitFactor})</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
