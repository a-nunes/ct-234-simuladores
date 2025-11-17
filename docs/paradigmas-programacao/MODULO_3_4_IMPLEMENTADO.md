# Módulos 3 e 4 - Programação Dinâmica e Memoization

**Data de Implementação**: 2025-01-XX  
**Status**: ✅ **COMPLETO** - Todos os simuladores implementados e integrados  
**Build**: ✅ Compilado com sucesso (apenas warnings ESLint, sem erros TypeScript)

## 📋 Resumo Executivo

Implementação completa dos **Módulos 3 (Programação Dinâmica)** e **Módulo 4 (Memoization)** do planejamento de Paradigmas de Programação, totalizando **6 novos simuladores educacionais interativos**:

- **Módulo 3 - PD (4 simuladores)**: Coin Change, Matrix Chain Multiplication, LCS, Knapsack 0/1
- **Módulo 4 - Memoization (2 simuladores)**: Fibonacci Memo, Coin Change Memo

Todos os simuladores seguem os **pseudocódigos exatos** de `pseudo-codigos.md` e as **especificações de UI** de `design-ui.md`.

---

## 🎯 Objetivos Cumpridos

### Módulo 3: Programação Dinâmica (Bottom-Up)
✅ **Troco com Moedas (Coin Change)**
- Tabelas `quant[]` e `ultima[]` para rastreamento
- Visualização célula a célula do preenchimento
- Reconstrução da solução usando `ultima[]`
- Explicação da propriedade de subestrutura ótima

✅ **Encadeamento de Matrizes (Matrix Chain Multiplication)**
- Matrizes `N` (custo) e `T` (ponto de divisão)
- Preenchimento por diagonais (bandas)
- Três loops aninhados (banda, linha, ponto de corte)
- Cálculo de operações escalares mínimas

✅ **Maior Subsequência Comum (LCS)**
- Tabelas `c` (comprimento) e `trace` (direção)
- Traceback com setas (↖ Diagonal, ↑ Cima, ← Esquerda)
- Reconstrução da LCS seguindo as direções
- Aplicação em ferramentas de diff

✅ **Mochila 0/1 (Knapsack)**
- Matriz `B` de lucros
- Preenchimento por linhas (item a item)
- Traceback para identificar itens selecionados
- Constraint de capacidade máxima

### Módulo 4: Memoization (Top-Down)
✅ **Fibonacci com Memoization**
- Array de cache `m[]` inicializado com -1
- Visualização de chamadas recursivas
- Diferença dramática: O(2ⁿ) → O(n)
- Rastreamento de cache hits vs cache misses

✅ **Troco com Memoization**
- Versão top-down recursiva do problema de troco
- Array `memo[]` para cache de subproblemas
- Comparação direta com versão PD (bottom-up)
- Mesma complexidade, estratégias opostas

---

## 📁 Arquivos Criados

### Componentes Principais

#### 1. **CoinChangeSimulator.tsx** (~650 linhas)
```
Localização: src/components/CoinChangeSimulator.tsx
Abordagem: Programação Dinâmica bottom-up
Estruturas de Dados:
  - quant[i]: número mínimo de moedas para valor i
  - ultima[i]: última moeda usada para valor i
Visualização:
  - Tabela quant com células coloridas (atual/passado/futuro)
  - Tabela ultima com moedas selecionadas
  - Reconstrução da solução passo a passo
Configuração:
  - Moedas disponíveis (editável)
  - Valor de troco desejado (slider)
Cores: Amarelo-Laranja (from-yellow-500 to-orange-600)
Ícone: Coins
```

**Pseudocódigo Implementado**:
```
TROCO(n, D)
  quant[0] ← 0
  Para i de 1 até n:
    min ← ∞
    Para cada d em D:
      Se i ≥ d e quant[i-d] + 1 < min:
        min ← quant[i-d] + 1
        ultima[i] ← d
    quant[i] ← min
  Retornar quant[n]
```

