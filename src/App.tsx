import './index.css';
import React, { useState } from 'react';
import { Search, Bot, Cpu, ArrowRight, GitBranch, Network, Layers, Share2, Navigation, TreePine, Edit3, Binary, Grid3x3, Calculator, Grid, Target, Clock, GitMerge, Coins, Grid2x2, Type, Package, Layers2, Brain } from 'lucide-react';
import { BoyerMooreSimulator } from '@features/boyer-moore';
import KMPSimulator from './components/KMPSimulator';
import AutomatonSimulator from './components/AutomatonSimulator';
import { TopologicalSortSimulator } from '@features/topological-sort';
import TarjanSimulator from './components/TarjanSimulator';
import GraphApplicationsSimulator from './components/GraphApplicationsSimulator';
import UndirectedGraphSimulator from './components/UndirectedGraphSimulator';
import DijkstraSimulator from './components/DijkstraSimulator';
import { DijkstraSimulator as DijkstraSimulatorRefactored } from '@features/dijkstra';
import MSTSimulator from './components/MSTSimulator';
import GraphEditorDemo from './components/GraphEditorDemo';
import BinarySearchSimulator from './components/BinarySearchSimulator';
import { BinarySearchSimulator as BinarySearchSimulatorRefactored } from '@features/binary-search';
import TrominoSimulator from './components/TrominoSimulator';
import KaratsubaSimulator from './components/KaratsubaSimulator';
import StrassenSimulator from './components/StrassenSimulator';
import SelectSimulator from './components/SelectSimulator';
import ActivitySelectionSimulator from './components/ActivitySelectionSimulator';
import HuffmanSimulator from './components/HuffmanSimulator';
import CoinChangeSimulator from './components/CoinChangeSimulator';
import MatrixChainSimulator from './components/MatrixChainSimulator';
import LCSSimulator from './components/LCSSimulator';
import KnapsackSimulator from './components/KnapsackSimulator';
import FibonacciMemoSimulator from './components/FibonacciMemoSimulator';
import CoinChangeMemoSimulator from './components/CoinChangeMemoSimulator';

