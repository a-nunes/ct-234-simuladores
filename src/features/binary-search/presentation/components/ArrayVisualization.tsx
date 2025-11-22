import React from 'react';
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';

export interface ArrayVisualizationProps {
  array: number[];
  currentStep: BinarySearchStep | null;
}

/**
 * Component for visualizing the array with step-based highlighting.
 * Pure presentation component with no business logic.
 */
export const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  array,
  currentStep
}) => {
  const getCellStyle = (index: number): string => {
    if (!currentStep) return 'bg-white border-gray-300';

    const { l, r, q, type } = currentStep;

    // Valor encontrado
    if (type === 'found' && q === index) {
      return 'bg-green-500 border-green-600 text-white scale-110 shadow-lg';
    }

    // Pivô atual
    if (
      q === index &&
      (type === 'calculate_pivot' ||
        type === 'compare' ||
        type === 'go_left' ||
        type === 'go_right')
    ) {
      return 'bg-yellow-300 border-yellow-500 ring-2 ring-yellow-400';
    }

    // Dentro do intervalo ativo
    if (index >= l && index <= r && type !== 'not_found') {
      return 'bg-blue-100 border-blue-400';
    }

    // Fora do intervalo (esmaecido)
    return 'bg-gray-100 border-gray-300 opacity-40';
  };

  const getPointerLabel = (index: number): string[] => {
    if (!currentStep) return [];

    const labels: string[] = [];
    const { l, r, q } = currentStep;

    if (l === index) labels.push('L');
    if (r === index) labels.push('R');
    if (q === index) labels.push('Q');

    return labels;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Visualização do Array</h2>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {array.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Ponteiros */}
            <div className="h-6 flex gap-1 mb-1">
              {getPointerLabel(index).map((label, i) => (
                <span
                  key={i}
                  className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                    label === 'Q'
                      ? 'bg-yellow-500 text-white'
                      : label === 'L'
                      ? 'bg-blue-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Célula do array */}
            <div
              className={`w-16 h-16 flex flex-col items-center justify-center border-2 rounded-lg transition-all duration-300 ${getCellStyle(
                index
              )}`}
            >
              <div className="text-lg font-bold">{value}</div>
              <div className="text-xs text-gray-500 mt-1">[{index}]</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem do passo atual */}
      {currentStep && (
        <div
          className={`p-4 rounded-lg ${
            currentStep.type === 'found'
              ? 'bg-green-100 border border-green-300'
              : currentStep.type === 'not_found'
              ? 'bg-red-100 border border-red-300'
              : 'bg-blue-100 border border-blue-300'
          }`}
        >
          <p className="text-sm font-medium text-gray-800">{currentStep.message}</p>
        </div>
      )}
    </div>
  );
};

