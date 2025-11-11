import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, RotateCcw, Play, Shuffle, AlertCircle, CheckCircle, List, Navigation, Maximize2, Minimize2 } from 'lucide-react';
import LoadCustomGraphButton from './LoadCustomGraphButton';
import { useGraph } from '../contexts/GraphContext';
import { convertGraphToSimulator } from '../utils/graphConverter';
import { useDragNodes } from '../hooks/useDragNodes';

// Tipos de arcos
type EdgeType = 'none' | 'tree' | 'back' | 'forward' | 'cross';

// Estado de um vértice
type NodeState = 'unvisited' | 'exploring' | 'finished';

// Modos de simulação
type SimulationMode = 'acyclicity' | 'topological' | 'scc';

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
  // Para SCC
  cfc?: number;
  inStack?: boolean;
  sccId?: number;
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
  action: string;
  // Para aciclidade
  isAcyclic?: boolean;
  cycleDetected?: boolean;
  cycleEdge?: { from: number; to: number };
  // Para ordenação topológica
  topologicalOrder?: number[];
  // Para SCC
  sccStack?: number[];
  sccs?: number[][];
}

const GraphApplicationsSimulator = () => {
  const [mode, setMode] = useState<SimulationMode>('acyclicity');
  
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
    { from: 4, to: 0, type: 'none', highlighted: false }, // Arco de retorno (ciclo)
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

  // Função para gerar grafo aleatório
  const generateRandomGraph = useCallback((n: number, includeBackEdge: boolean = true) => {
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
    
    // Adicionar arestas extras
    const extraEdges = Math.floor(n * 0.4);
    for (let i = 0; i < extraEdges; i++) {
      const from = Math.floor(Math.random() * n);
      const to = Math.floor(Math.random() * n);
      const edgeKey = `${from}-${to}`;
      
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
    
    // Adicionar um arco de retorno garantido (para demonstrar ciclo)
    if (includeBackEdge && n >= 3) {
      const from = Math.floor(n * 0.7);
      const to = Math.floor(n * 0.3);
      const edgeKey = `${from}-${to}`;
      if (!edgeSet.has(edgeKey) && from !== to) {
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

  // Gera DAG (grafo acíclico) para ordenação topológica
  const generateDAG = useCallback((n: number) => {
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
    
    // Gera arestas apenas de vértices de índice menor para maior (garante DAG)
    for (let i = 0; i < n; i++) {
      const numOutEdges = Math.floor(Math.random() * 3) + 1; // 1-3 arestas saindo
      for (let j = 0; j < numOutEdges; j++) {
        const to = i + 1 + Math.floor(Math.random() * Math.min(3, n - i - 1));
        if (to < n) {
          const edgeKey = `${i}-${to}`;
          if (!edgeSet.has(edgeKey)) {
            edgeSet.add(edgeKey);
            newEdges.push({
              from: i,
              to,
              type: 'none',
              highlighted: false,
            });
          }
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
    
    // Converte para os tipos específicos do GraphApplicationsSimulator
    const graphNodes: Node[] = customNodes.map(n => ({
      id: n.id,
      label: n.label,
      state: 'unvisited' as NodeState,
      expl: 0,
      comp: 0,
      x: n.x,
      y: n.y,
      cfc: 0,
      inStack: false,
      sccId: -1
    }));

    const graphEdges: Edge[] = customEdges.map(e => ({
      from: e.from,
      to: e.to,
      type: 'none' as EdgeType,
      highlighted: false
    }));
    
    setNodes(graphNodes);
    setEdges(graphEdges);
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setStartNode(0);
  }, [savedGraph]);

  // MÓDULO 2.1: Teste de Aciclidade
  const generateAcyclicitySteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    const nodesCopy: Node[] = nodes.map(n => ({ ...n }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
    
    let contadorExpl = 0;
    let contadorComp = 0;
    const callStack: CallStackFrame[] = [];
    let grafoEAciclico = true;
    let cycleEdge: { from: number; to: number } | undefined;
    
    const adjList: number[][] = new Array(nodes.length).fill(null).map(() => []);
    edges.forEach(edge => {
      adjList[edge.from].push(edge.to);
    });

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [...callStack],
      contadorExpl,
      contadorComp,
      message: 'Iniciando teste de aciclidade. Procurando arcos de retorno (ciclos).',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'init',
      isAcyclic: true,
      cycleDetected: false,
    });

    const dfsAciclicidade = (v: number): boolean => {
      if (!grafoEAciclico) return false;

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
        message: `DFS(${nodesCopy[v].label}): Descobrindo vértice. expl[${nodesCopy[v].label}] = ${contadorExpl}`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'discover',
        isAcyclic: grafoEAciclico,
        cycleDetected: false,
      });

      for (const u of adjList[v]) {
        const edgeIndex = edgesCopy.findIndex(e => e.from === v && e.to === u);
        
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
          action: 'evaluate-edge',
          isAcyclic: grafoEAciclico,
          cycleDetected: false,
        });

        if (nodesCopy[u].expl === 0) {
          edgesCopy[edgeIndex].type = 'tree';
          edgesCopy[edgeIndex].highlighted = false;
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp,
            message: `expl[${nodesCopy[u].label}] == 0. Arco de árvore. Chamada recursiva.`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'tree',
            isAcyclic: grafoEAciclico,
            cycleDetected: false,
          });

          if (!dfsAciclicidade(u)) return false;

        } else if (nodesCopy[u].comp === 0) {
          // CICLO DETECTADO!
          edgesCopy[edgeIndex].type = 'back';
          edgesCopy[edgeIndex].highlighted = false;
          grafoEAciclico = false;
          cycleEdge = { from: v, to: u };
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp,
            message: `⚠️ CICLO DETECTADO! Arco de retorno <${nodesCopy[v].label}, ${nodesCopy[u].label}>. O grafo NÃO é acíclico.`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'cycle-detected',
            isAcyclic: false,
            cycleDetected: true,
            cycleEdge: { from: v, to: u },
          });

          return false;
        } else {
          edgesCopy[edgeIndex].type = 'cross';
          edgesCopy[edgeIndex].highlighted = false;
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp,
            message: `comp[${nodesCopy[u].label}] > 0. Arco de cruzamento.`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'cross',
            isAcyclic: grafoEAciclico,
            cycleDetected: false,
          });
        }
      }

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
        message: `Exploração de ${nodesCopy[v].label} terminada. comp[${nodesCopy[v].label}] = ${contadorComp}`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'finish',
        isAcyclic: grafoEAciclico,
        cycleDetected: false,
      });

      return true;
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
        action: 'search',
        isAcyclic: grafoEAciclico,
        cycleDetected: false,
      });
      
      if (!dfsAciclicidade(startNode)) {
        // Já encontrou ciclo, não precisa continuar
      }
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
          action: 'search',
          isAcyclic: grafoEAciclico,
          cycleDetected: false,
        });
        
        if (!dfsAciclicidade(i)) {
          break;
        }
      }
    }

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [],
      contadorExpl,
      contadorComp,
      message: grafoEAciclico 
        ? '✅ Teste concluído! O grafo é ACÍCLICO (DAG).'
        : '❌ Teste concluído! O grafo contém CICLO.',
      highlightedNode: null,
      highlightedEdge: cycleEdge || null,
      action: 'final',
      isAcyclic: grafoEAciclico,
      cycleDetected: !grafoEAciclico,
      cycleEdge,
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges, startNode]);

  // MÓDULO 2.2: Ordenação Topológica
  const generateTopologicalSteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    const nodesCopy: Node[] = nodes.map(n => ({ ...n }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
    
    let contadorExpl = 0;
    let contadorComp = 0;
    const callStack: CallStackFrame[] = [];
    const topologicalOrder: number[] = [];
    
    const adjList: number[][] = new Array(nodes.length).fill(null).map(() => []);
    edges.forEach(edge => {
      adjList[edge.from].push(edge.to);
    });

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [...callStack],
      contadorExpl,
      contadorComp,
      message: 'Iniciando Ordenação Topológica. Os vértices serão adicionados à lista ao terminar sua exploração.',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'init',
      topologicalOrder: [...topologicalOrder],
    });

    const dfsOT = (v: number) => {
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
        message: `DFSOT(${nodesCopy[v].label}): Descobrindo vértice. expl[${nodesCopy[v].label}] = ${contadorExpl}`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'discover',
        topologicalOrder: [...topologicalOrder],
      });

      for (const u of adjList[v]) {
        const edgeIndex = edgesCopy.findIndex(e => e.from === v && e.to === u);
        
        if (nodesCopy[u].expl === 0) {
          edgesCopy[edgeIndex].type = 'tree';
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp,
            message: `Explorando arco <${nodesCopy[v].label}, ${nodesCopy[u].label}>. Chamada recursiva.`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'tree',
            topologicalOrder: [...topologicalOrder],
          });

          dfsOT(u);
        }
      }

      contadorComp++;
      nodesCopy[v].comp = contadorComp;
      nodesCopy[v].state = 'finished';
      
      // Adiciona no INÍCIO da lista de ordenação topológica
      topologicalOrder.unshift(v);
      
      callStack.pop();

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl,
        contadorComp,
        message: `${nodesCopy[v].label} terminado. comp[${nodesCopy[v].label}] = ${contadorComp}. Adicionado ao INÍCIO da ordenação.`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'finish-add-to-order',
        topologicalOrder: [...topologicalOrder],
      });
    };

    // Loop principal - começa pelo vértice selecionado, depois visita os demais
    if (nodesCopy[startNode].expl === 0) {
      dfsOT(startNode);
    }

    for (let i = 0; i < nodesCopy.length; i++) {
      if (nodesCopy[i].expl === 0) {
        dfsOT(i);
      }
    }

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [],
      contadorExpl,
      contadorComp,
      message: `✅ Ordenação Topológica concluída! Ordem: ${topologicalOrder.map(id => nodesCopy[id].label).join(' → ')}`,
      highlightedNode: null,
      highlightedEdge: null,
      action: 'final',
      topologicalOrder: [...topologicalOrder],
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges, startNode]);

  // MÓDULO 2.3: Componentes Fortemente Conexas (SCC)
  const generateSCCSteps = useCallback(() => {
    const simulationSteps: SimulationStep[] = [];
    const nodesCopy: Node[] = nodes.map(n => ({ ...n, cfc: 0, inStack: false, sccId: -1 }));
    const edgesCopy: Edge[] = edges.map(e => ({ ...e }));
    
    let contadorExpl = 0;
    const callStack: CallStackFrame[] = [];
    const sccStack: number[] = [];
    const sccs: number[][] = [];
    let currentSccId = 0;
    
    const adjList: number[][] = new Array(nodes.length).fill(null).map(() => []);
    edges.forEach(edge => {
      adjList[edge.from].push(edge.to);
    });

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [...callStack],
      contadorExpl,
      contadorComp: 0,
      message: 'Iniciando algoritmo de Tarjan para encontrar Componentes Fortemente Conexas (SCC).',
      highlightedNode: null,
      highlightedEdge: null,
      action: 'init',
      sccStack: [...sccStack],
      sccs: sccs.map(scc => [...scc]),
    });

    const dfsSCC = (v: number) => {
      contadorExpl++;
      nodesCopy[v].expl = contadorExpl;
      nodesCopy[v].cfc = contadorExpl;
      nodesCopy[v].state = 'exploring';
      nodesCopy[v].inStack = true;
      
      sccStack.push(v);
      callStack.push({ nodeId: v, nodeLabel: nodesCopy[v].label });

      simulationSteps.push({
        nodes: nodesCopy.map(n => ({ ...n })),
        edges: edgesCopy.map(e => ({ ...e })),
        callStack: [...callStack],
        contadorExpl,
        contadorComp: 0,
        message: `DFSCFC(${nodesCopy[v].label}): expl[${nodesCopy[v].label}] = cfc[${nodesCopy[v].label}] = ${contadorExpl}. Empilhado.`,
        highlightedNode: v,
        highlightedEdge: null,
        action: 'discover',
        sccStack: [...sccStack],
        sccs: sccs.map(scc => [...scc]),
      });

      for (const u of adjList[v]) {
        const edgeIndex = edgesCopy.findIndex(e => e.from === v && e.to === u);
        
        if (nodesCopy[u].expl === 0) {
          edgesCopy[edgeIndex].type = 'tree';
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp: 0,
            message: `Arco de árvore <${nodesCopy[v].label}, ${nodesCopy[u].label}>. Chamada recursiva.`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'tree',
            sccStack: [...sccStack],
            sccs: sccs.map(scc => [...scc]),
          });

          dfsSCC(u);
          
          const oldCfc: number = nodesCopy[v].cfc!;
          nodesCopy[v].cfc = Math.min(nodesCopy[v].cfc!, nodesCopy[u].cfc!);
          
          if (oldCfc !== nodesCopy[v].cfc) {
            simulationSteps.push({
              nodes: nodesCopy.map(n => ({ ...n })),
              edges: edgesCopy.map(e => ({ ...e })),
              callStack: [...callStack],
              contadorExpl,
              contadorComp: 0,
              message: `Atualizando: cfc[${nodesCopy[v].label}] = min(${oldCfc}, ${nodesCopy[u].cfc}) = ${nodesCopy[v].cfc}`,
              highlightedNode: v,
              highlightedEdge: null,
              action: 'update-cfc',
              sccStack: [...sccStack],
              sccs: sccs.map(scc => [...scc]),
            });
          }

        } else if (nodesCopy[u].inStack) {
          edgesCopy[edgeIndex].type = 'back';
          
          const oldCfc = nodesCopy[v].cfc!;
          nodesCopy[v].cfc = Math.min(nodesCopy[v].cfc!, nodesCopy[u].expl);
          
          simulationSteps.push({
            nodes: nodesCopy.map(n => ({ ...n })),
            edges: edgesCopy.map(e => ({ ...e })),
            callStack: [...callStack],
            contadorExpl,
            contadorComp: 0,
            message: `${nodesCopy[u].label} está na pilha. cfc[${nodesCopy[v].label}] = min(${oldCfc}, ${nodesCopy[u].expl}) = ${nodesCopy[v].cfc}`,
            highlightedNode: null,
            highlightedEdge: { from: v, to: u },
            action: 'back-in-stack',
            sccStack: [...sccStack],
            sccs: sccs.map(scc => [...scc]),
          });
        }
      }

      // Condição de raiz da SCC
      if (nodesCopy[v].cfc === nodesCopy[v].expl) {
        const currentSCC: number[] = [];
        let w: number;
        
        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n })),
          edges: edgesCopy.map(e => ({ ...e })),
          callStack: [...callStack],
          contadorExpl,
          contadorComp: 0,
          message: `🎯 ${nodesCopy[v].label} é raiz de uma SCC (cfc == expl). Desempilhando componente...`,
          highlightedNode: v,
          highlightedEdge: null,
          action: 'scc-root',
          sccStack: [...sccStack],
          sccs: sccs.map(scc => [...scc]),
        });

        do {
          w = sccStack.pop()!;
          nodesCopy[w].inStack = false;
          nodesCopy[w].sccId = currentSccId;
          nodesCopy[w].state = 'finished';
          currentSCC.push(w);
        } while (w !== v);

        sccs.push(currentSCC);
        currentSccId++;

        simulationSteps.push({
          nodes: nodesCopy.map(n => ({ ...n })),
          edges: edgesCopy.map(e => ({ ...e })),
          callStack: [...callStack],
          contadorExpl,
          contadorComp: 0,
          message: `✅ SCC ${currentSccId} encontrada: {${currentSCC.map(id => nodesCopy[id].label).join(', ')}}`,
          highlightedNode: null,
          highlightedEdge: null,
          action: 'scc-found',
          sccStack: [...sccStack],
          sccs: sccs.map(scc => [...scc]),
        });
      }

      callStack.pop();
    };

    // Loop principal - começa pelo vértice selecionado, depois visita os demais
    if (nodesCopy[startNode].expl === 0) {
      dfsSCC(startNode);
    }

    for (let i = 0; i < nodesCopy.length; i++) {
      if (nodesCopy[i].expl === 0) {
        dfsSCC(i);
      }
    }

    simulationSteps.push({
      nodes: nodesCopy.map(n => ({ ...n })),
      edges: edgesCopy.map(e => ({ ...e })),
      callStack: [],
      contadorExpl,
      contadorComp: 0,
      message: `🎉 Algoritmo concluído! Encontradas ${sccs.length} componente(s) fortemente conexa(s).`,
      highlightedNode: null,
      highlightedEdge: null,
      action: 'final',
      sccStack: [],
      sccs: sccs.map(scc => [...scc]),
    });

    setSteps(simulationSteps);
    setCurrentStep(0);
    setIsSimulating(true);
  }, [nodes, edges, startNode]);

  const generateSteps = useCallback(() => {
    switch (mode) {
      case 'acyclicity':
        generateAcyclicitySteps();
        break;
      case 'topological':
        generateTopologicalSteps();
        break;
      case 'scc':
        generateSCCSteps();
        break;
    }
  }, [mode, generateAcyclicitySteps, generateTopologicalSteps, generateSCCSteps]);

  const handleReset = () => {
    setSteps([]);
    setCurrentStep(0);
    setIsSimulating(false);
    setNodes(nodes.map(n => ({ ...n, state: 'unvisited', expl: 0, comp: 0, cfc: 0, inStack: false, sccId: -1 })));
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

  const getNodeColor = (state: NodeState, sccId?: number) => {
    if (mode === 'scc' && sccId !== undefined && sccId >= 0) {
      const colors = [
        'fill-blue-300 stroke-blue-600',
        'fill-green-300 stroke-green-600',
        'fill-yellow-300 stroke-yellow-600',
        'fill-purple-300 stroke-purple-600',
        'fill-pink-300 stroke-pink-600',
        'fill-orange-300 stroke-orange-600',
      ];
      return colors[sccId % colors.length];
    }
    
    switch (state) {
      case 'unvisited': return 'fill-gray-300 stroke-gray-500';
      case 'exploring': return 'fill-yellow-300 stroke-yellow-600';
      case 'finished': return 'fill-green-400 stroke-green-700';
    }
  };

  const getEdgeStyle = (type: EdgeType, highlighted: boolean) => {
    const baseStyle = highlighted ? 'stroke-[3]' : 'stroke-2';
    
    switch (type) {
      case 'none': return `stroke-gray-400 ${baseStyle}`;
      case 'tree': return `stroke-black ${baseStyle}`;
      case 'back': return `stroke-red-600 ${baseStyle}`;
      case 'forward': return `stroke-green-600 ${baseStyle}`;
      case 'cross': return `stroke-blue-600 ${baseStyle}`;
    }
  };

  const getEdgeDashArray = (type: EdgeType) => {
    return (type === 'back' || type === 'forward' || type === 'cross') ? '5,5' : 'none';
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'acyclicity': return 'Teste de Aciclidade';
      case 'topological': return 'Ordenação Topológica';
      case 'scc': return 'Componentes Fortemente Conexas (SCC)';
    }
  };

  const getModeDescription = () => {
    switch (mode) {
      case 'acyclicity': return 'Detecta se o grafo possui ciclos procurando por arcos de retorno.';
      case 'topological': return 'Ordena os vértices de um DAG linearmente respeitando as dependências.';
      case 'scc': return 'Encontra conjuntos de vértices mutuamente alcançáveis usando o algoritmo de Tarjan.';
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
                Aplicações de Grafos Direcionados
              </h1>
              <p className="text-slate-600 mb-4">
                Explore diferentes algoritmos baseados em DFS para análise de grafos direcionados.
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
                setMode('acyclicity');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'acyclicity'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              <AlertCircle className="inline mr-2" size={18} />
              Teste de Aciclidade
            </button>
            <button
              onClick={() => {
                setMode('topological');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'topological'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <List className="inline mr-2" size={18} />
              Ordenação Topológica
            </button>
            <button
              onClick={() => {
                setMode('scc');
                handleReset();
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === 'scc'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <CheckCircle className="inline mr-2" size={18} />
              Componentes Fortemente Conexas
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
                  
                  const dx = toNode.x - fromNode.x;
                  const dy = toNode.y - fromNode.y;
                  const length = Math.sqrt(dx * dx + dy * dy);
                  const ratio = (length - 25) / length;
                  const arrowX = fromNode.x + dx * ratio;
                  const arrowY = fromNode.y + dy * ratio;

                  const isCycleEdge = currentState.cycleEdge && 
                    currentState.cycleEdge.from === edge.from && 
                    currentState.cycleEdge.to === edge.to;

                  return (
                    <g key={idx}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={arrowX}
                        y2={arrowY}
                        className={isCycleEdge ? 'stroke-red-600 stroke-[4]' : getEdgeStyle(edge.type, edge.highlighted)}
                        strokeDasharray={getEdgeDashArray(edge.type)}
                      />
                      <polygon
                        points={`${arrowX},${arrowY} ${arrowX - 8},${arrowY - 4} ${arrowX - 8},${arrowY + 4}`}
                        className={isCycleEdge ? 'fill-red-600' :
                                  edge.type === 'none' ? 'fill-gray-400' : 
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
                      className={getNodeColor(node.state, node.sccId)}
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
                    {/* expl/comp ou expl/cfc */}
                    <text
                      x={node.x}
                      y={node.y - 35}
                      textAnchor="middle"
                      className="text-xs fill-slate-600 font-mono pointer-events-none"
                    >
                      {mode === 'scc' && node.expl > 0
                        ? `${node.expl}/${node.cfc || '-'}`
                        : node.expl > 0
                        ? `${node.expl}/${node.comp > 0 ? node.comp : '-'}`
                        : ''}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Controles */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-4">
              <div className="flex justify-between items-center">
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
              // Modo expandido: layout horizontal
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Resultado específico do modo */}
            {currentState && mode === 'acyclicity' && currentState.action === 'final' && (
              <div className={`rounded-xl shadow-lg p-6 ${
                currentState.isAcyclic 
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-red-50 border-2 border-red-300'
              }`}>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {currentState.isAcyclic ? (
                    <>
                      <CheckCircle className="text-green-600" />
                      <span className="text-green-800">Grafo Acíclico</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-red-600" />
                      <span className="text-red-800">Ciclo Detectado</span>
                    </>
                  )}
                </h2>
                <p className="text-sm">
                  {currentState.isAcyclic 
                    ? 'O grafo é um DAG (Directed Acyclic Graph).'
                    : 'O grafo contém pelo menos um ciclo.'}
                </p>
              </div>
            )}

            {currentState && mode === 'topological' && currentState.topologicalOrder && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Ordenação Topológica</h2>
                <div className="flex flex-wrap gap-2">
                  {currentState.topologicalOrder.map((nodeId, idx) => (
                    <React.Fragment key={nodeId}>
                      <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-bold">
                        {currentState.nodes[nodeId].label}
                      </div>
                      {idx < currentState.topologicalOrder!.length - 1 && (
                        <span className="text-slate-400 self-center">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {currentState && mode === 'scc' && currentState.sccs && currentState.sccs.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  SCCs Encontradas ({currentState.sccs.length})
                </h2>
                <div className="space-y-2">
                  {currentState.sccs.map((scc, idx) => (
                    <div key={idx} className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
                      <div className="font-semibold text-purple-900 text-sm mb-1">
                        SCC {idx + 1}:
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {scc.map(nodeId => (
                          <span key={nodeId} className="bg-purple-200 text-purple-800 px-2 py-1 rounded font-bold text-sm">
                            {currentState.nodes[nodeId].label}
                          </span>
                        ))}
                      </div>
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
            </div>
            ) : (
              <>
            {/* Resultado específico do modo */}
            {currentState && mode === 'acyclicity' && currentState.action === 'final' && (
              <div className={`rounded-xl shadow-lg p-6 ${
                currentState.isAcyclic 
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-red-50 border-2 border-red-300'
              }`}>
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {currentState.isAcyclic ? (
                    <>
                      <CheckCircle className="text-green-600" />
                      <span className="text-green-800">Grafo Acíclico</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="text-red-600" />
                      <span className="text-red-800">Ciclo Detectado</span>
                    </>
                  )}
                </h2>
                <p className="text-sm">
                  {currentState.isAcyclic 
                    ? 'O grafo é um DAG (Directed Acyclic Graph).'
                    : 'O grafo contém pelo menos um ciclo.'}
                </p>
              </div>
            )}

            {currentState && mode === 'topological' && currentState.topologicalOrder && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Ordenação Topológica</h2>
                <div className="flex flex-wrap gap-2">
                  {currentState.topologicalOrder.map((nodeId, idx) => (
                    <React.Fragment key={nodeId}>
                      <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-bold">
                        {currentState.nodes[nodeId].label}
                      </div>
                      {idx < currentState.topologicalOrder!.length - 1 && (
                        <span className="text-slate-400 self-center">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {currentState && mode === 'scc' && currentState.sccs && currentState.sccs.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                  SCCs Encontradas ({currentState.sccs.length})
                </h2>
                <div className="space-y-2">
                  {currentState.sccs.map((scc, idx) => (
                    <div key={idx} className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3">
                      <div className="font-semibold text-purple-900 text-sm mb-1">
                        SCC {idx + 1}:
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {scc.map(nodeId => (
                          <span key={nodeId} className="bg-purple-200 text-purple-800 px-2 py-1 rounded font-bold text-sm">
                            {currentState.nodes[nodeId].label}
                          </span>
                        ))}
                      </div>
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

            {/* Pilha SCC (apenas para modo SCC) */}
            {mode === 'scc' && currentState && currentState.sccStack && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Pilha SCC</h2>
                <div className="space-y-2">
                  {currentState.sccStack.length > 0 ? (
                    [...currentState.sccStack].reverse().map((nodeId, idx) => (
                      <div
                        key={idx}
                        className="bg-orange-100 border-2 border-orange-300 rounded-lg p-3 text-center font-mono"
                      >
                        {currentState.nodes[nodeId].label}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 text-center italic py-4">
                      Pilha vazia
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Painel de Estado */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Variáveis</h2>
              
              {currentState && (
                <div className="space-y-4">
                  <div className="bg-slate-100 rounded-lg p-3">
                    <div className="text-sm text-slate-600">Contador Exploração</div>
                    <div className="text-2xl font-bold text-slate-800">{currentState.contadorExpl}</div>
                  </div>
                  
                  {mode !== 'scc' && (
                    <div className="bg-slate-100 rounded-lg p-3">
                      <div className="text-sm text-slate-600">Contador Complementação</div>
                      <div className="text-2xl font-bold text-slate-800">{currentState.contadorComp}</div>
                    </div>
                  )}
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
                {mode === 'topological' 
                  ? 'Será gerado um DAG (grafo acíclico) adequado para ordenação topológica.'
                  : 'Será gerado um grafo direcionado com arestas aleatórias.'}
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
                <button
                  onClick={() => {
                    if (mode === 'topological') {
                      generateDAG(numVertices);
                    } else {
                      generateRandomGraph(numVertices, true);
                    }
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

export default GraphApplicationsSimulator;
