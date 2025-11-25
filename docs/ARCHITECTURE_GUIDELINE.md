# Architecture Guideline - React Frontend

**Versão:** 2.0  
**Status:** Implementado  
**Última Atualização:** Nov 2025  
**Propósito:** Guiar refatoração incremental e garantir coesão arquitetural

---

## 1. Visão Geral

Este projeto é um **React Frontend Puro** (sem API calls, sem backend direto). A arquitetura implementada combina **Feature-Based** com **Clean Architecture**, garantindo:

- ✅ Separação clara entre **UI, Lógica e Estado**
- ✅ Reusabilidade através de hooks focados
- ✅ Escalabilidade via organização por features
- ✅ Testabilidade através de lógica desacoplada
- ✅ Manutenibilidade via padrões consistentes

### 1.1 Arquitetura: Feature-Based + Clean Architecture

A arquitetura adotada organiza o código por **features** (co-localização), mantendo dentro de cada feature as **camadas do Clean Architecture**:

```
src/
  features/
    {feature-name}/
      domain/          # Regras de negócio (core)
      data/            # Implementações
      presentation/    # UI e estado React
      __tests__/       # Testes da feature
      index.ts         # Public API
```

**Benefícios:**
- Features isoladas e independentes
- Fácil localizar código relacionado
- Camadas internas garantem separação de responsabilidades
- Testes co-localizados com o código

---

## 2. Estrutura de uma Feature

### 2.1 Estrutura Completa

```
src/features/{feature-name}/
  domain/
    entities/          # Interfaces e tipos (Step, Config, etc.)
    usecases/          # Casos de uso (orquestram domain + data)
    errors/            # Erros customizados do domínio
  
  data/
    algorithms/        # Algoritmos puros (sem React, sem UI)
    stepGenerators/    # Gera steps de visualização
    validators/        # Validação de inputs
  
  presentation/
    components/        # Componentes React (UI pura)
    hooks/             # Hooks React (estado e lógica de apresentação)
  
  __tests__/
    unit/
      domain/          # Testes unitários do domain
      data/            # Testes unitários do data
      presentation/    # Testes unitários dos hooks
    integration/       # Testes de integração completos
  
  index.ts            # Exporta apenas o componente principal
```

### 2.2 Exemplo Real: Binary Search

```
src/features/binary-search/
  domain/
    entities/
      BinarySearchStep.ts          # Interface Step
      BinarySearchConfig.ts         # Interface Config
    usecases/
      GenerateSteps.usecase.ts     # Use case principal
    errors/
      InvalidArrayError.ts          # Erros customizados
  
  data/
    algorithms/
      BinarySearchAlgorithm.ts      # Algoritmo puro
    stepGenerators/
      BinarySearchStepGenerator.ts  # Gera steps
    validators/
      ArrayValidator.ts             # Valida inputs
  
  presentation/
    components/
      BinarySearchSimulator.tsx     # Componente principal
      ArrayVisualization.tsx         # Sub-componente
      ControlPanel.tsx              # Sub-componente
      StatePanel.tsx                 # Sub-componente
      CallStackPanel.tsx             # Sub-componente
    hooks/
      useStepNavigation.ts           # Hook: navegação
      useSimulatorConfig.ts          # Hook: configuração
      useStepGenerator.ts            # Hook: geração de steps
      useBinarySearchSimulator.ts    # Hook: orquestrador
  
  __tests__/
    unit/
      domain/usecases/GenerateSteps.usecase.test.ts
      data/algorithms/BinarySearchAlgorithm.test.ts
      data/stepGenerators/BinarySearchStepGenerator.test.ts
      data/validators/ArrayValidator.test.ts
      presentation/hooks/useStepNavigation.test.ts
      presentation/hooks/useSimulatorConfig.test.ts
    integration/
      BinarySearchSimulator.test.tsx
  
  index.ts                          # export { BinarySearchSimulator }
```

---

## 3. Camadas e Responsabilidades

### 3.1 Domain Layer (Regras de Negócio)

**Princípio:** Camada mais interna, não depende de nada.

**Responsabilidades:**
- Define **entidades** (interfaces, tipos)
- Define **casos de uso** (orquestram lógica de negócio)
- Define **erros** customizados do domínio

**Exemplos:**
- `BinarySearchStep.ts` - Interface do step
- `BinarySearchConfig.ts` - Interface de configuração
- `GenerateSteps.usecase.ts` - Use case que orquestra validação + geração
- `InvalidArrayError.ts` - Erro customizado

