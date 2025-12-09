import React, { useEffect } from 'react';
import { useHeapSortSimulator } from '../hooks/useHeapSortSimulator';
import { SortingLayout } from '@shared/sorting/ui/SortingLayout';
import { PSEUDOCODE_BY_ALGORITHM, COMPLEXITY_BY_ALGORITHM } from '@shared/sorting/meta';

/**
 * Main Heap Sort Simulator component.
 * Uses shared SortingLayout for unified presentation.
 */
export const HeapSortSimulator: React.FC = () => {
  const simulator = useHeapSortSimulator({
    initialArray: [4, 10, 3, 5, 1, 8, 7, 2, 9, 6]
  });

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
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={simulator.customArray}
          onChange={e => simulator.setCustomArray(e.target.value)}
          disabled={simulator.isPlaying}
          placeholder="Ex: 4, 10, 3, 5, 1, 8, 7, 2, 9, 6"
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
          Max-Heap
        </button>
        <button
          onClick={simulator.generateWorstCase}
          disabled={simulator.isPlaying}
          className="px-3 py-1.5 text-sm rounded-lg bg-red-100 hover:bg-red-200 text-red-700 disabled:opacity-50"
        >
          Sequencial
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
    <SortingLayout
      title="Heap Sort"
      description="Build + extração em Max-Heap"
      baseArray={simulator.array}
      step={simulator.currentStep}
      stepIndex={simulator.currentStepIndex}
      totalSteps={simulator.totalSteps}
      isPlaying={simulator.isPlaying}
      speedMs={simulator.speedMs}
      pseudocode={PSEUDOCODE_BY_ALGORITHM.heap}
      complexity={COMPLEXITY_BY_ALGORITHM.heap}
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
