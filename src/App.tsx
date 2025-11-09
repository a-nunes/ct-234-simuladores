import './index.css';
import React, { useState } from 'react';
import { Search, Bot, Cpu, ArrowRight } from 'lucide-react';
import BoyerMooreSimulator from './components/BoyerMooreSimulator';
import KMPSimulator from './components/KMPSimulator';
import AutomatonSimulator from './components/AutomatonSimulator';

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
    }
  ];

  const handleSimulatorSelect = (simulatorId: string) => {
    setSelectedSimulator(simulatorId);
  };

  const handleBackToHome = () => {
    setSelectedSimulator(null);
  };

  // Renderizar simulador específico
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

  // Página inicial
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simuladores de Algoritmos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore algoritmos de busca de padrões através de simuladores interativos
            desenvolvidos para auxiliar no aprendizado de Estrutura de Dados e Algoritmos.
          </p>
        </div>

        {/* Grid de Simuladores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
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