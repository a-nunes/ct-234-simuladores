import React from 'react';
import { useKMPSimulator } from '../hooks/useKMPSimulator';
import { InputPanel } from '@shared/pattern-matching';
import { NavigationControls } from './NavigationControls';
import { PreprocessVisualization } from './PreprocessVisualization';
import { SearchVisualization } from './SearchVisualization';
import { FailureFunctionPanel } from './FailureFunctionPanel';
import { isPreprocessStep, isSearchStep } from '@features/kmp/domain/entities/KMPStep';

/**
 * Main KMP (Knuth-Morris-Pratt) Simulator component.
 * Uses the orchestrator hook and composes sub-components.
 */
export const KMPSimulator: React.FC = () => {
  const simulator = useKMPSimulator();

  return (
    <div className="w-full p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Simulador KMP (Knuth-Morris-Pratt) - Passo a Passo
      </h1>

      <InputPanel
        text={simulator.text}
        pattern={simulator.pattern}
        textLabel="Texto (T):"
        patternLabel="Padrão (P):"
        onTextChange={simulator.setText}
        onPatternChange={simulator.setPattern}
        onSimulate={simulator.simulate}
        onReset={simulator.reset}
      />

      {simulator.error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
          {simulator.error}
        </div>
      )}

      {simulator.isRunning && simulator.steps.length > 0 && simulator.currentStep && (
        <div className="space-y-6">
          <NavigationControls
            currentStepIndex={simulator.currentStepIndex}
            totalSteps={simulator.steps.length}
            canGoNext={simulator.canGoNext}
            canGoPrevious={simulator.canGoPrevious}
            isAtStart={simulator.isAtStart}
            isAtEnd={simulator.isAtEnd}
            currentStep={simulator.currentStep}
            pattern={simulator.pattern}
            onNext={simulator.next}
            onPrevious={simulator.previous}
            onGoToStart={simulator.goToStart}
            onGoToEnd={simulator.goToEnd}
          />

          {/* Visualization based on current phase */}
          {isPreprocessStep(simulator.currentStep) && (
            <PreprocessVisualization
              pattern={simulator.pattern}
              currentStep={simulator.currentStep}
            />
          )}

          {isSearchStep(simulator.currentStep) && (
            <SearchVisualization
              text={simulator.text}
              pattern={simulator.pattern}
              steps={simulator.steps}
              currentStepIndex={simulator.currentStepIndex}
              currentStep={simulator.currentStep}
            />
          )}

          {/* Failure function table - always visible after calculated */}
          <FailureFunctionPanel
            pattern={simulator.pattern}
            failureTable={simulator.failureTable}
          />
        </div>
      )}
    </div>
  );
};

export default KMPSimulator;
