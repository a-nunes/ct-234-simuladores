import { FinalDistance } from '@features/dijkstra/domain/entities/DijkstraStep';
import { Node } from '@features/dijkstra/domain/entities/Node';

export interface FinalPathsPanelProps {
  finalDistances: FinalDistance[] | undefined;
  nodes: Node[];
  sourceNodeLabel: string;
}

export function FinalPathsPanel({ finalDistances, nodes, sourceNodeLabel }: FinalPathsPanelProps) {
  if (!finalDistances || finalDistances.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg p-6" data-testid="final-paths-panel">
      <h2 className="text-xl font-bold text-green-900 mb-4">
        ✅ Caminhos Mínimos
      </h2>
      <div className="space-y-3">
        {finalDistances.map((result) => (
          <div key={result.nodeId} className="bg-white rounded-lg p-3 border-2 border-green-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-800">
                {sourceNodeLabel} → {nodes[result.nodeId].label}
              </span>
              <span className="font-mono text-lg font-bold text-green-700">
                {result.dist}
              </span>
            </div>
            <div className="text-xs text-slate-600 font-mono">
              {result.path.map(nodeId => nodes[nodeId].label).join(' → ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

