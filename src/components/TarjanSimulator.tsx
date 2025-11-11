import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Play, Shuffle, Navigation, Maximize2, Minimize2 } from 'lucide-react';
import LoadCustomGraphButton from './LoadCustomGraphButton';
import { useGraph } from '../contexts/GraphContext';
import { convertGraphToSimulator } from '../utils/graphConverter';
import { useDragNodes } from '../hooks/useDragNodes';

// Tipos de arcos
type EdgeType = 'none' | 'tree' | 'back' | 'forward' | 'cross';

// Estado de um vértice
type NodeState = 'unvisited' | 'exploring' | 'finished';

interface Edge {
  from: number;
  to: number;
  type: EdgeType;
  highlighted: boolean;
}

interface Node {
  id: number;
  label: string;
  state: NodeState;
  expl: number;
  comp: number;
  x: number;
  y: number;
}

interface CallStackFrame {
  nodeId: number;
  nodeLabel: string;
}

interface SimulationStep {
  nodes: Node[];
  edges: Edge[];
  callStack: CallStackFrame[];
  contadorExpl: number;
  contadorComp: number;
  message: string;
  highlightedNode: number | null;
  highlightedEdge: { from: number; to: number } | null;
  action: 'init' | 'discover' | 'evaluate-edge' | 'classify-tree' | 'classify-back' | 'classify-forward' | 'classify-cross' | 'finish' | 'recursive-call' | 'return';
}

