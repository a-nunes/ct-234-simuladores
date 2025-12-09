import React, { useEffect, useMemo } from 'react';
import { useRadixSortSimulator } from '../hooks/useRadixSortSimulator';
import { SortingLayout } from '@shared/sorting/ui/SortingLayout';
import { PSEUDOCODE_BY_ALGORITHM, COMPLEXITY_BY_ALGORITHM } from '@shared/sorting/meta';
import { BucketVisualization } from './BucketVisualization';

/**
 * Main Radix Sort Simulator component.
 * Uses shared SortingLayout for unified presentation and keeps bucket view below.
 */
export const RadixSortSimulator: React.FC = () => {
  const simulator = useRadixSortSimulator({
    initialArray: [170, 45, 75, 90, 802, 24, 2, 66],
    initialBase: 10
  });

  const pseudocode = useMemo(() => PSEUDOCODE_BY_ALGORITHM.radix, []);
  const complexity = useMemo(() => COMPLEXITY_BY_ALGORITHM.radix, []);

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

  // Determine current phase for bucket highlighting
  const getPhase = (): 'distribute' | 'collect' | 'idle' => {
    if (!simulator.rawStep) return 'idle';
    if (simulator.rawStep.type === 'distribute') return 'distribute';
    if (simulator.rawStep.type === 'collect') return 'collect';
    return 'idle';
  };

  const extraControls = (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={simulator.customArray}
          onChange={e => simulator.setCustomArray(e.target.value)}
          disabled={simulator.isPlaying}
          placeholder="170, 45, 75, 90, 802, 24, 2, 66"
          className="flex-1 min-w-48 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="number"
          min={2}
          max={16}
          value={simulator.base}
          onChange={e => simulator.setBase(Number(e.target.value))}
          disabled={simulator.isPlaying}
          className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm"
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
          onClick={simulator.generateMultiDigitCase}
          disabled={simulator.isPlaying}
          className="px-3 py-1.5 text-sm rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 disabled:opacity-50"
        >
          Multi-dígitos
        </button>
        <button
          onClick={simulator.generateSingleDigitCase}
          disabled={simulator.isPlaying}
          className="px-3 py-1.5 text-sm rounded-lg bg-green-100 hover:bg-green-200 text-green-700 disabled:opacity-50"
        >
          1 dígito
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
        title="Radix Sort (LSD)"
        description="Distribuição por dígitos usando filas de baldes"
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
      <div className="max-w-6xl mx-auto px-4 pb-10">
        <BucketVisualization
          buckets={simulator.rawStep?.buckets ?? Array.from({ length: 10 }, (_, i) => ({ digit: i, elements: [] }))}
          highlightedBucket={simulator.rawStep?.highlightedBucket}
          currentElement={simulator.rawStep?.currentElement}
          phase={getPhase()}
        />
      </div>
    </>
  );
};
