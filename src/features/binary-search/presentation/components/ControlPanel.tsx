import React from 'react';
import { Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

export interface ControlPanelProps {
  // Config inputs
  customArray: string;
  customSearch: string;
  onCustomArrayChange: (value: string) => void;
  onCustomSearchChange: (value: string) => void;
  onApplyCustom: () => void;

  // Control buttons
  onStart: () => void;
  onReset: () => void;
  onPrevious: () => void;
  onNext: () => void;

  // States
  isRunning: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentStepIndex: number;
  totalSteps: number;
}

/**
 * Component for simulator controls and configuration.
 * Pure presentation component with no business logic.
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({
  customArray,
  customSearch,
  onCustomArrayChange,
  onCustomSearchChange,
  onApplyCustom,
  onStart,
  onReset,
  onPrevious,
  onNext,
  isRunning,
  canGoNext,
  canGoPrevious,
  currentStepIndex,
  totalSteps
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      {/* Configuração */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Array (separado por vírgulas)
          </label>
          <input
            type="text"
            value={customArray}
            onChange={(e) => onCustomArrayChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2,5,8,12,16,23..."
            disabled={isRunning}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor a buscar
          </label>
          <input
            type="number"
            value={customSearch}
            onChange={(e) => onCustomSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="23"
            disabled={isRunning}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={onApplyCustom}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isRunning}
          >
            Aplicar
          </button>
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isRunning}
        >
          <Play className="w-4 h-4" />
          Iniciar
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Resetar
        </button>
        <button
          onClick={onPrevious}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canGoPrevious}
        >
          <SkipBack className="w-4 h-4" />
          Anterior
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canGoNext}
        >
          Próximo
          <SkipForward className="w-4 h-4" />
        </button>
        {currentStepIndex >= 0 && totalSteps > 0 && (
          <div className="ml-auto text-sm text-gray-600 flex items-center">
            Passo {currentStepIndex + 1} de {totalSteps}
          </div>
        )}
      </div>
    </div>
  );
};

