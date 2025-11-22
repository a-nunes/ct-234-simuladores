import React from 'react';
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';

export interface StatePanelProps {
  currentStep: BinarySearchStep | null;
  searchValue: number;
}

/**
 * Component for displaying the current state (L, R, Q, v[q]).
 * Pure presentation component.
 */
export const StatePanel: React.FC<StatePanelProps> = ({
  currentStep,
  searchValue
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Estado Atual</h2>

      {currentStep ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-600">Valor buscado (x):</span>
            <span className="text-sm font-bold text-blue-600">{searchValue}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-600">Limite esquerdo (l):</span>
            <span className="text-sm font-bold text-blue-600">{currentStep.l}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span className="text-sm font-medium text-gray-600">Limite direito (r):</span>
            <span className="text-sm font-bold text-red-600">{currentStep.r}</span>
          </div>
          {currentStep.q !== undefined && (
            <>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-sm font-medium text-gray-600">Pivô (q):</span>
                <span className="text-sm font-bold text-yellow-600">{currentStep.q}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                <span className="text-sm font-medium text-gray-600">v[q]:</span>
                <span className="text-sm font-bold text-yellow-600">{currentStep.value}</span>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Clique em "Iniciar" para começar a simulação
        </p>
      )}
    </div>
  );
};