**Regras:**
- ❌ NUNCA importa de `data/` ou `presentation/` (exceto use cases que orquestram)
- ✅ Use cases podem importar funções de `data/` **apenas para orquestrar**, não para implementar lógica
- ✅ Pode importar apenas de `domain/` (outras entidades, erros)
- ✅ Use cases orquestram, não implementam

### 3.2 Data Layer (Implementações)

**Princípio:** Implementa algoritmos e lógica técnica.

**Responsabilidades:**
- Implementa **algoritmos puros** (sem React, sem UI)
- Implementa **geradores de steps** (converte execução em steps)
- Implementa **validadores** (valida inputs)

**Exemplos:**
- `BinarySearchAlgorithm.ts` - Função pura do algoritmo
- `BinarySearchStepGenerator.ts` - Gera array de steps
- `ArrayValidator.ts` - Valida e parseia inputs

**Regras:**
- ✅ Pode importar de `domain/` (entidades, erros)
- ❌ NUNCA importa de `presentation/`
- ✅ Funções puras, sem side effects
- ✅ Testáveis sem React

### 3.3 Presentation Layer (UI + Estado React)

**Princípio:** Camada mais externa, depende de domain e data.

**Responsabilidades:**
- **Componentes:** UI pura, recebem props, sem lógica
- **Hooks:** Gerenciam estado React e orquestram use cases

**Estrutura de Hooks (Padrão: Multiple Focused Hooks):**

1. **Hooks Focados:**
   - `useStepNavigation.ts` - Navegação entre steps
   - `useSimulatorConfig.ts` - Configuração (array, searchValue)
   - `useStepGenerator.ts` - Geração de steps (usa use case)

2. **Hook Orquestrador:**
   - `useBinarySearchSimulator.ts` - Compõe todos os hooks, expõe API unificada

**Exemplos de Componentes:**
- `BinarySearchSimulator.tsx` - Componente principal (usa apenas o hook orquestrador)
- `ArrayVisualization.tsx` - Visualização do array (recebe props, sem lógica)
- `ControlPanel.tsx` - Controles (recebe callbacks, sem lógica)

**Regras:**
- ✅ Pode importar de `domain/` e `data/`
- ✅ Componentes são **puros** (apenas renderização)
- ✅ Hooks orquestram, componentes apenas exibem
- ✅ Hook orquestrador compõe hooks menores

### 3.4 Exceções Práticas e Quando Abstrair

**Exceção Prática para Use Cases:**

Use cases na camada Domain podem importar funções de `data/` **apenas para orquestrar**, não para implementar lógica. Esta é uma exceção prática que permite que use cases coordenem validações e gerações de steps sem violar o princípio de orquestração.

**Exemplo:**
```typescript
// domain/usecases/GenerateSteps.usecase.ts
import { Config } from '@features/feature/domain/entities/Config';
import { Step } from '@features/feature/domain/entities/Step';
// Exceção prática: importar funções de data/ apenas para orquestrar
import { validateInput } from '@features/feature/data/validators/InputValidator';
import { generateSteps } from '@features/feature/data/stepGenerators/StepGenerator';

export class GenerateStepsUseCase {
  execute(config: Config): Step[] {
    // Orquestra, não implementa
    validateInput(config);
    return generateSteps(config);
  }
}
```

**Critérios para Abstrair para `shared/`:**

**Quando abstrair:**
1. **Regra dos 3:** Quando pelo menos 3 features diferentes precisam do mesmo código
2. **Algoritmos de Grafos:** Quando o 2º algoritmo de grafo for implementado (ex: MST após Dijkstra)
3. **Validação de Duplicação:** Se o código é idêntico ou quase idêntico (>80% similar) entre features
4. **Manutenibilidade:** Se mudanças futuras precisarão ser sincronizadas entre features

**Quando NÃO abstrair:**
1. **Código específico:** Se o código é específico de uma feature (ex: `ArrayValidator` para BinarySearch)
2. **Apenas 1 uso:** Se apenas uma feature usa o código
3. **Ainda em validação:** Se o padrão ainda está sendo validado (ex: PoC inicial)

**Processo de Abstração:**

Quando chegar o momento de abstrair código compartilhado:

