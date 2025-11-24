import React, { useState } from 'react';
import { GitMerge, Sparkles } from 'lucide-react';
import { KruskalSimulator } from '@features/kruskal';
import { PrimSimulator } from '@features/prim';

type SimulationMode = 'kruskal' | 'prim';

/**
 * Wrapper component that manages switching between Kruskal and Prim algorithms.
 * Maintains compatibility with App.tsx.
 */
const MSTSimulator = () => {
  const [mode, setMode] = useState<SimulationMode>('kruskal');

  return (
    <div>
      {/* Mode Selector Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Árvore Geradora de Custo Mínimo (MST)
        </h1>
        <p className="text-slate-600 mb-4">
          Algoritmos para encontrar a árvore geradora de custo mínimo em grafos ponderados.
        </p>
        
        {/* Seletor de Modo */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setMode('kruskal')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'kruskal'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            }`}
          >
            <GitMerge className="inline mr-2" size={18} />
            Kruskal (Union-Find)
          </button>
          <button
            onClick={() => setMode('prim')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              mode === 'prim'
                ? 'bg-violet-600 text-white'
                : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
            }`}
          >
            <Sparkles className="inline mr-2" size={18} />
            Prim (Crescimento)
          </button>
        </div>
      </div>

      {/* Render appropriate simulator */}
      {mode === 'kruskal' ? <KruskalSimulator /> : <PrimSimulator />}
    </div>
  );
};

export default MSTSimulator;