#### 2. **MatrixChainSimulator.tsx** (~580 linhas)
```
Localização: src/components/MatrixChainSimulator.tsx
Abordagem: PD com preenchimento por diagonais
Estruturas de Dados:
  - N[i][j]: custo mínimo para multiplicar Mi...Mj
  - T[i][j]: ponto de divisão k ótimo
  - d[]: vetor de dimensões (d[0]xd[1], d[1]xd[2], ...)
Visualização:
  - Matrizes N e T em formato tabular
  - Preenchimento por bandas diagonais
  - Células coloridas (diagonal/calculando/calculada)
Configuração:
  - Vetor de dimensões (editável)
  - Número de matrizes (derivado)
Cores: Índigo-Roxo (from-indigo-500 to-purple-600)
Ícone: Grid2x2
```

**Pseudocódigo Implementado**:
```
MATRIX-CHAIN-ORDER(d)
  n ← tamanho(d) - 1
  Para i de 1 até n:
    N[i][i] ← 0
  Para b de 1 até n-1:           // banda diagonal
    Para i de 1 até n-b:
      j ← i + b
      N[i][j] ← ∞
      Para k de i até j-1:       // ponto de divisão
        q ← N[i][k] + N[k+1][j] + d[i-1]*d[k]*d[j]
        Se q < N[i][j]:
          N[i][j] ← q
          T[i][j] ← k
```

#### 3. **LCSSimulator.tsx** (~620 linhas)
```
Localização: src/components/LCSSimulator.tsx
Abordagem: PD com tabela de direções para traceback
Estruturas de Dados:
  - c[i][j]: comprimento da LCS de X[1..i] e Y[1..j]
  - trace[i][j]: direção (DIAGONAL, CIMA, ESQUERDA)
Visualização:
  - Tabela c com comprimentos
  - Tabela trace com setas (↖, ↑, ←)
  - Traceback destacado com fundo verde
  - Resultado LCS destacado
Configuração:
  - String X (editável)
  - String Y (editável)
Cores: Ciano-Azul (from-cyan-500 to-blue-600)
Ícone: Type
```

**Pseudocódigo Implementado**:
```
LCS-LENGTH(X, Y)
  m ← tamanho(X)
  n ← tamanho(Y)
  Para i de 0 até m: c[i][0] ← 0
  Para j de 0 até n: c[0][j] ← 0
  Para i de 1 até m:
    Para j de 1 até n:
      Se X[i] = Y[j]:
        c[i][j] ← c[i-1][j-1] + 1
        trace[i][j] ← DIAGONAL
      Senão se c[i-1][j] ≥ c[i][j-1]:
        c[i][j] ← c[i-1][j]
        trace[i][j] ← CIMA
      Senão:
        c[i][j] ← c[i][j-1]
        trace[i][j] ← ESQUERDA
```

#### 4. **KnapsackSimulator.tsx** (~420 linhas)
```
Localização: src/components/KnapsackSimulator.tsx
Abordagem: PD 0/1 knapsack com traceback
Estruturas de Dados:
  - B[k][i]: lucro máximo usando itens 1..k com capacidade i
  - items[]: array de objetos {name, weight, profit}
Visualização:
  - Matriz B completa
  - Células destacadas durante preenchimento
  - Traceback destacado em verde
  - Lista de itens selecionados
Configuração:
  - Capacidade da mochila (slider)
  - Itens pré-configurados (peso, lucro)
Cores: Teal-Verde (from-teal-500 to-green-600)
Ícone: Package
```

**Pseudocódigo Implementado**:
```
KNAPSACK-01(items, capacity)
  n ← tamanho(items)
  Para k de 0 até n:
    B[k][0] ← 0
  Para i de 0 até capacity:
    B[0][i] ← 0
  Para k de 1 até n:
    Para i de 1 até capacity:
      Se items[k].weight ≤ i:
        B[k][i] ← max(B[k-1][i], B[k-1][i-weight] + profit)
      Senão:
        B[k][i] ← B[k-1][i]
```

