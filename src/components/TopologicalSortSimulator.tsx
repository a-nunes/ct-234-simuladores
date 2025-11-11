import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ChevronRight, ChevronLeft, GitBranch, List } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
}

interface NodeState {
  status: 'unvisited' | 'ready' | 'processing' | 'completed';
  indegree: number;
  initialIndegree: number;
}

type AlgorithmType = 'queue' | 'stack';

const TopologicalSortSimulator: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('queue');
  
  // Example graph (DAG)
  const exampleNodes: GraphNode[] = [
    { id: 'A', label: 'A', x: 100, y: 100 },
    { id: 'B', label: 'B', x: 250, y: 50 },
    { id: 'C', label: 'C', x: 250, y: 150 },
    { id: 'D', label: 'D', x: 400, y: 50 },
    { id: 'E', label: 'E', x: 400, y: 150 },
    { id: 'F', label: 'F', x: 550, y: 100 },
  ];

  const exampleEdges: GraphEdge[] = [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'C', to: 'E' },
    { from: 'D', to: 'F' },
    { from: 'E', to: 'F' },
  ];

  const [nodes] = useState<GraphNode[]>(exampleNodes);
  const [edges] = useState<GraphEdge[]>(exampleEdges);
  const [nodeStates, setNodeStates] = useState<Map<string, NodeState>>(new Map());
  const [queue, setQueue] = useState<string[]>([]);
  const [stack, setStack] = useState<string[]>([]);
  const [topologicalOrder, setTopologicalOrder] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [currentSuccessor, setCurrentSuccessor] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [hasCycle, setHasCycle] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [stepHistory, setStepHistory] = useState<any[]>([]);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [recursionStack, setRecursionStack] = useState<Set<string>>(new Set());

  // Initialize node states
  useEffect(() => {
    initializeGraph();
  }, [selectedAlgorithm]);

  const initializeGraph = () => {
    const states = new Map<string, NodeState>();
    
    // Calculate indegree for each node
    nodes.forEach(node => {
      const indegree = edges.filter(e => e.to === node.id).length;
      states.set(node.id, {
        status: 'unvisited',
        indegree,
        initialIndegree: indegree,
      });
    });

    setNodeStates(states);
    setQueue([]);
    setStack([]);
    setTopologicalOrder([]);
    setCounter(0);
    setCurrentNode(null);
    setCurrentSuccessor(null);
    setIsComplete(false);
    setHasCycle(false);
    setMessage('Clique em "Próximo Passo" para iniciar');
    setStepHistory([]);
    setVisited(new Set());
    setRecursionStack(new Set());
  };

  const saveState = () => {
    setStepHistory([...stepHistory, {
      nodeStates: new Map(nodeStates),
      queue: [...queue],
      stack: [...stack],
      topologicalOrder: [...topologicalOrder],
      counter,
      currentNode,
      currentSuccessor,
      isComplete,
      hasCycle,
      message,
      visited: new Set(visited),
      recursionStack: new Set(recursionStack),
    }]);
  };

  const previousStep = () => {
    if (stepHistory.length === 0) return;
    
    const previousState = stepHistory[stepHistory.length - 1];
    setNodeStates(previousState.nodeStates);
    setQueue(previousState.queue);
    setStack(previousState.stack);
    setTopologicalOrder(previousState.topologicalOrder);
    setCounter(previousState.counter);
    setCurrentNode(previousState.currentNode);
    setCurrentSuccessor(previousState.currentSuccessor);
    setIsComplete(previousState.isComplete);
    setHasCycle(previousState.hasCycle);
    setMessage(previousState.message);
    setVisited(previousState.visited);
    setRecursionStack(previousState.recursionStack);
    setStepHistory(stepHistory.slice(0, -1));
  };

  // Queue-based (Kahn's algorithm) steps
  const nextStepQueue = () => {
    saveState();

    // Step 1: Initial enqueue (nodes with indegree 0)
    if (queue.length === 0 && counter === 0 && !isComplete) {
      const newStates = new Map(nodeStates);
      const initialQueue: string[] = [];

      nodes.forEach(node => {
        const state = newStates.get(node.id)!;
        if (state.indegree === 0) {
          state.status = 'ready';
          initialQueue.push(node.id);
        }
      });

      setNodeStates(newStates);
      setQueue(initialQueue);
      setMessage(`Enfileirando vértices com grau de entrada 0: ${initialQueue.join(', ')}`);
      return;
    }

    // Step 2: Dequeue
    if (queue.length > 0 && !currentNode) {
      const node = queue[0];
      const newQueue = queue.slice(1);
      const newStates = new Map(nodeStates);
      newStates.get(node)!.status = 'processing';

      setQueue(newQueue);
      setCurrentNode(node);
      setNodeStates(newStates);
      setMessage(`Desenfileirando vértice ${node}`);
      return;
    }

    // Step 3: Process current node
    if (currentNode && !currentSuccessor && topologicalOrder[topologicalOrder.length - 1] !== currentNode) {
      const newOrder = [...topologicalOrder, currentNode];
      const newCounter = counter + 1;
      const newStates = new Map(nodeStates);
      newStates.get(currentNode)!.status = 'completed';

      setTopologicalOrder(newOrder);
      setCounter(newCounter);
      setNodeStates(newStates);
      setMessage(`Vértice ${currentNode} adicionado à ordenação (posição ${newCounter})`);
      return;
    }

    // Step 4: Process successors
    if (currentNode) {
      const successors = edges.filter(e => e.from === currentNode).map(e => e.to);
      
      if (!currentSuccessor && successors.length > 0) {
        setCurrentSuccessor(successors[0]);
        setMessage(`Analisando aresta ${currentNode} → ${successors[0]}`);
        return;
      }

      if (currentSuccessor) {
        const currentIndex = successors.indexOf(currentSuccessor);
        const newStates = new Map(nodeStates);
        const successorState = newStates.get(currentSuccessor)!;
        successorState.indegree--;

        setNodeStates(newStates);
        setMessage(`Decrementando grau de ${currentSuccessor}: ${successorState.indegree + 1} → ${successorState.indegree}`);

        // Check if successor is ready
        if (successorState.indegree === 0) {
          successorState.status = 'ready';
          const newQueue = [...queue, currentSuccessor];
          setQueue(newQueue);
          setTimeout(() => {
            setMessage(`Vértice ${currentSuccessor} agora tem grau 0, enfileirando`);
          }, 0);
        }

        // Move to next successor or finish with current node
        if (currentIndex < successors.length - 1) {
          setCurrentSuccessor(successors[currentIndex + 1]);
        } else {
          setCurrentSuccessor(null);
          setCurrentNode(null);
          setMessage('Vértice processado completamente');
        }
        return;
      }

      // No successors
      setCurrentNode(null);
      setMessage('Vértice sem sucessores, continuando...');
      return;
    }

    // Step 5: Check completion
    if (queue.length === 0 && !currentNode && !isComplete) {
      setIsComplete(true);
      if (counter === nodes.length) {
        setMessage('✓ Ordenação Topológica Concluída!');
      } else {
        setHasCycle(true);
        setMessage('✗ ERRO: Grafo contém ciclo!');
        
        // Highlight nodes not processed (part of cycle)
        const newStates = new Map(nodeStates);
        nodes.forEach(node => {
          if (newStates.get(node.id)!.status === 'unvisited') {
            newStates.get(node.id)!.status = 'processing'; // Will be rendered in red
          }
        });
        setNodeStates(newStates);
      }
    }
  };

  // Stack-based (DFS) helper function
  const dfsVisit = (nodeId: string, currentVisited: Set<string>, currentRecStack: Set<string>, 
                     currentOrder: string[], currentStates: Map<string, NodeState>): boolean => {
    currentVisited.add(nodeId);
    currentRecStack.add(nodeId);
    currentStates.get(nodeId)!.status = 'processing';

    const successors = edges.filter(e => e.from === nodeId).map(e => e.to);
    
    for (const successor of successors) {
      if (!currentVisited.has(successor)) {
        if (dfsVisit(successor, currentVisited, currentRecStack, currentOrder, currentStates)) {
          return true; // Cycle detected
        }
      } else if (currentRecStack.has(successor)) {
        return true; // Cycle detected
      }
    }

    currentRecStack.delete(nodeId);
    currentStates.get(nodeId)!.status = 'completed';
    currentOrder.unshift(nodeId); // Add to front for topological order
    return false;
  };

  // Stack-based (DFS) visualization steps
  const nextStepStack = () => {
    saveState();

    // For DFS-based topological sort, we'll simulate the process step by step
    // This is more complex than Kahn's, so we'll show a simplified version
    
    if (topologicalOrder.length === 0 && !isComplete) {
      const newVisited = new Set<string>();
      const newRecStack = new Set<string>();
      const newOrder: string[] = [];
      const newStates = new Map(nodeStates);
      let cycleDetected = false;

      // Perform DFS from all unvisited nodes
      for (const node of nodes) {
        if (!newVisited.has(node.id)) {
          if (dfsVisit(node.id, newVisited, newRecStack, newOrder, newStates)) {
            cycleDetected = true;
            setHasCycle(true);
            setMessage('✗ ERRO: Grafo contém ciclo (detectado durante DFS)!');
            break;
          }
        }
      }

      if (!cycleDetected) {
        setTopologicalOrder(newOrder);
        setCounter(newOrder.length);
        setMessage('✓ Ordenação Topológica Concluída (DFS)!');
      }

      setNodeStates(newStates);
      setVisited(newVisited);
      setIsComplete(true);
      return;
    }

    if (isComplete) {
      setMessage('Algoritmo já concluído. Use "Resetar" para reiniciar.');
    }
  };

  const nextStep = () => {
    if (selectedAlgorithm === 'queue') {
      nextStepQueue();
    } else {
      nextStepStack();
    }
  };

  const getNodeColor = (nodeId: string): string => {
    const state = nodeStates.get(nodeId);
    if (!state) return 'bg-gray-300';

    if (hasCycle && state.status === 'processing') return 'bg-red-500'; // Cycle node
    
    switch (state.status) {
      case 'ready': return 'bg-yellow-400';
      case 'processing': return 'bg-green-500';
      case 'completed': return 'bg-gray-400';
      default: return 'bg-blue-300';
    }
  };

  const getNodeBorder = (nodeId: string): string => {
    if (currentNode === nodeId) return 'border-4 border-green-600';
    if (currentSuccessor === nodeId) return 'border-4 border-orange-500';
    return 'border-2 border-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <GitBranch className="text-indigo-600" size={40} />
            Ordenação Topológica
          </h1>
          <p className="text-lg text-gray-600">
            Compare os algoritmos baseados em Fila (Kahn) e Pilha (DFS)
          </p>
        </div>

        {/* Algorithm Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Selecione o Algoritmo:</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedAlgorithm('queue')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                selectedAlgorithm === 'queue'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <List size={20} />
                Fila (Kahn's Algorithm)
              </div>
            </button>
            <button
              onClick={() => setSelectedAlgorithm('stack')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                selectedAlgorithm === 'stack'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <GitBranch size={20} />
                Pilha (DFS)
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Graph Visualization */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Visualização do Grafo</h2>
            
            <svg width="650" height="250" className="border-2 border-gray-200 rounded-lg bg-gray-50">
              {/* Draw edges */}
              {edges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const isHighlighted = currentNode === edge.from && currentSuccessor === edge.to;

                return (
                  <g key={idx}>
                    <defs>
                      <marker
                        id={`arrowhead-${idx}`}
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3, 0 6"
                          fill={isHighlighted ? '#f97316' : '#374151'}
                        />
                      </marker>
                    </defs>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={isHighlighted ? '#f97316' : '#374151'}
                      strokeWidth={isHighlighted ? 3 : 2}
                      markerEnd={`url(#arrowhead-${idx})`}
                    />
                  </g>
                );
              })}

              {/* Draw nodes */}
              {nodes.map(node => {
                const state = nodeStates.get(node.id);
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={25}
                      className={`${getNodeColor(node.id)} ${getNodeBorder(node.id)}`}
                    />
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-lg font-bold fill-gray-900"
                    >
                      {node.label}
                    </text>
                    {selectedAlgorithm === 'queue' && (
                      <text
                        x={node.x}
                        y={node.y + 40}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-indigo-700"
                      >
                        grau: {state?.indegree ?? 0}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-300 border-2 border-gray-600 rounded-full"></div>
                <span>Não visitado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 border-2 border-gray-600 rounded-full"></div>
                <span>Pronto (grau 0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 border-2 border-gray-600 rounded-full"></div>
                <span>Processando</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 border-2 border-gray-600 rounded-full"></div>
                <span>Concluído</span>
              </div>
            </div>
          </div>

          {/* Right Panel - State Info */}
          <div className="space-y-6">
            {/* Queue/Stack Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-3">
                {selectedAlgorithm === 'queue' ? 'Fila' : 'Pilha'}
              </h3>
              <div className="min-h-[60px] border-2 border-indigo-300 rounded-lg p-3 bg-indigo-50">
                {selectedAlgorithm === 'queue' ? (
                  <div className="flex gap-2 flex-wrap">
                    {queue.map((nodeId, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold shadow-md"
                      >
                        {nodeId}
                      </div>
                    ))}
                    {queue.length === 0 && (
                      <span className="text-gray-400 italic">Fila vazia</span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {stack.map((nodeId, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold shadow-md"
                      >
                        {nodeId}
                      </div>
                    ))}
                    {stack.length === 0 && (
                      <span className="text-gray-400 italic">Pilha vazia</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Topological Order */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-3">Ordenação Topológica</h3>
              <div className="grid grid-cols-6 gap-2">
                {nodes.map((_, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{idx + 1}</div>
                    <div className={`h-10 rounded border-2 flex items-center justify-center font-bold ${
                      topologicalOrder[idx]
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                    }`}>
                      {topologicalOrder[idx] || '?'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* State Panel */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-3">Estado do Algoritmo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Vértices processados:</span>
                  <span className="font-mono">{counter} / {nodes.length}</span>
                </div>
                {currentNode && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Vértice atual:</span>
                    <span className="font-mono bg-green-100 px-2 py-1 rounded">{currentNode}</span>
                  </div>
                )}
                {currentSuccessor && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Sucessor atual:</span>
                    <span className="font-mono bg-orange-100 px-2 py-1 rounded">{currentSuccessor}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-3">Controles</h3>
              <div className="space-y-3">
                <button
                  onClick={nextStep}
                  disabled={isComplete}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    isComplete
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <ChevronRight size={20} />
                  Próximo Passo
                </button>
                <button
                  onClick={previousStep}
                  disabled={stepHistory.length === 0}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    stepHistory.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  <ChevronLeft size={20} />
                  Passo Anterior
                </button>
                <button
                  onClick={initializeGraph}
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw size={20} />
                  Resetar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Message Display */}
        <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
          hasCycle
            ? 'bg-red-100 text-red-700 border-2 border-red-300'
            : isComplete
            ? 'bg-green-100 text-green-700 border-2 border-green-300'
            : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
        }`}>
          {message}
        </div>

        {/* Indegree Table (Queue algorithm only) */}
        {selectedAlgorithm === 'queue' && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-4">Tabela de Graus de Entrada</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 px-4">Vértice</th>
                  <th className="text-center py-2 px-4">Grau Inicial</th>
                  <th className="text-center py-2 px-4">Grau Atual</th>
                  <th className="text-left py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map(node => {
                  const state = nodeStates.get(node.id);
                  return (
                    <tr key={node.id} className="border-b border-gray-200">
                      <td className="py-2 px-4 font-bold">{node.label}</td>
                      <td className="text-center py-2 px-4">{state?.initialIndegree ?? 0}</td>
                      <td className="text-center py-2 px-4 font-bold">{state?.indegree ?? 0}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          state?.status === 'completed' ? 'bg-gray-200 text-gray-700' :
                          state?.status === 'processing' ? 'bg-green-200 text-green-700' :
                          state?.status === 'ready' ? 'bg-yellow-200 text-yellow-700' :
                          'bg-blue-200 text-blue-700'
                        }`}>
                          {state?.status === 'completed' ? 'Concluído' :
                           state?.status === 'processing' ? 'Processando' :
                           state?.status === 'ready' ? 'Pronto' :
                           'Não visitado'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopologicalSortSimulator;
