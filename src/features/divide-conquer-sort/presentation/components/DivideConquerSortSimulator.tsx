import React, { useEffect } from 'react';
import { GitBranch } from 'lucide-react';
import { useDivideConquerSortSimulator } from '../hooks/useDivideConquerSortSimulator';
import { ControlPanel } from './ControlPanel';
import { ArrayVisualization } from './ArrayVisualization';
import { VariablesPanel } from './VariablesPanel';
import { PseudocodePanel } from './PseudocodePanel';
import { RecursionStackPanel } from './RecursionStackPanel';

/**
 * Main Divide and Conquer Sort Simulator component.
 * Supports Merge Sort and Quick Sort.
 * Orchestrates all sub-components and uses the orchestrator hook.
 * Contains ZERO business logic - only UI composition.
 */
export const DivideConquerSortSimulator: React.FC = () => {
  const simulator = useDivideConquerSortSimulator({
    initialArray: [38, 27, 43, 3, 9, 82, 10],
    initialAlgorithm: 'merge'
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (simulator.isRunning) {
        if (e.key === 'ArrowRight' && simulator.canGoNext) {
          simulator.next();
        } else if (e.key === 'ArrowLeft' && simulator.canGoPrevious) {
          simulator.previous();
        } else if (e.key === ' ') {
          e.preventDefault();
          simulator.reset();
        }
      } else if (e.key === 'Enter') {
        simulator.start();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [simulator]);

  const algorithmNames = {
    merge: 'Merge Sort',
    quick: 'Quick Sort'
  };

  const algorithmDescriptions = {
    merge: 'Divisão recursiva até n=1, seguida de intercalação (Merge) usando vetor auxiliar',
    quick: 'Escolha do pivô e particionamento recursivo do vetor'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {algorithmNames[simulator.algorithm]}
              </h1>
              <p className="text-gray-600">
                {algorithmDescriptions[simulator.algorithm]}
              </p>
            </div>
          </div>

          <ControlPanel
            customArray={simulator.customArray}
            algorithm={simulator.algorithm}
            onCustomArrayChange={simulator.setCustomArray}
            onAlgorithmChange={simulator.setAlgorithm}
            onApplyCustom={simulator.applyCustomConfig}
            onGenerateWorstCase={simulator.generateWorstCase}
            onGenerateBestCase={simulator.generateBestCase}
            onGenerateRandomCase={simulator.generateRandomCase}
            onStart={simulator.start}
            onReset={simulator.reset}
            onPrevious={simulator.previous}
            onNext={simulator.next}
            isRunning={simulator.isRunning}
            canGoNext={simulator.canGoNext}
            canGoPrevious={simulator.canGoPrevious}
            currentStepIndex={simulator.currentStepIndex}
            totalSteps={simulator.totalSteps}
          />

          {/* Error display */}
          {simulator.error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700">
              {simulator.error.message}
            </div>
          )}

          {/* Keyboard shortcuts hint */}
          <div className="mt-4 text-sm text-gray-500">
            <span className="font-medium">Atalhos:</span>
            {' '}← Anterior | → Próximo | Enter Iniciar | Espaço Reiniciar
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualização do Array */}
          <div className="lg:col-span-2">
            <ArrayVisualization
              currentStep={simulator.currentStep}
              originalArray={simulator.array}
            />
          </div>

          {/* Painel Direito */}
          <div className="space-y-6">
            <RecursionStackPanel currentStep={simulator.currentStep} />
            <VariablesPanel currentStep={simulator.currentStep} />
          </div>
        </div>

        {/* Pseudocode Panel - Full Width */}
        <div className="mt-6">
          <PseudocodePanel
            algorithm={simulator.algorithm}
            activeLine={simulator.currentStep?.pseudocodeLine}
          />
        </div>
      </div>
    </div>
  );
};
