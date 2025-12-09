import React from 'react';
import { SortingComplexity, SortingPseudocode, SortingStep } from '../types';
import { ArrayStrip } from './ArrayStrip';
import { ControlPanel } from './ControlPanel';
import { PseudocodePanel } from './PseudocodePanel';
import { NarrationBanner } from './NarrationBanner';
import { StatsPanel } from './StatsPanel';
import { sortingColors } from './theme';

export interface SortingLayoutProps {
  title: string;
  description?: string;
  baseArray: number[];
  step: SortingStep | null;
  stepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speedMs: number;
  pseudocode: SortingPseudocode;
  complexity: SortingComplexity;
  onPlayPause: () => void;
  onReset: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onStepChange: (index: number) => void;
  onSpeedChange: (value: number) => void;
  arraySize?: number;
  onArraySizeChange?: (size: number) => void;
  extraControls?: React.ReactNode;
  showNarration?: boolean;
}

export const SortingLayout: React.FC<SortingLayoutProps> = ({
  title,
  description,
  baseArray,
  step,
  stepIndex,
  totalSteps,
  isPlaying,
  speedMs,
  pseudocode,
  complexity,
  onPlayPause,
  onReset,
  onPrevious,
  onNext,
  onStepChange,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  extraControls,
  showNarration = true
}) => {
  return (
    <div className="min-h-screen" style={{ background: sortingColors.background }}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl shadow-sm border p-6 space-y-4" style={{ background: sortingColors.card, borderColor: sortingColors.border }}>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {description && <p className="text-slate-600 text-sm">{description}</p>}
          </div>
          {showNarration && step?.message && <NarrationBanner message={step.message} />}
          <ArrayStrip baseArray={baseArray} step={step} caption="Passo a passo do array" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <ControlPanel
              stepIndex={stepIndex}
              totalSteps={totalSteps}
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onReset={onReset}
              onPrevious={onPrevious}
              onNext={onNext}
              onStepChange={onStepChange}
              speedMs={speedMs}
              onSpeedChange={onSpeedChange}
              arraySize={arraySize}
              onArraySizeChange={onArraySizeChange}
              extraControls={extraControls}
            />
          </div>
          <div className="space-y-4">
            <PseudocodePanel pseudocode={pseudocode} activeLine={step?.pseudocodeLine} />
            <StatsPanel complexity={complexity} />
          </div>
        </div>
      </div>
    </div>
  );
};

