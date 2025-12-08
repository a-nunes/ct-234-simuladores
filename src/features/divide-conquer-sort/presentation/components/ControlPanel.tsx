import React from 'react';
import { DivideConquerAlgorithm } from '@features/divide-conquer-sort/domain/entities/DivideConquerSortStep';
import { Play, RotateCcw, ChevronLeft, ChevronRight, Shuffle, TrendingUp, TrendingDown } from 'lucide-react';

interface ControlPanelProps {
  // Config
  customArray: string;
  algorithm: DivideConquerAlgorithm;
  onCustomArrayChange: (value: string) => void;
  onAlgorithmChange: (algorithm: DivideConquerAlgorithm) => void;
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

const ALGORITHM_OPTIONS: { value: DivideConquerAlgorithm; label: string }[] = [
  { value: 'merge', label: 'Merge Sort' },
  { value: 'quick', label: 'Quick Sort' }
];

/**
 * Control panel component with algorithm selection, input, and navigation.
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({
  customArray,
  algorithm,
  onCustomArrayChange,
  onAlgorithmChange,
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
      {/* Algorithm Selection */}
      <div className="flex flex-wrap gap-2">
        {ALGORITHM_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onAlgorithmChange(opt.value)}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              algorithm === opt.value
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Input Configuration */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={customArray}
          onChange={e => onCustomArrayChange(e.target.value)}
          disabled={isRunning}
          placeholder="Ex: 38, 27, 43, 3, 9, 82, 10"
          className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
          <TrendingUp className="w-4 h-4" /> Melhor Caso
        </button>
        <button
          onClick={onGenerateWorstCase}
          disabled={isRunning}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm disabled:opacity-50"
        >
          <TrendingDown className="w-4 h-4" /> Pior Caso
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
              className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Passo anterior (←)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-20 text-center">
              {currentStepIndex + 1} / {totalSteps}
            </span>
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className="p-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Próximo passo (→)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {isRunning && (
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={totalSteps - 1}
              value={currentStepIndex >= 0 ? currentStepIndex : 0}
              onChange={e => {
                const index = parseInt(e.target.value, 10);
                if (!isNaN(index)) {
                  // We need to expose goToStep or handle this differently
                }
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