const TarjanSimulator = () => {
  // Estado do simulador
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, label: 'A', state: 'unvisited', expl: 0, comp: 0, x: 150, y: 100 },
    { id: 1, label: 'B', state: 'unvisited', expl: 0, comp: 0, x: 300, y: 100 },
    { id: 2, label: 'C', state: 'unvisited', expl: 0, comp: 0, x: 450, y: 100 },
    { id: 3, label: 'D', state: 'unvisited', expl: 0, comp: 0, x: 225, y: 250 },
    { id: 4, label: 'E', state: 'unvisited', expl: 0, comp: 0, x: 375, y: 250 },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { from: 0, to: 1, type: 'none', highlighted: false },
    { from: 0, to: 3, type: 'none', highlighted: false },
    { from: 1, to: 2, type: 'none', highlighted: false },
    { from: 1, to: 4, type: 'none', highlighted: false },
    { from: 2, to: 4, type: 'none', highlighted: false },
    { from: 3, to: 4, type: 'none', highlighted: false },
    { from: 4, to: 0, type: 'none', highlighted: false },
  ]);

  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showRandomDialog, setShowRandomDialog] = useState(false);
  const [showStartNodeDialog, setShowStartNodeDialog] = useState(false);
  const [numVertices, setNumVertices] = useState(5);
  const [startNode, setStartNode] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Hook para arrastar nós
  const { isDragging, handleNodeMouseDown, handleMouseMove, handleMouseUp } = useDragNodes(
    nodes,
    setNodes,
    isSimulating,
    steps,
    setSteps
  );

  // Função para gerar grafo aleatório
  const generateRandomGraph = useCallback((n: number) => {
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const newNodes: Node[] = [];
    
    // Gera posições em círculo para melhor visualização
    const centerX = 300;
    const centerY = 200;
    const radius = Math.min(150, 100 + n * 10);
    
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2; // Começa no topo
      newNodes.push({
        id: i,
        label: labels[i % labels.length],
        state: 'unvisited',
        expl: 0,
        comp: 0,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    
    // Gera arestas aleatórias
    const newEdges: Edge[] = [];
    const edgeSet = new Set<string>();
    
    // Garantir que o grafo seja conectado (árvore geradora)
    for (let i = 1; i < n; i++) {
      const from = Math.floor(Math.random() * i);
      const edgeKey = `${from}-${i}`;
      edgeSet.add(edgeKey);
      newEdges.push({
        from,
        to: i,
        type: 'none',
        highlighted: false,
      });
    }
    
    // Adicionar arestas extras aleatórias (para criar diferentes tipos de arcos)
    const extraEdges = Math.floor(n * 0.5); // 50% a mais de arestas
    for (let i = 0; i < extraEdges; i++) {
      const from = Math.floor(Math.random() * n);
      const to = Math.floor(Math.random() * n);
      const edgeKey = `${from}-${to}`;
      
      // Evita self-loops e arestas duplicadas
      if (from !== to && !edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        newEdges.push({
          from,
          to,
          type: 'none',
          highlighted: false,
        });
      }
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setShowRandomDialog(false);
  }, []);

  // Hook para acessar o grafo salvo
  const { savedGraph } = useGraph();

  // Função para carregar grafo customizado
  const loadCustomGraph = useCallback(() => {
    if (!savedGraph) return;

    const { nodes: customNodes, edges: customEdges } = convertGraphToSimulator(savedGraph);
    
    // Converte para os tipos específicos do TarjanSimulator
    const tarjanNodes: Node[] = customNodes.map(n => ({
      id: n.id,
      label: n.label,
      state: 'unvisited' as NodeState,
      expl: 0,
      comp: 0,
      x: n.x,
      y: n.y
    }));

    const tarjanEdges: Edge[] = customEdges.map(e => ({
      from: e.from,
      to: e.to,
      type: 'none' as EdgeType,
      highlighted: false
    }));
    
    setNodes(tarjanNodes);
    setEdges(tarjanEdges);
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setStartNode(0); // Reset para primeiro vértice
  }, [savedGraph]);

  // Gera os passos da simulação
  const generateSteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    
    // Cria cópias dos estados iniciais
    const nodesCopy: Node[] = nodes.map(n => ({ ...n }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
    
    let contadorExpl = 0;
    let contadorComp = 0;
    const callStack: CallStackFrame[] = [];
    
    // Cria lista de adjacência
    const adjList: number[][] = new Array(nodes.length).fill(null).map(() => []);
    edges.forEach(edge => {
      adjList[edge.from].push(edge.to);
    });

    // Estado inicial
    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [...callStack],
      contadorExpl,
      contadorComp,
      message: 'Estado inicial. Todos os vértices não visitados (expl = 0).',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'init'
    });

    // Função recursiva DFS (simulada iterativamente)
    const dfst = (v: number) => {
      // Marca descoberta
      contadorExpl++;
      nodesCopy[v].expl = contadorExpl;
      nodesCopy[v].state = 'exploring';
      callStack.push({ nodeId: v, nodeLabel: nodesCopy[v].label });

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl,
        contadorComp,
        message: `DFST(${nodesCopy[v].label}) chamado. Descobrindo vértice ${nodesCopy[v].label}. expl[${nodesCopy[v].label}] = ${contadorExpl}`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'discover'
      });

      // Explora vizinhos
      for (const u of adjList[v]) {
        const edgeIndex = edgesCopy.findIndex(e => e.from === v && e.to === u);
        
        // Destaca a aresta sendo avaliada
        edgesCopy[edgeIndex].highlighted = true;
        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n })),
          edges: edgesCopy.map(e => ({ ...e })),
          callStack: [...callStack],
          contadorExpl,
          contadorComp,
          message: `Avaliando aresta <${nodesCopy[v].label}, ${nodesCopy[u].label}>`,
          highlightedNode: null,
          highlightedEdge: { from: v, to: u },
          action: 'evaluate-edge'
        });

        // Classificação da aresta
        if (nodesCopy[u].expl === 0) {
          // Arco de Árvore
          edgesCopy[edgeIndex].type = 'tree';
          edgesCopy[edgeIndex].highlighted = false;
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp,
            message: `expl[${nodesCopy[u].label}] == 0. Classificado como ÁRVORE (T). Próximo: chamada recursiva DFST(${nodesCopy[u].label})`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'classify-tree'
          });

          dfst(u); // Chamada recursiva

        } else if (nodesCopy[u].expl > nodesCopy[v].expl) {
          // Arco de Avanço
          edgesCopy[edgeIndex].type = 'forward';
          edgesCopy[edgeIndex].highlighted = false;
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp,
            message: `expl[${nodesCopy[u].label}] (${nodesCopy[u].expl}) > expl[${nodesCopy[v].label}] (${nodesCopy[v].expl}). Classificado como AVANÇO (F)`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'classify-forward'
          });

        } else if (nodesCopy[u].comp > 0) {
          // Arco de Cruzamento
          edgesCopy[edgeIndex].type = 'cross';
          edgesCopy[edgeIndex].highlighted = false;
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp,
            message: `expl[${nodesCopy[u].label}] < expl[${nodesCopy[v].label}] e comp[${nodesCopy[u].label}] > 0. Classificado como CRUZAMENTO (C)`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'classify-cross'
          });

        } else {
          // Arco de Retorno
          edgesCopy[edgeIndex].type = 'back';
          edgesCopy[edgeIndex].highlighted = false;
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp,
            message: `expl[${nodesCopy[u].label}] (${nodesCopy[u].expl}) < expl[${nodesCopy[v].label}] (${nodesCopy[v].expl}) e comp[${nodesCopy[u].label}] == 0. Classificado como RETORNO (B)`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'classify-back'
          });
        }
      }

      // Marca término
      contadorComp++;
      nodesCopy[v].comp = contadorComp;
      nodesCopy[v].state = 'finished';
      callStack.pop();

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl,
        contadorComp,
        message: `Exploração de ${nodesCopy[v].label} terminada. comp[${nodesCopy[v].label}] = ${contadorComp}. Retornando.`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'finish'
      });
    };

    // Loop principal - começa pelo vértice selecionado, depois visita os demais
    // Primeiro, tenta o vértice inicial
    if (nodesCopy[startNode].expl === 0) {
      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl,
        contadorComp,
        message: `Iniciando DFS a partir do vértice selecionado: ${nodesCopy[startNode].label}`,
        highlightedNode: startNode,
        highlightedEdge: null,
        action: 'init'
      });
      dfst(startNode);
    }

    // Depois visita os demais vértices não visitados
    for (let i = 0; i < nodesCopy.length; i++) {
      if (nodesCopy[i].expl === 0) {
        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n })),
          edges: edgesCopy.map(e => ({ ...e })),
          callStack: [...callStack],
          contadorExpl,
          contadorComp,
          message: `Procurando nó não visitado. Encontrado: ${nodesCopy[i].label}`,
          highlightedNode: i,
          highlightedEdge: null,
          action: 'init'
        });
        
        dfst(i);
      }
    }

    // Estado final
    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [],
      contadorExpl,
      contadorComp,
      message: 'Algoritmo concluído! Todos os vértices foram explorados.',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'init'
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges, startNode]);

  const handleReset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setNodes(nodes.map(n => ({ ...n, state: 'unvisited', expl: 0, comp: 0 })));
    setEdges(edges.map(e => ({ ...e, type: 'none', highlighted: false })));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentState = steps[currentStep];

  // Cores para estados dos nós
  const getNodeColor = (state: NodeState) => {
    switch (state) {
      case 'unvisited': return 'fill-gray-300 stroke-gray-500';
      case 'exploring': return 'fill-yellow-300 stroke-yellow-600';
      case 'finished': return 'fill-green-400 stroke-green-700';
    }
  };

  // Cores para tipos de arestas
  const getEdgeStyle = (type: EdgeType, highlighted: boolean) => {
    const baseStyle = highlighted ? 'stroke-[3]' : 'stroke-2';
    
    switch (type) {
      case 'none': return `stroke-gray-400 ${baseStyle}`;
      case 'tree': return `stroke-black ${baseStyle}`;
      case 'back': return `stroke-red-600 ${baseStyle} stroke-dasharray-4`;
      case 'forward': return `stroke-green-600 ${baseStyle} stroke-dasharray-4`;
      case 'cross': return `stroke-blue-600 ${baseStyle} stroke-dasharray-4`;
    }
  };

  const getEdgeDashArray = (type: EdgeType) => {
    return (type === 'back' || type === 'forward' || type === 'cross') ? '5,5' : 'none';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Simulador Tarjan - Classificação de Arcos
              </h1>
              <p className="text-slate-600">
                Visualize a Busca em Profundidade (DFS) e como os tempos de exploração e complementação classificam os arcos.
              </p>
            </div>
            
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Navigation className="text-purple-600" size={24} />
                <span className="text-sm font-semibold text-slate-700">
                  Vértice Inicial: <span className="text-purple-700 text-lg">{nodes[startNode]?.label || 'A'}</span>
                </span>
              </div>
              <button
                onClick={() => setShowStartNodeDialog(true)}
                disabled={isSimulating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              >
                Alterar Vértice Inicial
              </button>
            </div>
          </div>
        </div>

        <div className={`grid gap-8 transition-all duration-300 ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Visualização do Grafo */}
          <div className={isExpanded ? 'col-span-1' : 'lg:col-span-2'}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Grafo</h2>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
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
                width={isExpanded ? "100%" : "600"} 
                height={isExpanded ? "700" : "400"} 
                viewBox={isExpanded ? "0 0 900 700" : "0 0 600 400"}
                className="border-2 border-slate-200 rounded-lg bg-white w-full"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: isDragging ? 'grabbing' : 'default' }}
              >
                {/* Arestas */}
                {currentState && currentState.edges.map((edge, idx) => {
                  const fromNode = currentState.nodes[edge.from];
                  const toNode = currentState.nodes[edge.to];
                  
                  // Calcula ponto de seta
                  const dx = toNode.x - fromNode.x;
                  const dy = toNode.y - fromNode.y;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const ratio = (length - 25) / length;
                  const arrowX = fromNode.x + dx * ratio;
                  const arrowY = fromNode.y + dy * ratio;

                  return (
                    <g key={idx}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={arrowX}
                        y2={arrowY}
                        className={getEdgeStyle(edge.type, edge.highlighted)}
                        strokeDasharray={getEdgeDashArray(edge.type)}
                      />
                      {/* Seta */}
                      <polygon
                        points={`${arrowX},${arrowY} ${arrowX - 8},${arrowY - 4} ${arrowX - 8},${arrowY + 4}`}
                        className={edge.type === 'none' ? 'fill-gray-400' : 
                                  edge.type === 'tree' ? 'fill-black' :
                                  edge.type === 'back' ? 'fill-red-600' :
                                  edge.type === 'forward' ? 'fill-green-600' : 'fill-blue-600'}
                        transform={`rotate(${Math.atan2(dy, dx) * 180 / Math.PI}, ${arrowX}, ${arrowY})`}
                      />
                    </g>
                  );
                })}

                {/* Nós */}
                {currentState && currentState.nodes.map((node) => (
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
                      className={getNodeColor(node.state)}
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
                    {/* expl/comp */}
                    <text
                      x={node.x}
                      y={node.y - 35}
                      textAnchor="middle"
                      className="text-xs fill-slate-600 font-mono pointer-events-none"
                    >
                      {node.expl > 0 ? `${node.expl}/${node.comp > 0 ? node.comp : '-'}` : ''}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Legenda */}
              <div className={`mt-4 grid gap-4 ${isExpanded ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2'}`}>
                <div>
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Estados dos Nós:</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-500"></div>
                      <span>Não Visitado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-yellow-600"></div>
                      <span>Em Exploração</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-700"></div>
                      <span>Terminado</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Tipos de Arcos:</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-gray-400"></div>
                      <span>Não Classificado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-black"></div>
                      <span>Árvore (T)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-red-600 border-dashed"></div>
                      <span>Retorno (B)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-green-600 border-dashed"></div>
                      <span>Avanço (F)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-blue-600 border-dashed"></div>
                      <span>Cruzamento (C)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <RotateCcw size={20} />
                    Resetar
                  </button>
                  
                  <button
                    onClick={() => setShowRandomDialog(true)}
                    disabled={isSimulating}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Shuffle size={20} />
                    Grafo Aleatório
                  </button>
                  
                  <LoadCustomGraphButton
                    onLoadGraph={loadCustomGraph}
                    requiredType="directed"
                    requiresWeights={false}
                    disabled={isSimulating}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0 || !isSimulating}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    Anterior
                  </button>
                  
                  {!isSimulating ? (
                    <button
                      onClick={generateSteps}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play size={20} />
                      Iniciar Simulação
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={currentStep === steps.length - 1}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo
                      <ChevronRight size={20} />
                    </button>
                  )}
                </div>
              </div>

              {isSimulating && (
                <div className="mt-4">
                  <div className="text-sm text-slate-600 mb-2">
                    Passo {currentStep + 1} de {steps.length}
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Painel Lateral */}
          <div className={`space-y-4 ${isExpanded ? 'col-span-1' : ''}`}>
            {/* Modo expandido: reorganiza em grid horizontal */}
            {isExpanded ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pilha de Chamadas */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Pilha de Chamadas</h2>
                  <div className="space-y-2">
                    {currentState && currentState.callStack.length > 0 ? (
                      [...currentState.callStack].reverse().map((frame, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-100 border-2 border-purple-300 rounded-lg p-3 text-center font-mono"
                        >
                          DFST({frame.nodeLabel})
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 text-center italic py-4">
                        Pilha vazia
                      </div>
                    )}
                  </div>
                </div>

                {/* Painel de Estado */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Variáveis Globais</h2>
                  
                  {currentState && (
                    <div className="space-y-4">
                      <div className="bg-slate-100 rounded-lg p-3">
                        <div className="text-sm text-slate-600">Contador Exploração (ce)</div>
                        <div className="text-2xl font-bold text-slate-800">{currentState.contadorExpl}</div>
                      </div>
                      
                      <div className="bg-slate-100 rounded-lg p-3">
                        <div className="text-sm text-slate-600">Contador Complementação (cc)</div>
                        <div className="text-2xl font-bold text-slate-800">{currentState.contadorComp}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabela de Vértices */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Tabela de Vértices</h2>
                  {currentState && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-200">
                            <th className="px-2 py-1 text-left">V</th>
                            <th className="px-2 py-1 text-left">Estado</th>
                            <th className="px-2 py-1 text-center">expl</th>
                            <th className="px-2 py-1 text-center">comp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentState.nodes.map((node) => (
                            <tr key={node.id} className="border-b border-slate-200">
                              <td className="px-2 py-1 font-bold">{node.label}</td>
                              <td className="px-2 py-1">
                                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                  node.state === 'unvisited' ? 'bg-gray-400' :
                                  node.state === 'exploring' ? 'bg-yellow-500' : 'bg-green-600'
                                }`}></span>
                                <span className="text-xs">
                                  {node.state === 'unvisited' ? 'NV' :
                                   node.state === 'exploring' ? 'EX' : 'FI'}
                                </span>
                              </td>
                              <td className="px-2 py-1 text-center font-mono">{node.expl || '-'}</td>
                              <td className="px-2 py-1 text-center font-mono">{node.comp || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
            {/* Pilha de Chamadas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Pilha de Chamadas</h2>
              <div className="space-y-2">
                {currentState && currentState.callStack.length > 0 ? (
                  [...currentState.callStack].reverse().map((frame, idx) => (
                    <div
                      key={idx}
                      className="bg-purple-100 border-2 border-purple-300 rounded-lg p-3 text-center font-mono"
                    >
                      DFST({frame.nodeLabel})
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 text-center italic py-4">
                    Pilha vazia
                  </div>
                )}
              </div>
            </div>

            {/* Painel de Estado */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Variáveis Globais</h2>
              
              {currentState && (
                <div className="space-y-4">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <div className="text-sm text-slate-600">Contador Exploração (ce)</div>
                    <div className="text-2xl font-bold text-slate-800">{currentState.contadorExpl}</div>
                  </div>
                  
                  <div className="bg-slate-100 rounded-lg p-3">
                    <div className="text-sm text-slate-600">Contador Complementação (cc)</div>
                    <div className="text-2xl font-bold text-slate-800">{currentState.contadorComp}</div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-slate-700 mb-2">Tabela de Vértices:</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-200">
                            <th className="px-2 py-1 text-left">V</th>
                            <th className="px-2 py-1 text-left">Estado</th>
                            <th className="px-2 py-1 text-center">expl</th>
                            <th className="px-2 py-1 text-center">comp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentState.nodes.map((node) => (
                            <tr key={node.id} className="border-b border-slate-200">
                              <td className="px-2 py-1 font-bold">{node.label}</td>
                              <td className="px-2 py-1">
                                <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                  node.state === 'unvisited' ? 'bg-gray-400' :
                                  node.state === 'exploring' ? 'bg-yellow-500' : 'bg-green-600'
                                }`}></span>
                                <span className="text-xs">
                                  {node.state === 'unvisited' ? 'NV' :
                                   node.state === 'exploring' ? 'EX' : 'FI'}
                                </span>
                              </td>
                              <td className="px-2 py-1 text-center font-mono">{node.expl || '-'}</td>
                              <td className="px-2 py-1 text-center font-mono">{node.comp || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mensagem de Ação */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Ação Atual:</h3>
              <p className="text-sm text-blue-800">
                {currentState ? currentState.message : 'Clique em "Iniciar Simulação" para começar.'}
              </p>
            </div>
            </>
            )}
          </div>
        </div>

        {/* Modal de Seleção de Vértice Inicial */}
        {showStartNodeDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Selecionar Vértice Inicial
              </h2>
              
              <div className="grid grid-cols-4 gap-2 mb-6">
                {nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => {
                      setStartNode(node.id);
                      setShowStartNodeDialog(false);
                      handleReset();
                    }}
                    className={`p-4 rounded-lg font-bold text-lg transition-colors ${
                      startNode === node.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {node.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowStartNodeDialog(false)}
                className="w-full px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Grafo Aleatório */}
        {showRandomDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Gerar Grafo Aleatório
              </h2>
              
              <p className="text-slate-600 mb-6">
                Escolha a quantidade de vértices para o novo grafo. Um grafo direcionado 
                será gerado com arestas aleatórias.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Número de Vértices (3-26)
                </label>
                <input
                  type="number"
                  min="3"
                  max="26"
                  value={numVertices}
                  onChange={(e) => setNumVertices(Math.min(26, Math.max(3, parseInt(e.target.value) || 3)))}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-semibold text-center"
                />
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>Mínimo: 3</span>
                  <span>Máximo: 26</span>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-purple-900 text-sm mb-2">
                  Sobre o grafo gerado:
                </h3>
                <ul className="text-xs text-purple-800 space-y-1">
                  <li>• Vértices dispostos em círculo</li>
                  <li>• Grafo garantidamente conectado</li>
                  <li>• Arestas extras para criar diferentes tipos de arcos</li>
                  <li>• Vértices rotulados de A até {String.fromCharCode(64 + numVertices)}</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRandomDialog(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => generateRandomGraph(numVertices)}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Shuffle size={20} />
                  Gerar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarjanSimulator;
