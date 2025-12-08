import React from 'react';
import { Play, RotateCcw, ChevronLeft, ChevronRight, Shuffle, TreePine, Binary } from 'lucide-react';

interface ControlPanelProps {
  // Config
  customArray: string;
  onCustomArrayChange: (value: string) => void;
  onApplyCustom: () => void;
  onGenerateWorstCase: () => void;
  onGenerateBestCase: () => void;
  onGenerateRandomCase: () => void;

  // Navigation
  onStart: () => void;
  onReset: () => void;
  onPrevious: () => void;
  onNext: () => void;

  // State
  isRunning: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentStepIndex: number;
  totalSteps: number;
}

/**
 * Control panel component with input and navigation.
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({
  customArray,
  onCustomArrayChange,
  onApplyCustom,
  onGenerateWorstCase,
  onGenerateBestCase,
  onGenerateRandomCase,
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
    <div className="space-y-4">
      {/* Input Configuration */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={customArray}
          onChange={e => onCustomArrayChange(e.target.value)}
          disabled={isRunning}
          placeholder="Ex: 4, 10, 3, 5, 1, 8, 7, 2, 9, 6"
          className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          onClick={onApplyCustom}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Aplicar
        </button>
      </div>

      {/* Quick Case Generators */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onGenerateRandomCase}
          disabled={isRunning}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm disabled:opacity-50"
        >
          <Shuffle className="w-4 h-4" /> Aleatório
        </button>
        <button
          onClick={onGenerateBestCase}
          disabled={isRunning}
          className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm disabled:opacity-50"
        >
          <TreePine className="w-4 h-4" /> Max-Heap Pronto
        </button>
        <button
          onClick={onGenerateWorstCase}
          disabled={isRunning}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm disabled:opacity-50"
        >
          <Binary className="w-4 h-4" /> Sequencial
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Play className="w-5 h-5" /> Iniciar
            </button>
          ) : (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" /> Reiniciar
            </button>
          )}
        </div>

        {isRunning && (
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Passo anterior (←)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-600 min-w-24 text-center">
              Passo {currentStepIndex + 1} / {totalSteps}
            </span>
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Próximo passo (→)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Progress bar */}
        {isRunning && totalSteps > 0 && (
          <div className="flex-1 max-w-xs">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
