import React, { useEffect, useMemo } from 'react';
import { useElementarySortSimulator } from '../hooks/useElementarySortSimulator';
import { SortingLayout } from '@shared/sorting/ui/SortingLayout';
import { PSEUDOCODE_BY_ALGORITHM, COMPLEXITY_BY_ALGORITHM } from '@shared/sorting/meta';
import { SortingAlgorithmKind } from '@shared/sorting/types';

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

  const pseudocode = useMemo(() => PSEUDOCODE_BY_ALGORITHM[simulator.algorithm as SortingAlgorithmKind], [simulator.algorithm]);
  const complexity = useMemo(() => COMPLEXITY_BY_ALGORITHM[simulator.algorithm as SortingAlgorithmKind], [simulator.algorithm]);

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

  const handleReset = () => {
    simulator.reset();
  };

  const handleArraySizeChange = (size: number) => {
    simulator.setArraySize(size);
    simulator.reset();
  };

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
        {(['bubble', 'selection', 'insertion'] as const).map(opt => (
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
          placeholder="Ex: 44, 55, 12, 42, 94, 18"
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
          Melhor Caso
        </button>
        <button
          onClick={simulator.generateWorstCase}
          disabled={simulator.isPlaying}
          className="px-3 py-1.5 text-sm rounded-lg bg-red-100 hover:bg-red-200 text-red-700 disabled:opacity-50"
        >
          Pior Caso
        </button>
      </div>
    </div>
  );

  return (
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
  );
};
