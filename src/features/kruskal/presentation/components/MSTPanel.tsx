import { KruskalStep } from '@features/kruskal/domain/entities/KruskalStep';

export interface MSTPanelProps {
  currentStep: KruskalStep | null;
}

export function MSTPanel({ currentStep }: MSTPanelProps) {
  if (!currentStep || !currentStep.mstEdges || currentStep.mstEdges.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg p-6" data-testid="mst-panel">
      <h2 className="text-xl font-bold text-green-900 mb-4">
        MST Atual ({currentStep.mstEdges.length} arestas)
      </h2>
      <div className="space-y-2">
        {currentStep.mstEdges.map((edge, idx) => (
          <div key={idx} className="bg-white rounded-lg p-3 border-2 border-green-200">
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm">
                {currentStep.nodes[edge.from].label} — {currentStep.nodes[edge.to].label}
              </span>
              <span className="font-bold text-green-700">{edge.weight}</span>
            </div>
          </div>
        ))}
      </div>
      {currentStep.totalCost !== undefined && (
        <div className="mt-3 p-3 bg-green-100 rounded-lg border-2 border-green-300">
          <div className="text-center">
            <div className="text-sm text-green-700">Custo Total:</div>
            <div className="text-2xl font-bold text-green-900">{currentStep.totalCost}</div>
          </div>
        </div>
      )}
    </div>
  );
}

