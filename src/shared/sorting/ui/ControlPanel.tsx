import React from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { sortingColors } from './theme';

interface ControlPanelProps {
  stepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onStepChange: (index: number) => void;
  speedMs: number;
  onSpeedChange: (value: number) => void;
  arraySize?: number;
  onArraySizeChange?: (size: number) => void;
  extraControls?: React.ReactNode;
}

const SPEED_OPTIONS = [
  { label: '0.5x', value: 1200 },
  { label: '1x', value: 800 },
  { label: '2x', value: 400 }
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  stepIndex,
  totalSteps,
  isPlaying,
  onPlayPause,
  onReset,
  onPrevious,
  onNext,
  onStepChange,
  speedMs,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  extraControls
}) => {
  const safeStepIndex = Math.max(stepIndex, 0);

  return (
    <div className="rounded-xl shadow-sm border p-5 space-y-4" style={{ borderColor: sortingColors.border, background: sortingColors.card }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 border border-slate-200 hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" /> Reiniciar
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            disabled={safeStepIndex <= 0}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            title="Passo anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 text-sm text-slate-700">
            Passo {Math.min(safeStepIndex + 1, Math.max(totalSteps, 1))} de {Math.max(totalSteps, 1)}
          </div>
          <button
            onClick={onNext}
            disabled={safeStepIndex >= totalSteps - 1}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            title="Próximo passo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px]">
          <input
            type="range"
            min={0}
            max={Math.max(totalSteps - 1, 0)}
            value={safeStepIndex}
            onChange={e => onStepChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Velocidade</label>
          <select
            className="border border-slate-200 rounded-lg px-2 py-1 text-sm"
            value={speedMs}
            onChange={e => onSpeedChange(Number(e.target.value))}
          >
            {SPEED_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {onArraySizeChange && arraySize !== undefined && (
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Tamanho</label>
            <input
              type="number"
              min={3}
              max={50}
              value={arraySize}
              onChange={e => onArraySizeChange(Number(e.target.value))}
              className="w-24 border border-slate-200 rounded-lg px-2 py-1 text-sm"
            />
          </div>
        )}
      </div>

      {extraControls && <div className="pt-2 border-t" style={{ borderColor: sortingColors.border }}>{extraControls}</div>}
    </div>
  );
};

