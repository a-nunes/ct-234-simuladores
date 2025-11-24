import { Route } from 'lucide-react';
import { Node } from '@features/dijkstra/domain/entities/Node';
import { DijkstraStep } from '@features/dijkstra/domain/entities/DijkstraStep';

export interface DistanceTablePanelProps {
  nodes: Node[];
  currentStep: DijkstraStep | null;
  getDistanceDisplay: (dist: number) => string;
  isExpanded?: boolean;
}

export function DistanceTablePanel({ 
  nodes, 
  currentStep, 
  getDistanceDisplay,
  isExpanded = false 
}: DistanceTablePanelProps) {
  if (isExpanded) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6" data-testid="distance-table-panel">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          <Route className="inline mr-2" size={20} />
          Distâncias Atuais
        </h2>
        <div className="space-y-2">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`rounded-lg p-3 border-2 ${
                node.isSource
                  ? 'bg-purple-50 border-purple-200'
                  : node.state === 'visited'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-800">{node.label}</span>
                <span className="font-mono text-lg font-bold text-blue-700">
                  {getDistanceDisplay(node.dist)}
                </span>
              </div>
              {node.pred !== null && currentStep && (
                <div className="text-xs text-slate-600">
                  via {currentStep.nodes[node.pred].label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="distance-table-panel">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        <Route className="inline mr-2" size={20} />
        Distâncias e Predecessores
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-200">
              <th className="px-2 py-1 text-left">Vértice</th>
              <th className="px-2 py-1 text-center">Estado</th>
              <th className="px-2 py-1 text-center">dist</th>
              <th className="px-2 py-1 text-center">pred</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr key={node.id} className="border-b border-slate-200">
                <td className="px-2 py-1 font-bold flex items-center gap-1">
                  {node.isSource && <span className="text-green-600">★</span>}
                  {node.label}
                </td>
                <td className="px-2 py-1 text-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    node.state === 'unvisited' ? 'bg-gray-400' :
                    node.state === 'visiting' ? 'bg-yellow-500' : 'bg-green-600'
                  }`}></span>
                </td>
                <td className="px-2 py-1 text-center font-mono text-sm">
                  {getDistanceDisplay(node.dist)}
                </td>
                <td className="px-2 py-1 text-center font-mono text-sm">
                  {node.pred !== null && currentStep ? currentStep.nodes[node.pred].label : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

