import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Play, Shuffle, GitBranch, Scissors, AlertTriangle, Navigation, Maximize2, Minimize2 } from 'lucide-react';
import LoadCustomGraphButton from './LoadCustomGraphButton';
import { useGraph } from '../contexts/GraphContext';
import { convertGraphToSimulator } from '../utils/graphConverter';
import { useDragNodes } from '../hooks/useDragNodes';

// Estado de um vértice
type NodeState = 'unvisited' | 'exploring' | 'finished';

// Modos de simulação
type SimulationMode = 'bipartition' | 'articulation' | 'bridges';

interface Edge {
  from: number;
  to: number;
  highlighted: boolean;
  isBridge?: boolean;
  isConflict?: boolean;
}

interface Node {
  id: number;
  label: string;
  state: NodeState;
  expl: number;
  comp: number;
  x: number;
  y: number;
  // Para Bipartição
  color?: number; // 0 = sem cor, 1 = vermelho, 2 = azul
  // Para Vértices de Corte
  m?: number; // low-link
  parent?: number;
  numChildren?: number;
  isArticulation?: boolean;
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
  message: string;
  highlightedNode: number | null;
  highlightedEdge: { from: number; to: number } | null;
  action: string;
  // Para Bipartição
  isBipartite?: boolean;
  conflictDetected?: boolean;
  conflictEdge?: { from: number; to: number };
  // Para Vértices de Corte
  articulationPoints?: number[];
  rootNode?: number;
  // Para Pontes
  bridges?: { from: number; to: number }[];
}

