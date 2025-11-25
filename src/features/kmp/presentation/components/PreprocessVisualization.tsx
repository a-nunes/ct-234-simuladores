import React from 'react';
import { KMPPreprocessStep } from '@features/kmp/domain/entities/KMPStep';

export interface PreprocessVisualizationProps {
  pattern: string;
  currentStep: KMPPreprocessStep;
}

/**
 * Visualization component for the preprocessing phase (failure function calculation).
 */
export const PreprocessVisualization: React.FC<PreprocessVisualizationProps> = ({
  pattern,
  currentStep
}) => {
  return (
    <div className="border border-purple-300 rounded-lg p-6 bg-purple-50">
      <h3 className="font-semibold text-gray-800 mb-4">Cálculo da Função de Falha F[]</h3>
      
      {/* Pattern with indices */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Padrão P:</p>
        <div className="flex gap-1 mb-1">
          {pattern.split('').map((_, idx) => (
            <div key={idx} className="w-12 text-center text-xs text-gray-500">
              j={idx}
            </div>
          ))}
        </div>
        <div className="flex gap-1 mb-2">
          {pattern.split('').map((char, idx) => {
            let bgColor = 'bg-white';
            let textColor = 'text-gray-800';
            let borderColor = 'border-gray-300';
            
            if (currentStep.comparing) {
              if (idx === currentStep.i) {
                bgColor = currentStep.match === true ? 'bg-green-100' : currentStep.match === false ? 'bg-red-100' : 'bg-yellow-100';
                borderColor = 'border-blue-500';
                textColor = 'font-bold';
              } else if (idx === currentStep.j) {
                bgColor = currentStep.match === true ? 'bg-green-100' : currentStep.match === false ? 'bg-red-100' : 'bg-yellow-100';
                borderColor = 'border-purple-500';
                textColor = 'font-bold';
              }
            }
            
            return (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center border-2 ${borderColor} ${bgColor} ${textColor} font-mono text-lg`}
              >
                {char}
              </div>
            );
          })}
        </div>
        
        {/* Pointers */}
        <div className="flex gap-1">
          {pattern.split('').map((_, idx) => (
            <div key={idx} className="w-12 text-center text-xs font-semibold">
              {idx === currentStep.j && <span className="text-purple-600">↑ j</span>}
              {idx === currentStep.i && currentStep.i < pattern.length && <span className="text-blue-600">↑ i</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Failure table F[] */}
      <div className="bg-white rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Tabela F[] (Função de Falha):</p>
        <div className="flex gap-1 mb-1">
          {currentStep.failureTable.map((_, idx) => (
            <div key={idx} className="w-12 text-center text-xs text-gray-500">
              F[{idx}]
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {currentStep.failureTable.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center border-2 font-mono text-lg font-semibold ${
                val >= 0 ? 'bg-green-50 border-green-400 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            >
              {val >= 0 ? val : '-'}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded text-xs text-gray-700">
        <p className="font-semibold mb-1">Legenda:</p>
        <p>• <span className="text-purple-600 font-semibold">j</span>: ponteiro que percorre os prefixos</p>
        <p>• <span className="text-blue-600 font-semibold">i</span>: ponteiro que percorre os sufixos</p>
        <p>• F[k]: tamanho do maior prefixo de P[0..k] que é sufixo de P[1..k]</p>
      </div>
    </div>
  );
};
