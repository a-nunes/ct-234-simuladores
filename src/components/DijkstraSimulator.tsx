import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Play, Shuffle, Navigation, Route, Upload, Maximize2, Minimize2 } from 'lucide-react';
import { useGraph } from '../contexts/GraphContext';
import { convertGraphToSimulator } from '../utils/graphConverter';
import LoadCustomGraphButton from './LoadCustomGraphButton';
import { useDragNodes } from '../hooks/useDragNodes';

// Estado de um vértice
type NodeState = 'unvisited' | 'visiting' | 'visited';

interface Edge {
  from: number;
  to: number;
  weight: number;
  highlighted: boolean;
  isInPath?: boolean;
  isRelaxing?: boolean;
}

interface Node {
  id: number;
  label: string;
  state: NodeState;
  dist: number; // Distância da origem
  pred: number | null; // Predecessor no caminho
  x: number;
  y: number;
  isSource?: boolean;
  isInQueue?: boolean;
}

interface PriorityQueueItem {
  nodeId: number;
  nodeLabel: string;
  dist: number;
}

interface SimulationStep {
  nodes: Node[];
  edges: Edge[];
  priorityQueue: PriorityQueueItem[];
  message: string;
  highlightedNode: number | null;
  highlightedEdge: { from: number; to: number } | null;
  action: string;
  currentNode: number | null;
  relaxingEdge: { from: number; to: number; oldDist: number; newDist: number } | null;
  finalDistances?: { nodeId: number; dist: number; path: number[] }[];
}