#### 5. **FibonacciMemoSimulator.tsx** (~360 linhas)
```
Localização: src/components/FibonacciMemoSimulator.tsx
Abordagem: Memoization top-down
Estruturas de Dados:
  - m[i]: cache do resultado de Fib(i), -1 = não calculado
  - callStack: pilha de chamadas recursivas
Visualização:
  - Array m[] com estados (-1, calculado, cache hit)
  - Pilha de chamadas em tempo real
  - Contador de chamadas vs acesso ao cache
  - Comparação O(2ⁿ) vs O(n)
Configuração:
  - Valor de n (slider 1-20)
Cores: Laranja-Vermelho (from-orange-500 to-red-600)
Ícone: Layers2
```

**Pseudocódigo Implementado**:
```
FIB-MEMO(n)
  m[0] ← 0, m[1] ← 1
  Para i de 2 até MAX: m[i] ← -1
  Retornar FIB-REC(n)

FIB-REC(n)
  Se m[n] ≠ -1:           // cache hit
    Retornar m[n]
  m[n] ← FIB-REC(n-1) + FIB-REC(n-2)
  Retornar m[n]
```

#### 6. **CoinChangeMemoSimulator.tsx** (~380 linhas)
```
Localização: src/components/CoinChangeMemoSimulator.tsx
Abordagem: Memoization top-down (comparar com PD)
Estruturas de Dados:
  - memo[i]: número mínimo de moedas para valor i, -1 = não calculado
Visualização:
  - Array memo[] com estados
  - Árvore de recursão conceitual
  - Comparação com CoinChangeSimulator (PD)
Configuração:
  - Moedas disponíveis (editável)
  - Valor de troco desejado (slider)
Cores: Rosa-Roxo (from-pink-500 to-purple-600)
Ícone: Brain
```

**Pseudocódigo Implementado**:
```
TROCO-MEMO(n, D)
  memo[0] ← 0
  Para i de 1 até n: memo[i] ← -1
  Retornar TROCO-REC(n, D)

TROCO-REC(n, D)
  Se memo[n] ≠ -1:
    Retornar memo[n]
  min ← ∞
  Para cada d em D:
    Se n ≥ d:
      min ← mín(min, TROCO-REC(n-d, D) + 1)
  memo[n] ← min
  Retornar min
```

### Modificações em Arquivos Existentes

#### **App.tsx**
```diff
Linhas adicionadas: ~60 linhas
Seções modificadas:
  1. Imports de ícones (linha 3):
+    Coins, Grid2x2, Type, Package, Layers2, Brain
  
  2. Imports de componentes (linhas 19-24):
+    import CoinChangeSimulator from './components/CoinChangeSimulator';
+    import MatrixChainSimulator from './components/MatrixChainSimulator';
+    import LCSSimulator from './components/LCSSimulator';
+    import KnapsackSimulator from './components/KnapsackSimulator';
+    import FibonacciMemoSimulator from './components/FibonacciMemoSimulator';
+    import CoinChangeMemoSimulator from './components/CoinChangeMemoSimulator';
  
  3. Array de simuladores (6 novos objetos após huffman):
+    { id: 'coin-change', title: 'Moedas de Troco (PD)', ... }
+    { id: 'matrix-chain', title: 'Encadeamento de Matrizes', ... }
+    { id: 'lcs', title: 'Maior Subsequência Comum (LCS)', ... }
+    { id: 'knapsack', title: 'Mochila 0/1', ... }
+    { id: 'fibonacci-memo', title: 'Fibonacci com Memoization', ... }
+    { id: 'coin-change-memo', title: 'Troco com Memoization', ... }
  
  4. Renderizadores condicionais (após huffman):
+    if (selectedSimulator === 'coin-change') {
+      return <CoinChangeSimulator onBack={handleBackToHome} />;
+    }
     // ... outros 5 renderizadores
```

---

## 🎨 Design e UX

### Padrão de Interface Consistente

Todos os simuladores seguem o mesmo padrão visual e de interação:

1. **Header com botão "Voltar ao Início"**
   - Ícone `←` alinhado à esquerda
   - Background cinza escuro (`bg-gray-600`)
   - Hover com transição suave

