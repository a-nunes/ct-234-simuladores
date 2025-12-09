import React, { useEffect, useMemo } from 'react';
import { useDivideConquerSortSimulator } from '../hooks/useDivideConquerSortSimulator';
import { SortingLayout } from '@shared/sorting/ui/SortingLayout';
import { PSEUDOCODE_BY_ALGORITHM, COMPLEXITY_BY_ALGORITHM } from '@shared/sorting/meta';
import { RecursionStackPanel } from './RecursionStackPanel';
import { VariablesPanel } from './VariablesPanel';
import { ArrayVisualization } from './ArrayVisualization';

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

  const algorithmNames = {
    merge: 'Merge Sort',
    quick: 'Quick Sort'
  };

  const algorithmDescriptions = {
    merge: 'Divisão recursiva até n=1, seguida de intercalação (Merge) usando vetor auxiliar',
    quick: 'Escolha do pivô e particionamento recursivo do vetor'
  };

  const pseudocode = useMemo(() => PSEUDOCODE_BY_ALGORITHM[simulator.algorithm], [simulator.algorithm]);
  const complexity = useMemo(() => COMPLEXITY_BY_ALGORITHM[simulator.algorithm], [simulator.algorithm]);

  const handlePlayPause = () => {
    if (!simulator.isRunning) {
      simulator.start();
      return;
    }
    if (simulator.isPlaying) {
      simulator.pause();
    } else {
      simulator.play();
    }
  };

  const handleReset = () => simulator.reset();

  const handleArraySizeChange = (size: number) => {
    simulator.setArraySize(size);
    simulator.reset();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handlePlayPause();
      } else if (e.key === ' ') {
        e.preventDefault();
        simulator.reset();
      } else if (e.key === 'ArrowRight' && simulator.canGoNext) {
        simulator.next();
      } else if (e.key === 'ArrowLeft' && simulator.canGoPrevious) {
        simulator.previous();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [simulator, handlePlayPause]);

  const extraControls = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(['merge', 'quick'] as const).map(opt => (
          <button
            key={opt}
            onClick={() => simulator.setAlgorithm(opt)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border ${
              simulator.algorithm === opt ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {algorithmNames[opt]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={simulator.customArray}
          onChange={e => simulator.setCustomArray(e.target.value)}
          disabled={simulator.isPlaying}
          placeholder="38, 27, 43, 3, 9, 82, 10"
          className="flex-1 min-w-48 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={simulator.applyCustomConfig}
          disabled={simulator.isPlaying}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50"
        >
          Aplicar
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={simulator.generateRandomCase}
          disabled={simulator.isPlaying}
          className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50"
        >
          Aleatório
        </button>
        <button
          onClick={simulator.generateBestCase}
          disabled={simulator.isPlaying}
          className="px-3 py-1.5 text-sm rounded-lg bg-green-100 hover:bg-green-200 text-green-700 disabled:opacity-50"
        >
          Balanceado
        </button>
        <button
          onClick={simulator.generateWorstCase}
          disabled={simulator.isPlaying}
          className="px-3 py-1.5 text-sm rounded-lg bg-red-100 hover:bg-red-200 text-red-700 disabled:opacity-50"
        >
          Pior Caso
        </button>
      </div>
      {simulator.error && (
        <div className="p-2 text-sm rounded-md border border-red-200 bg-red-50 text-red-700">
          {simulator.error.message}
        </div>
      )}
    </div>
  );

  return (
    <>
      <SortingLayout
        title={algorithmNames[simulator.algorithm]}
        description={algorithmDescriptions[simulator.algorithm]}
        baseArray={simulator.array}
        step={simulator.currentStep}
        stepIndex={simulator.currentStepIndex}
        totalSteps={simulator.totalSteps}
        isPlaying={simulator.isPlaying}
        speedMs={simulator.speedMs}
        pseudocode={pseudocode}
        complexity={complexity}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        onPrevious={simulator.previous}
        onNext={simulator.next}
        onStepChange={simulator.goToStep}
        onSpeedChange={simulator.setSpeedMs}
        arraySize={simulator.array.length}
        onArraySizeChange={handleArraySizeChange}
        extraControls={extraControls}
        showNarration
      />
      <div className="max-w-6xl mx-auto px-4 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ArrayVisualization currentStep={simulator.rawStep} originalArray={simulator.array} />
        </div>
        <div className="space-y-4">
          <RecursionStackPanel currentStep={simulator.rawStep} />
          <VariablesPanel currentStep={simulator.rawStep} />
        </div>
      </div>
    </>
  );
};