1. **Identificar duplicação:** Comparar código entre features
2. **Criar estrutura shared/:** Criar pastas e arquivos em `src/shared/`
3. **Mover código:** Mover código duplicado para shared/
4. **Atualizar imports:** Atualizar todas as features que usam o código
5. **Atualizar testes:** Mover/atualizar testes para `shared/__tests__/`
6. **Validar:** Garantir que todas as features ainda funcionam
7. **Documentar:** Atualizar guideline com exemplos de uso

### 3.5 Código Compartilhado (Shared/)

**Estrutura de Shared/ (Por Tipo):**

Quando código precisa ser compartilhado entre múltiplas features, use a estrutura `shared/` organizada por tipo:

```
src/
  shared/
    graph-validators/          # Validadores compartilhados de grafos
      GraphValidator.ts        # Validação básica de grafos (nós, arestas, pesos)
      NodeValidator.ts         # Validação de nós (IDs únicos, etc)
      EdgeValidator.ts         # Validação de arestas (referências válidas, etc)
    hooks/                     # Hooks compartilhados
      useStepNavigation.ts     # Navegação genérica entre steps
    components/                # Componentes compartilhados
      ControlPanel.tsx         # Painel de controle genérico
      StepIndicator.tsx        # Indicador de step atual
    domain/                    # Entidades compartilhadas (se necessário)
      entities/
        Graph.ts               # Interfaces base de grafos (se houver)
```

**Quando usar shared/ vs manter em features/:**

- ✅ **Usar shared/:** Código usado por 3+ features ou código que será sincronizado entre features
- ✅ **Manter em features/:** Código específico de uma feature ou ainda em validação

**Casos Específicos:**

**Caso 1: Binary Search**
- **Status:** Não abstrair
- **Razão:** Validadores são específicos (array ordenado, searchValue numérico)
- **Ação:** Manter em `features/binary-search/data/validators/`

**Caso 2: Dijkstra (Atual)**
- **Status:** Manter local por enquanto
- **Razão:** Ainda é o primeiro algoritmo de grafo implementado
- **Ação:** Aguardar implementação do 2º algoritmo de grafo (MST)

**Caso 3: MST (Próximo)**
- **Status:** Avaliar abstração após implementação
- **Razão:** Se GraphValidator for idêntico ou muito similar, abstrair
- **Ação:** 
  1. Implementar MST com validador local
  2. Comparar com GraphValidator do Dijkstra
  3. Se >80% similar, abstrair para `shared/graph-validators/GraphValidator.ts`
  4. Atualizar ambos os use cases para usar o shared

**Caso 4: Outros Algoritmos de Grafos**
- **Status:** Usar shared/ quando disponível
- **Razão:** Evitar duplicação desde o início
- **Ação:** Importar de `shared/graph-validators/` ao invés de criar novo

**Exemplo de Uso de Shared/:**

```typescript
// shared/graph-validators/GraphValidator.ts
import { Node } from '@features/dijkstra/domain/entities/Node';
import { Edge } from '@features/dijkstra/domain/entities/Edge';
import { InvalidGraphError } from '@features/dijkstra/domain/errors/InvalidGraphError';

export function validateGraph(nodes: Node[], edges: Edge[]): void {
  // Validação compartilhada entre algoritmos de grafos
  // ...
}

// features/mst/domain/usecases/GenerateSteps.usecase.ts
import { validateGraph } from '@shared/graph-validators/GraphValidator';
// ...
```

---

## 4. Padrão de Hooks: Multiple Focused Hooks

### 4.1 Por que Multiple Hooks?

Evita o "god hook" que teria todas as responsabilidades:
- ❌ Um único hook com 200+ linhas
- ❌ Difícil de testar
- ❌ Difícil de reutilizar

### 4.2 Estrutura Recomendada

```typescript
// 1. Hook focado: Navegação
useStepNavigation({ steps, initialIndex })
  → Retorna: currentStep, next(), previous(), canGoNext, etc.

// 2. Hook focado: Configuração
useSimulatorConfig({ initialArray, initialSearchValue })
  → Retorna: array, searchValue, applyCustomConfig(), etc.

// 3. Hook focado: Geração
useStepGenerator({ array, searchValue })
  → Retorna: steps, generateSteps(), error, etc.

// 4. Hook orquestrador: Compõe tudo
useBinarySearchSimulator({ initialArray, initialSearchValue })
  → Usa os 3 hooks acima
  → Retorna: API unificada para o componente
```

### 4.3 Exemplo de Hook Focado

