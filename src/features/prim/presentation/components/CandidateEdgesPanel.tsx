import { PrimStep } from '@features/prim/domain/entities/PrimStep';

export interface CandidateEdgesPanelProps {
  currentStep: PrimStep | null;
}

export function CandidateEdgesPanel({ currentStep }: CandidateEdgesPanelProps) {
  if (!currentStep || !currentStep.candidateEdges || currentStep.candidateEdges.length === 0) {
    return null;
  }

  const sortedCandidates = [...currentStep.candidateEdges].sort((a, b) => a.weight - b.weight);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="candidate-edges-panel">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Arestas Candidatas
      </h2>
      <p className="text-xs text-slate-600 mb-3">Entre U e V-U:</p>
      <div className="space-y-2">
        {sortedCandidates.map((edge, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-2 border-2 ${
              idx === 0
                ? 'bg-yellow-50 border-yellow-400'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm">
                {currentStep.nodes[edge.from].label} — {currentStep.nodes[edge.to].label}
              </span>
              <span className="font-bold text-blue-700">{edge.weight}</span>
            </div>
            {idx === 0 && (
              <div className="text-xs text-yellow-700 mt-1">← mínima</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