const UndirectedGraphSimulator = () => {
  const [mode, setMode] = useState<SimulationMode>('bipartition');
  
  // Grafo não-orientado padrão
  const [nodes, setNodes] = useState<Node[]>([
    { id: 0, label: 'A', state: 'unvisited', expl: 0, comp: 0, x: 150, y: 150 },
    { id: 1, label: 'B', state: 'unvisited', expl: 0, comp: 0, x: 300, y: 100 },
    { id: 2, label: 'C', state: 'unvisited', expl: 0, comp: 0, x: 450, y: 150 },
    { id: 3, label: 'D', state: 'unvisited', expl: 0, comp: 0, x: 300, y: 300 },
    { id: 4, label: 'E', state: 'unvisited', expl: 0, comp: 0, x: 450, y: 250 },
  ]);

  // Arestas não-direcionadas (representadas bidirecionalmente)
  const [edges, setEdges] = useState<Edge[]>([
    { from: 0, to: 1, highlighted: false },
    { from: 1, to: 0, highlighted: false },
    { from: 1, to: 2, highlighted: false },
    { from: 2, to: 1, highlighted: false },
    { from: 1, to: 3, highlighted: false },
    { from: 3, to: 1, highlighted: false },
    { from: 2, to: 4, highlighted: false },
    { from: 4, to: 2, highlighted: false },
    { from: 3, to: 4, highlighted: false },
    { from: 4, to: 3, highlighted: false },
  ]);

  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showRandomDialog, setShowRandomDialog] = useState(false);
  const [numVertices, setNumVertices] = useState(5);
  const [showStartNodeDialog, setShowStartNodeDialog] = useState(false);
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

  // Gera grafo não-orientado aleatório
  const generateRandomGraph = useCallback((n: number, sparse: boolean = false) => {
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const newNodes: Node[] = [];
    
    const centerX = 300;
    const centerY = 200;
    const radius = Math.min(150, 100 + n * 10);
    
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
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
    
    const newEdges: Edge[] = [];
    const edgeSet = new Set<string>();
    
    // Garantir conectividade (árvore geradora)
    for (let i = 1; i < n; i++) {
      const from = Math.floor(Math.random() * i);
      const edgeKey1 = `${from}-${i}`;
      const edgeKey2 = `${i}-${from}`;
      
      if (!edgeSet.has(edgeKey1)) {
        edgeSet.add(edgeKey1);
        edgeSet.add(edgeKey2);
        // Adiciona aresta bidirecional
        newEdges.push({ from, to: i, highlighted: false });
        newEdges.push({ from: i, to: from, highlighted: false });
      }
    }
    
    // Adicionar arestas extras
    const extraEdges = sparse ? Math.floor(n * 0.2) : Math.floor(n * 0.5);
    for (let i = 0; i < extraEdges; i++) {
      const from = Math.floor(Math.random() * n);
      const to = Math.floor(Math.random() * n);
      const edgeKey1 = `${from}-${to}`;
      const edgeKey2 = `${to}-${from}`;
      
      if (from !== to && !edgeSet.has(edgeKey1)) {
        edgeSet.add(edgeKey1);
        edgeSet.add(edgeKey2);
        newEdges.push({ from, to, highlighted: false });
        newEdges.push({ from: to, to: from, highlighted: false });
      }
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setShowRandomDialog(false);
  }, []);

  // Gera grafo bipartido garantido
  const generateBipartiteGraph = useCallback((n: number) => {
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const newNodes: Node[] = [];
    
    const n1 = Math.ceil(n / 2);
    const n2 = n - n1;
    
    // Partição 1 (esquerda)
    for (let i = 0; i < n1; i++) {
      newNodes.push({
        id: i,
        label: labels[i],
        state: 'unvisited',
        expl: 0,
        comp: 0,
        x: 150,
        y: 100 + (i * 300 / Math.max(n1 - 1, 1)),
      });
    }
    
    // Partição 2 (direita)
    for (let i = 0; i < n2; i++) {
      newNodes.push({
        id: n1 + i,
        label: labels[n1 + i],
        state: 'unvisited',
        expl: 0,
        comp: 0,
        x: 450,
        y: 100 + (i * 300 / Math.max(n2 - 1, 1)),
      });
    }
    
    const newEdges: Edge[] = [];
    const edgeSet = new Set<string>();
    
    // Conecta vértices entre partições
    for (let i = 0; i < n1; i++) {
      const numConnections = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numConnections; j++) {
        const to = n1 + Math.floor(Math.random() * n2);
        const edgeKey1 = `${i}-${to}`;
        const edgeKey2 = `${to}-${i}`;
        
        if (!edgeSet.has(edgeKey1)) {
          edgeSet.add(edgeKey1);
          edgeSet.add(edgeKey2);
          newEdges.push({ from: i, to, highlighted: false });
          newEdges.push({ from: to, to: i, highlighted: false });
        }
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
    
    // Converte para os tipos específicos do UndirectedGraphSimulator
    const undirectedNodes: Node[] = customNodes.map(n => ({
      id: n.id,
      label: n.label,
      state: 'unvisited' as NodeState,
      expl: 0,
      comp: 0,
      x: n.x,
      y: n.y,
      color: 0,
      m: 0,
      parent: -1,
      numChildren: 0,
      isArticulation: false
    }));

    const undirectedEdges: Edge[] = customEdges.map(e => ({
      from: e.from,
      to: e.to,
      highlighted: false,
      isBridge: false,
      isConflict: false
    }));
    
    setNodes(undirectedNodes);
    setEdges(undirectedEdges);
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setStartNode(0);
  }, [savedGraph]);

  // MÓDULO 3.1: Teste de Bipartição
  const generateBipartitionSteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    const nodesCopy: Node[] = nodes.map(n => ({ ...n, color: 0 }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
    
    const callStack: CallStackFrame[] = [];
    let eBipartido = true;
    let conflictEdge: { from: number; to: number } | undefined;
    
    const adjList: number[][] = new Array(nodes.length).fill(null).map(() => []);
    edges.forEach(edge => {
      if (!adjList[edge.from].includes(edge.to)) {
        adjList[edge.from].push(edge.to);
      }
    });
    
    // Ordena adjacências lexicograficamente (por label)
    adjList.forEach(neighbors => {
      neighbors.sort((a, b) => nodesCopy[a].label.localeCompare(nodesCopy[b].label));
    });

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [...callStack],
      contadorExpl: 0,
      message: 'Iniciando teste de bipartição. Tentando colorir o grafo com 2 cores.',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'init',
      isBipartite: true,
      conflictDetected: false,
    });

    const dfsBP = (v: number, corAtual: number): boolean => {
      if (!eBipartido) return false;

      nodesCopy[v].color = corAtual;
      nodesCopy[v].state = 'exploring';
      callStack.push({ nodeId: v, nodeLabel: nodesCopy[v].label });

      const corVizinho = corAtual === 1 ? 2 : 1;

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl: 0,
        message: `DFSBP(${nodesCopy[v].label}, cor=${corAtual}): Colorindo ${nodesCopy[v].label} com cor ${corAtual}.`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'color',
        isBipartite: eBipartido,
        conflictDetected: false,
      });

      for (const u of adjList[v]) {
        const edgeIndex = edgesCopy.findIndex(e => e.from === v && e.to === u);
        
        edgesCopy[edgeIndex].highlighted = true;
        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n })),
          edges: edgesCopy.map(e => ({ ...e })),
          callStack: [...callStack],
          contadorExpl: 0,
          message: `Avaliando aresta {${nodesCopy[v].label}, ${nodesCopy[u].label}}`,
          highlightedNode: null,
          highlightedEdge: { from: v, to: u },
          action: 'evaluate-edge',
          isBipartite: eBipartido,
          conflictDetected: false,
        });
        edgesCopy[edgeIndex].highlighted = false;

        if (nodesCopy[u].color === 0) {
          // Vizinho sem cor - colorir com cor oposta
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl: 0,
            message: `${nodesCopy[u].label} não tem cor. Colorindo com cor ${corVizinho} (oposta à ${nodesCopy[v].label}).`,
            highlightedNode: u,
            highlightedEdge: { from: v, to: u },
            action: 'tree',
            isBipartite: eBipartido,
            conflictDetected: false,
          });

          if (!dfsBP(u, corVizinho)) return false;

        } else if (nodesCopy[u].color === corAtual) {
          // CONFLITO! Vizinho tem a mesma cor
          eBipartido = false;
          conflictEdge = { from: v, to: u };
          
          // Marca a aresta de conflito
          const fwdEdge = edgesCopy.findIndex(e => e.from === v && e.to === u);
          const bckEdge = edgesCopy.findIndex(e => e.from === u && e.to === v);
          if (fwdEdge >= 0) edgesCopy[fwdEdge].isConflict = true;
          if (bckEdge >= 0) edgesCopy[bckEdge].isConflict = true;

          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl: 0,
            message: `⚠️ CONFLITO! ${nodesCopy[u].label} já tem cor ${nodesCopy[u].color} (mesma que ${nodesCopy[v].label}). Grafo NÃO é bipartido!`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'conflict',
            isBipartite: false,
            conflictDetected: true,
            conflictEdge: { from: v, to: u },
          });

          return false;
        } else {
          // Vizinho tem cor oposta - OK
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl: 0,
            message: `${nodesCopy[u].label} já tem cor ${nodesCopy[u].color} (oposta à ${nodesCopy[v].label}). OK!`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'valid',
            isBipartite: eBipartido,
            conflictDetected: false,
          });
        }
      }

      nodesCopy[v].state = 'finished';
      callStack.pop();

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl: 0,
        message: `Exploração de ${nodesCopy[v].label} concluída.`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'finish',
        isBipartite: eBipartido,
        conflictDetected: false,
      });

      return true;
    };

    // Loop principal - começa pelo vértice selecionado, depois visita os demais
    if (nodesCopy[startNode].color === 0) {
      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl: 0,
        message: `Iniciando DFS a partir do vértice selecionado: ${nodesCopy[startNode].label}`,
        highlightedNode: startNode,
        highlightedEdge: null,
        action: 'search',
        isBipartite: eBipartido,
        conflictDetected: false,
      });

      if (!dfsBP(startNode, 1)) {
        // Já encontrou conflito
      }
    }

    for (let i = 0; i < nodesCopy.length; i++) {
      if (nodesCopy[i].color === 0) {
        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n })),
          edges: edgesCopy.map(e => ({ ...e })),
          callStack: [...callStack],
          contadorExpl: 0,
          message: `Procurando vértice não colorido. Encontrado: ${nodesCopy[i].label}`,
          highlightedNode: i,
          highlightedEdge: null,
          action: 'search',
          isBipartite: eBipartido,
          conflictDetected: false,
        });
        
        if (!dfsBP(i, 1)) break;
      }
    }

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [],
      contadorExpl: 0,
      message: eBipartido 
        ? '✅ Grafo é BIPARTIDO! Pode ser colorido com 2 cores.'
        : '❌ Grafo NÃO é bipartido. Contém ciclo ímpar.',
      highlightedNode: null,
      highlightedEdge: conflictEdge || null,
      action: 'final',
      isBipartite: eBipartido,
      conflictDetected: !eBipartido,
      conflictEdge,
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges, startNode]);

  // MÓDULO 3.2: Vértices de Corte
  const generateArticulationSteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    const nodesCopy: Node[] = nodes.map(n => ({ ...n, m: 0, parent: -1, numChildren: 0, isArticulation: false }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
    
    let contadorExpl = 0;
    const callStack: CallStackFrame[] = [];
    const articulationPoints: number[] = [];
    const rootNode = startNode;
    
    const adjList: number[][] = new Array(nodes.length).fill(null).map(() => []);
    edges.forEach(edge => {
      if (!adjList[edge.from].includes(edge.to)) {
        adjList[edge.from].push(edge.to);
      }
    });
    
    // Ordena adjacências lexicograficamente (por label)
    adjList.forEach(neighbors => {
      neighbors.sort((a, b) => nodesCopy[a].label.localeCompare(nodesCopy[b].label));
    });

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [...callStack],
      contadorExpl,
      message: 'Iniciando busca por vértices de corte (articulação).',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'init',
      articulationPoints: [],
      rootNode,
    });

    const dfsVC = (v: number) => {
      contadorExpl++;
      nodesCopy[v].expl = contadorExpl;
      nodesCopy[v].m = contadorExpl;
      nodesCopy[v].state = 'exploring';
      callStack.push({ nodeId: v, nodeLabel: nodesCopy[v].label });

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl,
        message: `DFSVC(${nodesCopy[v].label}): expl[${nodesCopy[v].label}] = m[${nodesCopy[v].label}] = ${contadorExpl}`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'discover',
        articulationPoints: [...articulationPoints],
        rootNode,
      });

      for (const u of adjList[v]) {
        if (nodesCopy[u].expl === 0) {
          // Arco de árvore
          nodesCopy[u].parent = v;
          nodesCopy[v].numChildren = (nodesCopy[v].numChildren || 0) + 1;

          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            message: `Arco de árvore {${nodesCopy[v].label}, ${nodesCopy[u].label}}. ${nodesCopy[u].label} é filho de ${nodesCopy[v].label}.`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'tree',
            articulationPoints: [...articulationPoints],
            rootNode,
          });

          dfsVC(u);

          // Atualiza m[v]
          const oldM: number = nodesCopy[v].m!;
          nodesCopy[v].m = Math.min(nodesCopy[v].m!, nodesCopy[u].m!);

          if (oldM !== nodesCopy[v].m) {
            simulationSteps.push({
              nodes: nodesCopy.map(n => ({ ...n })),
              edges: edgesCopy.map(e => ({ ...e })),
              callStack: [...callStack],
              contadorExpl,
              message: `Atualizando: m[${nodesCopy[v].label}] = min(${oldM}, ${nodesCopy[u].m}) = ${nodesCopy[v].m}`,
              highlightedNode: v,
              highlightedEdge: null,
              action: 'update-m',
              articulationPoints: [...articulationPoints],
              rootNode,
            });
          }

          // Testa se v é ponto de articulação
          if (v !== rootNode && nodesCopy[u].m! >= nodesCopy[v].expl && !nodesCopy[v].isArticulation) {
            nodesCopy[v].isArticulation = true;
            articulationPoints.push(v);

            simulationSteps.push({
              nodes: nodesCopy.map(n => ({ ...n })),
              edges: edgesCopy.map(e => ({ ...e })),
              callStack: [...callStack],
              contadorExpl,
              message: `🎯 ${nodesCopy[v].label} é VÉRTICE DE CORTE! m[${nodesCopy[u].label}] >= expl[${nodesCopy[v].label}]`,
              highlightedNode: v,
              highlightedEdge: null,
              action: 'articulation-found',
              articulationPoints: [...articulationPoints],
              rootNode,
            });
          }

        } else if (u !== nodesCopy[v].parent) {
          // Arco de retorno
          const oldM = nodesCopy[v].m!;
          nodesCopy[v].m = Math.min(nodesCopy[v].m!, nodesCopy[u].expl);

          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            message: `Arco de retorno {${nodesCopy[v].label}, ${nodesCopy[u].label}}. m[${nodesCopy[v].label}] = min(${oldM}, ${nodesCopy[u].expl}) = ${nodesCopy[v].m}`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'back',
            articulationPoints: [...articulationPoints],
            rootNode,
          });
        }
      }

      nodesCopy[v].state = 'finished';
      callStack.pop();
    };

    dfsVC(rootNode);

    // Testa a raiz
    if (nodesCopy[rootNode].numChildren! > 1 && !nodesCopy[rootNode].isArticulation) {
      nodesCopy[rootNode].isArticulation = true;
      articulationPoints.push(rootNode);

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [],
        contadorExpl,
        message: `🎯 Raiz ${nodesCopy[rootNode].label} é VÉRTICE DE CORTE! Tem ${nodesCopy[rootNode].numChildren} filhos.`,
        highlightedNode: rootNode,
        highlightedEdge: null,
        action: 'root-articulation',
        articulationPoints: [...articulationPoints],
        rootNode,
      });
    }

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [],
      contadorExpl,
      message: articulationPoints.length > 0
        ? `✅ Encontrados ${articulationPoints.length} vértice(s) de corte: {${articulationPoints.map(id => nodesCopy[id].label).join(', ')}}`
        : '✅ Nenhum vértice de corte encontrado. Grafo é biconexo.',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'final',
      articulationPoints: [...articulationPoints],
      rootNode,
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges, startNode]);

  // MÓDULO 3.3: Arestas de Corte (Pontes)
  const generateBridgesSteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    const nodesCopy: Node[] = nodes.map(n => ({ ...n, m: 0, parent: -1 }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
    
    let contadorExpl = 0;
    const callStack: CallStackFrame[] = [];
    const bridges: { from: number; to: number }[] = [];
    
    const adjList: number[][] = new Array(nodes.length).fill(null).map(() => []);
    edges.forEach(edge => {
      if (!adjList[edge.from].includes(edge.to)) {
        adjList[edge.from].push(edge.to);
      }
    });
    
    // Ordena adjacências lexicograficamente (por label)
    adjList.forEach(neighbors => {
      neighbors.sort((a, b) => nodesCopy[a].label.localeCompare(nodesCopy[b].label));
    });

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [...callStack],
      contadorExpl,
      message: 'Iniciando busca por arestas de corte (pontes).',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'init',
      bridges: [],
    });

    const dfsAC = (v: number) => {
      contadorExpl++;
      nodesCopy[v].expl = contadorExpl;
      nodesCopy[v].m = contadorExpl;
      nodesCopy[v].state = 'exploring';
      callStack.push({ nodeId: v, nodeLabel: nodesCopy[v].label });

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl,
        message: `DFSAC(${nodesCopy[v].label}): expl[${nodesCopy[v].label}] = m[${nodesCopy[v].label}] = ${contadorExpl}`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'discover',
        bridges: bridges.map(b => ({ ...b })),
      });

      for (const u of adjList[v]) {
        if (nodesCopy[u].expl === 0) {
          // Arco de árvore
          nodesCopy[u].parent = v;

          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            message: `Arco de árvore {${nodesCopy[v].label}, ${nodesCopy[u].label}}.`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'tree',
            bridges: bridges.map(b => ({ ...b })),
          });

          dfsAC(u);

          // Atualiza m[v]
          const oldM: number = nodesCopy[v].m!;
          nodesCopy[v].m = Math.min(nodesCopy[v].m!, nodesCopy[u].m!);

          if (oldM !== nodesCopy[v].m) {
            simulationSteps.push({
              nodes: nodesCopy.map(n => ({ ...n })),
              edges: edgesCopy.map(e => ({ ...e })),
              callStack: [...callStack],
              contadorExpl,
              message: `m[${nodesCopy[v].label}] = min(${oldM}, ${nodesCopy[u].m}) = ${nodesCopy[v].m}`,
              highlightedNode: v,
              highlightedEdge: null,
              action: 'update-m',
              bridges: bridges.map(b => ({ ...b })),
            });
          }

          // Testa se é ponte
          if (nodesCopy[u].m! > nodesCopy[v].expl) {
            bridges.push({ from: v, to: u });
            
            // Marca as arestas como ponte
            const fwdEdge = edgesCopy.findIndex(e => e.from === v && e.to === u);
            const bckEdge = edgesCopy.findIndex(e => e.from === u && e.to === v);
            if (fwdEdge >= 0) edgesCopy[fwdEdge].isBridge = true;
            if (bckEdge >= 0) edgesCopy[bckEdge].isBridge = true;

            simulationSteps.push({
              nodes: nodesCopy.map(n => ({ ...n })),
              edges: edgesCopy.map(e => ({ ...e })),
              callStack: [...callStack],
              contadorExpl,
              message: `🌉 PONTE encontrada! {${nodesCopy[v].label}, ${nodesCopy[u].label}} é aresta de corte. m[${nodesCopy[u].label}] > expl[${nodesCopy[v].label}]`,
              highlightedNode: null,
              highlightedEdge: { from: v, to: u },
              action: 'bridge-found',
              bridges: bridges.map(b => ({ ...b })),
            });
          }

        } else if (u !== nodesCopy[v].parent) {
          // Arco de retorno
          const oldM = nodesCopy[v].m!;
          nodesCopy[v].m = Math.min(nodesCopy[v].m!, nodesCopy[u].expl);

          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            message: `Arco de retorno {${nodesCopy[v].label}, ${nodesCopy[u].label}}. m[${nodesCopy[v].label}] = min(${oldM}, ${nodesCopy[u].expl}) = ${nodesCopy[v].m}`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'back',
            bridges: bridges.map(b => ({ ...b })),
          });
        }
      }

      nodesCopy[v].state = 'finished';
      callStack.pop();
    };

    dfsAC(startNode);

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [],
      contadorExpl,
      message: bridges.length > 0
        ? `✅ Encontradas ${bridges.length} ponte(s): ${bridges.map(b => `{${nodesCopy[b.from].label}, ${nodesCopy[b.to].label}}`).join(', ')}`
        : '✅ Nenhuma ponte encontrada. Grafo é 2-aresta-conexo.',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'final',
      bridges: bridges.map(b => ({ ...b })),
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges, startNode]);

  const generateSteps = useCallback(() => {
    switch (mode) {
      case 'bipartition':
        generateBipartitionSteps();
        break;
      case 'articulation':
        generateArticulationSteps();
        break;
      case 'bridges':
        generateBridgesSteps();
        break;
    }
  }, [mode, generateBipartitionSteps, generateArticulationSteps, generateBridgesSteps]);

  const handleReset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setNodes(nodes.map(n => ({ 
      ...n, 
      state: 'unvisited', 
      expl: 0, 
      comp: 0, 
      color: 0, 
      m: 0, 
      parent: -1, 
      numChildren: 0, 
      isArticulation: false 
    })));
    setEdges(edges.map(e => ({ ...e, highlighted: false, isBridge: false, isConflict: false })));
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
    if (mode === 'bipartition' && node.color) {
      return node.color === 1 
        ? 'fill-red-300 stroke-red-600' 
        : 'fill-blue-300 stroke-blue-600';
    }
    
    if (mode === 'articulation' && node.isArticulation) {
      return 'fill-orange-400 stroke-orange-700';
    }
    
    switch (node.state) {
      case 'unvisited': return 'fill-gray-300 stroke-gray-500';
      case 'exploring': return 'fill-yellow-300 stroke-yellow-600';
      case 'finished': return 'fill-green-400 stroke-green-700';
    }
  };

  const getEdgeStyle = (edge: Edge) => {
    if (edge.isConflict) return 'stroke-red-600 stroke-[4]';
    if (edge.isBridge) return 'stroke-purple-600 stroke-[3]';
    if (edge.highlighted) return 'stroke-blue-500 stroke-[3]';
    return 'stroke-gray-400 stroke-2';
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'bipartition': return 'Teste de Bipartição';
      case 'articulation': return 'Vértices de Corte';
      case 'bridges': return 'Arestas de Corte (Pontes)';
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'bipartition': return 'Verifica se o grafo pode ser colorido com 2 cores (não possui ciclos ímpares).';
      case 'articulation': return 'Encontra vértices cuja remoção desconecta o grafo.';
      case 'bridges': return 'Encontra arestas cuja remoção aumenta o número de componentes conexas.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Aplicações de Grafos Não-Orientados
              </h1>
              <p className="text-slate-600 mb-4">
                Explore algoritmos para análise de grafos não-direcionados.
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
          
          {/* Seletor de Modo */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setMode('bipartition');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'bipartition'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <GitBranch className="inline mr-2" size={18} />
              Teste de Bipartição
            </button>
            <button
              onClick={() => {
                setMode('articulation');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'articulation'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              <AlertTriangle className="inline mr-2" size={18} />
              Vértices de Corte
            </button>
            <button
              onClick={() => {
                setMode('bridges');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'bridges'
                  ? 'bg-teal-600 text-white'
                  : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
              }`}
            >
              <Scissors className="inline mr-2" size={18} />
              Arestas de Corte (Pontes)
            </button>
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-800 mb-1">{getModeTitle()}</h3>
            <p className="text-sm text-slate-600">{getModeDescription()}</p>
          </div>
        </div>

        <div className={`grid gap-8 transition-all duration-300 ${isExpanded ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
          {/* Visualização do Grafo */}
          <div className={isExpanded ? 'col-span-1' : 'lg:col-span-2'}>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">Grafo Não-Orientado</h2>
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
                {/* Arestas (renderiza apenas uma direção visualmente) */}
                {currentState && currentState.edges
                  .filter(edge => edge.from < edge.to) // Evita duplicatas visuais
                  .map((edge, idx) => {
                  const fromNode = currentState.nodes[edge.from];
                  const toNode = currentState.nodes[edge.to];
                  
                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      className={getEdgeStyle(edge)}
                    />
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
                    {/* expl/m */}
                    {(mode === 'articulation' || mode === 'bridges') && node.expl > 0 && (
                      <text
                        x={node.x}
                        y={node.y - 35}
                        textAnchor="middle"
                        className="text-xs fill-slate-600 font-mono pointer-events-none"
                      >
                        {node.expl}/{node.m || '-'}
                      </text>
                    )}
                  </g>
                ))}
              </svg>

              {/* Legenda */}
              <div className="mt-4">
                {mode === 'bipartition' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-700 mb-2">Cores:</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-red-300 border-2 border-red-600"></div>
                          <span>Cor 1 (Partição A)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-blue-300 border-2 border-blue-600"></div>
                          <span>Cor 2 (Partição B)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1 bg-red-600"></div>
                          <span>Aresta conflitante</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {mode === 'articulation' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-700 mb-2">Vértices:</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-orange-400 border-2 border-orange-700"></div>
                          <span>Vértice de Corte</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-700"></div>
                          <span>Vértice Normal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {mode === 'bridges' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-700 mb-2">Arestas:</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1 bg-purple-600"></div>
                          <span>Ponte (Aresta de Corte)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1 bg-gray-400"></div>
                          <span>Aresta Normal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                    requiresWeights={false}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Resultado específico do modo */}
            {currentState && mode === 'bipartition' && currentState.action === 'final' && (
              <div className={`rounded-xl shadow-lg p-6 ${
                currentState.isBipartite 
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-red-50 border-2 border-red-300'
              }`}>
                <h2 className="text-xl font-bold mb-2">
                  {currentState.isBipartite ? '✅ Grafo Bipartido' : '❌ Não Bipartido'}
                </h2>
                <p className="text-sm">
                  {currentState.isBipartite 
                    ? 'O grafo pode ser colorido com 2 cores.'
                    : 'O grafo contém ciclo ímpar.'}
                </p>
              </div>
            )}

            {currentState && mode === 'articulation' && currentState.articulationPoints && currentState.articulationPoints.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Vértices de Corte ({currentState.articulationPoints.length})
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {currentState.articulationPoints.map(nodeId => (
                    <span key={nodeId} className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg font-bold border-2 border-orange-300">
                      {currentState.nodes[nodeId].label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentState && mode === 'bridges' && currentState.bridges && currentState.bridges.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Pontes ({currentState.bridges.length})
                </h2>
                <div className="space-y-2">
                  {currentState.bridges.map((bridge, idx) => (
                    <div key={idx} className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 text-center font-bold text-purple-800">
                      {`{${currentState.nodes[bridge.from].label}, ${currentState.nodes[bridge.to].label}}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      DFS({frame.nodeLabel})
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 text-center italic py-4">
                    Pilha vazia
                  </div>
                )}
              </div>
            </div>

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
            {/* Resultado específico do modo */}
            {currentState && mode === 'bipartition' && currentState.action === 'final' && (
              <div className={`rounded-xl shadow-lg p-6 ${
                currentState.isBipartite 
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-red-50 border-2 border-red-300'
              }`}>
                <h2 className="text-xl font-bold mb-2">
                  {currentState.isBipartite ? '✅ Grafo Bipartido' : '❌ Não Bipartido'}
                </h2>
                <p className="text-sm">
                  {currentState.isBipartite 
                    ? 'O grafo pode ser colorido com 2 cores.'
                    : 'O grafo contém ciclo ímpar.'}
                </p>
              </div>
            )}

            {currentState && mode === 'articulation' && currentState.articulationPoints && currentState.articulationPoints.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Vértices de Corte ({currentState.articulationPoints.length})
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {currentState.articulationPoints.map(nodeId => (
                    <span key={nodeId} className="bg-orange-100 text-orange-800 px-3 py-2 rounded-lg font-bold border-2 border-orange-300">
                      {currentState.nodes[nodeId].label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentState && mode === 'bridges' && currentState.bridges && currentState.bridges.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  Arestas-Ponte ({currentState.bridges.length})
                </h2>
                <div className="space-y-2">
                  {currentState.bridges.map((bridge, idx) => (
                    <div key={idx} className="bg-red-50 border-2 border-red-200 rounded-lg p-2 text-center font-mono text-red-800">
                      {currentState.nodes[bridge.from].label} - {currentState.nodes[bridge.to].label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variáveis Globais */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Variáveis</h2>
              {currentState && (
                <div className="bg-slate-100 rounded-lg p-3">
                  <div className="text-sm text-slate-600">Contador Exploração</div>
                  <div className="text-2xl font-bold text-slate-800">{currentState.contadorExpl}</div>
                </div>
              )}
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
                Gerar Grafo
              </h2>
              
              <p className="text-slate-600 mb-6">
                {mode === 'bipartition' 
                  ? 'Escolha entre um grafo aleatório ou um grafo bipartido garantido.'
                  : 'Será gerado um grafo não-orientado com arestas aleatórias.'}
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
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRandomDialog(false)}
                  className="flex-1 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                {mode === 'bipartition' && (
                  <button
                    onClick={() => generateBipartiteGraph(numVertices)}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Bipartido
                  </button>
                )}
                <button
                  onClick={() => generateRandomGraph(numVertices, mode !== 'bipartition')}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Shuffle size={20} />
                  Aleatório
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UndirectedGraphSimulator;
