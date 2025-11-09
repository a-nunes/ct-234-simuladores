// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ChevronRight, ChevronLeft, FastForward } from 'lucide-react';

const AutomatonSimulator = () => {
  const [pattern, setPattern] = useState('ababaca');
  const [alphabet, setAlphabet] = useState(['a', 'b', 'c']);
  const [customAlphabet, setCustomAlphabet] = useState('a,b,c');
  const [af, setAf] = useState([]);
  const [currentState, setCurrentState] = useState({ s: 0, x: 0 });
  const [k, setK] = useState(0);
  const [step, setStep] = useState('idle');
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('Clique em "Próximo Passo" para iniciar');
  const [detailedMode, setDetailedMode] = useState(true);
  const [testString, setTestString] = useState('');
  const [candidatePrefix, setCandidatePrefix] = useState('');
  const [isMatch, setIsMatch] = useState(null);

  const m = pattern.length;

  useEffect(() => {
    initializeAF();
  }, [pattern, alphabet]);

  const initializeAF = () => {
    const newAf = [];
    for (let s = 0; s <= m; s++) {
      newAf[s] = {};
      alphabet.forEach(char => {
        newAf[s][char] = null;
      });
    }
    setAf(newAf);
    setCurrentState({ s: 0, x: 0 });
    setStep('idle');
    setHistory([]);
    setMessage('Autômato inicializado. Clique em "Próximo Passo" para começar a construção.');
  };

  const getPrefix = (length) => {
    if (length < 0) return 'ε';
    return pattern.substring(0, length);
  };

  const isSuffix = (prefix, str) => {
    if (prefix === 'ε') return true;
    if (prefix.length > str.length) return false;
    return str.endsWith(prefix);
  };

  const nextStep = () => {
    const { s, x } = currentState;
    const char = alphabet[x];

    if (s > m) {
      setMessage('Construção do autômato completa!');
      setStep('complete');
      return;
    }

    setHistory([...history, { 
      af: JSON.parse(JSON.stringify(af)), 
      currentState, 
      k, 
      step, 
      message,
      testString,
      candidatePrefix,
      isMatch
    }]);

    if (step === 'idle' || step === 'assigned') {
      // Iniciar cálculo de nova célula
      const prefixSm1 = getPrefix(s);
      const testStr = prefixSm1 + char;
      setTestString(testStr);
      
      const initialK = Math.min(s + 1, m);
      setK(initialK);
      
      // Testar o primeiro k imediatamente
      const prefixK = getPrefix(initialK);
      setCandidatePrefix(prefixK);
      
      const match = isSuffix(prefixK, testStr);
      setIsMatch(match);
      
      if (match) {
        setMessage(`Calculando AF[${s}, '${char}']. String de teste: "${testStr}". k = ${initialK}: Match encontrado! P${initialK} = "${prefixK}" é sufixo de "${testStr}".`);
        setStep('matched');
      } else {
        setMessage(`Calculando AF[${s}, '${char}']. String de teste: "${testStr}". k = ${initialK}: P${initialK} = "${prefixK}" não é sufixo. Testando k = ${initialK - 1}...`);
        setStep('initialized');
      }
    } else if (step === 'initialized' || step === 'testing') {
      // Decrementar k e testar
      const newK = k - 1;
      setK(newK);
      
      const prefixKm1 = getPrefix(newK);
      setCandidatePrefix(prefixKm1);
      
      const match = isSuffix(prefixKm1, testString);
      setIsMatch(match);
      
      if (match) {
        setMessage(`k = ${newK}: Match encontrado! P${newK} = "${prefixKm1}" é sufixo de "${testString}". AF[${currentState.s}, '${alphabet[currentState.x]}'] = ${newK}`);
        setStep('matched');
      } else {
        setMessage(`k = ${newK}: P${newK} = "${prefixKm1}" não é sufixo de "${testString}". Testando k = ${newK - 1}...`);
        setStep('testing');
        
        if (!detailedMode) {
          // No modo rápido, continua até encontrar match
          let testK = newK - 1;
          while (testK >= 0) {
            const testPrefix = getPrefix(testK);
            if (isSuffix(testPrefix, testString)) {
              setK(testK);
              setCandidatePrefix(testPrefix);
              setIsMatch(true);
              setMessage(`Match encontrado! P${testK} = "${testPrefix}" é sufixo de "${testString}". AF[${currentState.s}, '${alphabet[currentState.x]}'] = ${testK}`);
              setStep('matched');
              break;
            }
            testK--;
          }
        }
      }
    } else if (step === 'matched') {
      // Atribuir valor à célula
      const newAf = JSON.parse(JSON.stringify(af));
      newAf[s][char] = k;
      setAf(newAf);
      setStep('assigned');
      
      // Avançar para próxima célula
      let nextX = x + 1;
      let nextS = s;
      
      if (nextX >= alphabet.length) {
        nextX = 0;
        nextS = s + 1;
        if (nextS <= m) {
          setMessage(`Estado ${s} completo. Avançando para estado ${nextS}...`);
        }
      }
      
      setCurrentState({ s: nextS, x: nextX });
      setTestString('');
      setCandidatePrefix('');
      setIsMatch(null);
    }
  };

  const prevStep = () => {
    if (history.length === 0) return;
    
    const lastState = history[history.length - 1];
    setAf(lastState.af);
    setCurrentState(lastState.currentState);
    setK(lastState.k);
    setStep(lastState.step);
    setMessage(lastState.message);
    setTestString(lastState.testString);
    setCandidatePrefix(lastState.candidatePrefix);
    setIsMatch(lastState.isMatch);
    setHistory(history.slice(0, -1));
  };

  const calculateAll = () => {
    const newAf = [];
    for (let s = 0; s <= m; s++) {
      newAf[s] = {};
      alphabet.forEach(x => {
        const prefixSm1 = getPrefix(s);
        const testStr = prefixSm1 + x;
        let testK = Math.min(s + 1, m);
        
        while (testK >= 0) {
          const prefixKm1 = getPrefix(testK);
          if (isSuffix(prefixKm1, testStr)) {
            newAf[s][x] = testK;
            break;
          }
          testK--;
        }
      });
    }
    setAf(newAf);
    setCurrentState({ s: m + 1, x: 0 });
    setStep('complete');
    setMessage('Tabela AF completa calculada!');
  };

  const updateAlphabet = () => {
    const newAlpha = customAlphabet.split(',').map(c => c.trim()).filter(c => c.length > 0);
    setAlphabet(newAlpha);
  };

  const highlightMatch = (str, suffix) => {
    if (!suffix || suffix === 'ε' || !str) return str;
    if (!str.endsWith(suffix)) return str;
    
    const idx = str.length - suffix.length;
    
    return (
      <>
        <span className="text-gray-600">{str.substring(0, idx)}</span>
        <span className="bg-green-200 font-bold">{suffix}</span>
      </>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-900">
        Simulador de Construção de Autômato Finito
      </h1>

      {/* Entrada de Dados */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Padrão (P):</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: ababaca"
            />
            <p className="text-xs text-gray-500 mt-1">Tamanho m = {m}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Alfabeto Σ (separado por vírgula):</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customAlphabet}
                onChange={(e) => setCustomAlphabet(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: a,b,c"
              />
              <button
                onClick={updateAlphabet}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <button
            onClick={initializeAF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            <RotateCcw size={18} /> Resetar
          </button>
          <button
            onClick={prevStep}
            disabled={history.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} /> Passo Anterior
          </button>
          <button
            onClick={nextStep}
            disabled={step === 'complete'}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} /> Próximo Passo
          </button>
          <button
            onClick={calculateAll}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <FastForward size={18} /> Calcular Tudo
          </button>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={detailedMode}
              onChange={(e) => setDetailedMode(e.target.checked)}
              className="rounded"
            />
            Modo Detalhado
          </label>
        </div>
      </div>

      {/* Visualização do Padrão */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Padrão P:</h2>
        <div className="flex gap-1 justify-center mb-2">
          {pattern.split('').map((char, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-12 border-2 border-indigo-400 rounded flex items-center justify-center bg-indigo-50 text-lg font-bold">
                {char}
              </div>
              <div className="text-xs text-gray-500 mt-1">{idx}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Teste de Sufixo */}
      {testString && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Teste de Sufixo:</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold">String de teste (P<sub>{currentState.s}</sub>{alphabet[currentState.x]}):</span>
              <div className="text-xl font-mono mt-1 p-3 bg-yellow-50 rounded border border-yellow-300">
                {isMatch !== null ? highlightMatch(testString, candidatePrefix) : testString}
              </div>
            </div>
            <div>
              <span className="font-semibold">Candidato P<sub>{k}</sub>:</span>
              <div className="text-xl font-mono mt-1 p-3 bg-blue-50 rounded border border-blue-300">
                {candidatePrefix || 'ε'}
              </div>
            </div>
            {isMatch !== null && (
              <div className={`p-3 rounded ${isMatch ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
                <span className="font-semibold">
                  {isMatch ? '✓ É sufixo!' : '✗ Não é sufixo'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabela AF */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Tabela de Estados (Matriz AF):</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-2 border-gray-400 bg-gray-200 p-2 font-semibold">Estado</th>
              {alphabet.map((char, idx) => (
                <th key={idx} className="border-2 border-gray-400 bg-gray-200 p-2 font-semibold">{char}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {af.map((row, s) => (
              <tr key={s}>
                <td className="border-2 border-gray-400 bg-gray-100 p-2 text-center font-semibold">{s}</td>
                {alphabet.map((char, x) => {
                  const isCurrentCell = currentState.s === s && currentState.x === x && step !== 'complete';
                  const value = row[char];
                  return (
                    <td
                      key={x}
                      className={`border-2 border-gray-400 p-2 text-center text-lg ${
                        isCurrentCell
                          ? 'bg-yellow-200 font-bold'
                          : value !== null
                          ? 'bg-green-100'
                          : 'bg-white'
                      }`}
                    >
                      {value !== null ? value : '?'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Painel de Estado */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Painel de Estado:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-blue-50 rounded">
            <div className="text-xs text-gray-600">Estado Atual (s)</div>
            <div className="text-2xl font-bold text-blue-700">{currentState.s}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded">
            <div className="text-xs text-gray-600">Caractere (x)</div>
            <div className="text-2xl font-bold text-purple-700">{alphabet[currentState.x] || '-'}</div>
          </div>
          <div className="p-3 bg-green-50 rounded">
            <div className="text-xs text-gray-600">Candidato k</div>
            <div className="text-2xl font-bold text-green-700">{k}</div>
          </div>
          <div className="p-3 bg-orange-50 rounded">
            <div className="text-xs text-gray-600">Prefixo P<sub>{currentState.s}</sub></div>
            <div className="text-xl font-mono font-bold text-orange-700">{getPrefix(currentState.s)}</div>
          </div>
        </div>
      </div>

      {/* Mensagem de Status */}
      <div className="bg-indigo-100 border-l-4 border-indigo-600 p-4 rounded">
        <p className="text-sm text-indigo-900">{message}</p>
      </div>
    </div>
  );
};

export default AutomatonSimulator;