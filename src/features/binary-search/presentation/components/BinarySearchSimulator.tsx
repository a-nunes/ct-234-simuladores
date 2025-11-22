import React from 'react';
import { Search } from 'lucide-react';
import { useBinarySearchSimulator } from '../hooks/useBinarySearchSimulator';
import { ControlPanel } from './ControlPanel';
import { ArrayVisualization } from './ArrayVisualization';
import { StatePanel } from './StatePanel';
import { CallStackPanel } from './CallStackPanel';

/**
 * Main Binary Search Simulator component.
 * Orchestrates all sub-components and uses the orchestrator hook.
 * Contains ZERO business logic - only UI composition.
 */
export const BinarySearchSimulator: React.FC = () => {
  const simulator = useBinarySearchSimulator({
    initialArray: [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78],
    initialSearchValue: 23
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Busca Binária</h1>
              <p className="text-gray-600">
                Divisão-e-Conquista: Reduzindo o espaço de busca pela metade
              </p>
            </div>
          </div>

          <ControlPanel
            customArray={simulator.customArray}
            customSearch={simulator.customSearch}
            onCustomArrayChange={simulator.setCustomArray}
            onCustomSearchChange={simulator.setCustomSearch}
            onApplyCustom={simulator.applyCustomConfig}
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visualização do Array */}
          <div className="lg:col-span-2">
            <ArrayVisualization array={simulator.array} currentStep={simulator.currentStep} />
          </div>

          {/* Painel de Estado */}
          <div className="space-y-6">
            <StatePanel currentStep={simulator.currentStep} searchValue={simulator.searchValue} />
            <CallStackPanel currentStep={simulator.currentStep} />
          </div>
        </div>
      </div>
    </div>
  );
};

