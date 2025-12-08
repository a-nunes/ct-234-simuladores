import React, { useEffect } from 'react';
import { Layers } from 'lucide-react';
import { useRadixSortSimulator } from '../hooks/useRadixSortSimulator';
import { ControlPanel } from './ControlPanel';
import { ArrayVisualization } from './ArrayVisualization';
import { BucketVisualization } from './BucketVisualization';
import { VariablesPanel } from './VariablesPanel';
import { PseudocodePanel } from './PseudocodePanel';

/**
 * Main Radix Sort Simulator component.
 * Implements visualization of LSD (Least Significant Digit) Radix Sort.
 * Uses buckets/queues for distribution-based sorting.
 * Contains ZERO business logic - only UI composition.
 */
export const RadixSortSimulator: React.FC = () => {
  const simulator = useRadixSortSimulator({
    initialArray: [170, 45, 75, 90, 802, 24, 2, 66],
    initialBase: 10
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

  // Determine current phase for bucket highlighting
  const getPhase = (): 'distribute' | 'collect' | 'idle' => {
    if (!simulator.currentStep) return 'idle';
    if (simulator.currentStep.type === 'distribute') return 'distribute';
    if (simulator.currentStep.type === 'collect') return 'collect';
    return 'idle';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Radix Sort (LSD)
              </h1>
              <p className="text-gray-600">
                Ordenação por distribuição usando dígitos (Least Significant Digit first)
              </p>
            </div>
          </div>

          <ControlPanel
            customArray={simulator.customArray}
            base={simulator.base}
            onCustomArrayChange={simulator.setCustomArray}
            onBaseChange={simulator.setBase}
            onApplyCustom={simulator.applyCustomConfig}
            onGenerateRandomCase={simulator.generateRandomCase}
            onGenerateMultiDigitCase={simulator.generateMultiDigitCase}
            onGenerateSingleDigitCase={simulator.generateSingleDigitCase}
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

        {/* Main visualization area */}
        <div className="space-y-6">
          {/* Array Visualization */}
          <ArrayVisualization
            currentStep={simulator.currentStep}
            originalArray={simulator.array}
          />

          {/* Buckets Visualization */}
          <BucketVisualization
            buckets={simulator.currentStep?.buckets ?? Array.from({ length: 10 }, (_, i) => ({ digit: i, elements: [] }))}
            highlightedBucket={simulator.currentStep?.highlightedBucket}
            currentElement={simulator.currentStep?.currentElement}
            phase={getPhase()}
          />
        </div>

        {/* Side panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <VariablesPanel currentStep={simulator.currentStep} />
          <PseudocodePanel
            activeLine={simulator.currentStep?.pseudocodeLine}
          />
        </div>

        {/* Algorithm explanation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Como funciona o Radix Sort?
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Algoritmo LSD:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Começa pelo dígito menos significativo (unidades)</li>
                <li>Distribui os elementos nos baldes (0-9) pelo dígito atual</li>
                <li>Coleta os elementos dos baldes em ordem</li>
                <li>Repete para o próximo dígito (dezenas, centenas...)</li>
                <li>Após processar todos os dígitos, o array está ordenado</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Características:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Complexidade:</strong> O(d × n) onde d = número de dígitos</li>
                <li><strong>Estabilidade:</strong> Estável (mantém ordem relativa)</li>
                <li><strong>Não-comparativo:</strong> Não compara elementos diretamente</li>
                <li><strong>Requisito:</strong> Funciona apenas com inteiros não-negativos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
