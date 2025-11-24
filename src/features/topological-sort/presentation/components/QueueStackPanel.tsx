import { TopologicalSortStep } from '@features/topological-sort/domain/entities/TopologicalSortStep';

export interface QueueStackPanelProps {
  currentStep: TopologicalSortStep | null;
  nodes: Array<{ id: number; label: string }>;
}

export function QueueStackPanel({ currentStep, nodes }: QueueStackPanelProps) {
  if (!currentStep) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6" data-testid="queue-stack-panel">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Fila/Pilha</h2>
        <div className="text-slate-400 text-center italic py-4">
          Aguardando início da simulação
        </div>
      </div>
    );
  }

  const dataStructure = currentStep.dataStructure;
  const queue = currentStep.queue;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="queue-stack-panel">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        {dataStructure === 'stack' ? 'Pilha' : 'Fila'} ({dataStructure === 'stack' ? 'LIFO' : 'FIFO'})
      </h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {queue.length > 0 ? (
          dataStructure === 'stack' ? (
            // Stack: show from top to bottom (reverse order)
            [...queue].reverse().map((nodeId, idx) => {
              const node = nodes.find(n => n.id === nodeId);
              return (
                <div
                  key={`${nodeId}-${idx}`}
                  className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <span className="font-bold text-blue-900">{node?.label || `N${nodeId}`}</span>
                  <span className="text-xs text-blue-600 italic">
                    {idx === 0 ? 'Topo' : ''}
                  </span>
                </div>
              );
            })
          ) : (
            // Queue: show from front to back
            queue.map((nodeId, idx) => {
              const node = nodes.find(n => n.id === nodeId);
              return (
                <div
                  key={`${nodeId}-${idx}`}
                  className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 flex justify-between items-center"
                >
                  <span className="font-bold text-blue-900">{node?.label || `N${nodeId}`}</span>
                  <span className="text-xs text-blue-600 italic">
                    {idx === 0 ? 'Frente' : idx === queue.length - 1 ? 'Fim' : ''}
                  </span>
                </div>
              );
            })
          )
        ) : (
          <div className="text-slate-400 text-center italic py-4">
            {dataStructure === 'stack' ? 'Pilha vazia' : 'Fila vazia'}
          </div>
        )}
      </div>
    </div>
  );
}

