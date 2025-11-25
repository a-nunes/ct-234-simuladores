import React from 'react';
import { BadCharTable } from '@features/boyer-moore/domain/entities/BoyerMooreConfig';

export interface BadCharTablePanelProps {
  text: string;
  pattern: string;
  badCharTable: BadCharTable;
}

/**
 * Panel displaying the Last Occurrence (L(x)) table for Bad Character heuristic.
 */
export const BadCharTablePanel: React.FC<BadCharTablePanelProps> = ({
  text,
  pattern,
  badCharTable
}) => {
  // Get all unique characters from text and pattern
  const allChars = Array.from(new Set(text.split('').concat(pattern.split(''))));

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <h3 className="font-semibold text-gray-800 mb-3">Tabela L(x) - Função de Última Ocorrência</h3>
      <div className="space-y-1 text-sm font-mono">
        {Object.keys(badCharTable).length > 0 ? (
          allChars.map((char) => {
            const pos = badCharTable[char] !== undefined ? badCharTable[char] : -1;
            return (
              <div key={char} className="flex justify-between">
                <span>L('{char}'):</span>
                <span className="font-semibold">{pos}</span>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Execute a simulação para ver a tabela</p>
        )}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-gray-700">
        <p className="font-semibold mb-1">Como usar L(x):</p>
        <p>• Se L(x) existe: deslocamento = max(1, j - L(x))</p>
        <p>• Se L(x) não existe: deslocamento = j + 1</p>
      </div>
    </div>
  );
};
