import React from 'react';
import { Play, RotateCcw, ChevronLeft, ChevronRight, Shuffle, Hash, Layers } from 'lucide-react';

interface ControlPanelProps {
  // Config
  customArray: string;
  base: number;
  onCustomArrayChange: (value: string) => void;
  onBaseChange: (base: number) => void;
  onApplyCustom: () => void;
  onGenerateRandomCase: () => void;
  onGenerateMultiDigitCase: () => void;
  onGenerateSingleDigitCase: () => void;

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
 * Control panel component for Radix Sort simulator.
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({
  customArray,
  base,
  onCustomArrayChange,
  onBaseChange,
  onApplyCustom,
  onGenerateRandomCase,
  onGenerateMultiDigitCase,
  onGenerateSingleDigitCase,
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
          onChange={(e) => onCustomArrayChange(e.target.value)}
          disabled={isRunning}
          placeholder="Ex: 170, 45, 75, 90, 802, 24, 2, 66"
          className={`flex-1 min-w-[300px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
            isRunning ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
        />
        <button
          onClick={onApplyCustom}
          disabled={isRunning}
          className={`px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors ${
            isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Aplicar
        </button>
      </div>

      {/* Quick test cases */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onGenerateRandomCase}
          disabled={isRunning}
          className={`flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
            isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Shuffle size={16} />
          Aleatório
        </button>
        <button
          onClick={onGenerateMultiDigitCase}
          disabled={isRunning}
          className={`flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
            isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Layers size={16} />
          Multi-dígitos
        </button>
        <button
          onClick={onGenerateSingleDigitCase}
          disabled={isRunning}
          className={`flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
            isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Hash size={16} />
          Um dígito
        </button>
      </div>

      {/* Base selection */}
      <div className="flex items-center gap-4">
        <span className="text-gray-600 font-medium">Base:</span>
        <div className="flex gap-2">
          {[2, 8, 10, 16].map((b) => (
            <button
              key={b}
              onClick={() => onBaseChange(b)}
              disabled={isRunning}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                base === b
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {b}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500">
          (Base 10 recomendada para visualização)
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 pt-2 border-t">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            <Play size={20} />
            Iniciar
          </button>
        ) : (
          <>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              <RotateCcw size={20} />
              Reiniciar
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className={`p-2 rounded-lg transition-colors ${
                  canGoPrevious
                    ? 'bg-gray-200 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={24} />
              </button>

              <span className="px-4 py-2 bg-gray-100 rounded-lg font-mono min-w-[100px] text-center">
                {currentStepIndex + 1} / {totalSteps}
              </span>

              <button
                onClick={onNext}
                disabled={!canGoNext}
                className={`p-2 rounded-lg transition-colors ${
                  canGoNext
                    ? 'bg-gray-200 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