```typescript
// useStepNavigation.ts
export function useStepNavigation({
  steps,
  initialIndex = -1
}: UseStepNavigationProps): UseStepNavigationReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialIndex);
  
  const currentStep = useMemo(() => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) {
      return null;
    }
    return steps[currentStepIndex];
  }, [steps, currentStepIndex]);

  const next = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  // ... outras funções

  return {
    currentStepIndex,
    currentStep,
    canGoNext,
    canGoPrevious,
    next,
    previous,
    reset
  };
}
```

### 4.4 Exemplo de Hook Orquestrador

```typescript
// useBinarySearchSimulator.ts
export function useBinarySearchSimulator({
  initialArray,
  initialSearchValue
}: UseBinarySearchSimulatorProps): UseBinarySearchSimulatorReturn {
  // Compõe hooks menores
  const config = useSimulatorConfig({ initialArray, initialSearchValue });
  const stepGenerator = useStepGenerator({
    array: config.array,
    searchValue: config.searchValue
  });
  const navigation = useStepNavigation({
    steps: stepGenerator.steps,
    initialIndex: -1
  });

  // Orquestra ações
  const start = useCallback(() => {
    stepGenerator.generateSteps();
  }, [stepGenerator]);

  // Retorna API unificada
  return {
    array: config.array,
    searchValue: config.searchValue,
    currentStep: navigation.currentStep,
    start,
    reset,
    // ... outros
  };
}
```

---

## 5. Regras de Dependência (Clean Architecture)

### 5.1 Fluxo de Dependências

```
Presentation → Domain ← Data
     ↓            ↑
     └────────────┘
```

**Regra de Ouro:** Dependências sempre apontam para dentro.

### 5.2 Regras Específicas

1. **Domain** não depende de nada (core)
   - ✅ Pode ter dependências entre entidades/erros
   - ❌ NUNCA importa de `data/` ou `presentation/`

2. **Data** depende apenas de Domain
   - ✅ Pode importar entidades e erros de `domain/`
   - ❌ NUNCA importa de `presentation/`

3. **Presentation** depende de Domain e Data
   - ✅ Pode importar de `domain/` e `data/`
   - ✅ Hooks usam use cases de `domain/`
   - ✅ Componentes usam hooks de `presentation/hooks/`

### 5.3 Exemplo de Fluxo

```
[User clicks "Iniciar"]
       ↓
[ControlPanel] → onStart()
       ↓
[useBinarySearchSimulator] → start()
       ↓
[useStepGenerator] → generateSteps()
       ↓
[GenerateStepsUseCase] → execute()
       ↓
[ArrayValidator] → validateArray() ✓
       ↓
[BinarySearchStepGenerator] → generateSteps()
       ↓
[BinarySearchAlgorithm] → recursive calls
       ↓
[Steps array] → return
       ↓
[useStepNavigation] → set steps, index = 0
       ↓
[Components] → re-render with currentStep
```

---

## 6. Estrutura de Testes

### 6.1 Organização

```
__tests__/
  unit/
    domain/           # Testes de entidades, use cases, erros
    data/             # Testes de algoritmos, validators, generators
    presentation/     # Testes de hooks
  integration/        # Testes do fluxo completo
```

### 6.2 Estratégia de Testes

**Unit Tests (Jest puro):**
- Domain: Use cases, entidades
- Data: Algoritmos, validators, step generators
- Presentation: Hooks individuais

**Integration Tests (React Testing Library):**
- Fluxo completo do simulador
- Interação usuário → UI → hooks → use case → data

### 6.3 Exemplo de Teste Unit

```typescript
// __tests__/unit/data/algorithms/BinarySearchAlgorithm.test.ts
describe('BinarySearchAlgorithm', () => {
  it('should find value present in array', () => {
    const arr = [2, 5, 8, 12, 16, 23];
    const result = binarySearch(arr, 23, 0, arr.length - 1);
    expect(result.found).toBe(true);
    expect(result.index).toBe(5);
  });
});
```

### 6.4 Exemplo de Teste de Hook

```typescript
// __tests__/unit/presentation/hooks/useStepNavigation.test.ts
describe('useStepNavigation', () => {
  it('should navigate to next step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    act(() => {
      result.current.next();
    });

    expect(result.current.currentStepIndex).toBe(1);
  });
});
```

### 6.5 Coverage Goals

