import './index.css';
import React, { useState } from 'react';
import { Search, Bot, Cpu, ArrowRight, GitBranch, Network, Layers, Share2, Navigation, TreePine, Edit3 } from 'lucide-react';
import BoyerMooreSimulator from './components/BoyerMooreSimulator';
import KMPSimulator from './components/KMPSimulator';
import AutomatonSimulator from './components/AutomatonSimulator';
import TopologicalSortSimulator from './components/TopologicalSortSimulator';
import TarjanSimulator from './components/TarjanSimulator';
import GraphApplicationsSimulator from './components/GraphApplicationsSimulator';
import UndirectedGraphSimulator from './components/UndirectedGraphSimulator';
import DijkstraSimulator from './components/DijkstraSimulator';
import MSTSimulator from './components/MSTSimulator';
import GraphEditorDemo from './components/GraphEditorDemo';
import { GraphProvider } from './contexts/GraphContext';

const App = () => {
  const [selectedSimulator, setSelectedSimulator] = useState<string | null>(null);

  const simulators = [
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
        <DijkstraSimulator />
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
            Simuladores de Algoritmos
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Explore algoritmos de busca de padrões através de simuladores interativos
            desenvolvidos para auxiliar no aprendizado de Estrutura de Dados e Algoritmos.
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
              Estes simuladores foram desenvolvidos para auxiliar no estudo de algoritmos
              de busca de padrões, incluindo KMP, Autômatos Finitos e Boyer-Moore.
              Cada simulador oferece uma visualização passo a passo dos algoritmos,
              facilitando a compreensão dos conceitos fundamentais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;