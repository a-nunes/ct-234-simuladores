import React, { useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface TreeNode {
  id: number;
  value: number;
  label: string;
  left?: TreeNode;
  right?: TreeNode;
  x?: number;
  y?: number;
}

interface Step {
  type: 'init' | 'build_heap' | 'extract_min_1' | 'extract_min_2' | 'create_parent' | 'insert_parent' | 'complete';
  description: string;
  heap: TreeNode[];
  extractedNode1?: TreeNode;
  extractedNode2?: TreeNode;
  newParentNode?: TreeNode;
  builtTree: TreeNode[];
}

const HuffmanSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Estados para os nós iniciais
  const [initialNodes, setInitialNodes] = useState<{ label: string; value: number }[]>([
    { label: 'A', value: 5 },
    { label: 'B', value: 9 },
    { label: 'C', value: 12 },
    { label: 'D', value: 13 },
    { label: 'E', value: 16 },
    { label: 'F', value: 45 }
  ]);

  // Estados do simulador
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Função auxiliar para criar Min-Heap
  const buildMinHeap = (nodes: TreeNode[]): TreeNode[] => {
    const heap = [...nodes];
    // Ordenar para simular min-heap (em produção seria heapify)
    heap.sort((a, b) => a.value - b.value);
    return heap;
  };

  // Função auxiliar para extrair mínimo
  const extractMin = (heap: TreeNode[]): { min: TreeNode; newHeap: TreeNode[] } => {
    const newHeap = [...heap];
    const min = newHeap.shift()!;
    return { min, newHeap };
  };

  // Função auxiliar para inserir na heap
  const insertHeap = (heap: TreeNode[], node: TreeNode): TreeNode[] => {
    const newHeap = [...heap, node];
    newHeap.sort((a, b) => a.value - b.value);
    return newHeap;
  };

  // Função para calcular posições da árvore
  const calculateTreePositions = (node: TreeNode, x: number, y: number, horizontalSpacing: number): void => {
    node.x = x;
    node.y = y;

    if (node.left) {
      calculateTreePositions(node.left, x - horizontalSpacing, y + 80, horizontalSpacing / 2);
    }
    if (node.right) {
      calculateTreePositions(node.right, x + horizontalSpacing, y + 80, horizontalSpacing / 2);
    }
  };

  // Função para gerar os passos do algoritmo
  const generateSteps = useCallback((): Step[] => {
    const stepList: Step[] = [];
    let nodeIdCounter = 0;

    // Criar nós iniciais (folhas)
    const leaves: TreeNode[] = initialNodes.map((node) => ({
      id: nodeIdCounter++,
      value: node.value,
      label: node.label
    }));

    // Passo 1: Inicialização
    stepList.push({
      type: 'init',
      description: `Iniciando algoritmo de Huffman/Intercalação Ótima. Temos ${leaves.length} nós iniciais (folhas).`,
      heap: [],
      builtTree: []
    });

    // Passo 2: Construir Min-Heap
    let heap = buildMinHeap(leaves);
    stepList.push({
      type: 'build_heap',
      description: `Min-Heap construída com todos os nós. A heap sempre mantém o menor elemento no topo.`,
      heap: [...heap],
      builtTree: []
    });

    const builtTree: TreeNode[] = [];
    const k = leaves.length;

    // Passo 3-N: Loop principal
    for (let i = 1; i <= k - 1; i++) {
      // Extrair primeiro mínimo
      const { min: node1, newHeap: heap1 } = extractMin(heap);
      stepList.push({
        type: 'extract_min_1',
        description: `Extraindo primeiro nó de menor valor da heap: "${node1.label}" (valor=${node1.value})`,
        heap: [...heap1],
        extractedNode1: node1,
        builtTree: [...builtTree]
      });

      // Extrair segundo mínimo
      const { min: node2, newHeap: heap2 } = extractMin(heap1);
      stepList.push({
        type: 'extract_min_2',
        description: `Extraindo segundo nó de menor valor da heap: "${node2.label}" (valor=${node2.value})`,
        heap: [...heap2],
        extractedNode1: node1,
        extractedNode2: node2,
        builtTree: [...builtTree]
      });

      // Criar novo nó pai
      const parentNode: TreeNode = {
        id: nodeIdCounter++,
        value: node1.value + node2.value,
        label: `${node1.label}+${node2.label}`,
        left: node1,
        right: node2
      };

      builtTree.push(parentNode);

      stepList.push({
        type: 'create_parent',
        description: `Criando novo nó pai com valor ${parentNode.value} (${node1.value} + ${node2.value}). Este nó combina "${node1.label}" e "${node2.label}".`,
        heap: [...heap2],
        extractedNode1: node1,
        extractedNode2: node2,
        newParentNode: parentNode,
        builtTree: [...builtTree]
      });

      // Inserir pai de volta na heap
      heap = insertHeap(heap2, parentNode);
      stepList.push({
        type: 'insert_parent',
        description: `Inserindo novo nó pai (valor=${parentNode.value}) de volta na Min-Heap.`,
        heap: [...heap],
        builtTree: [...builtTree]
      });
    }

    // Passo final: Extrair raiz
    const { min: root } = extractMin(heap);
    stepList.push({
      type: 'complete',
      description: `Algoritmo concluído! Último nó extraído é a RAIZ da árvore (valor=${root.value}). A árvore de Huffman/Intercalação está completa.`,
      heap: [],
      builtTree: [root]
    });

    return stepList;
  }, [initialNodes]);

  // Iniciar simulação
  const handleStart = () => {
    const generatedSteps = generateSteps();
    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsSimulating(true);
  };

  // Resetar simulação
  const handleReset = () => {
    setSteps([]);
    setCurrentStepIndex(-1);
    setIsSimulating(false);
  };

  // Navegação
  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // Atualizar nó
  const handleNodeChange = (index: number, field: 'label' | 'value', value: string) => {
    const newNodes = [...initialNodes];
    if (field === 'label') {
      newNodes[index] = { ...newNodes[index], label: value };
    } else {
      newNodes[index] = { ...newNodes[index], value: parseInt(value) || 0 };
    }
    setInitialNodes(newNodes);
  };

  // Adicionar nó
  const handleAddNode = () => {
    const newLabel = String.fromCharCode(65 + initialNodes.length); // A, B, C...
    setInitialNodes([...initialNodes, { label: newLabel, value: 10 }]);
  };

  // Remover nó
  const handleRemoveNode = (index: number) => {
    if (initialNodes.length > 2) {
      setInitialNodes(initialNodes.filter((_, i) => i !== index));
    }
  };

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  // Renderizar nó da heap
  const renderHeapNode = (node: TreeNode, index: number) => {
    const isExtracted1 = currentStep?.extractedNode1?.id === node.id;
    const isExtracted2 = currentStep?.extractedNode2?.id === node.id;
    const isNew = currentStep?.newParentNode?.id === node.id;

    return (
      <div
        key={node.id}
        className={`inline-flex flex-col items-center justify-center w-20 h-20 rounded-lg border-2 font-bold text-white transition-all duration-300 ${
          isExtracted1 || isExtracted2
            ? 'bg-yellow-500 border-yellow-600 scale-110'
            : isNew
            ? 'bg-green-500 border-green-600 scale-110'
            : index === 0
            ? 'bg-blue-600 border-blue-700'
            : 'bg-blue-500 border-blue-600'
        }`}
      >
        <div className="text-sm">{node.label}</div>
        <div className="text-lg">{node.value}</div>
      </div>
    );
  };

  // Renderizar árvore recursivamente
  const renderTree = (node: TreeNode | undefined) => {
    if (!node) return null;

    // Calcular posições
    calculateTreePositions(node, 400, 50, 150);

    const renderNode = (n: TreeNode): React.ReactElement => {
      return (
        <g key={n.id}>
          {/* Linhas para filhos */}
          {n.left && (
            <line
              x1={n.x}
              y1={n.y! + 30}
              x2={n.left.x}
              y2={n.left.y!}
              stroke="#4B5563"
              strokeWidth="2"
            />
          )}
          {n.right && (
            <line
              x1={n.x}
              y1={n.y! + 30}
              x2={n.right.x}
              y2={n.right.y!}
              stroke="#4B5563"
              strokeWidth="2"
            />
          )}

          {/* Nó */}
          <circle cx={n.x} cy={n.y} r="30" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
          <text
            x={n.x}
            y={n.y! - 5}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            {n.label}
          </text>
          <text x={n.x} y={n.y! + 10} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
            {n.value}
          </text>

          {/* Renderizar filhos recursivamente */}
          {n.left && renderNode(n.left)}
          {n.right && renderNode(n.right)}
        </g>
      );
    };

    return (
      <svg width="800" height="500" className="mx-auto">
        {renderNode(node)}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Codificação de Huffman / Intercalação Ótima</h1>
              <p className="text-gray-600">Método Guloso - Sempre combine os dois menores</p>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={handleStart}
                disabled={isSimulating}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Iniciar</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Resetar</span>
              </button>
            </div>

            {isSimulating && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium">
                  Passo {currentStepIndex + 1} de {steps.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === steps.length - 1}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Entrada de Nós */}
        {!isSimulating && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Configurar Nós Iniciais (Folhas)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Para <strong>Huffman</strong>: Use letras como rótulos e frequências como valores.<br />
              Para <strong>Intercalação</strong>: Use nomes de arquivos como rótulos e tamanhos como valores.
            </p>
            <div className="space-y-2">
              {initialNodes.map((node, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm w-16">Rótulo:</label>
                    <input
                      type="text"
                      value={node.label}
                      onChange={(e) => handleNodeChange(index, 'label', e.target.value)}
                      className="w-20 px-2 py-1 border rounded"
                      maxLength={5}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm">Valor/Freq:</label>
                    <input
                      type="number"
                      value={node.value}
                      onChange={(e) => handleNodeChange(index, 'value', e.target.value)}
                      className="w-24 px-2 py-1 border rounded"
                      min="1"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveNode(index)}
                    disabled={initialNodes.length <= 2}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 text-sm"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddNode}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Adicionar Nó
            </button>
          </div>
        )}

        {/* Visualização */}
        {isSimulating && currentStep && (
          <div className="space-y-6">
            {/* Descrição do passo */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Passo Atual</h3>
              <p className="text-gray-700">{currentStep.description}</p>
            </div>

            {/* Min-Heap */}
            {currentStep.heap.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Min-Heap (Fila de Prioridade) - {currentStep.heap.length} nó(s)
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {currentStep.heap.map((node, index) => renderHeapNode(node, index))}
                </div>
                {currentStep.heap.length > 0 && (
                  <p className="text-sm text-gray-600 mt-4 text-center">
                    ↑ O nó mais à esquerda (azul escuro) é sempre o de MENOR valor
                  </p>
                )}
              </div>
            )}

            {/* Nós Extraídos */}
            {(currentStep.extractedNode1 || currentStep.extractedNode2) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Nós Extraídos da Heap</h3>
                <div className="flex gap-6 justify-center items-center">
                  {currentStep.extractedNode1 && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Primeiro (esquerda)</p>
                      {renderHeapNode(currentStep.extractedNode1, -1)}
                    </div>
                  )}
                  {currentStep.extractedNode2 && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Segundo (direita)</p>
                      {renderHeapNode(currentStep.extractedNode2, -1)}
                    </div>
                  )}
                  {currentStep.newParentNode && (
                    <>
                      <div className="text-4xl text-gray-400">→</div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Novo Pai</p>
                        {renderHeapNode(currentStep.newParentNode, -1)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Árvore em Construção */}
            {currentStep.builtTree.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {currentStep.type === 'complete'
                    ? 'Árvore de Huffman Completa'
                    : 'Árvore em Construção'}
                </h3>
                <div className="overflow-x-auto">
                  {renderTree(currentStep.builtTree[currentStep.builtTree.length - 1])}
                </div>
                {currentStep.type === 'complete' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Custo Total:</strong> {currentStep.builtTree[0].value}
                      <br />
                      <strong>Para Huffman:</strong> Este é o número total de bits necessários para codificar a mensagem.
                      <br />
                      <strong>Para Intercalação:</strong> Este é o número total de operações para intercalar todos os arquivos.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Painel de Estado */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Estado do Algoritmo</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nós na Heap</p>
                  <p className="text-2xl font-bold text-blue-600">{currentStep.heap.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nós Criados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {currentStep.builtTree.length}
                  </p>
                </div>
                {currentStep.extractedNode1 && (
                  <div>
                    <p className="text-sm text-gray-600">1º Extraído</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {currentStep.extractedNode1.value}
                    </p>
                  </div>
                )}
                {currentStep.extractedNode2 && (
                  <div>
                    <p className="text-sm text-gray-600">2º Extraído</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {currentStep.extractedNode2.value}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Explicação do Algoritmo */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Sobre o Algoritmo</h3>
          <div className="text-gray-700 space-y-2">
            <p>
              <strong>Método Guloso:</strong> O algoritmo sempre combina os dois nós de menor valor,
              construindo uma árvore binária de baixo para cima.
            </p>
            <p>
              <strong>Huffman:</strong> Usado para compressão de dados. Letras mais frequentes recebem
              códigos mais curtos, minimizando o tamanho total.
            </p>
            <p>
              <strong>Intercalação Ótima:</strong> Usado para combinar arquivos ordenados. Minimiza o
              número total de comparações necessárias.
            </p>
            <p>
              <strong>Complexidade:</strong> O(n log n), onde n é o número de nós iniciais (devido às
              operações na heap).
            </p>
            <p>
              <strong>Por que funciona?</strong> Ao sempre combinar os menores, garantimos que os
              elementos de menor peso/frequência fiquem nas folhas mais profundas da árvore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HuffmanSimulator;