- **Domain/Data:** > 90%
- **Presentation:** > 70%
- **Integration:** Cobertura de fluxos principais

---

## 7. Configuração do Projeto

### 7.1 TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@features/*": ["features/*"]
    }
  }
}
```

### 7.2 Jest (package.json)

```json
{
  "jest": {
    "moduleNameMapper": {
      "^@features/(.*)$": "<rootDir>/src/features/$1"
    }
  }
}
```

### 7.3 Imports

**Regra Principal:** Use **SEMPRE** path aliases `@features/*` e `@shared/*` para imports entre camadas ou features. Imports relativos (`./` ou `../`) são permitidos APENAS dentro da mesma pasta/módulo.

**Aliases Disponíveis (craco.config.js):**
- `@features/*` → `src/features/*`
- `@shared/*` → `src/shared/*`

**Quando usar alias vs relativo:**

| Situação | Tipo de Import | Exemplo |
|----------|----------------|---------|
| Entre camadas (data → domain) | ✅ Alias | `import { Step } from '@features/my-feature/domain/entities/Step'` |
| Entre features | ✅ Alias | `import { validate } from '@shared/validators/GraphValidator'` |
| Na mesma camada/pasta | ✅ Relativo | `import { OtherHook } from './useOtherHook'` |
| Em testes | ✅ Alias | `import { fn } from '@features/my-feature/data/algorithms/Algorithm'` |

**Exemplos de imports corretos:**

```typescript
// ✅ CORRETO: data/ importando de domain/ (cross-layer) - usar alias
import { BoyerMooreStep } from '@features/boyer-moore/domain/entities/BoyerMooreStep';
import { InvalidInputError } from '@features/boyer-moore/domain/errors/InvalidInputError';

// ✅ CORRETO: presentation/ importando de domain/ (cross-layer) - usar alias
import { BinarySearchStep } from '@features/binary-search/domain/entities/BinarySearchStep';

// ✅ CORRETO: mesma pasta - usar relativo
import { useSimulatorConfig } from './useSimulatorConfig';
import { useStepNavigation } from './useStepNavigation';

// ✅ CORRETO: em App.tsx - importar do index.ts da feature
import { BinarySearchSimulator } from '@features/binary-search';
import { BoyerMooreSimulator } from '@features/boyer-moore';

// ✅ CORRETO: em testes - usar alias
import { buildLastOccurrence } from '@features/boyer-moore/data/algorithms/BoyerMooreAlgorithm';
```

**Exemplos de imports incorretos:**

```typescript
// ❌ INCORRETO: relativo cross-layer
import { Step } from '../../domain/entities/Step';

// ❌ INCORRETO: alias para mesma pasta
import { useOtherHook } from '@features/my-feature/presentation/hooks/useOtherHook';
```

---

## 8. Princípios de Design

### 8.1 Single Responsibility (SRP)

**Cada arquivo tem UMA responsabilidade:**

- `BinarySearchAlgorithm.ts` → Apenas algoritmo puro
- `useStepNavigation.ts` → Apenas navegação entre steps
- `ArrayVisualization.tsx` → Apenas renderização do array
- `GenerateSteps.usecase.ts` → Apenas orquestração do use case

### 8.2 Dependency Inversion

**Dependa de abstrações, não de implementações.**

- Use cases dependem de interfaces (entidades), não de implementações
- Hooks dependem de use cases, não de algoritmos diretamente
- Componentes dependem de hooks, não de lógica de negócio

### 8.3 Composition Over Inheritance

**Use hooks e composição, NUNCA herança de componentes.**

- ✅ Hook orquestrador compõe hooks menores
- ✅ Componente principal compõe sub-componentes
- ❌ Nunca use `extends` em componentes React

### 8.4 Keep It Simple (KISS)

**Não antecipe complexidade.**

- Comece com hooks simples
- Adicione complexidade apenas quando necessário
- Prefira múltiplos hooks pequenos a um hook grande

---

## 9. Checklist para Novos Simuladores

### 9.1 Estrutura Base

- [ ] Criar pasta `src/features/{simulator-name}/`
- [ ] Criar estrutura de pastas (domain, data, presentation, __tests__)
- [ ] Criar `index.ts` exportando componente principal

### 9.2 Domain Layer

- [ ] Criar entidades (Step, Config)
- [ ] Criar erros customizados
- [ ] Criar use case principal

### 9.3 Data Layer

- [ ] Criar algoritmo puro (sem React)
- [ ] Criar step generator
- [ ] Criar validators

### 9.4 Presentation Layer

- [ ] Criar hooks focados (navigation, config, generator)
- [ ] Criar hook orquestrador
- [ ] Criar componentes (principal + sub-componentes)
- [ ] Componentes devem ser puros (apenas props)

### 9.5 Testes

- [ ] Testes unitários do domain
- [ ] Testes unitários do data
- [ ] Testes unitários dos hooks
- [ ] Testes de integração completos

### 9.6 Integração

- [ ] Adicionar ao `App.tsx`
- [ ] Verificar imports (usar `@features/*`)
- [ ] Testar fluxo completo

---

## 10. Exemplo Completo: Fluxo de Implementação

### 10.1 Passo 1: Domain (Inside-Out)

```typescript
// 1. Criar entidades
// domain/entities/SimulatorStep.ts
export interface SimulatorStep {
  type: string;
  message: string;
  // ...
}

// 2. Criar erros
// domain/errors/InvalidInputError.ts
export class InvalidInputError extends Error { }

// 3. Criar use case
// domain/usecases/GenerateSteps.usecase.ts
import { Config } from '@features/feature/domain/entities/Config';
import { Step } from '@features/feature/domain/entities/Step';
// Exceção prática: importar funções de data/ apenas para orquestrar
import { validateInput } from '@features/feature/data/validators/InputValidator';
import { generateSteps } from '@features/feature/data/stepGenerators/StepGenerator';

export class GenerateStepsUseCase {
  execute(config: Config): Step[] {
    // Orquestra, não implementa
    validateInput(config);
    return generateSteps(config);
  }
}
```

### 10.2 Passo 2: Data

```typescript
// 1. Algoritmo puro
// data/algorithms/Algorithm.ts
export function algorithm(input: Input): Result {
  // Lógica pura, sem React
}

// 2. Step generator
// data/stepGenerators/StepGenerator.ts
export function generateSteps(input: Input): Step[] {
  // Converte execução em steps
}

// 3. Validator
// data/validators/InputValidator.ts
export function validateInput(input: string): void {
  // Valida e lança erros
}
```

### 10.3 Passo 3: Presentation

```typescript
// 1. Hooks focados
// presentation/hooks/useStepNavigation.ts
export function useStepNavigation({ steps }) { }

// presentation/hooks/useSimulatorConfig.ts
export function useSimulatorConfig({ initialConfig }) { }

// 2. Hook orquestrador
// presentation/hooks/useSimulator.ts
export function useSimulator({ initialConfig }) {
  const config = useSimulatorConfig({ initialConfig });
  const navigation = useStepNavigation({ steps });
  // ...
}

// 3. Componentes
// presentation/components/Simulator.tsx
export const Simulator = () => {
  const simulator = useSimulator({});
  return <div>{/* UI */}</div>;
};
```

---

## 11. Boas Práticas

### 11.1 Hooks

- ✅ Hooks focados em uma responsabilidade
- ✅ Hook orquestrador compõe hooks menores
- ✅ Use `useCallback` para funções passadas como props
- ✅ Use `useMemo` para valores computados

### 11.2 Componentes

- ✅ Componentes são puros (recebem props, retornam JSX)
- ✅ Zero lógica de negócio em componentes
- ✅ Quebrar componentes grandes em menores
- ✅ Um componente por arquivo

### 11.3 Testes

- ✅ Teste lógica de negócio sem React (domain/data)
- ✅ Teste hooks isoladamente
- ✅ Teste fluxo completo em testes de integração
- ✅ Mantenha testes próximos ao código

### 11.4 Imports

- ✅ Use path aliases `@features/*` em código
- ✅ Use path aliases em testes (Jest configurado)
- ✅ Mantenha imports absolutos consistentes

---

## 12. Referências

### 12.1 Exemplo Implementado

- **Feature:** `src/features/binary-search/`
- **Arquitetura:** Feature-Based + Clean Architecture
- **Padrão de Hooks:** Multiple Focused Hooks + Orchestrator
- **Cobertura de Testes:** > 80%

### 12.2 Próximos Passos

1. Refatorar outros simuladores seguindo este padrão
2. Extrair código comum para `shared/` quando apropriado
3. Documentar padrões específicos de cada tipo de simulador

---

**Última Revisão:** Nov 2025  
**Mantido por:** Equipe de Desenvolvimento CT-234
