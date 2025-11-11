import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  MousePointer, 
  Plus, 
  ArrowRight, 
  Trash2, 
  Download, 
  Upload, 
  FileText,
  X,
  Check,
  Book
} from 'lucide-react';

export type GraphType = 'directed' | 'undirected';
export type WeightType = 'unweighted' | 'weighted';

export interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

export interface GraphDefinition {
  nodes: GraphNode[];
  edges: GraphEdge[];
  type: GraphType;
  weighted: WeightType;
}

type ToolMode = 'select' | 'add-node' | 'add-edge' | 'delete';

interface Props {
  onGraphChange: (graph: GraphDefinition) => void;
  defaultType?: GraphType;
  defaultWeighted?: WeightType;
  allowTypeChange?: boolean;
  examples?: { name: string; graph: GraphDefinition }[];
}

const GraphEditor: React.FC<Props> = ({ 
  onGraphChange, 
  defaultType = 'directed',
  defaultWeighted = 'unweighted',
  allowTypeChange = true,
  examples = []
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [graphType, setGraphType] = useState<GraphType>(defaultType);
  const [weightType, setWeightType] = useState<WeightType>(defaultWeighted);
  
  const [toolMode, setToolMode] = useState<ToolMode>('select');
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [edgeStart, setEdgeStart] = useState<number | null>(null);
  const [draggingNode, setDraggingNode] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [textInput, setTextInput] = useState('');
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  
  const [editingEdge, setEditingEdge] = useState<{ from: number; to: number } | null>(null);
  const [edgeWeightInput, setEdgeWeightInput] = useState('');
  
  const canvasRef = useRef<SVGSVGElement>(null);
  const nextNodeId = useRef(0);

  // Notifica mudanças
  useEffect(() => {
    onGraphChange({
      nodes,
      edges,
      type: graphType,
      weighted: weightType
    });
  }, [nodes, edges, graphType, weightType, onGraphChange]);

  // Gera label para novo nó (A, B, C, ...)
  const getNextLabel = useCallback(() => {
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return labels[nextNodeId.current % 26];
  }, []);

  // Converte grafo para texto
  const graphToText = useCallback(() => {
    if (nodes.length === 0) return '';
    
    const adjacencyMap = new Map<number, Array<{ to: number; weight?: number }>>();
    
    // Inicializa todos os nós
    nodes.forEach(node => {
      adjacencyMap.set(node.id, []);
    });
    
    // Adiciona arestas
    edges.forEach(edge => {
      const list = adjacencyMap.get(edge.from) || [];
      list.push({ to: edge.to, weight: edge.weight });
      adjacencyMap.set(edge.from, list);
    });
    
    const arrow = graphType === 'directed' ? '->' : '-';
    const lines: string[] = [];
    
    adjacencyMap.forEach((neighbors, nodeId) => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;
      
      if (neighbors.length === 0) {
        // Nó isolado
        lines.push(node.label);
      } else {
        const targets = neighbors.map(n => {
          const targetNode = nodes.find(tn => tn.id === n.to);
          if (!targetNode) return '';
          
          if (weightType === 'weighted' && n.weight !== undefined) {
            return `${targetNode.label}(${n.weight})`;
          }
          return targetNode.label;
        }).filter(Boolean);
        
        if (targets.length > 0) {
          lines.push(`${node.label} ${arrow} ${targets.join(', ')}`);
        }
      }
    });
    
    return lines.join('\n');
  }, [nodes, edges, graphType, weightType]);

  // Converte texto para grafo
  const textToGraph = useCallback((text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];
    const nodeMap = new Map<string, number>();
    
    let currentId = 0;
    
    // Função auxiliar para obter ou criar nó
    const getOrCreateNode = (label: string): number => {
      if (nodeMap.has(label)) {
        return nodeMap.get(label)!;
      }
      
      const id = currentId++;
      const angle = (2 * Math.PI * id) / Math.max(lines.length, 4);
      const radius = 150;
      const x = 300 + radius * Math.cos(angle);
      const y = 200 + radius * Math.sin(angle);
      
      newNodes.push({ id, label, x, y });
      nodeMap.set(label, id);
      return id;
    };
    
    lines.forEach(line => {
      // Remove espaços extras
      line = line.replace(/\s+/g, ' ');
      
      // Verifica se é nó isolado
      if (!/->|-/.test(line)) {
        getOrCreateNode(line.trim());
        return;
      }
      
      // Parseia aresta
      const arrowMatch = line.match(/(.+?)\s*(->\s*|-\s*)(.+)/);
      if (!arrowMatch) return;
      
      const fromLabel = arrowMatch[1].trim();
      const targets = arrowMatch[3].split(',').map(t => t.trim());
      
      const fromId = getOrCreateNode(fromLabel);
      
      targets.forEach(target => {
        // Parseia peso se tiver
        const weightMatch = target.match(/^(.+?)\((\d+)\)$/);
        
        let toLabel: string;
        let weight: number | undefined;
        
        if (weightMatch) {
          toLabel = weightMatch[1].trim();
          weight = parseInt(weightMatch[2]);
        } else {
          toLabel = target.trim();
        }
        
        const toId = getOrCreateNode(toLabel);
        newEdges.push({ from: fromId, to: toId, weight });
        
        // Se não-direcionado, adiciona aresta reversa
        if (graphType === 'undirected') {
          newEdges.push({ from: toId, to: fromId, weight });
        }
      });
    });
    
    setNodes(newNodes);
    setEdges(newEdges);
    nextNodeId.current = currentId;
    setShowTextEditor(false);
  }, [graphType]);

  // Event handlers
  const handleCanvasClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (toolMode === 'add-node') {
      const label = getNextLabel();
      const newNode: GraphNode = {
        id: nextNodeId.current++,
        label,
        x,
        y
      };
      setNodes([...nodes, newNode]);
    } else if (toolMode === 'select') {
      setSelectedNode(null);
      setEdgeStart(null);
    }
  }, [toolMode, nodes, getNextLabel]);

  const handleNodeClick = useCallback((nodeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (toolMode === 'delete') {
      // Remove nó e todas as arestas conectadas
      setNodes(nodes.filter(n => n.id !== nodeId));
      setEdges(edges.filter(e => e.from !== nodeId && e.to !== nodeId));
    } else if (toolMode === 'add-edge') {
      if (edgeStart === null) {
        setEdgeStart(nodeId);
      } else if (edgeStart !== nodeId) {
        // Verifica se aresta já existe
        const exists = edges.some(e => e.from === edgeStart && e.to === nodeId);
        if (!exists) {
          const newEdge: GraphEdge = { from: edgeStart, to: nodeId };
          
          // Se ponderado, pede o peso
          if (weightType === 'weighted') {
            setEditingEdge({ from: edgeStart, to: nodeId });
            setEdgeWeightInput('1');
          } else {
            setEdges([...edges, newEdge]);
            if (graphType === 'undirected') {
              setEdges(prev => [...prev, { from: nodeId, to: edgeStart }]);
            }
          }
        }
        setEdgeStart(null);
      }
    } else if (toolMode === 'select') {
      setSelectedNode(nodeId);
    }
  }, [toolMode, edgeStart, nodes, edges, weightType, graphType]);

  const handleNodeMouseDown = useCallback((nodeId: number, e: React.MouseEvent) => {
    if (toolMode !== 'select') return;
    
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDraggingNode(nodeId);
    setDragOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
  }, [toolMode, nodes]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (draggingNode === null || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setNodes(nodes.map(n => 
      n.id === draggingNode 
        ? { ...n, x, y }
        : n
    ));
  }, [draggingNode, nodes]);

  const handleMouseUp = useCallback(() => {
    setDraggingNode(null);
  }, []);

  const handleEdgeClick = useCallback((edge: GraphEdge, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (toolMode === 'delete') {
      setEdges(edges.filter(e => !(e.from === edge.from && e.to === edge.to)));
      // Se não-direcionado, remove reversa também
      if (graphType === 'undirected') {
        setEdges(prev => prev.filter(e => !(e.from === edge.to && e.to === edge.from)));
      }
    }
  }, [toolMode, edges, graphType]);

  const handleSaveWeight = useCallback(() => {
    if (!editingEdge) return;
    
    const weight = parseInt(edgeWeightInput) || 1;
    const newEdge: GraphEdge = { ...editingEdge, weight };
    setEdges([...edges, newEdge]);
    
    if (graphType === 'undirected') {
      setEdges(prev => [...prev, { from: editingEdge.to, to: editingEdge.from, weight }]);
    }
    
    setEditingEdge(null);
    setEdgeWeightInput('');
  }, [editingEdge, edgeWeightInput, edges, graphType]);

  const loadExample = useCallback((graph: GraphDefinition) => {
    setNodes(graph.nodes);
    setEdges(graph.edges);
    setGraphType(graph.type);
    setWeightType(graph.weighted);
    nextNodeId.current = Math.max(...graph.nodes.map(n => n.id), -1) + 1;
    setShowExamples(false);
  }, []);

  const clearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
    nextNodeId.current = 0;
    setSelectedNode(null);
    setEdgeStart(null);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-800">Editor de Grafo</h2>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowTextEditor(!showTextEditor)}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
          >
            <FileText size={16} />
            {showTextEditor ? 'Fechar' : 'Editor de Texto'}
          </button>
          
          {examples.length > 0 && (
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <Book size={16} />
              Exemplos
            </button>
          )}
          
          <button
            onClick={clearGraph}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold flex items-center gap-2"
          >
            <Trash2 size={16} />
            Limpar
          </button>
        </div>
      </div>

      {/* Configurações */}
      {allowTypeChange && (
        <div className="mb-4 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tipo de Direção
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={graphType === 'directed'}
                    onChange={() => setGraphType('directed')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Direcionado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={graphType === 'undirected'}
                    onChange={() => setGraphType('undirected')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Não-Direcionado</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tipo de Peso
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={weightType === 'unweighted'}
                    onChange={() => setWeightType('unweighted')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Não-Ponderado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={weightType === 'weighted'}
                    onChange={() => setWeightType('weighted')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Ponderado</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ferramentas */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setToolMode('select')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            toolMode === 'select'
              ? 'bg-slate-700 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <MousePointer size={18} />
          Selecionar/Arrastar
        </button>
        
        <button
          onClick={() => setToolMode('add-node')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            toolMode === 'add-node'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          <Plus size={18} />
          Adicionar Vértice
        </button>
        
        <button
          onClick={() => setToolMode('add-edge')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            toolMode === 'add-edge'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          <ArrowRight size={18} />
          Adicionar Aresta
        </button>
        
        <button
          onClick={() => setToolMode('delete')}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
            toolMode === 'delete'
              ? 'bg-red-600 text-white'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          <Trash2 size={18} />
          Deletar
        </button>
      </div>

      {/* Canvas */}
      <div className="relative">
        <svg
          ref={canvasRef}
          width="600"
          height="400"
          className={`border-2 border-slate-200 rounded-lg bg-white ${
            toolMode === 'add-node' ? 'cursor-crosshair' : 'cursor-default'
          }`}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Arestas */}
          {edges.map((edge, idx) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            
            if (!fromNode || !toNode) return null;
            
            // Evita desenhar arestas duplicadas em grafos não-direcionados
            if (graphType === 'undirected' && fromNode.id > toNode.id) return null;
            
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const unitX = dx / length;
            const unitY = dy / length;
            
            const startX = fromNode.x + unitX * 25;
            const startY = fromNode.y + unitY * 25;
            const endX = toNode.x - unitX * 25;
            const endY = toNode.y - unitY * 25;
            
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            
            return (
              <g key={`${edge.from}-${edge.to}-${idx}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="#64748b"
                  strokeWidth="2"
                  className="cursor-pointer hover:stroke-red-500"
                  onClick={(e) => handleEdgeClick(edge, e)}
                />
                
                {graphType === 'directed' && (
                  <polygon
                    points={`${endX},${endY} ${endX - unitX * 10 - unitY * 5},${endY - unitY * 10 + unitX * 5} ${endX - unitX * 10 + unitY * 5},${endY - unitY * 10 - unitX * 5}`}
                    fill="#64748b"
                  />
                )}
                
                {weightType === 'weighted' && edge.weight !== undefined && (
                  <text
                    x={midX}
                    y={midY - 5}
                    textAnchor="middle"
                    className="text-sm font-bold fill-blue-600"
                    style={{ pointerEvents: 'none' }}
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Linha temporária ao criar aresta */}
          {toolMode === 'add-edge' && edgeStart !== null && (
            <line
              x1={nodes.find(n => n.id === edgeStart)?.x}
              y1={nodes.find(n => n.id === edgeStart)?.y}
              x2={nodes.find(n => n.id === edgeStart)?.x}
              y2={nodes.find(n => n.id === edgeStart)?.y}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="pointer-events-none"
            />
          )}
          
          {/* Vértices */}
          {nodes.map((node) => (
            <g
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
              onClick={(e) => handleNodeClick(node.id, e)}
              className="cursor-pointer"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r="25"
                className={`${
                  selectedNode === node.id
                    ? 'fill-yellow-300 stroke-yellow-600'
                    : edgeStart === node.id
                    ? 'fill-blue-300 stroke-blue-600'
                    : 'fill-slate-300 stroke-slate-500'
                } hover:fill-yellow-200`}
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
            </g>
          ))}
        </svg>
        
        {/* Info do modo atual */}
        <div className="mt-2 text-sm text-slate-600">
          {toolMode === 'select' && '🖱️ Clique e arraste vértices para reorganizar'}
          {toolMode === 'add-node' && '➕ Clique no canvas para adicionar vértices'}
          {toolMode === 'add-edge' && edgeStart === null && '→ Clique no vértice de origem'}
          {toolMode === 'add-edge' && edgeStart !== null && '→ Clique no vértice de destino'}
          {toolMode === 'delete' && '🗑️ Clique em vértices ou arestas para deletar'}
        </div>
      </div>

      {/* Editor de Texto */}
      {showTextEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Editor de Texto
            </h2>
            
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 text-sm mb-2">Sintaxe:</h3>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• <strong>Vértice isolado:</strong> <code className="bg-blue-100 px-1">D</code></li>
                <li>• <strong>Arestas (sem peso):</strong> <code className="bg-blue-100 px-1">A {graphType === 'directed' ? '->' : '-'} B, C</code></li>
                <li>• <strong>Arestas (com peso):</strong> <code className="bg-blue-100 px-1">A {graphType === 'directed' ? '->' : '-'} B(7), C(5)</code></li>
              </ul>
            </div>
            
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Exemplo:\nA ${graphType === 'directed' ? '->' : '-'} B, C\nB ${graphType === 'directed' ? '->' : '-'} D\nD`}
              className="w-full h-64 px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm"
            />
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowTextEditor(false)}
                className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const currentText = graphToText();
                  setTextInput(currentText);
                }}
                className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
              >
                Carregar Grafo Atual
              </button>
              <button
                onClick={() => textToGraph(textInput)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Gerar Grafo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exemplos */}
      {showExamples && examples.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Carregar Exemplo
            </h2>
            
            <div className="space-y-2 mb-6">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => loadExample(example.graph)}
                  className="w-full px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-purple-100 hover:text-purple-700 transition-colors font-semibold text-left"
                >
                  {example.name}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setShowExamples(false)}
              className="w-full px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Peso da Aresta */}
      {editingEdge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Peso da Aresta
            </h2>
            
            <p className="text-slate-600 mb-4">
              Aresta de <strong>{nodes.find(n => n.id === editingEdge.from)?.label}</strong> para <strong>{nodes.find(n => n.id === editingEdge.to)?.label}</strong>
            </p>
            
            <input
              type="number"
              min="1"
              value={edgeWeightInput}
              onChange={(e) => setEdgeWeightInput(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-semibold text-center mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveWeight()}
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingEdge(null);
                  setEdgeWeightInput('');
                }}
                className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveWeight}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphEditor;
