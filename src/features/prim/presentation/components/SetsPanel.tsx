import { PrimStep } from '@features/prim/domain/entities/PrimStep';

export interface SetsPanelProps {
  currentStep: PrimStep | null;
}

export function SetsPanel({ currentStep }: SetsPanelProps) {
  if (!currentStep || !currentStep.inTree) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="sets-panel">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Conjuntos</h2>
      <div className="space-y-3">
        <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">U (na árvore):</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(currentStep.inTree).map(nodeId => (
              <span key={nodeId} className="bg-green-200 text-green-900 px-3 py-1 rounded-lg font-bold">
                {currentStep.nodes[nodeId].label}
              </span>
            ))}
          </div>
        </div>
        <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-lg">
          <h3 className="font-semibold text-slate-800 mb-2">V - U (fora):</h3>
          <div className="flex flex-wrap gap-2">
            {currentStep.outTree && Array.from(currentStep.outTree).length > 0 ? (
              Array.from(currentStep.outTree).map(nodeId => (
                <span key={nodeId} className="bg-slate-200 text-slate-900 px-3 py-1 rounded-lg font-bold">
                  {currentStep.nodes[nodeId].label}
                </span>
              ))
            ) : (
              <span className="text-slate-400 italic">vazio</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

