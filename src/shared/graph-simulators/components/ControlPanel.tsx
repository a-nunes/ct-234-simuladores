import { RotateCcw, Play, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import LoadCustomGraphButton from '../../../components/LoadCustomGraphButton';

export interface ControlPanelProps {
  onStart: () => void;
  onReset: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLoadCustomGraph: () => void;
  isRunning: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  currentStepIndex: number;
  totalSteps: number;
  onShowRandomDialog: () => void;
  requiredGraphType?: 'directed' | 'undirected';
  requiresWeights?: boolean;
}

/**
 * Generic control panel component for graph simulators.
 * Works with any graph simulator that follows the standard pattern.
 */
export function ControlPanel({
  onStart,
  onReset,
  onPrevious,
  onNext,
  onLoadCustomGraph,
  isRunning,
  canGoNext,
  canGoPrevious,
  currentStepIndex,
  totalSteps,
  onShowRandomDialog,
  requiredGraphType = 'directed',
  requiresWeights = false
}: ControlPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap">
          <button
            data-testid="reset-button"
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={20} />
            Resetar
          </button>
          
          <button
            data-testid="generate-graph-button"
            onClick={onShowRandomDialog}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle size={20} />
            Gerar Grafo
          </button>

          <LoadCustomGraphButton
            requiredType={requiredGraphType}
            requiresWeights={requiresWeights}
            onLoadGraph={onLoadCustomGraph}
            disabled={isRunning}
          />
        </div>

        <div className="flex gap-2">
          <button
            data-testid="previous-button"
            onClick={onPrevious}
            disabled={!canGoPrevious || !isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            Anterior
          </button>
          
          {!isRunning ? (
            <button
              data-testid="start-button"
              onClick={onStart}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play size={20} />
              Iniciar
            </button>
          ) : (
            <button
              data-testid="next-button"
              onClick={onNext}
              disabled={!canGoNext}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>

      {isRunning && (
        <div className="mt-4" data-testid="step-indicator">
          <div className="text-sm text-slate-600 mb-2">
            Passo {currentStepIndex + 1} de {totalSteps}
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

