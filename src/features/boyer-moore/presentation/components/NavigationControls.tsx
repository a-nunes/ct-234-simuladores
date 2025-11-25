import React from 'react';
import { ChevronRight, ChevronLeft, SkipForward, RotateCcw } from 'lucide-react';
import { BoyerMooreStep } from '@features/boyer-moore/domain/entities/BoyerMooreStep';

export interface NavigationControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  currentStep: BoyerMooreStep | null;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStart: () => void;
  onGoToEnd: () => void;
}

/**
 * Navigation controls for stepping through the algorithm.
 */
export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStepIndex,
  totalSteps,
  canGoPrevious,
  canGoNext,
  isAtStart,
  isAtEnd,
  currentStep,
  onNext,
  onPrevious,
  onGoToStart,
  onGoToEnd
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Passo {currentStepIndex + 1} de {totalSteps}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onGoToStart}
            disabled={isAtStart}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Primeiro passo"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Passo anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Próximo passo"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={onGoToEnd}
            disabled={isAtEnd}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Último passo"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Current step information */}
      <div className="bg-white rounded-lg p-4 space-y-2">
        <p className="text-sm">
          <span className="font-semibold">Posição no texto:</span> {currentStep ? currentStep.position + 1 : '-'}
        </p>
        <p className="text-sm">
          <span className="font-semibold">Comparações até agora:</span> {currentStep ? currentStep.comparisonCount : 0}
        </p>
        {currentStep && currentStep.mismatchChar && (
          <>
            <p className="text-sm">
              <span className="font-semibold">Caractere incompatível:</span> '{currentStep.mismatchChar}' na posição {currentStep.mismatchIndex} do padrão
            </p>
            <p className="text-sm">
              <span className="font-semibold">L('{currentStep.mismatchChar}'):</span> {currentStep.lastOccValue !== undefined && currentStep.lastOccValue >= 0 ? currentStep.lastOccValue : 'não existe'}
            </p>
          </>
        )}
        <p className="text-sm font-semibold text-blue-700 mt-2">
          {currentStep ? currentStep.shiftReason : ''}
        </p>
        {currentStep && currentStep.found && (
          <p className="text-sm font-bold text-green-600 mt-2">
            ✓ Padrão encontrado na posição {currentStep.position + 1}!
          </p>
        )}
      </div>
    </div>
  );
};
