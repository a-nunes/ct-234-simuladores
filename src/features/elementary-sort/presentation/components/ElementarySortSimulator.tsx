import React, { useEffect } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useElementarySortSimulator } from '../hooks/useElementarySortSimulator';
import { ControlPanel } from './ControlPanel';
import { ArrayVisualization } from './ArrayVisualization';
import { VariablesPanel } from './VariablesPanel';
import { PseudocodePanel } from './PseudocodePanel';

/**
 * Main Elementary Sort Simulator component.
 * Supports Bubble Sort, Selection Sort, and Insertion Sort.
 * Orchestrates all sub-components and uses the orchestrator hook.
 * Contains ZERO business logic - only UI composition.
 */
export const ElementarySortSimulator: React.FC = () => {
  const simulator = useElementarySortSimulator({
    initialArray: [44, 55, 12, 42, 94, 18, 6, 67],
    initialAlgorithm: 'bubble'
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
    bubble: 'Bubble Sort',
    selection: 'Selection Sort',
    insertion: 'Insertion Sort'
  };

  const algorithmDescriptions = {
    bubble: 'Comparação de vizinhos e "flutuação" do maior elemento para o final',
    selection: 'Busca do menor elemento e troca com a posição inicial',
    insertion: 'Inserção ordenada como "cartas de baralho"'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
              <ArrowUpDown className="w-6 h-6 text-white" />
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
            <VariablesPanel currentStep={simulator.currentStep} />
            <PseudocodePanel
              algorithm={simulator.algorithm}
              activeLine={simulator.currentStep?.pseudocodeLine}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
