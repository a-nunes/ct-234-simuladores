import { Maximize2, Minimize2 } from 'lucide-react';
import { Node } from '@features/topological-sort/domain/entities/Node';
import { Edge } from '@features/topological-sort/domain/entities/Edge';
import { TopologicalSortStep } from '@features/topological-sort/domain/entities/TopologicalSortStep';

export interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  currentStep: TopologicalSortStep | null;
  isExpanded: boolean;
  isDragging: boolean;
  onToggleExpanded: () => void;
  handleNodeMouseDown: (nodeId: number, event: React.MouseEvent<SVGGElement>) => void;
  handleMouseMove: (event: React.MouseEvent<SVGSVGElement>) => void;
  handleMouseUp: () => void;
}

export function GraphVisualization({
  nodes,
  edges,
  currentStep,
  isExpanded,
  isDragging,
  onToggleExpanded,
  handleNodeMouseDown,
  handleMouseMove,
  handleMouseUp
}: GraphVisualizationProps) {
  const getNodeColor = (node: Node) => {
    switch (node.state) {
      case 'unvisited': return 'fill-gray-300 stroke-gray-500';
      case 'processing': return 'fill-yellow-300 stroke-yellow-600';
      case 'processed': return 'fill-green-400 stroke-green-700';
    }
  };

  const getEdgeStyle = (edge: Edge) => {
    if (edge.highlighted) return 'stroke-blue-500 stroke-[3]';
    return 'stroke-gray-400 stroke-2';
  };

  const displayNodes = currentStep ? currentStep.nodes : nodes;
  const displayEdges = currentStep ? currentStep.edges : edges;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Grafo Direcionado</h2>
        <button
          onClick={onToggleExpanded}
          className="flex items-center gap-2 px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
          title={isExpanded ? "Modo Normal" : "Expandir Canvas"}
        >
          {isExpanded ? (
            <>
              <Minimize2 size={18} />
              Normal
            </>
          ) : (
            <>
              <Maximize2 size={18} />
              Expandir
            </>
          )}
        </button>
      </div>
      
      <svg 
        width={isExpanded ? "100%" : "700"} 
        height={isExpanded ? "700" : "400"} 
        viewBox={isExpanded ? "0 0 1000 700" : "0 0 700 400"} 
        className="border-2 border-slate-200 rounded-lg bg-white w-full"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
        {/* Arestas */}
        {displayEdges.map((edge, idx) => {
          const fromNode = displayNodes[edge.from];
          const toNode = displayNodes[edge.to];
          
          if (!fromNode || !toNode) return null;
          
          // Calcular posição da seta
          const dx = toNode.x - fromNode.x;
          const dy = toNode.y - fromNode.y;
          const angle = Math.atan2(dy, dx);
          const length = Math.sqrt(dx * dx + dy * dy);
          
          // Ponto final da linha (antes da seta)
          const arrowSize = 10;
          const endX = fromNode.x + (length - 30) * Math.cos(angle);
          const endY = fromNode.y + (length - 30) * Math.sin(angle);
          
          // Pontas da seta
          const arrowX = toNode.x - 25 * Math.cos(angle);
          const arrowY = toNode.y - 25 * Math.sin(angle);
          const arrowLeft = {
            x: arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
            y: arrowY - arrowSize * Math.sin(angle - Math.PI / 6),
          };
          const arrowRight = {
            x: arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
            y: arrowY - arrowSize * Math.sin(angle + Math.PI / 6),
          };
          
          return (
            <g key={idx}>
              {/* Linha */}
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={endX}
                y2={endY}
                className={getEdgeStyle(edge)}
              />
              {/* Seta */}
              <polygon
                points={`${arrowX},${arrowY} ${arrowLeft.x},${arrowLeft.y} ${arrowRight.x},${arrowRight.y}`}
                className={getEdgeStyle(edge).replace('stroke-', 'fill-')}
              />
            </g>
          );
        })}

        {/* Nós */}
        {displayNodes.map((node) => {
          const nodeIndex = nodes.findIndex(n => n.id === node.id);
          const baseNode = nodeIndex >= 0 ? nodes[nodeIndex] : node;
          
          return (
            <g 
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
              style={{ cursor: 'grab' }}
              className="transition-opacity hover:opacity-80"
            >
              {/* Círculo do nó */}
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                className={getNodeColor(node)}
                strokeWidth="3"
              />
              {/* Label */}
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                className="font-bold text-lg fill-slate-800 pointer-events-none"
              >
                {node.label}
              </text>
              {/* Indegree */}
              {node.indegree !== undefined && (
                <text
                  x={node.x}
                  y={node.y - 35}
                  textAnchor="middle"
                  className="text-sm fill-blue-700 font-bold pointer-events-none"
                >
                  indegree = {node.indegree}
                </text>
              )}
              {/* Topological Order */}
              {node.topologicalOrder !== undefined && (
                <text
                  x={node.x}
                  y={node.y + 45}
                  textAnchor="middle"
                  className="text-xs fill-purple-700 font-bold pointer-events-none"
                >
                  f[{node.label}] = {node.topologicalOrder}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legenda */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-sm text-slate-700 mb-2">Estados:</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-500"></div>
              <span>Não visitado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-yellow-600"></div>
              <span>Processando</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-700"></div>
              <span>Processado</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-slate-700 mb-2">Arestas:</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-blue-500"></div>
              <span>Destacada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-gray-400"></div>
              <span>Normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