const DijkstraSimulator = () => {
  // Grafo ponderado direcionado padrão
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, label: 'A', state: 'unvisited', dist: Infinity, pred: null, x: 100, y: 200 },
    { id: 1, label: 'B', state: 'unvisited', dist: Infinity, pred: null, x: 250, y: 100 },
    { id: 2, label: 'C', state: 'unvisited', dist: Infinity, pred: null, x: 400, y: 100 },
    { id: 3, label: 'D', state: 'unvisited', dist: Infinity, pred: null, x: 250, y: 300 },
    { id: 4, label: 'E', state: 'unvisited', dist: Infinity, pred: null, x: 400, y: 300 },
    { id: 5, label: 'F', state: 'unvisited', dist: Infinity, pred: null, x: 550, y: 200 },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    { from: 0, to: 1, weight: 4, highlighted: false },
    { from: 0, to: 3, weight: 2, highlighted: false },
    { from: 1, to: 2, weight: 3, highlighted: false },
    { from: 1, to: 3, weight: 1, highlighted: false },
    { from: 3, to: 1, weight: 1, highlighted: false },
    { from: 3, to: 4, weight: 7, highlighted: false },
    { from: 2, to: 4, weight: 2, highlighted: false },
    { from: 2, to: 5, weight: 5, highlighted: false },
    { from: 4, to: 5, weight: 1, highlighted: false },
  ]);

  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [sourceNode, setSourceNode] = useState(0);
  const [showSourceDialog, setShowSourceDialog] = useState(false);
  const [showRandomDialog, setShowRandomDialog] = useState(false);
  const [numVertices, setNumVertices] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);

  // Hook para arrastar nós
  const { isDragging, handleNodeMouseDown, handleMouseMove, handleMouseUp } = useDragNodes(
    nodes,
    setNodes,
    isSimulating,
    steps,
    setSteps
  );

  // Gera grafo ponderado aleatório
  const generateRandomGraph = useCallback((n: number) => {
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const newNodes: Node[] = [];
    
    const centerX = 350;
    const centerY = 200;
    const radius = Math.min(150, 100 + n * 8);
    
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      newNodes.push({
        id: i,
        label: labels[i % labels.length],
        state: 'unvisited',
        dist: Infinity,
        pred: null,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    
    const newEdges: Edge[] = [];
    const edgeSet = new Set<string>();
    
    // Garantir conectividade (árvore geradora)
    for (let i = 1; i < n; i++) {
      const from = Math.floor(Math.random() * i);
      const weight = Math.floor(Math.random() * 9) + 1; // 1-9
      const edgeKey = `${from}-${i}`;
      
      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        newEdges.push({ from, to: i, weight, highlighted: false });
      }
    }
    
    // Adicionar arestas extras (grafo direcionado)
    const extraEdges = Math.floor(n * 0.8);
    for (let i = 0; i < extraEdges; i++) {
      const from = Math.floor(Math.random() * n);
      const to = Math.floor(Math.random() * n);
      const weight = Math.floor(Math.random() * 9) + 1;
      const edgeKey = `${from}-${to}`;
      
      if (from !== to && !edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        newEdges.push({ from, to, weight, highlighted: false });
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
    
    // Converte para os tipos específicos do DijkstraSimulator
    const dijkstraNodes: Node[] = customNodes.map(n => ({
      id: n.id,
      label: n.label,
      state: 'unvisited' as NodeState,
      dist: Infinity,
      pred: null,
      x: n.x,
      y: n.y,
      isSource: false
    }));

    const dijkstraEdges: Edge[] = customEdges.map(e => ({
      from: e.from,
      to: e.to,
      weight: e.weight || 1, // Default weight if not specified
      highlighted: false,
      isInPath: false
    }));
    
    setNodes(dijkstraNodes);
    setEdges(dijkstraEdges);
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setSourceNode(0);
  }, [savedGraph]);

  // Algoritmo de Dijkstra
  const generateDijkstraSteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    const nodesCopy: Node[] = nodes.map(n => ({ ...n, dist: Infinity, pred: null, state: 'unvisited' as NodeState }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e, highlighted: false, isInPath: false }));
    
    // Inicialização
    nodesCopy[sourceNode].dist = 0;
    nodesCopy[sourceNode].isSource = true;
    
    // Fila de prioridade (conjunto S no pseudocódigo)
    const pq: PriorityQueueItem[] = nodesCopy.map(n => ({
      nodeId: n.id,
      nodeLabel: n.label,
      dist: n.dist,
    }));
    
    // Lista de adjacências
    const adjList: { to: number; weight: number }[][] = new Array(nodes.length).fill(null).map(() => []);
    edges.forEach(edge => {
      adjList[edge.from].push({ to: edge.to, weight: edge.weight });
    });
    
    // Ordena adjacências lexicograficamente (por label do nó destino)
    adjList.forEach(neighbors => {
      neighbors.sort((a, b) => nodesCopy[a.to].label.localeCompare(nodesCopy[b.to].label));
    });

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      priorityQueue: [...pq],
      message: `Inicializando Dijkstra a partir de ${nodesCopy[sourceNode].label}. dist[${nodesCopy[sourceNode].label}] = 0, demais = ∞`,
      highlightedNode: sourceNode,
      highlightedEdge: null,
      action: 'init',
      currentNode: null,
      relaxingEdge: null,
    });

    // Loop principal
    while (pq.length > 0) {
      // Extrai mínimo (vértice com menor distância)
      pq.sort((a, b) => a.dist - b.dist);
      const minItem = pq.shift()!;
      const j = minItem.nodeId;
      
      // Se a distância é infinita, os vértices restantes são inalcançáveis
      if (nodesCopy[j].dist === Infinity) {
        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n })),
          edges: edgesCopy.map(e => ({ ...e })),
          priorityQueue: [...pq],
          message: `Fila contém apenas vértices inalcançáveis. Algoritmo finalizado.`,
          highlightedNode: null,
          highlightedEdge: null,
          action: 'unreachable',
          currentNode: null,
          relaxingEdge: null,
        });
        break;
      }

      nodesCopy[j].state = 'visiting';
      
      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
        edges: edgesCopy.map(e => ({ ...e })),
        priorityQueue: [...pq],
        message: `EXTRAIR_MÍNIMO: Selecionando ${nodesCopy[j].label} com dist = ${nodesCopy[j].dist}`,
        highlightedNode: j,
        highlightedEdge: null,
        action: 'extract-min',
        currentNode: j,
        relaxingEdge: null,
      });

      // Itera sobre os vizinhos
      for (const neighbor of adjList[j]) {
        const w = neighbor.to;
        const weight = neighbor.weight;
        
        // Destaca a aresta sendo avaliada
        const edgeIndex = edgesCopy.findIndex(e => e.from === j && e.to === w);
        if (edgeIndex >= 0) {
          edgesCopy[edgeIndex].highlighted = true;
        }

        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
          edges: edgesCopy.map(e => ({ ...e })),
          priorityQueue: [...pq],
          message: `Avaliando arco <${nodesCopy[j].label}, ${nodesCopy[w].label}> com custo ${weight}`,
          highlightedNode: null,
          highlightedEdge: { from: j, to: w },
          action: 'evaluate-edge',
          currentNode: j,
          relaxingEdge: null,
        });

        // Relaxamento
        const newDist = nodesCopy[j].dist + weight;
        if (nodesCopy[w].dist > newDist) {
          const oldDist = nodesCopy[w].dist;
          nodesCopy[w].dist = newDist;
          nodesCopy[w].pred = j;
          
          // Atualiza a fila de prioridade (DecreaseKey)
          const pqIndex = pq.findIndex(item => item.nodeId === w);
          if (pqIndex >= 0) {
            pq[pqIndex].dist = newDist;
          }

          if (edgeIndex >= 0) {
            edgesCopy[edgeIndex].isRelaxing = true;
          }

          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
            edges: edgesCopy.map(e => ({ ...e })),
            priorityQueue: [...pq],
            message: `✅ RELAXAMENTO: dist[${nodesCopy[w].label}] = ${oldDist === Infinity ? '∞' : oldDist} → ${newDist}. pred[${nodesCopy[w].label}] = ${nodesCopy[j].label}`,
            highlightedNode: w,
            highlightedEdge: { from: j, to: w },
            action: 'relax',
            currentNode: j,
            relaxingEdge: { from: j, to: w, oldDist, newDist },
          });

          if (edgeIndex >= 0) {
            edgesCopy[edgeIndex].isRelaxing = false;
          }
        } else {
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
            edges: edgesCopy.map(e => ({ ...e })),
            priorityQueue: [...pq],
            message: `❌ Sem melhoria: dist[${nodesCopy[w].label}] = ${nodesCopy[w].dist} ≤ ${newDist}`,
            highlightedNode: null,
            highlightedEdge: { from: j, to: w },
            action: 'no-relax',
            currentNode: j,
            relaxingEdge: null,
          });
        }

        if (edgeIndex >= 0) {
          edgesCopy[edgeIndex].highlighted = false;
        }
      }

      nodesCopy[j].state = 'visited';
      
      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n, isInQueue: pq.some(item => item.nodeId === n.id) })),
        edges: edgesCopy.map(e => ({ ...e })),
        priorityQueue: [...pq],
        message: `${nodesCopy[j].label} processado. Distância final: ${nodesCopy[j].dist}`,
        highlightedNode: j,
        highlightedEdge: null,
        action: 'finish-node',
        currentNode: null,
        relaxingEdge: null,
      });
    }

    // Marca os caminhos mínimos
    const finalDistances: { nodeId: number; dist: number; path: number[] }[] = [];
    
    for (let i = 0; i < nodesCopy.length; i++) {
      if (i !== sourceNode && nodesCopy[i].dist !== Infinity) {
        const path: number[] = [];
        let current: number | null = i;
        
        while (current !== null) {
          path.unshift(current);
          current = nodesCopy[current].pred;
        }
        
        // Marca arestas do caminho
        for (let j = 0; j < path.length - 1; j++) {
          const edgeIndex = edgesCopy.findIndex(e => e.from === path[j] && e.to === path[j + 1]);
          if (edgeIndex >= 0) {
            edgesCopy[edgeIndex].isInPath = true;
          }
        }
        
        finalDistances.push({ nodeId: i, dist: nodesCopy[i].dist, path });
      }
    }

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n, isInQueue: false })),
      edges: edgesCopy.map(e => ({ ...e })),
      priorityQueue: [],
      message: `✅ Algoritmo de Dijkstra concluído! Distâncias mínimas calculadas a partir de ${nodesCopy[sourceNode].label}.`,
      highlightedNode: null,
      highlightedEdge: null,
      action: 'final',
      currentNode: null,
      relaxingEdge: null,
      finalDistances,
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges, sourceNode]);

  const handleReset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setNodes(nodes.map(n => ({ ...n, state: 'unvisited', dist: Infinity, pred: null, isSource: false, isInQueue: false })));
    setEdges(edges.map(e => ({ ...e, highlighted: false, isInPath: false, isRelaxing: false })));
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

  const getNodeColor = (node: Node) => {
    if (node.isSource) {
      return 'fill-purple-400 stroke-purple-700';
    }
    
    switch (node.state) {
      case 'unvisited': return 'fill-gray-300 stroke-gray-500';
      case 'visiting': return 'fill-yellow-300 stroke-yellow-600';
      case 'visited': return 'fill-green-400 stroke-green-700';
    }
  };

  const getEdgeStyle = (edge: Edge) => {
    if (edge.isInPath) return 'stroke-purple-600 stroke-[4]';
    if (edge.isRelaxing) return 'stroke-green-500 stroke-[3]';
    if (edge.highlighted) return 'stroke-blue-500 stroke-[3]';
    return 'stroke-gray-400 stroke-2';
  };

  const getDistanceDisplay = (dist: number) => {
    return dist === Infinity ? '∞' : dist.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Algoritmo de Dijkstra
          </h1>
          <p className="text-slate-600 mb-4">
            Encontra os caminhos mínimos de uma origem para todos os demais vértices em grafos com pesos não-negativos.
          </p>
          
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <Navigation className="text-purple-600" size={24} />
              <span className="text-sm font-semibold text-slate-700">
                Origem: <span className="text-purple-700 text-lg">{nodes[sourceNode].label}</span>
              </span>
            </div>
            <button
              onClick={() => setShowSourceDialog(true)}
              disabled={isSimulating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
            >
              Alterar Origem
            </button>
          </div>
        </div>

        <div className={`grid gap-8 transition-all duration-300 ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Visualização do Grafo */}
          <div className={isExpanded ? 'col-span-1' : 'lg:col-span-2'}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Grafo Ponderado</h2>
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
                {currentState && currentState.edges.map((edge, idx) => {
                  const fromNode = currentState.nodes[edge.from];
                  const toNode = currentState.nodes[edge.to];
                  
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
                  
                  // Posição do peso (meio da aresta)
                  const midX = (fromNode.x + toNode.x) / 2;
                  const midY = (fromNode.y + toNode.y) / 2;
                  
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
                      {/* Peso */}
                      <circle cx={midX} cy={midY} r="12" className="fill-white stroke-gray-300" strokeWidth="1.5" />
                      <text
                        x={midX}
                        y={midY + 4}
                        textAnchor="middle"
                        className="text-xs font-bold fill-slate-700"
                      >
                        {edge.weight}
                      </text>
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
                    {/* Distância */}
                    <text
                      x={node.x}
                      y={node.y - 35}
                      textAnchor="middle"
                      className="text-sm fill-blue-700 font-bold pointer-events-none"
                    >
                      {getDistanceDisplay(node.dist)}
                    </text>
                    {/* Indicador de origem */}
                    {node.isSource && (
                      <text
                        x={node.x}
                        y={node.y + 45}
                        textAnchor="middle"
                        className="text-xs fill-purple-700 font-bold"
                      >
                        origem
                      </text>
                    )}
                  </g>
                ))}
              </svg>

              {/* Legenda */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Estados:</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-purple-700"></div>
                      <span>Origem</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-yellow-600"></div>
                      <span>Processando</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-700"></div>
                      <span>Finalizado</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Arestas:</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-purple-600"></div>
                      <span>Caminho mínimo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-green-500"></div>
                      <span>Relaxando</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-gray-400"></div>
                      <span>Normal</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">Notação:</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-700 font-bold">5</span>
                      <span>Distância da origem</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-700 font-bold">∞</span>
                      <span>Inalcançável</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex gap-2 flex-wrap">
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
                    Gerar Grafo
                  </button>

                  <LoadCustomGraphButton
                    requiredType="directed"
                    requiresWeights={true}
                    onLoadGraph={loadCustomGraph}
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
                      onClick={generateDijkstraSteps}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play size={20} />
                      Iniciar
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
            {isExpanded ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fila de Prioridade */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Fila de Prioridade (S)</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentState && currentState.priorityQueue.length > 0 ? (
                  currentState.priorityQueue
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

            {/* Tabela de Distâncias */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                <Route className="inline mr-2" size={20} />
                Distâncias Atuais
              </h2>
              <div className="space-y-2">
                {currentState && currentState.nodes.map((node) => (
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
                    {node.pred !== null && (
                      <div className="text-xs text-slate-600">
                        via {currentState.nodes[node.pred].label}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mensagem de Ação */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Ação Atual:</h3>
              <p className="text-sm text-blue-800">
                {currentState ? currentState.message : 'Clique em "Iniciar" para começar.'}
              </p>
            </div>

            {/* Resultados Finais */}
            {currentState && currentState.finalDistances && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-green-900 mb-4">
                  ✅ Caminhos Mínimos
                </h2>
                <div className="space-y-3">
                  {currentState.finalDistances.map((result) => (
                    <div key={result.nodeId} className="bg-white rounded-lg p-3 border-2 border-green-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-800">
                          {nodes[sourceNode].label} → {currentState.nodes[result.nodeId].label}
                        </span>
                        <span className="font-mono text-lg font-bold text-green-700">
                          {result.dist}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-mono">
                        {result.path.map(nodeId => currentState.nodes[nodeId].label).join(' → ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
            ) : (
              <>
            {/* Fila de Prioridade */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Fila de Prioridade (S)</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {currentState && currentState.priorityQueue.length > 0 ? (
                  currentState.priorityQueue
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

            {/* Tabela de Distâncias */}
            <div className="bg-white rounded-xl shadow-lg p-6">
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
                    {currentState && currentState.nodes.map((node) => (
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
                          {node.pred !== null ? currentState.nodes[node.pred].label : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mensagem de Ação */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Ação Atual:</h3>
              <p className="text-sm text-blue-800">
                {currentState ? currentState.message : 'Clique em "Iniciar" para começar.'}
              </p>
            </div>
            </>
            )}
          </div>
        </div>

        {/* Modal de Seleção de Origem */}
        {showSourceDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Selecionar Vértice de Origem
              </h2>
              
              <div className="grid grid-cols-4 gap-2 mb-6">
                {nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => {
                      setSourceNode(node.id);
                      setShowSourceDialog(false);
                      handleReset();
                    }}
                    className={`p-4 rounded-lg font-bold text-lg transition-colors ${
                      sourceNode === node.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {node.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowSourceDialog(false)}
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
                Será gerado um grafo direcionado com pesos aleatórios (1-9).
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Número de Vértices (3-15)
                </label>
                <input
                  type="number"
                  min="3"
                  max="15"
                  value={numVertices}
                  onChange={(e) => setNumVertices(Math.min(15, Math.max(3, parseInt(e.target.value) || 3)))}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-semibold text-center"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRandomDialog(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    generateRandomGraph(numVertices);
                    setSourceNode(0);
                  }}
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

export default DijkstraSimulator;
