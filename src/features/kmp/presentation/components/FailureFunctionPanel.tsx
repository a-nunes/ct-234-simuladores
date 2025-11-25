import React from 'react';

export interface FailureFunctionPanelProps {
  pattern: string;
  failureTable: number[];
}

/**
 * Panel displaying the failure function table.
 * Shows the pattern characters aligned with their F[] values.
 */
export const FailureFunctionPanel: React.FC<FailureFunctionPanelProps> = ({
  pattern,
  failureTable
}) => {
  if (failureTable.length === 0) {
    return null;
  }

  return (
    <div className="border border-purple-300 rounded-lg p-4 bg-purple-50">
      <h3 className="font-semibold text-gray-800 mb-3">Tabela F[] - Função de Falha</h3>
      <div className="bg-white rounded-lg p-3">
        <div className="flex gap-1 mb-1">
          {failureTable.map((_, idx) => (
            <div key={idx} className="w-12 text-center text-xs text-gray-500">
              j={idx}
            </div>
          ))}
        </div>
        <div className="flex gap-1 mb-1">
          {pattern.split('').map((char, idx) => (
            <div key={idx} className="w-12 h-10 flex items-center justify-center border border-gray-300 bg-gray-50 font-mono text-sm">
              {char}
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {failureTable.map((val, idx) => (
            <div
              key={idx}
              className="w-12 h-10 flex items-center justify-center border-2 border-purple-400 bg-purple-100 font-mono text-sm font-semibold text-purple-700"
            >
              {val}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 p-3 bg-white rounded text-xs text-gray-700">
        <p className="font-semibold mb-1">Como usar F[]:</p>
        <p>• Se P[j] ≠ T[i] e j {'>'} 0: j = F[j-1] (usa a função de falha)</p>
        <p>• Se P[j] ≠ T[i] e j = 0: i++ (avança só o texto)</p>
      </div>
    </div>
  );
};
