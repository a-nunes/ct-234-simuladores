import { TopologicalSortStep } from '@features/topological-sort/domain/entities/TopologicalSortStep';

export interface TopologicalOrderPanelProps {
  currentStep: TopologicalSortStep | null;
  nodes: Array<{ id: number; label: string }>;
}

export function TopologicalOrderPanel({ currentStep, nodes }: TopologicalOrderPanelProps) {
  if (!currentStep) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6" data-testid="topological-order-panel">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Ordem Topológica</h2>
        <div className="text-slate-400 text-center italic py-4">
          Aguardando início da simulação
        </div>
      </div>
    );
  }

  const topologicalOrder = currentStep.topologicalOrder;
  const counter = currentStep.counter;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="topological-order-panel">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Ordem Topológica (f[v] = counter)
      </h2>
      <div className="mb-4">
        <div className="text-sm text-slate-600 mb-2">
          Counter: <span className="font-bold text-blue-700">{counter}</span> / {nodes.length}
        </div>
        {currentStep.type === 'cycle-detected' && (
          <div className="text-sm text-red-600 font-semibold mb-2">
            ⚠️ Grafo cíclico detectado!
          </div>
        )}
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {topologicalOrder.length > 0 ? (
          topologicalOrder.map((nodeId, idx) => {
            const node = nodes.find(n => n.id === nodeId);
            const order = idx + 1;
            return (
              <div
                key={nodeId}
                className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-purple-900 text-lg">{order}.</span>
                  <span className="font-bold text-purple-900 text-xl">{node?.label || `N${nodeId}`}</span>
                </div>
                <span className="text-sm text-purple-600 font-mono">
                  f[{node?.label || `N${nodeId}`}] = {order}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-slate-400 text-center italic py-4">
            Nenhum vértice processado ainda
          </div>
        )}
      </div>
      {topologicalOrder.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="text-sm text-slate-600">
            <span className="font-semibold">Ordem:</span>{' '}
            <span className="font-mono text-slate-800">
              {topologicalOrder.map(id => nodes.find(n => n.id === id)?.label).join(' → ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

