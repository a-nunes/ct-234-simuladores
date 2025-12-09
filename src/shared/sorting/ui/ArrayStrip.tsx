import React from 'react';
import { SortingStep } from '../types';
import { barStateStyles, SortingBarState, sortingColors } from './theme';

export interface ArrayStripProps {
  baseArray: number[];
  step: SortingStep | null;
  height?: number;
  caption?: string;
}

const resolveState = (step: SortingStep | null, index: number): SortingBarState => {
  if (!step) return 'default';

  if (step.sortedIndices?.includes(index)) return 'sorted';
  if (step.swapping && step.swapping.includes(index)) return 'swapping';
  if (step.comparing && step.comparing.includes(index)) return 'comparing';
  if (step.pivot && step.pivot.includes(index)) return 'pivot';
  if (step.secondary && step.secondary.includes(index)) return 'secondary';
  if (step.bucket && step.bucket.includes(index)) return 'bucket';
  if (step.inactive && step.inactive.includes(index)) return 'inactive';

  return 'default';
};

const pointerToneToColor: Record<string, string> = {
  primary: '#1d4ed8',
  secondary: '#0ea5e9',
  info: '#0284c7',
  warn: '#ea580c',
  pivot: '#a855f7'
};

export const ArrayStrip: React.FC<ArrayStripProps> = ({ baseArray, step, height = 120, caption }) => {
  const values = step?.array ?? baseArray;

  return (
    <div className="space-y-3">
      {caption && <p className="text-sm text-slate-600">{caption}</p>}

      <div
        className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border flex-wrap"
        style={{ background: sortingColors.card, borderColor: sortingColors.border, minHeight: height }}
      >
        {values.map((value, index) => {
          const state = resolveState(step, index);
          const style = barStateStyles[state];
          const pointer = step?.pointers?.find(p => p.index === index);
          const pointerColor = pointer ? pointerToneToColor[pointer.tone ?? 'primary'] : sortingColors.subtext;

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              {pointer && (
                <span className="text-[11px] font-semibold leading-none" style={{ color: pointerColor }}>
                  {pointer.label}
                </span>
              )}
              <div
                className="w-12 h-14 rounded-lg border shadow-sm flex items-center justify-center text-base font-semibold transition-all duration-200"
                style={{
                  background: style.bg,
                  color: style.text,
                  borderColor: style.border ?? style.bg,
                  boxShadow: state === 'swapping' || state === 'comparing' ? '0 0 0 2px rgba(0,0,0,0.06)' : undefined
                }}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>

      {step?.message && (
        <div className="rounded-lg border px-4 py-3 bg-slate-50 text-slate-700" style={{ borderColor: sortingColors.border }}>
          {step.message}
        </div>
      )}
    </div>
  );
};

