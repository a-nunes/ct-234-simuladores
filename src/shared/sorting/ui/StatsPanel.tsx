import React from 'react';
import { SortingComplexity } from '../types';
import { sortingColors } from './theme';

interface StatsPanelProps {
  complexity: SortingComplexity;
}

const Item: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-lg border px-3 py-2" style={{ borderColor: sortingColors.border }}>
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm font-semibold text-slate-800">{value}</span>
  </div>
);

export const StatsPanel: React.FC<StatsPanelProps> = ({ complexity }) => {
  return (
    <div className="rounded-xl shadow-sm border p-4 space-y-3" style={{ borderColor: sortingColors.border, background: sortingColors.card }}>
      <p className="text-sm font-semibold text-slate-800">Detalhes do Algoritmo</p>
      <Item label="Tempo (Pior)" value={complexity.worst} />
      <Item label="Tempo (Médio)" value={complexity.average} />
      <Item label="Tempo (Melhor)" value={complexity.best} />
      <Item label="Espaço" value={complexity.space} />
    </div>
  );
};

