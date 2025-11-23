import { PriorityQueueItem } from '@features/dijkstra/domain/entities/PriorityQueueItem';

export interface PriorityQueuePanelProps {
  priorityQueue: PriorityQueueItem[];
  getDistanceDisplay: (dist: number) => string;
}

export function PriorityQueuePanel({ priorityQueue, getDistanceDisplay }: PriorityQueuePanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Fila de Prioridade (S)</h2>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {priorityQueue.length > 0 ? (
          priorityQueue
            .sort((a, b) => a.dist - b.dist)
            .map((item, idx) => (
              <div
                key={idx}
                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 flex justify-between items-center"
              >
                <span className="font-bold text-blue-900">{item.nodeLabel}</span>
                <span className="font-mono text-blue-700 text-sm">
                  dist = {getDistanceDisplay(item.dist)}
                </span>
              </div>
            ))
        ) : (
          <div className="text-slate-400 text-center italic py-4">
            Fila vazia
          </div>
        )}
      </div>
    </div>
  );
}

