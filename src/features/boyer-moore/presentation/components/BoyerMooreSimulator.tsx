import React from 'react';
import { useBoyerMooreSimulator } from '../hooks/useBoyerMooreSimulator';
import { InputPanel } from '@shared/pattern-matching';
import { NavigationControls } from './NavigationControls';
import { TextVisualization } from './TextVisualization';
import { BadCharTablePanel } from './BadCharTablePanel';

/**
 * Main Boyer-Moore Simulator component.
 * Uses the orchestrator hook and composes sub-components.
 */
export const BoyerMooreSimulator: React.FC = () => {
  const simulator = useBoyerMooreSimulator();

  return (
    <div className="w-full p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Simulador Boyer-Moore - Passo a Passo
      </h1>

      <InputPanel
        text={simulator.text}
        pattern={simulator.pattern}
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

      {simulator.isRunning && simulator.steps.length > 0 && (
        <div className="space-y-6">
          <NavigationControls
            currentStepIndex={simulator.currentStepIndex}
            totalSteps={simulator.steps.length}
            canGoNext={simulator.canGoNext}
            canGoPrevious={simulator.canGoPrevious}
            isAtStart={simulator.isAtStart}
            isAtEnd={simulator.isAtEnd}
            currentStep={simulator.currentStep}
            onNext={simulator.next}
            onPrevious={simulator.previous}
            onGoToStart={simulator.goToStart}
            onGoToEnd={simulator.goToEnd}
          />

          <TextVisualization
            text={simulator.text}
            pattern={simulator.pattern}
            steps={simulator.steps}
            currentStepIndex={simulator.currentStepIndex}
          />

          <div className="grid grid-cols-1 gap-4">
            <BadCharTablePanel
              text={simulator.text}
              pattern={simulator.pattern}
              badCharTable={simulator.badCharTable}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BoyerMooreSimulator;
