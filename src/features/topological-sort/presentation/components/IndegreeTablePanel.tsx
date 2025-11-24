import { TopologicalSortStep } from '@features/topological-sort/domain/entities/TopologicalSortStep';

export interface IndegreeTablePanelProps {
  currentStep: TopologicalSortStep | null;
  nodes: Array<{ id: number; label: string }>;
}

export function IndegreeTablePanel({ currentStep, nodes }: IndegreeTablePanelProps) {
  if (!currentStep) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6" data-testid="indegree-table-panel">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Grau de Entrada</h2>
        <div className="text-slate-400 text-center italic py-4">
          Aguardando início da simulação
        </div>
      </div>
    );
  }

  const indegree = currentStep.indegree;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="indegree-table-panel">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Grau de Entrada (indegree)</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {nodes.map((node) => {
          const nodeIndegree = indegree[node.id] ?? 0;
          const isZero = nodeIndegree === 0;
          return (
            <div
              key={node.id}
              className={`border-2 rounded-lg p-3 flex justify-between items-center ${
                isZero
                  ? 'bg-green-50 border-green-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="font-bold text-slate-900">{node.label}</span>
              <span
                className={`font-mono text-lg font-bold ${
                  isZero ? 'text-green-700' : 'text-slate-700'
                }`}
              >
                {nodeIndegree}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

