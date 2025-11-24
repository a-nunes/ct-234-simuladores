import { KruskalStep } from '@features/kruskal/domain/entities/KruskalStep';

export interface SortedEdgesPanelProps {
  currentStep: KruskalStep | null;
}

export function SortedEdgesPanel({ currentStep }: SortedEdgesPanelProps) {
  if (!currentStep || !currentStep.sortedEdges || currentStep.sortedEdges.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="sorted-edges-panel">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Arestas Ordenadas por Peso
      </h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {currentStep.sortedEdges.map((edge, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-3 border-2 ${
              idx === currentStep.currentEdgeIndex
                ? 'bg-yellow-50 border-yellow-400'
                : idx < (currentStep.currentEdgeIndex || 0)
                ? 'bg-green-50 border-green-200'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm">
                {currentStep.nodes[edge.from].label} — {currentStep.nodes[edge.to].label}
              </span>
              <span className="font-bold text-blue-700">{edge.weight}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

