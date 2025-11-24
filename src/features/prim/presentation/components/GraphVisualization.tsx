import { Maximize2, Minimize2 } from 'lucide-react';
import { Node } from '@features/prim/domain/entities/Node';
import { Edge } from '@features/prim/domain/entities/Edge';
import { PrimStep } from '@features/prim/domain/entities/PrimStep';

export interface GraphVisualizationProps {
  nodes: Node[];
  edges: Edge[];
  currentStep: PrimStep | null;
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
    if (node.isRoot) return 'fill-purple-400 stroke-purple-700';
    if (node.isInTree) return 'fill-green-400 stroke-green-700';
    return 'fill-gray-300 stroke-gray-500';
  };

  const getEdgeStyle = (edge: Edge) => {
    if (edge.isInMST) return 'stroke-green-600 stroke-[4]';
    if (edge.isEvaluating) return 'stroke-yellow-500 stroke-[3]';
    if (edge.highlighted) return 'stroke-blue-500 stroke-[3]';
    return 'stroke-gray-400 stroke-2';
  };

  const displayNodes = currentStep ? currentStep.nodes : nodes;
  const displayEdges = currentStep ? currentStep.edges : edges;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">Grafo Não-Orientado Ponderado</h2>
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
          
          // Posição do peso (meio da aresta)
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          
          return (
            <g key={idx}>
              {/* Linha */}
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                className={getEdgeStyle(edge)}
              />
              {/* Peso */}
              <circle cx={midX} cy={midY} r="14" className="fill-white stroke-gray-300" strokeWidth="2" />
              <text
                x={midX}
                y={midY + 5}
                textAnchor="middle"
                className="text-sm font-bold fill-slate-700"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}

        {/* Nós */}
        {displayNodes.map((node) => (
          <g 
            key={node.id}
            onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
            style={{ cursor: 'grab' }}
            className="transition-opacity hover:opacity-80"
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="25"
              className={getNodeColor(node)}
              strokeWidth="3"
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="font-bold text-lg fill-slate-800 pointer-events-none"
            >
              {node.label}
            </text>
            {node.isRoot && (
              <text
                x={node.x}
                y={node.y + 45}
                textAnchor="middle"
                className="text-xs fill-purple-700 font-bold pointer-events-none"
              >
                raiz
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Legenda */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-sm text-slate-700 mb-2">Vértices:</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-purple-700"></div>
              <span>Raiz (início)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-700"></div>
              <span>Em U (na árvore)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-500"></div>
              <span>Em V-U (fora)</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-slate-700 mb-2">MST:</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-green-600"></div>
              <span>Aresta na MST</span>
            </div>
            {currentStep && currentStep.totalCost !== undefined && (
              <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                <span className="font-bold text-green-800">Custo: {currentStep.totalCost}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

