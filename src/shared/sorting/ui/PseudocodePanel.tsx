import React from 'react';
import { SortingPseudocode } from '../types';
import { sortingColors } from './theme';

interface PseudocodePanelProps {
  pseudocode: SortingPseudocode;
  activeLine?: number;
}

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({ pseudocode, activeLine }) => {
  return (
    <div className="rounded-xl shadow-sm border" style={{ borderColor: sortingColors.border, background: sortingColors.card }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: sortingColors.border }}>
        <p className="text-sm font-semibold text-slate-800">{pseudocode.title}</p>
      </div>
      <div className="font-mono text-sm bg-slate-900 text-slate-200 rounded-b-xl p-4 overflow-x-auto">
        {pseudocode.lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = activeLine === lineNumber;
          return (
            <div
              key={lineNumber}
              data-testid={`pseudocode-line-${lineNumber}`}
              data-active={isActive}
              className={`flex transition-colors ${isActive ? 'bg-amber-500/20' : ''}`}
            >
              <span className="text-slate-500 w-8 text-right pr-3 select-none">{lineNumber}</span>
              <span className={isActive ? 'text-amber-200 font-semibold' : 'text-slate-200'}>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

