import React, { useState, useCallback } from 'react';
import { ArrowLeft, Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

interface Step {
  type: 'init' | 'process_cell' | 'test_coin' | 'update_cell' | 'complete';
  description: string;
  cents: number;
  coinIndex?: number;
  currentCoin?: number;
  quantProv?: number;
  ultProv?: number;
  quant: number[];
  ultima: number[];
}

const CoinChangeSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  // Estados para configuração
  const [coins, setCoins] = useState<number[]>([1, 5, 10, 25]);
  const [targetAmount, setTargetAmount] = useState<number>(30);

  // Estados do simulador
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Função para gerar os passos do algoritmo
  const generateSteps = useCallback((): Step[] => {
    const stepList: Step[] = [];
    const quant: number[] = new Array(targetAmount + 1).fill(0);
    const ultima: number[] = new Array(targetAmount + 1).fill(0);

    // Passo 0: Inicialização
    quant[0] = 0;
    ultima[0] = 0;

    stepList.push({
      type: 'init',
      description: `Inicializando tabelas. quant[0] = 0 e ultima[0] = 0 (troco de 0 centavos requer 0 moedas).`,
      cents: 0,
      quant: [...quant],
      ultima: [...ultima]
    });

    // Loop principal: para cada valor de cents de 1 até troco
    for (let cents = 1; cents <= targetAmount; cents++) {
      stepList.push({
        type: 'process_cell',
        description: `Processando cents = ${cents}. Buscando a melhor solução...`,
        cents: cents,
        quant: [...quant],
        ultima: [...ultima]
      });

      // Solução provisória (todas moedas de 1 centavo)
      let quantProv = cents;
      let ultProv = 1;

      stepList.push({
        type: 'test_coin',
        description: `Solução provisória: usar ${cents} moedas de 1 centavo. quantProv = ${quantProv}, ultProv = 1`,
        cents: cents,
        quantProv: quantProv,
        ultProv: ultProv,
        quant: [...quant],
        ultima: [...ultima]
      });

      // Testar cada moeda
      for (let j = 0; j < coins.length; j++) {
        const coin = coins[j];

        stepList.push({
          type: 'test_coin',
          description: `Testando moeda[${j}] = ${coin} centavos...`,
          cents: cents,
          coinIndex: j,
          currentCoin: coin,
          quantProv: quantProv,
          ultProv: ultProv,
          quant: [...quant],
          ultima: [...ultima]
        });

        if (coin <= cents) {
          const newQuant = quant[cents - coin] + 1;

          stepList.push({
            type: 'test_coin',
            description: `Moeda ${coin} cabe! Calculando: quant[${cents} - ${coin}] + 1 = quant[${cents - coin}] + 1 = ${quant[cents - coin]} + 1 = ${newQuant}`,
            cents: cents,
            coinIndex: j,
            currentCoin: coin,
            quantProv: quantProv,
            ultProv: ultProv,
            quant: [...quant],
            ultima: [...ultima]
          });

          if (newQuant < quantProv) {
            quantProv = newQuant;
            ultProv = coin;

            stepList.push({
              type: 'test_coin',
              description: `✓ ${newQuant} < ${quantProv} anterior! Atualizando: quantProv = ${quantProv}, ultProv = ${coin}`,
              cents: cents,
              coinIndex: j,
              currentCoin: coin,
              quantProv: quantProv,
              ultProv: ultProv,
              quant: [...quant],
              ultima: [...ultima]
            });
          } else {
            stepList.push({
              type: 'test_coin',
              description: `✗ ${newQuant} >= ${quantProv}. Não é melhor. Mantendo quantProv = ${quantProv}`,
              cents: cents,
              coinIndex: j,
              currentCoin: coin,
              quantProv: quantProv,
              ultProv: ultProv,
              quant: [...quant],
              ultima: [...ultima]
            });
          }
        } else {
          stepList.push({
            type: 'test_coin',
            description: `✗ Moeda ${coin} > ${cents}. Não cabe! Ignorando...`,
            cents: cents,
            coinIndex: j,
            currentCoin: coin,
            quantProv: quantProv,
            ultProv: ultProv,
            quant: [...quant],
            ultima: [...ultima]
          });
        }
      }

      // Atualizar tabelas
      quant[cents] = quantProv;
      ultima[cents] = ultProv;

      stepList.push({
        type: 'update_cell',
        description: `Preenchendo quant[${cents}] = ${quantProv} e ultima[${cents}] = ${ultProv}. Melhor solução para ${cents} centavos usa ${quantProv} moedas.`,
        cents: cents,
        quantProv: quantProv,
        ultProv: ultProv,
        quant: [...quant],
        ultima: [...ultima]
      });
    }

    // Passo final
    stepList.push({
      type: 'complete',
      description: `Algoritmo concluído! Para ${targetAmount} centavos: ${quant[targetAmount]} moedas necessárias. Use ultima[] para reconstruir a solução.`,
      cents: targetAmount,
      quant: [...quant],
      ultima: [...ultima]
    });

    return stepList;
  }, [coins, targetAmount]);

  // Reconstruir solução
  const reconstructSolution = (quant: number[], ultima: number[]): { coin: number; count: number }[] => {
    const result: { coin: number; count: number }[] = [];
    let remaining = targetAmount;

    while (remaining > 0) {
      const coin = ultima[remaining];
      const existing = result.find(r => r.coin === coin);
      if (existing) {
        existing.count++;
      } else {
        result.push({ coin, count: 1 });
      }
      remaining -= coin;
    }

    return result.sort((a, b) => b.coin - a.coin);
  };

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

  // Atualizar moedas
  const handleCoinChange = (index: number, value: string) => {
    const newCoins = [...coins];
    newCoins[index] = parseInt(value) || 1;
    setCoins(newCoins);
  };

  const handleAddCoin = () => {
    setCoins([...coins, 1]);
  };

  const handleRemoveCoin = (index: number) => {
    if (coins.length > 1) {
      setCoins(coins.filter((_, i) => i !== index));
    }
  };

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  // Renderizar célula da tabela
  const renderCell = (index: number, value: number, isQuant: boolean) => {
    if (!currentStep) return null;

    const isCurrent = currentStep.cents === index;
    const isPast = index < currentStep.cents;

    return (
      <div
        className={`flex flex-col items-center justify-center p-2 border-2 transition-all duration-300 ${
          isCurrent
            ? 'bg-yellow-100 border-yellow-500 scale-110'
            : isPast
            ? 'bg-green-50 border-green-300'
            : 'bg-gray-50 border-gray-300'
        }`}
      >
        <div className="text-xs text-gray-600 mb-1">{index}</div>
        <div className={`text-lg font-bold ${isCurrent ? 'text-yellow-700' : isPast ? 'text-green-700' : 'text-gray-400'}`}>
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-8">
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
              <h1 className="text-3xl font-bold text-gray-800">Moedas de Troco - Programação Dinâmica</h1>
              <p className="text-gray-600">Construção bottom-up da tabela de soluções ótimas</p>
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
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
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

        {/* Configuração */}
        {!isSimulating && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Configuração</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Valor do Troco (centavos)</label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  className="w-32 px-3 py-2 border rounded-lg"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Moedas Disponíveis</label>
                <div className="space-y-2">
                  {coins.map((coin, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-24">Moeda[{index}]:</span>
                      <input
                        type="number"
                        value={coin}
                        onChange={(e) => handleCoinChange(index, e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                        min="1"
                      />
                      <span>centavos</span>
                      <button
                        onClick={() => handleRemoveCoin(index)}
                        disabled={coins.length <= 1}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300 text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddCoin}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Adicionar Moeda
                </button>
              </div>
            </div>
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

            {/* Tabela quant[] */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Tabela quant[] - Quantidade Mínima de Moedas</h3>
              <div className="overflow-x-auto">
                <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(targetAmount + 1, 20)}, minmax(60px, 1fr))` }}>
                  {currentStep.quant.slice(0, Math.min(targetAmount + 1, 20)).map((value, index) => (
                    <div key={index}>
                      {renderCell(index, value, true)}
                    </div>
                  ))}
                </div>
                {targetAmount + 1 > 20 && (
                  <p className="text-sm text-gray-500 mt-2">
                    (Mostrando primeiros 20 valores. Total: {targetAmount + 1})
                  </p>
                )}
              </div>
            </div>

            {/* Tabela ultima[] */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Tabela ultima[] - Última Moeda Usada</h3>
              <div className="overflow-x-auto">
                <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(targetAmount + 1, 20)}, minmax(60px, 1fr))` }}>
                  {currentStep.ultima.slice(0, Math.min(targetAmount + 1, 20)).map((value, index) => (
                    <div key={index}>
                      {renderCell(index, value, false)}
                    </div>
                  ))}
                </div>
                {targetAmount + 1 > 20 && (
                  <p className="text-sm text-gray-500 mt-2">
                    (Mostrando primeiros 20 valores. Total: {targetAmount + 1})
                  </p>
                )}
              </div>
            </div>

            {/* Painel de Estado */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Estado Atual</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Cents Atual</p>
                  <p className="text-2xl font-bold text-yellow-600">{currentStep.cents}</p>
                </div>
                {currentStep.currentCoin !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">Moeda Testada</p>
                    <p className="text-2xl font-bold text-blue-600">{currentStep.currentCoin}</p>
                  </div>
                )}
                {currentStep.quantProv !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">quantProv</p>
                    <p className="text-2xl font-bold text-green-600">{currentStep.quantProv}</p>
                  </div>
                )}
                {currentStep.ultProv !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600">ultProv</p>
                    <p className="text-2xl font-bold text-purple-600">{currentStep.ultProv}</p>
                  </div>
                )}
              </div>

              {/* Moedas disponíveis */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Moedas Disponíveis</p>
                <div className="flex gap-2">
                  {coins.map((coin, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 rounded-lg font-bold ${
                        currentStep.coinIndex === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {coin}¢
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Solução Final */}
            {currentStep.type === 'complete' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Solução Ótima</h3>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    Para <strong>{targetAmount} centavos</strong>, use <strong>{currentStep.quant[targetAmount]} moedas</strong>:
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    {reconstructSolution(currentStep.quant, currentStep.ultima).map((item, index) => (
                      <div key={index} className="flex items-center space-x-2 text-green-800">
                        <span className="font-bold">{item.count}x</span>
                        <span>moeda de {item.coin} centavos</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Explicação do Algoritmo */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Sobre o Algoritmo</h3>
          <div className="text-gray-700 space-y-2">
            <p>
              <strong>Programação Dinâmica (Bottom-Up):</strong> Constrói a solução de baixo para cima,
              preenchendo uma tabela onde cada célula depende de soluções anteriores já calculadas.
            </p>
            <p>
              <strong>Subestrutura Ótima:</strong> A solução ótima para n centavos contém a solução ótima
              para (n - moeda) centavos.
            </p>
            <p>
              <strong>Tabela quant[i]:</strong> Quantidade mínima de moedas para fazer i centavos.
            </p>
            <p>
              <strong>Tabela ultima[i]:</strong> Última moeda usada na solução ótima para i centavos
              (permite reconstruir a solução).
            </p>
            <p>
              <strong>Complexidade:</strong> O(n × m), onde n = valor do troco e m = número de moedas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinChangeSimulator;
