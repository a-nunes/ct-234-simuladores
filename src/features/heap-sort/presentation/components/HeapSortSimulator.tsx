import React, { useEffect, useState } from 'react';
import { TreePine } from 'lucide-react';
import { useHeapSortSimulator } from '../hooks/useHeapSortSimulator';
import { ControlPanel } from './ControlPanel';
import { ArrayVisualization } from './ArrayVisualization';
import { TreeVisualization } from './TreeVisualization';
import { VariablesPanel } from './VariablesPanel';
import { PseudocodePanel } from './PseudocodePanel';

/**
 * Main Heap Sort Simulator component.
 * Features dual view: Array + Binary Tree visualization.
 * Orchestrates all sub-components and uses the orchestrator hook.
 * Contains ZERO business logic - only UI composition.
 */
export const HeapSortSimulator: React.FC = () => {
  const simulator = useHeapSortSimulator({
    initialArray: [4, 10, 3, 5, 1, 8, 7, 2, 9, 6]
  });

  // Shared hover state for synchronization between array and tree
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Heap Sort</h1>
              <p className="text-gray-600">
                Build + Extração: Árvore binária em vetor com propriedade de Max-Heap
              </p>
            </div>
          </div>

          <ControlPanel
            customArray={simulator.customArray}
            onCustomArrayChange={simulator.setCustomArray}
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

        {/* Main visualization area - Dual View */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Tree Visualization */}
          <TreeVisualization
            currentStep={simulator.currentStep}
            originalArray={simulator.array}
            hoveredIndex={hoveredIndex}
            onHover={setHoveredIndex}
          />
          
          {/* Array Visualization */}
          <ArrayVisualization
            currentStep={simulator.currentStep}
            originalArray={simulator.array}
            hoveredIndex={hoveredIndex}
            onHover={setHoveredIndex}
          />
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VariablesPanel currentStep={simulator.currentStep} />
          <PseudocodePanel currentStep={simulator.currentStep} />
        </div>
      </div>
    </div>
  );
};