const App = () => {
  const [selectedSimulator, setSelectedSimulator] = useState<string | null>(null);
  // Temporary: Side-by-side comparison mode (moved to top level to avoid hook rule violation)
  const [showComparison] = useState(true);

  const simulators = [
    // Módulo 1: Divisão-e-Conquista
    {
      id: 'binary-search',
      title: 'Busca Binária',
      description: 'Algoritmo de divisão-e-conquista que reduz o espaço de busca pela metade a cada passo.',
      icon: Binary,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      features: ['Divisão recursiva', 'Cálculo de pivô', 'Visualização da pilha de chamadas']
    },
    {
      id: 'tromino',
      title: 'Preenchimento com Treminós',
      description: 'Divide um tabuleiro 2^n × 2^n em quadrantes e preenche recursivamente com treminós.',
      icon: Grid3x3,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      features: ['Divisão em quadrantes', 'Treminó central', 'Resolução recursiva']
    },
    {
      id: 'karatsuba',
      title: 'Multiplicação de Karatsuba',
      description: 'Multiplica inteiros grandes usando apenas 3 multiplicações recursivas em vez de 4.',
      icon: Calculator,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      features: ['3 multiplicações recursivas', 'Divisão de números', 'Complexidade O(n^1.585)']
    },
    {
      id: 'strassen',
      title: 'Multiplicação de Strassen',
      description: 'Multiplica matrizes usando 7 multiplicações recursivas em vez de 8.',
      icon: Grid,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      features: ['7 multiplicações (P-V)', 'Divisão de matrizes', 'Combinação final']
    },
    {
      id: 'select',
      title: 'Seleção do k-ésimo Elemento',
      description: 'Encontra o k-ésimo menor elemento em tempo linear usando mediana das medianas.',
      icon: Target,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-100',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      features: ['Grupos de 5 elementos', 'Mediana das medianas', 'Particionamento eficiente']
    },
    // Módulo 2: Método Guloso
    {
      id: 'activity-selection',
      title: 'Seleção de Atividades',
      description: 'Método guloso que sempre escolhe a atividade que termina mais cedo para maximizar o conjunto.',
      icon: Clock,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      features: ['Ordenação por término', 'Escolha gulosa', 'Visualização de timeline']
    },
    {
      id: 'huffman',
      title: 'Huffman / Intercalação Ótima',
      description: 'Constrói árvore binária de custo mínimo combinando sempre os dois menores elementos.',
      icon: GitMerge,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      features: ['Min-Heap', 'Construção de árvore', 'Compressão de dados']
    },
    // Módulo 3: Programação Dinâmica
    {
      id: 'coin-change',
      title: 'Moedas de Troco (PD)',
      description: 'Programação Dinâmica bottom-up para encontrar o mínimo de moedas necessárias.',
      icon: Coins,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-100',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      features: ['Tabelas quant e ultima', 'Preenchimento célula a célula', 'Reconstrução da solução']
    },
    {
      id: 'matrix-chain',
      title: 'Encadeamento de Matrizes',
      description: 'Encontra a ordem ótima para multiplicar n matrizes minimizando operações.',
      icon: Grid2x2,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-100',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      features: ['Matrizes N e T', 'Preenchimento por diagonais', 'Subestrutura ótima']
    },
    {
      id: 'lcs',
      title: 'Maior Subsequência Comum (LCS)',
      description: 'Encontra a maior subsequência comum entre duas strings usando PD.',
      icon: Type,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'from-cyan-50 to-blue-100',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700',
      features: ['Matrizes c e trace', 'Traceback com setas', 'Aplicações em diff']
    },
    {
      id: 'knapsack',
      title: 'Mochila 0/1',
      description: 'Maximiza lucro sem exceder capacidade. Cada item pode ser pego ou não (0/1).',
      icon: Package,
      color: 'from-teal-500 to-green-600',
      bgColor: 'from-teal-50 to-green-100',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      features: ['Matriz B de lucros', 'Preenchimento por linhas', 'Traceback de itens']
    },
    // Módulo 4: Memoization
    {
      id: 'fibonacci-memo',
      title: 'Fibonacci com Memoization',
      description: 'Abordagem top-down com cache para evitar recálculos recursivos.',
      icon: Layers2,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      features: ['Array m[] de cache', 'Visualização de chamadas', 'Comparação O(2ⁿ) vs O(n)']
    },
    {
      id: 'coin-change-memo',
      title: 'Troco com Memoization',
      description: 'Versão top-down recursiva do problema de troco. Compare com a versão PD!',
      icon: Brain,
      color: 'from-pink-500 to-purple-600',
      bgColor: 'from-pink-50 to-purple-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
      features: ['Array memo[] top-down', 'Recursão com cache', 'Comparação com PD']
    },
    // Busca de Padrões
    {
      id: 'kmp',
      title: 'Algoritmo KMP',
      description: 'Simulador passo a passo do algoritmo Knuth-Morris-Pratt para busca de padrões em strings.',
      icon: Search,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      features: ['Pré-processamento da função de falha', 'Busca otimizada', 'Visualização detalhada']
    },
    {
      id: 'automaton',
      title: 'Autômato Finito',
      description: 'Construtor interativo de autômatos finitos para reconhecimento de padrões.',
      icon: Bot,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      features: ['Construção passo a passo', 'Tabela de estados', 'Teste de sufixos']
    },
    {
      id: 'boyer-moore',
      title: 'Algoritmo Boyer-Moore',
      description: 'Simulador do algoritmo Boyer-Moore com heurísticas de caracteres ruins.',
      icon: Cpu,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      features: ['Heurística de caracteres ruins', 'Comparações eficientes', 'Tabela de última ocorrência']
    },
    // Grafos
    {
      id: 'topological-sort',
      title: 'Ordenação Topológica',
      description: 'Compare os algoritmos de ordenação topológica usando Fila (Kahn) e Pilha (DFS).',
      icon: GitBranch,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-700',
      features: ['Algoritmo de Kahn (Fila)', 'DFS com Pilha', 'Detecção de ciclos']
    },
    {
      id: 'tarjan',
      title: 'Tarjan - Classificação de Arcos',
      description: 'Visualize a Busca em Profundidade (DFS) e a classificação de arcos em Árvore, Retorno, Avanço e Cruzamento.',
      icon: Network,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      features: ['DFS passo a passo', 'Classificação de arcos', 'Pilha de chamadas recursivas']
    },
    {
      id: 'graph-applications',
      title: 'Aplicações de Grafos',
      description: 'Explore algoritmos avançados: Teste de Aciclidade, Ordenação Topológica e Componentes Fortemente Conexas.',
      icon: Layers,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      features: ['Teste de aciclidade (DAG)', 'Ordenação topológica', 'Componentes fortemente conexas']
    },
    {
      id: 'undirected-graphs',
      title: 'Grafos Não-Orientados',
      description: 'Algoritmos para grafos não-direcionados: Bipartição, Vértices de Corte e Pontes.',
      icon: Share2,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-700',
      features: ['Teste de bipartição', 'Vértices de corte', 'Arestas de corte (pontes)']
    },
    {
      id: 'dijkstra',
      title: 'Algoritmo de Dijkstra',
      description: 'Encontra os caminhos mínimos de uma origem para todos os vértices em grafos com pesos não-negativos.',
      icon: Navigation,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'from-cyan-50 to-cyan-100',
      borderColor: 'border-cyan-200',
      textColor: 'text-cyan-700',
      features: ['Caminhos mínimos', 'Fila de prioridade', 'Relaxamento de arestas']
    },
    {
      id: 'mst',
      title: 'Árvore Geradora Mínima (MST)',
      description: 'Encontra a árvore geradora de custo mínimo com Kruskal (Union-Find) e Prim (Crescimento).',
      icon: TreePine,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      features: ['Algoritmo de Kruskal', 'Algoritmo de Prim', 'Union-Find']
    },
    {
      id: 'graph-editor',
      title: 'Editor de Grafos',
      description: 'Crie e edite grafos de forma visual ou por texto. Ferramenta completa para montar seus próprios exemplos.',
      icon: Edit3,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'from-violet-50 to-violet-100',
      borderColor: 'border-violet-200',
      textColor: 'text-violet-700',
      features: ['Editor visual interativo', 'Editor de texto', 'Exemplos pré-definidos']
    }
  ];

  const handleSimulatorSelect = (simulatorId: string) => {
    setSelectedSimulator(simulatorId);
  };

  const handleBackToHome = () => {
    setSelectedSimulator(null);
  };

  // Renderizar simulador específico
  // Módulo 1: Divisão-e-Conquista
  if (selectedSimulator === 'binary-search') {
    if (showComparison) {
      return (
        <div>
          <div className="mb-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              ← Voltar ao Início
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h2 className="text-2xl font-bold mb-4">Original</h2>
              <BinarySearchSimulator />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Refatorado</h2>
              <BinarySearchSimulatorRefactored />
            </div>
          </div>
        </div>
      );
    }
    
    // Use refactored version
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <BinarySearchSimulatorRefactored />
      </div>
    );
  }

  if (selectedSimulator === 'tromino') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <TrominoSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'karatsuba') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <KaratsubaSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'strassen') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <StrassenSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'select') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <SelectSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'activity-selection') {
    return <ActivitySelectionSimulator onBack={handleBackToHome} />;
  }

  if (selectedSimulator === 'huffman') {
    return <HuffmanSimulator onBack={handleBackToHome} />;
  }

  // Módulo 3: Programação Dinâmica
  if (selectedSimulator === 'coin-change') {
    return <CoinChangeSimulator onBack={handleBackToHome} />;
  }

  if (selectedSimulator === 'matrix-chain') {
    return <MatrixChainSimulator onBack={handleBackToHome} />;
  }

  if (selectedSimulator === 'lcs') {
    return <LCSSimulator onBack={handleBackToHome} />;
  }

  if (selectedSimulator === 'knapsack') {
    return <KnapsackSimulator onBack={handleBackToHome} />;
  }

  // Módulo 4: Memoization
  if (selectedSimulator === 'fibonacci-memo') {
    return <FibonacciMemoSimulator onBack={handleBackToHome} />;
  }

  if (selectedSimulator === 'coin-change-memo') {
    return <CoinChangeMemoSimulator onBack={handleBackToHome} />;
  }

  if (selectedSimulator === 'graph-applications') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <GraphApplicationsSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'tarjan') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <TarjanSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'topological-sort') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <TopologicalSortSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'undirected-graphs') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <UndirectedGraphSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'dijkstra') {
    if (showComparison) {
      return (
        <div>
          <div className="mb-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              ← Voltar ao Início
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h2 className="text-2xl font-bold mb-4">Original</h2>
              <DijkstraSimulator />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Refatorado</h2>
              <DijkstraSimulatorRefactored />
            </div>
          </div>
        </div>
      );
    }
    
    // Use refactored version
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <DijkstraSimulatorRefactored />
      </div>
    );
  }

  if (selectedSimulator === 'mst') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <MSTSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'boyer-moore') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <BoyerMooreSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'kmp') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <KMPSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'automaton') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <AutomatonSimulator />
      </div>
    );
  }

  if (selectedSimulator === 'graph-editor') {
    return (
      <div>
        <div className="mb-4">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            ← Voltar ao Início
          </button>
        </div>
        <GraphEditorDemo />
      </div>
    );
  }

  // Página inicial
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simuladores de Algoritmos - CT-234
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Explore algoritmos através de simuladores interativos: Paradigmas de Programação,
            Busca de Padrões, Grafos e muito mais. Desenvolvido para auxiliar no aprendizado
            de Estrutura de Dados e Algoritmos do ITA.
          </p>
        </div>

        {/* Grid de Simuladores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {simulators.map((simulator) => {
            const IconComponent = simulator.icon;
            return (
              <div
                key={simulator.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${simulator.borderColor} overflow-hidden cursor-pointer transform hover:-translate-y-1`}
                onClick={() => handleSimulatorSelect(simulator.id)}
              >
                {/* Header do Card */}
                <div className={`bg-gradient-to-r ${simulator.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <IconComponent size={32} className="opacity-90" />
                    <ArrowRight size={24} className="opacity-70" />
                  </div>
                  <h3 className="text-xl font-bold mt-4">{simulator.title}</h3>
                </div>

                {/* Conteúdo do Card */}
                <div className={`p-6 bg-gradient-to-b ${simulator.bgColor}`}>
                  <p className={`text-sm ${simulator.textColor} mb-4 leading-relaxed`}>
                    {simulator.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {simulator.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${simulator.color}`}></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Botão */}
                  <button
                    className={`mt-6 w-full bg-gradient-to-r ${simulator.color} text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                  >
                    Acessar Simulador
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Sobre os Simuladores
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Estes simuladores foram desenvolvidos para auxiliar no estudo de algoritmos fundamentais,
              incluindo Paradigmas de Programação (Divisão-e-Conquista, Guloso, Programação Dinâmica),
              Busca de Padrões (KMP, Boyer-Moore, Autômatos) e Algoritmos em Grafos.
              Cada simulador oferece uma visualização passo a passo, facilitando a compreensão dos conceitos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;