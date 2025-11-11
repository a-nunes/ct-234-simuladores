import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Play, Shuffle, GitMerge, Sparkles, Upload, Maximize2, Minimize2 } from 'lucide-react';
import { useGraph } from '../contexts/GraphContext';
import { convertGraphToSimulator } from '../utils/graphConverter';
import LoadCustomGraphButton from './LoadCustomGraphButton';
import { useDragNodes } from '../hooks/useDragNodes';

// Modos de simulação
type SimulationMode = 'kruskal' | 'prim';

interface Edge {
  from: number;
  to: number;
  weight: number;
  highlighted: boolean;
  isInMST?: boolean;
  isEvaluating?: boolean;
  isRejected?: boolean;
}

interface Node {
  id: number;
  label: string;
  x: number;
  y: number;
  isInTree?: boolean; // Para Prim
  isRoot?: boolean; // Para Prim
  componentId?: number; // Para Kruskal - identificador da componente conexa
  isInMST?: boolean; // Para Kruskal - se está incluído na MST
}

// Union-Find para Kruskal
interface UnionFindState {
  parent: number[];
  rank: number[];
}

interface SimulationStep {
  nodes: Node[];
  edges: Edge[];
  message: string;
  highlightedEdge: { from: number; to: number } | null;
  action: string;
  // Kruskal
  sortedEdges?: { from: number; to: number; weight: number }[];
  currentEdgeIndex?: number;
  unionFind?: UnionFindState;
  mstEdges?: { from: number; to: number; weight: number }[];
  totalCost?: number;
  // Prim
  inTree?: Set<number>;
  outTree?: Set<number>;
  candidateEdges?: { from: number; to: number; weight: number }[];
}