2. **Título e Descrição**
   - Gradiente de fundo específico por simulador
   - Ícone representativo (Lucide React)
   - Descrição educacional curta

3. **Painel de Configuração**
   - Background branco com borda
   - Inputs interativos (sliders, text inputs)
   - Botão "Gerar Nova Simulação" destacado

4. **Área de Visualização**
   - Tabelas/Arrays com células coloridas
   - Estados visuais distintos:
     - **Verde**: Célula atual sendo calculada
     - **Azul**: Célula já calculada (passado)
     - **Cinza**: Célula ainda não visitada (futuro)
     - **Amarelo**: Traceback/reconstrução
   - Explicações educacionais a cada passo

5. **Controles de Navegação**
   - Botões "← Anterior" e "Próximo →"
   - Disabled quando no início/fim
   - Contador de passos (ex: "Passo 5 de 42")

6. **Resultado Final**
   - Destaque em card verde com ícone de sucesso
   - Valor otimizado e/ou solução reconstruída
   - Métricas relevantes (nº de operações, itens, etc.)

### Cores e Ícones (Lucide React)

| Simulador | Gradiente | Ícone | Cor Primária |
|-----------|-----------|-------|--------------|
| Coin Change | yellow-500 → orange-600 | Coins | Amarelo |
| Matrix Chain | indigo-500 → purple-600 | Grid2x2 | Índigo |
| LCS | cyan-500 → blue-600 | Type | Ciano |
| Knapsack | teal-500 → green-600 | Package | Teal |
| Fibonacci Memo | orange-500 → red-600 | Layers2 | Laranja |
| Coin Change Memo | pink-500 → purple-600 | Brain | Rosa |

---

## 🧪 Testes Realizados

### 1. Compilação TypeScript
```bash
✅ npm run build
Resultado: "Compiled with warnings" (apenas ESLint, sem erros TypeScript)
Warnings: Variáveis não utilizadas (não afetam funcionalidade)
```

### 2. Integração no Menu Principal
```
✅ Cards aparecem corretamente no menu
✅ Gradientes e ícones renderizados
✅ Clique nos cards seleciona o simulador correto
✅ Botão "Voltar ao Início" retorna ao menu
```

### 3. Funcionalidades dos Simuladores

#### CoinChangeSimulator
- ✅ Configuração de moedas ([1, 2, 5, 10, 25] default)
- ✅ Slider de valor de troco (1-100)
- ✅ Preenchimento correto de quant[] e ultima[]
- ✅ Reconstrução da solução usando ultima[]
- ✅ Caso impossível (valor não alcançável)

#### MatrixChainSimulator
- ✅ Vetor de dimensões editável
- ✅ Preenchimento por diagonais (bandas 1, 2, ..., n-1)
- ✅ Três loops aninhados funcionando
- ✅ Cálculo correto de operações escalares
- ✅ Matrizes N e T sincronizadas

#### LCSSimulator
- ✅ Strings X e Y editáveis
- ✅ Tabela c calculada corretamente
- ✅ Traceback com setas (↖, ↑, ←)
- ✅ Reconstrução da LCS
- ✅ Casos especiais (strings iguais, disjuntas)

#### KnapsackSimulator
- ✅ Capacidade ajustável (slider)
- ✅ Matriz B preenchida por linhas
- ✅ Traceback identifica itens corretos
- ✅ Lucro máximo calculado
- ✅ Restrição de peso respeitada

#### FibonacciMemoSimulator
- ✅ Array m[] inicializado com -1
- ✅ Cache hits vs cache misses
- ✅ Pilha de chamadas visualizada
- ✅ Comparação O(2ⁿ) vs O(n) explicada
- ✅ Valores de n até 20

#### CoinChangeMemoSimulator
- ✅ Array memo[] top-down
- ✅ Recursão com cache funcional
- ✅ Comparação com versão PD no texto
- ✅ Mesma solução que CoinChangeSimulator
- ✅ Estratégia oposta (top-down vs bottom-up)

---

## 📊 Métricas de Implementação

