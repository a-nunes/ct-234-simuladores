import React from 'react';
import { ChevronRight, ChevronLeft, SkipForward, RotateCcw } from 'lucide-react';
import { KMPStep, isPreprocessStep, isSearchStep } from '@features/kmp/domain/entities/KMPStep';

export interface NavigationControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isAtStart: boolean;
  isAtEnd: boolean;
  currentStep: KMPStep | null;
  pattern: string;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStart: () => void;
  onGoToEnd: () => void;
}

/**
 * Navigation controls for stepping through the KMP algorithm.
 * Shows different information based on the current phase (preprocess or search).
 */
export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStepIndex,
  totalSteps,
  canGoPrevious,
  canGoNext,
  isAtStart,
  isAtEnd,
  currentStep,
  pattern,
  onNext,
  onPrevious,
  onGoToStart,
  onGoToEnd
}) => {
  const isPreprocess = currentStep && isPreprocessStep(currentStep);
  const isSearch = currentStep && isSearchStep(currentStep);
  
  const gradientClass = isPreprocess 
    ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' 
    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200';

  return (
    <div className={`${gradientClass} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Passo {currentStepIndex + 1} de {totalSteps}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            <span className={`font-semibold ${isPreprocess ? 'text-purple-700' : 'text-blue-700'}`}>
              {isPreprocess 
                ? '📋 FASE 1: Pré-processamento (Função de Falha)' 
                : '🔍 FASE 2: Busca no Texto'}
            </span>
          </p>
        </div>
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
        {isPreprocess && currentStep && isPreprocessStep(currentStep) && (
          <>
            <p className="text-sm">
              <span className="font-semibold">Ponteiro i (sufixos):</span> {currentStep.i < pattern.length ? currentStep.i : 'fim'}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Ponteiro j (prefixos):</span> {currentStep.j}
            </p>
          </>
        )}
        {isSearch && currentStep && isSearchStep(currentStep) && (
          <>
            <p className="text-sm">
              <span className="font-semibold">Ponteiro i (texto):</span> {currentStep.i}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Ponteiro j (padrão):</span> {currentStep.j}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Posição de alinhamento:</span> {currentStep.position + 1}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Comparações realizadas:</span> {currentStep.comparisonCount}
            </p>
            {currentStep.usedFailure && (
              <p className="text-sm text-purple-700">
                <span className="font-semibold">→ Usou F[{currentStep.j}] = {currentStep.failureValue}</span>
              </p>
            )}
          </>
        )}
        <p className={`text-sm font-semibold mt-2 ${isPreprocess ? 'text-purple-700' : 'text-blue-700'}`}>
          {currentStep?.message}
        </p>
        {isSearch && currentStep && isSearchStep(currentStep) && currentStep.found && (
          <p className="text-sm font-bold text-green-600 mt-2">
            ✓ Padrão encontrado na posição {currentStep.position + 1}!
          </p>
        )}
      </div>
    </div>
  );
};