const MSTSimulator = () => {
  const [mode, setMode] = useState<SimulationMode>('kruskal');
  
  // Grafo não-orientado ponderado padrão
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, label: 'A', x: 150, y: 200 },
    { id: 1, label: 'B', x: 300, y: 100 },
    { id: 2, label: 'C', x: 450, y: 100 },
    { id: 3, label: 'D', x: 300, y: 300 },
    { id: 4, label: 'E', x: 450, y: 300 },
    { id: 5, label: 'F', x: 600, y: 200 },
  ]);

  // Arestas não-direcionadas (representadas uma vez)
  const [edges, setEdges] = useState<Edge[]>([
    { from: 0, to: 1, weight: 4, highlighted: false },
    { from: 0, to: 3, weight: 2, highlighted: false },
    { from: 1, to: 2, weight: 3, highlighted: false },
    { from: 1, to: 3, weight: 1, highlighted: false },
    { from: 2, to: 4, weight: 5, highlighted: false },
    { from: 2, to: 5, weight: 6, highlighted: false },
    { from: 3, to: 4, weight: 7, highlighted: false },
    { from: 4, to: 5, weight: 2, highlighted: false },
  ]);

  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [primRoot, setPrimRoot] = useState(0);
  const [showRootDialog, setShowRootDialog] = useState(false);
  const [showRandomDialog, setShowRandomDialog] = useState(false);
  const [numVertices, setNumVertices] = useState(6);
  const [isExpanded, setIsExpanded] = useState(false);

  // Hook de arrastar nós
  const { isDragging, handleNodeMouseDown, handleMouseMove, handleMouseUp } = useDragNodes(
    nodes,
    setNodes,
    isSimulating,
    steps,
    setSteps
  );

  // Union-Find: MAKE_SET
  const makeSet = (n: number): UnionFindState => {
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = Array(n).fill(0);
    return { parent, rank };
  };

  // Union-Find: FIND (com path compression)
  const find = (uf: UnionFindState, x: number): number => {
    if (uf.parent[x] !== x) {
      uf.parent[x] = find(uf, uf.parent[x]);
    }
    return uf.parent[x];
  };

  // Union-Find: UNION (by rank)
  const union = (uf: UnionFindState, x: number, y: number): void => {
    const rootX = find(uf, x);
    const rootY = find(uf, y);
    
    if (rootX === rootY) return;
    
    if (uf.rank[rootX] < uf.rank[rootY]) {
      uf.parent[rootX] = rootY;
    } else if (uf.rank[rootX] > uf.rank[rootY]) {
      uf.parent[rootY] = rootX;
    } else {
      uf.parent[rootY] = rootX;
      uf.rank[rootX]++;
    }
  };

  // Gera grafo não-orientado ponderado aleatório
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
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
    
    const newEdges: Edge[] = [];
    const edgeSet = new Set<string>();
    
    // Garantir conectividade (árvore geradora)
    for (let i = 1; i < n; i++) {
      const from = Math.floor(Math.random() * i);
      const weight = Math.floor(Math.random() * 9) + 1;
      const edgeKey = from < i ? `${from}-${i}` : `${i}-${from}`;
      
      if (!edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        newEdges.push({ 
          from: Math.min(from, i), 
          to: Math.max(from, i), 
          weight, 
          highlighted: false 
        });
      }
    }
    
    // Adicionar arestas extras
    const extraEdges = Math.floor(n * 0.5);
    for (let i = 0; i < extraEdges; i++) {
      const from = Math.floor(Math.random() * n);
      const to = Math.floor(Math.random() * n);
      const weight = Math.floor(Math.random() * 9) + 1;
      const edgeKey = from < to ? `${from}-${to}` : `${to}-${from}`;
      
      if (from !== to && !edgeSet.has(edgeKey)) {
        edgeSet.add(edgeKey);
        newEdges.push({ 
          from: Math.min(from, to), 
          to: Math.max(from, to), 
          weight, 
          highlighted: false 
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
    
    // Converte para os tipos específicos do MSTSimulator
    const mstNodes: Node[] = customNodes.map(n => ({
      id: n.id,
      label: n.label,
      x: n.x,
      y: n.y,
      rank: 0,
      parent: n.id
    }));

    const mstEdges: Edge[] = customEdges.map(e => ({
      from: e.from,
      to: e.to,
      weight: e.weight || 1, // Default weight if not specified
      highlighted: false,
      isInMST: false
    }));
    
    setNodes(mstNodes);
    setEdges(mstEdges);
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
  }, [savedGraph]);

  // ALGORITMO DE KRUSKAL
  const generateKruskalSteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    const nodesCopy: Node[] = nodes.map(n => ({ ...n, isInMST: false })); // Inicialmente nenhum nó está na MST
    const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
    
    // Inicializa Union-Find
    const uf = makeSet(nodes.length);
    const mstEdges: { from: number; to: number; weight: number }[] = [];
    let totalCost = 0;
    let nextComponentId = 0; // Contador para gerar IDs de componentes
    
    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      message: 'Iniciando Kruskal. Criando componentes individuais para cada vértice (MAKE_SET).',
      highlightedEdge: null,
      action: 'init',
      sortedEdges: [],
      mstEdges: [],
      totalCost: 0,
      unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
    });

    // 1. Ordena as arestas por peso
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    
    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      message: `Ordenando ${edges.length} arestas por peso crescente.`,
      highlightedEdge: null,
      action: 'sort',
      sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
      currentEdgeIndex: -1,
      mstEdges: [],
      totalCost: 0,
      unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
    });

    // 2. Loop principal
    for (let i = 0; i < sortedEdges.length; i++) {
      const edge = sortedEdges[i];
      const u = edge.from;
      const v = edge.to;
      
      const edgeIndex = edgesCopy.findIndex(e => 
        (e.from === u && e.to === v) || (e.from === v && e.to === u)
      );
      
      if (edgeIndex >= 0) {
        edgesCopy[edgeIndex].isEvaluating = true;
      }

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        message: `Avaliando aresta {${nodesCopy[u].label}, ${nodesCopy[v].label}} com peso ${edge.weight}`,
        highlightedEdge: { from: u, to: v },
        action: 'evaluate',
        sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
        currentEdgeIndex: i,
        mstEdges: [...mstEdges],
        totalCost,
        unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
      });

      // Verifica se u e v estão em componentes diferentes
      const rootU = find(uf, u);
      const rootV = find(uf, v);
      
      if (rootU !== rootV) {
        // Aceita a aresta
        union(uf, u, v);
        mstEdges.push({ from: u, to: v, weight: edge.weight });
        totalCost += edge.weight;
        
        // Determina qual componentId usar (reutilizar existente ou criar novo)
        const uHasComponent = nodesCopy[u].componentId !== undefined;
        const vHasComponent = nodesCopy[v].componentId !== undefined;
        
        let componentIdToUse: number;
        
        if (uHasComponent && vHasComponent) {
          // Ambos têm componente: mesclar tudo na componente de u
          const oldComponentId = nodesCopy[v].componentId;
          const newComponentId = nodesCopy[u].componentId!;
          nodesCopy.forEach(node => {
            if (node.componentId === oldComponentId) {
              node.componentId = newComponentId;
            }
          });
          componentIdToUse = newComponentId;
        } else if (uHasComponent) {
          // Só u tem componente: v entra na componente de u
          nodesCopy[v].componentId = nodesCopy[u].componentId;
          nodesCopy[v].isInMST = true;
          componentIdToUse = nodesCopy[u].componentId!;
        } else if (vHasComponent) {
          // Só v tem componente: u entra na componente de v
          nodesCopy[u].componentId = nodesCopy[v].componentId;
          nodesCopy[u].isInMST = true;
          componentIdToUse = nodesCopy[v].componentId!;
        } else {
          // Nenhum tem componente: criar nova componente
          componentIdToUse = nextComponentId++;
          nodesCopy[u].componentId = componentIdToUse;
          nodesCopy[v].componentId = componentIdToUse;
          nodesCopy[u].isInMST = true;
          nodesCopy[v].isInMST = true;
        }
        
        if (edgeIndex >= 0) {
          edgesCopy[edgeIndex].isInMST = true;
          edgesCopy[edgeIndex].isEvaluating = false;
        }

        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n })),
          edges: edgesCopy.map(e => ({ ...e })),
          message: `✅ FIND(${nodesCopy[u].label}) ≠ FIND(${nodesCopy[v].label}). Adicionando à MST. UNION(${nodesCopy[u].label}, ${nodesCopy[v].label}). Custo total: ${totalCost}`,
          highlightedEdge: { from: u, to: v },
          action: 'accept',
          sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
          currentEdgeIndex: i,
          mstEdges: [...mstEdges],
          totalCost,
          unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
        });
      } else {
        // Rejeita a aresta (formaria ciclo)
        if (edgeIndex >= 0) {
          edgesCopy[edgeIndex].isRejected = true;
          edgesCopy[edgeIndex].isEvaluating = false;
        }

        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n })),
          edges: edgesCopy.map(e => ({ ...e })),
          message: `❌ FIND(${nodesCopy[u].label}) = FIND(${nodesCopy[v].label}). Mesma componente! Rejeitando (formaria ciclo).`,
          highlightedEdge: { from: u, to: v },
          action: 'reject',
          sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
          currentEdgeIndex: i,
          mstEdges: [...mstEdges],
          totalCost,
          unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
        });

        // Remove o estado de rejeitado após um passo
        if (edgeIndex >= 0) {
          edgesCopy[edgeIndex].isRejected = false;
        }
      }
    }

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      message: `✅ Kruskal finalizado! MST com ${mstEdges.length} arestas. Custo total: ${totalCost}`,
      highlightedEdge: null,
      action: 'final',
      sortedEdges: sortedEdges.map(e => ({ from: e.from, to: e.to, weight: e.weight })),
      currentEdgeIndex: sortedEdges.length,
      mstEdges: [...mstEdges],
      totalCost,
      unionFind: { parent: [...uf.parent], rank: [...uf.rank] },
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges]);

  // ALGORITMO DE PRIM
  const generatePrimSteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    const nodesCopy: Node[] = nodes.map(n => ({ ...n, isInTree: false, isRoot: false }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
    
    nodesCopy[primRoot].isRoot = true;
    
    const inTree = new Set<number>([primRoot]);
    const outTree = new Set<number>(nodes.map((_, i) => i).filter(i => i !== primRoot));
    const mstEdges: { from: number; to: number; weight: number }[] = [];
    let totalCost = 0;

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n, isInTree: n.id === primRoot })),
      edges: edgesCopy.map(e => ({ ...e })),
      message: `Iniciando Prim a partir de ${nodesCopy[primRoot].label}. U = {${nodesCopy[primRoot].label}}, V-U = {${Array.from(outTree).map(id => nodesCopy[id].label).join(', ')}}`,
      highlightedEdge: null,
      action: 'init',
      inTree: new Set(inTree),
      outTree: new Set(outTree),
      mstEdges: [],
      totalCost: 0,
    });

    // Loop principal
    while (outTree.size > 0) {
      // Encontra a aresta de custo mínimo entre U e V-U
      let minEdge: { from: number; to: number; weight: number } | null = null;
      const candidateEdges: { from: number; to: number; weight: number }[] = [];

      for (const edge of edges) {
        const inU = inTree.has(edge.from) && outTree.has(edge.to);
        const inV = inTree.has(edge.to) && outTree.has(edge.from);
        
        if (inU || inV) {
          const u = inU ? edge.from : edge.to;
          const v = inU ? edge.to : edge.from;
          candidateEdges.push({ from: u, to: v, weight: edge.weight });
          
          if (!minEdge || edge.weight < minEdge.weight) {
            minEdge = { from: u, to: v, weight: edge.weight };
          }
        }
      }

      if (!minEdge) break; // Grafo desconexo

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n, isInTree: inTree.has(n.id) })),
        edges: edgesCopy.map(e => ({ ...e })),
        message: `Buscando aresta mínima entre U e V-U. Candidatas: ${candidateEdges.length}`,
        highlightedEdge: null,
        action: 'search',
        inTree: new Set(inTree),
        outTree: new Set(outTree),
        candidateEdges: [...candidateEdges],
        mstEdges: [...mstEdges],
        totalCost,
      });

      // Destaca a aresta escolhida
      const edgeIndex = edgesCopy.findIndex(e => 
        (e.from === minEdge!.from && e.to === minEdge!.to) || 
        (e.from === minEdge!.to && e.to === minEdge!.from)
      );
      
      if (edgeIndex >= 0) {
        edgesCopy[edgeIndex].isEvaluating = true;
      }

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n, isInTree: inTree.has(n.id) })),
        edges: edgesCopy.map(e => ({ ...e })),
        message: `Aresta mínima: {${nodesCopy[minEdge.from].label}, ${nodesCopy[minEdge.to].label}} com peso ${minEdge.weight}`,
        highlightedEdge: { from: minEdge.from, to: minEdge.to },
        action: 'select-min',
        inTree: new Set(inTree),
        outTree: new Set(outTree),
        candidateEdges: [...candidateEdges],
        mstEdges: [...mstEdges],
        totalCost,
      });

      // Adiciona a aresta à MST
      mstEdges.push(minEdge);
      totalCost += minEdge.weight;
      
      if (edgeIndex >= 0) {
        edgesCopy[edgeIndex].isInMST = true;
        edgesCopy[edgeIndex].isEvaluating = false;
      }

      // Move v de V-U para U
      inTree.add(minEdge.to);
      outTree.delete(minEdge.to);

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n, isInTree: inTree.has(n.id) })),
        edges: edgesCopy.map(e => ({ ...e })),
        message: `✅ Adicionando à MST. ${nodesCopy[minEdge.to].label} agora está em U. Custo total: ${totalCost}. V-U = {${Array.from(outTree).map(id => nodesCopy[id].label).join(', ') || 'vazio'}}`,
        highlightedEdge: { from: minEdge.from, to: minEdge.to },
        action: 'add-to-tree',
        inTree: new Set(inTree),
        outTree: new Set(outTree),
        mstEdges: [...mstEdges],
        totalCost,
      });
    }

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n, isInTree: inTree.has(n.id) })),
      edges: edgesCopy.map(e => ({ ...e })),
      message: `✅ Prim finalizado! MST com ${mstEdges.length} arestas. Custo total: ${totalCost}`,
      highlightedEdge: null,
      action: 'final',
      inTree: new Set(inTree),
      outTree: new Set(outTree),
      mstEdges: [...mstEdges],
      totalCost,
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges, primRoot]);

  const generateSteps = useCallback(() => {
    if (mode === 'kruskal') {
      generateKruskalSteps();
    } else {
      generatePrimSteps();
    }
  }, [mode, generateKruskalSteps, generatePrimSteps]);

  const handleReset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setNodes(nodes.map(n => ({ ...n, isInTree: false, isRoot: false })));
    setEdges(edges.map(e => ({ ...e, highlighted: false, isInMST: false, isEvaluating: false, isRejected: false })));
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
    if (mode === 'prim') {
      if (node.isRoot) return 'fill-purple-400 stroke-purple-700';
      if (node.isInTree) return 'fill-green-400 stroke-green-700';
      return 'fill-gray-300 stroke-gray-500';
    }
    
    // Modo Kruskal: cinza se não está na MST, colorido se está
    if (mode === 'kruskal') {
      // Se não está na MST, mostrar em cinza
      if (!node.isInMST || node.componentId === undefined) {
        return 'fill-gray-300 stroke-gray-500';
      }
      
      // Se está na MST, colorir por componente
      const colors = [
        'fill-blue-400 stroke-blue-700',
        'fill-green-400 stroke-green-700',
        'fill-purple-400 stroke-purple-700',
        'fill-pink-400 stroke-pink-700',
        'fill-yellow-400 stroke-yellow-700',
        'fill-indigo-400 stroke-indigo-700',
        'fill-red-400 stroke-red-700',
        'fill-orange-400 stroke-orange-700',
        'fill-teal-400 stroke-teal-700',
        'fill-cyan-400 stroke-cyan-700',
      ];
      
      return colors[node.componentId % colors.length];
    }
    
    return 'fill-blue-300 stroke-blue-600';
  };

  const getEdgeStyle = (edge: Edge) => {
    if (edge.isInMST) return 'stroke-green-600 stroke-[4]';
    if (edge.isEvaluating) return 'stroke-yellow-500 stroke-[3]';
    if (edge.isRejected) return 'stroke-red-500 stroke-[3]';
    if (edge.highlighted) return 'stroke-blue-500 stroke-[3]';
    return 'stroke-gray-400 stroke-2';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Árvore Geradora de Custo Mínimo (MST)
          </h1>
          <p className="text-slate-600 mb-4">
            Algoritmos para encontrar a árvore geradora de custo mínimo em grafos ponderados.
          </p>
          
          {/* Seletor de Modo */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setMode('kruskal');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'kruskal'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
            >
              <GitMerge className="inline mr-2" size={18} />
              Kruskal (Union-Find)
            </button>
            <button
              onClick={() => {
                setMode('prim');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'prim'
                  ? 'bg-violet-600 text-white'
                  : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
              }`}
            >
              <Sparkles className="inline mr-2" size={18} />
              Prim (Crescimento)
            </button>
            
            {mode === 'prim' && (
              <button
                onClick={() => setShowRootDialog(true)}
                disabled={isSimulating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
              >
                Raiz: {nodes[primRoot].label}
              </button>
            )}
          </div>
        </div>

        <div className={`grid gap-8 transition-all duration-300 ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Visualização do Grafo */}
          <div className={isExpanded ? 'col-span-1' : 'lg:col-span-2'}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Grafo Não-Orientado Ponderado</h2>
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
                {mode === 'kruskal' && (
                  <>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-700 mb-2">Vértices:</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gray-300 border-2 border-gray-500"></div>
                          <span>Não incluído na MST</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-4 h-4 rounded-full bg-blue-400 border-2 border-blue-700"></div>
                            <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-700"></div>
                            <div className="w-4 h-4 rounded-full bg-purple-400 border-2 border-purple-700"></div>
                          </div>
                          <span>Componentes da MST</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Mesma cor = mesma componente
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-700 mb-2">Arestas:</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1 bg-green-600"></div>
                          <span>Na MST</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1 bg-yellow-500"></div>
                          <span>Avaliando</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1 bg-red-500"></div>
                          <span>Rejeitada (ciclo)</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {mode === 'prim' && (
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
                )}
                <div>
                  <h3 className="font-semibold text-sm text-slate-700 mb-2">MST:</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-1 bg-green-600"></div>
                      <span>Aresta na MST</span>
                    </div>
                    {currentState && currentState.totalCost !== undefined && (
                      <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                        <span className="font-bold text-green-800">Custo: {currentState.totalCost}</span>
                      </div>
                    )}
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
                    requiredType="undirected"
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
                      onClick={generateSteps}
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
            {/* Lista de Arestas Ordenadas (Kruskal) */}
            {mode === 'kruskal' && currentState && currentState.sortedEdges && currentState.sortedEdges.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Arestas Ordenadas por Peso
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {currentState.sortedEdges.map((edge, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-3 border-2 ${
                        idx === currentState.currentEdgeIndex
                          ? 'bg-yellow-50 border-yellow-400'
                          : idx < (currentState.currentEdgeIndex || 0)
                          ? 'bg-green-50 border-green-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm">
                          {currentState.nodes[edge.from].label} — {currentState.nodes[edge.to].label}
                        </span>
                        <span className="font-bold text-blue-700">{edge.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conjuntos U e V-U (Prim) */}
            {mode === 'prim' && currentState && currentState.inTree && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Conjuntos</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">U (na árvore):</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(currentState.inTree).map(nodeId => (
                        <span key={nodeId} className="bg-green-200 text-green-900 px-3 py-1 rounded-lg font-bold">
                          {currentState.nodes[nodeId].label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-2">V - U (fora):</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentState.outTree && Array.from(currentState.outTree).length > 0 ? (
                        Array.from(currentState.outTree).map(nodeId => (
                          <span key={nodeId} className="bg-slate-200 text-slate-900 px-3 py-1 rounded-lg font-bold">
                            {currentState.nodes[nodeId].label}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">vazio</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Arestas Candidatas (Prim) */}
            {mode === 'prim' && currentState && currentState.candidateEdges && currentState.candidateEdges.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Arestas Candidatas
                </h2>
                <p className="text-xs text-slate-600 mb-3">Entre U e V-U:</p>
                <div className="space-y-2">
                  {currentState.candidateEdges
                    .sort((a, b) => a.weight - b.weight)
                    .map((edge, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-2 border-2 ${
                          idx === 0
                            ? 'bg-yellow-50 border-yellow-400'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-sm">
                            {currentState.nodes[edge.from].label} — {currentState.nodes[edge.to].label}
                          </span>
                          <span className="font-bold text-blue-700">{edge.weight}</span>
                        </div>
                        {idx === 0 && (
                          <div className="text-xs text-yellow-700 mt-1">← mínima</div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* MST Atual */}
            {currentState && currentState.mstEdges && currentState.mstEdges.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-green-900 mb-4">
                  MST Atual ({currentState.mstEdges.length} arestas)
                </h2>
                <div className="space-y-2">
                  {currentState.mstEdges.map((edge, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border-2 border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm">
                          {currentState.nodes[edge.from].label} — {currentState.nodes[edge.to].label}
                        </span>
                        <span className="font-bold text-green-700">{edge.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {currentState.totalCost !== undefined && (
                  <div className="mt-3 p-3 bg-green-100 rounded-lg border-2 border-green-300">
                    <div className="text-center">
                      <div className="text-sm text-green-700">Custo Total:</div>
                      <div className="text-2xl font-bold text-green-900">{currentState.totalCost}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mensagem de Ação */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Ação Atual:</h3>
              <p className="text-sm text-blue-800">
                {currentState ? currentState.message : 'Clique em "Iniciar" para começar.'}
              </p>
            </div>
            </div>
            ) : (
              <>
            {/* Lista de Arestas Ordenadas (Kruskal) - Versão Normal */}
            {mode === 'kruskal' && currentState && currentState.sortedEdges && currentState.sortedEdges.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Arestas Ordenadas por Peso
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {currentState.sortedEdges.map((edge, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg p-3 border-2 ${
                        idx === currentState.currentEdgeIndex
                          ? 'bg-yellow-50 border-yellow-400'
                          : idx < (currentState.currentEdgeIndex || 0)
                          ? 'bg-green-50 border-green-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-sm">
                          {currentState.nodes[edge.from].label} — {currentState.nodes[edge.to].label}
                        </span>
                        <span className="font-bold text-blue-700">{edge.weight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conjuntos U e V-U (Prim) - Versão Normal */}
            {mode === 'prim' && currentState && currentState.inTree && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Conjuntos</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-green-700 mb-2">U (na MST):</h3>
                    <div className="flex gap-2 flex-wrap">
                      {currentState.nodes
                        .filter(node => currentState.inTree!.has(node.id))
                        .map(node => (
                          <span key={node.id} className="bg-green-100 text-green-800 px-3 py-1 rounded-lg font-bold border-2 border-green-300">
                            {node.label}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-600 mb-2">V - U (fora da MST):</h3>
                    <div className="flex gap-2 flex-wrap">
                      {currentState.nodes
                        .filter(node => !currentState.inTree!.has(node.id))
                        .map(node => (
                          <span key={node.id} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg font-bold border-2 border-slate-300">
                            {node.label}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resultado Final */}
            {currentState && currentState.action === 'final' && currentState.mstEdges && (
              <div className="bg-green-50 border-2 border-green-300 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-green-900 mb-3 flex items-center gap-2">
                  <Sparkles />
                  MST Completa
                </h2>
                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-sm text-slate-600">Custo Total:</span>
                    <div className="text-3xl font-bold text-green-700">{currentState.totalCost}</div>
                  </div>
                  <div>
                    <span className="text-sm text-slate-700 font-semibold">Arestas da MST:</span>
                    <div className="mt-2 space-y-1">
                      {currentState.mstEdges.map((edge, idx) => (
                        <div key={idx} className="bg-green-100 rounded-lg p-2 flex justify-between items-center border-2 border-green-300">
                          <span className="font-mono text-sm text-green-900">
                            {currentState.nodes[edge.from].label} — {currentState.nodes[edge.to].label}
                          </span>
                          <span className="font-bold text-green-700">{edge.weight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

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

        {/* Modal de Seleção de Raiz (Prim) */}
        {showRootDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Selecionar Raiz para Prim
              </h2>
              
              <div className="grid grid-cols-4 gap-2 mb-6">
                {nodes.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => {
                      setPrimRoot(node.id);
                      setShowRootDialog(false);
                      handleReset();
                    }}
                    className={`p-4 rounded-lg font-bold text-lg transition-colors ${
                      primRoot === node.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {node.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowRootDialog(false)}
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
                Será gerado um grafo não-orientado conectado com pesos aleatórios (1-9).
              </p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Número de Vértices (3-12)
                </label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  value={numVertices}
                  onChange={(e) => setNumVertices(Math.min(12, Math.max(3, parseInt(e.target.value) || 3)))}
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
                    setPrimRoot(0);
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

export default MSTSimulator;