### Linhas de Código
```
CoinChangeSimulator.tsx       ~650 linhas
MatrixChainSimulator.tsx      ~580 linhas
LCSSimulator.tsx              ~620 linhas
KnapsackSimulator.tsx         ~420 linhas
FibonacciMemoSimulator.tsx    ~360 linhas
CoinChangeMemoSimulator.tsx   ~380 linhas
App.tsx (modificações)         ~60 linhas
───────────────────────────────────────
TOTAL                        ~3.070 linhas
```

### Complexidades Implementadas

| Simulador | Complexidade Tempo | Complexidade Espaço | Observações |
|-----------|-------------------|---------------------|-------------|
| Coin Change | O(n × \|D\|) | O(n) | n = valor, D = moedas |
| Matrix Chain | O(n³) | O(n²) | n = número de matrizes |
| LCS | O(m × n) | O(m × n) | m, n = tamanhos das strings |
| Knapsack | O(n × C) | O(n × C) | n = itens, C = capacidade |
| Fibonacci Memo | O(n) | O(n) | vs O(2ⁿ) sem memo |
| Coin Change Memo | O(n × \|D\|) | O(n) | Mesma complexidade da versão PD |

### Componentes por Módulo

**Status Geral dos Paradigmas de Programação**:
```
Módulo 1 - Divisão-e-Conquista:  5/5 ✅ (merge-sort, quick-sort, etc.)
Módulo 2 - Método Guloso:        2/2 ✅ (activity-selection, huffman)
Módulo 3 - Programação Dinâmica: 4/4 ✅ (coin-change, matrix-chain, lcs, knapsack)
Módulo 4 - Memoization:          2/2 ✅ (fibonacci-memo, coin-change-memo)
───────────────────────────────────────────
TOTAL:                          13/13 ✅ COMPLETO
```

---

## 🔧 Detalhes Técnicos

### Dependências Utilizadas
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^4.9.5",
  "lucide-react": "^0.454.0",
  "tailwindcss": "^3.4.17"
}
```

### Estrutura de Estados (useState)

Todos os simuladores seguem padrão similar:

```typescript
interface Step {
  description: string;
  // Dados específicos do algoritmo (quant, N, c, B, m, memo, etc.)
  // Índices de destaque (currentI, currentJ, currentK, etc.)
}

const [steps, setSteps] = useState<Step[]>([]);
const [currentStep, setCurrentStep] = useState(0);
const [config, setConfig] = useState({ /* parâmetros */ });
```

### Geração de Passos

Cada simulador implementa uma função `generateSteps()` que:
1. Executa o algoritmo completo
2. Captura o estado após cada operação significativa
3. Armazena em array de `Step` com descrições
4. Permite navegação linear (Anterior/Próximo)

**Exemplo** (CoinChangeSimulator):
```typescript
const generateSteps = useCallback(() => {
  const newSteps: Step[] = [];
  const quant = new Array(value + 1).fill(Infinity);
  const ultima = new Array(value + 1).fill(-1);
  quant[0] = 0;
  
  newSteps.push({ description: "Inicialização...", quant: [...quant], ... });
  
  for (let i = 1; i <= value; i++) {
    for (const coin of coins) {
      if (i >= coin && quant[i - coin] + 1 < quant[i]) {
        quant[i] = quant[i - coin] + 1;
        ultima[i] = coin;
        newSteps.push({ description: `Atualizando quant[${i}]...`, ... });
      }
    }
  }
  
  // Reconstrução da solução
  // ...
  
  setSteps(newSteps);
}, [value, coins]);
```

### Renderização de Tabelas

Padrão usado em todos os simuladores:

```typescript
const renderCell = (value: number, state: 'current' | 'past' | 'future') => {
  const bgColor = 
    state === 'current' ? 'bg-green-100 border-green-500' :
    state === 'past' ? 'bg-blue-50 border-blue-300' :
    'bg-gray-50 border-gray-200';
    
  return (
    <div className={`p-2 border-2 ${bgColor} rounded text-center`}>
      {value === Infinity ? '∞' : value}
    </div>
  );
};
```

---

## 📚 Conceitos Educacionais Implementados

### Programação Dinâmica (Módulo 3)

**Princípios fundamentais aplicados**:

1. **Subestrutura Ótima**
   - Coin Change: `quant[i] = min(quant[i-d] + 1)` para cada moeda d
   - Matrix Chain: `N[i][j] = min(N[i][k] + N[k+1][j] + custo)` para cada k
   - LCS: `c[i][j] = c[i-1][j-1] + 1` se X[i] = Y[j]
   - Knapsack: `B[k][i] = max(sem item, com item)`

2. **Subproblemas Sobrepostos**
   - Todas as soluções evitam recálculos usando tabelas
   - Exemplo: LCS calcula c[i][j] apenas uma vez, reutiliza para c[i+1][j+1]

3. **Bottom-Up vs Memoization**
   - Módulo 3: Preenchimento iterativo (bottom-up)
   - Módulo 4: Recursão com cache (top-down)
   - Mesma complexidade, estratégias opostas

4. **Traceback/Reconstrução**
   - Coin Change: usa `ultima[]` para reconstruir moedas
   - Matrix Chain: usa `T[][]` para encontrar divisões
   - LCS: usa `trace[][]` para reconstruir subsequência
   - Knapsack: navega de `B[n][C]` até `B[0][0]`

### Memoization (Módulo 4)

**Conceitos destacados**:

1. **Cache Top-Down**
   - Inicialização com sentinela (-1 = não calculado)
   - Check antes de recursão: `if (m[n] !== -1) return m[n]`
   - Armazenamento após cálculo: `m[n] = resultado`

2. **Comparação de Complexidade**
   - Fibonacci sem memo: O(2ⁿ) - explosão exponencial
   - Fibonacci com memo: O(n) - linear
   - Visualização de cache hits reduz chamadas dramaticamente

3. **Estratégia vs PD**
   - Mesmo problema (Coin Change), duas abordagens
   - PD: preenche toda tabela sequencialmente
   - Memo: calcula apenas subproblemas necessários
   - Trade-off: PD é mais direto, Memo pode ser mais eficiente em espaço

---

## 🚀 Como Usar os Simuladores

### Acesso via Menu Principal

1. Inicie o projeto:
   ```bash
   npm start
   ```

2. No menu principal, role até **"Paradigmas de Programação"**

3. Localize os novos simuladores:
   - **Moedas de Troco (PD)** - Ícone de moedas, gradiente amarelo-laranja
   - **Encadeamento de Matrizes** - Ícone de grade, gradiente índigo-roxo
   - **Maior Subsequência Comum (LCS)** - Ícone de texto, gradiente ciano-azul
   - **Mochila 0/1** - Ícone de pacote, gradiente teal-verde
   - **Fibonacci com Memoization** - Ícone de camadas, gradiente laranja-vermelho
   - **Troco com Memoization** - Ícone de cérebro, gradiente rosa-roxo

4. Clique no card desejado

### Fluxo de Interação Típico

**Exemplo: Coin Change Simulator**

1. **Configuração**:
   - Edite o campo "Moedas disponíveis" (ex: `1,5,10,25`)
   - Ajuste o slider "Valor de troco" (ex: 63)

2. **Geração**:
   - Clique em "Gerar Nova Simulação"
   - Sistema calcula todos os passos automaticamente

3. **Navegação**:
   - Use "← Anterior" para voltar passos
   - Use "Próximo →" para avançar
   - Observe as células mudarem de cor:
     - Verde = calculando agora
     - Azul = já calculado
     - Cinza = ainda não visitado

4. **Aprendizado**:
   - Leia a descrição de cada passo
   - Observe como `quant[i]` é preenchido
   - Veja como `ultima[i]` registra a moeda usada
   - Acompanhe a reconstrução da solução no final

5. **Experimentação**:
   - Teste com moedas diferentes (`1,3,4`)
   - Teste com valores impossíveis (ex: moedas `[2,5]`, valor 3)
   - Compare com a versão Memoization

### Casos de Teste Sugeridos

**Coin Change**:
- Moedas `[1,5,10,25]`, Valor `63` → Deve usar 6 moedas (25+25+10+1+1+1)
- Moedas `[1,3,4]`, Valor `6` → Deve usar 2 moedas (3+3)
- Moedas `[2,5]`, Valor `3` → Impossível (quant[3] = ∞)

**Matrix Chain**:
- Dimensões `[10,20,30,40,30]` → Ótimo: ((AB)(CD))
- Dimensões `[40,20,30,10,30]` → Ótimo diferente

**LCS**:
- X = `"ABCDGH"`, Y = `"AEDFHR"` → LCS = `"ADH"` (comprimento 3)
- X = `"AGGTAB"`, Y = `"GXTXAYB"` → LCS = `"GTAB"` (comprimento 4)

**Knapsack**:
- Capacidade 10, Itens [(Laptop,5,60), (Câmera,3,40), (Fone,2,30)] → Seleciona Laptop+Câmera+Fone (lucro 130)

**Fibonacci Memo**:
- n = 10 → Resultado 55, ~10 chamadas (vs ~177 sem memo)
- n = 20 → Resultado 6765, ~20 chamadas (vs ~21891 sem memo)

**Coin Change Memo**:
- Mesmos casos do Coin Change PD, comparar estratégias

---

## 📖 Recursos Educacionais

### Explicações em Cada Simulador

Todos os simuladores incluem:

1. **Descrição do Problema** (card de introdução)
2. **Explicação do Algoritmo** (no painel de informações)
3. **Descrições Passo a Passo** (durante a simulação)
4. **Complexidade de Tempo e Espaço** (no final)
5. **Aplicações Práticas** (exemplos reais)

### Links para Pseudocódigos

- Coin Change: `docs/paradigmas-programacao/pseudo-codigos.md` (seção 3.1)
- Matrix Chain: `docs/paradigmas-programacao/pseudo-codigos.md` (seção 3.2)
- LCS: `docs/paradigmas-programacao/pseudo-codigos.md` (seção 3.3)
- Knapsack: `docs/paradigmas-programacao/pseudo-codigos.md` (seção 3.4)
- Fibonacci Memo: `docs/paradigmas-programacao/pseudo-codigos.md` (seção 4.1)
- Coin Change Memo: `docs/paradigmas-programacao/pseudo-codigos.md` (seção 4.2)

### Comparações Entre Abordagens

Os simuladores permitem comparações diretas:

- **Coin Change PD vs Coin Change Memo**: Mesmo problema, estratégias opostas
- **Fibonacci Memo vs Fibonacci Ingênuo**: Impacto dramático da memoization
- **PD Bottom-Up vs Memoization Top-Down**: Filosofias complementares

---

## 🐛 Problemas Conhecidos e Limitações

### Warnings ESLint
```
Variáveis declaradas mas não utilizadas em alguns simuladores
Impacto: NENHUM (não afeta funcionalidade)
Solução: Adicionar `// eslint-disable-next-line` ou remover variáveis
Prioridade: BAIXA (cosmético)
```

### Limitações de Performance
- Matrix Chain: Com n > 15 matrizes, geração de passos pode demorar
- Fibonacci Memo: Valores n > 40 podem ser lentos (recursão profunda)
- LCS: Strings muito longas (>50 caracteres) podem deixar UI lento

### Casos Especiais Não Cobertos
- Coin Change: Não trata moedas duplicadas (assume set)
- Knapsack: Não implementa versão unbounded (mochila ilimitada)
- LCS: Não mostra todas as LCS quando há empates

---

## 🔮 Próximos Passos Sugeridos

### Melhorias de UX
1. **Animações de Transição**: Suavizar mudanças de passo com CSS transitions
2. **Auto-Play**: Botão "▶ Reproduzir" para avançar automaticamente
3. **Velocidade Ajustável**: Slider para controlar tempo entre passos
4. **Zoom em Tabelas**: Para matrizes grandes (LCS, Matrix Chain)

### Funcionalidades Extras
1. **Export de Passos**: Salvar simulação como PDF ou JSON
2. **Comparador Side-by-Side**: PD vs Memo no mesmo viewport
3. **Modo Quiz**: Perguntas sobre o próximo passo antes de revelar
4. **Histórico de Simulações**: Salvar configurações testadas

### Otimizações de Código
1. **Memoization dos Passos**: useCallback para generateSteps já implementado
2. **Virtual Scrolling**: Para tabelas muito grandes
3. **Web Workers**: Gerar passos em background thread
4. **Lazy Loading**: Carregar simuladores sob demanda

### Novos Simuladores (Expansão Futura)
1. **Edit Distance (Levenshtein)**: Outra aplicação de PD
2. **Rod Cutting**: Variante do problema de corte
3. **Subset Sum**: Decisão de subconjunto com soma alvo
4. **Bellman-Ford Memo**: Menor caminho com pesos negativos

---

## ✅ Checklist de Verificação

- [x] Todos os 6 simuladores criados
- [x] Pseudocódigos de `pseudo-codigos.md` implementados fielmente
- [x] Especificações de `design-ui.md` seguidas
- [x] Imports adicionados ao `App.tsx`
- [x] Cards no menu principal criados
- [x] Renderizadores condicionais adicionados
- [x] Build compilado com sucesso
- [x] Testes manuais de cada simulador
- [x] Navegação entre passos funcionando
- [x] Botão "Voltar ao Início" funcional
- [x] Cores e ícones apropriados
- [x] Explicações educacionais incluídas
- [x] Documentação completa criada

---

## 📝 Notas de Desenvolvimento

### Decisões de Design

1. **Por que separar PD e Memoization em módulos?**
   - Pedagogicamente, são estratégias opostas (bottom-up vs top-down)
   - Permite comparação direta (ex: Coin Change nas duas versões)
   - Alinha com organização comum em livros de algoritmos

2. **Por que incluir `ultima[]` em Coin Change?**
   - Muitos tutoriais só calculam `quant[]` (quantidade mínima)
   - `ultima[]` permite **reconstrução da solução** (quais moedas usar)
   - Demonstra conceito de traceback, essencial em PD

3. **Por que Matrix Chain usa bandas diagonais?**
   - Segue algoritmo clássico de Cormen (CLRS)
   - Visualiza dependências: `N[i][j]` depende de `N[i][k]` e `N[k+1][j]`
   - Preenchimento por diagonais é didaticamente superior

4. **Por que LCS tem tabela `trace`?**
   - Permite reconstruir a subsequência, não só o comprimento
   - Visualização com setas (↖↑←) é intuitiva
   - Demonstra como PD pode armazenar decisões, não só valores

### Lições Aprendidas

1. **Geração de Passos**: Capturar estado após CADA modificação é essencial para visualização fluida
2. **Clonagem de Arrays**: Usar `[...array]` e `JSON.parse(JSON.stringify())` para evitar mutações
3. **Cores Consistentes**: Padronizar verde=atual, azul=passado, cinza=futuro melhora UX
4. **Descrições Verbais**: Explicar "o quê" e "por quê" em cada passo aumenta valor educacional

### Agradecimentos

Implementação baseada em:
- **Cormen et al. (CLRS)**: Introduction to Algorithms (pseudocódigos)
- **design-ui.md**: Especificações de interface e componentes
- **pseudo-codigos.md**: Algoritmos exatos implementados

---

## 📞 Contato e Suporte

Para dúvidas ou melhorias, consulte:
- **Documentação Principal**: `README.md`
- **Pseudocódigos**: `docs/paradigmas-programacao/pseudo-codigos.md`
- **Design de UI**: `docs/paradigmas-programacao/design-ui.md`
- **Módulos de Grafos**: `docs/grafos/` (para comparação de estrutura)

---

**Documento criado em**: 2025-01-XX  
**Versão**: 1.0  
**Status**: ✅ Módulos 3 e 4 COMPLETOS - Paradigmas de Programação 100% implementado
