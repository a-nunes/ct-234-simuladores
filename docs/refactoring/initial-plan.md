# Refatoração PoC: BinarySearchSimulator - Opção A (Focused Hooks)

## Arquitetura: Feature-Based + Clean Architecture

Estrutura final:

```
src/
  features/
    binary-search/
      domain/
        entities/
          BinarySearchStep.ts          # Interface Step
          BinarySearchConfig.ts        # Interface Config
        usecases/
          GenerateSteps.usecase.ts     # Use case: gerar steps
        errors/
          InvalidArrayError.ts         # Erros customizados
      
      data/
        algorithms/
          BinarySearchAlgorithm.ts     # Algoritmo puro recursivo
        stepGenerators/
          BinarySearchStepGenerator.ts # Gera steps do algoritmo
        validators/
          ArrayValidator.ts            # Valida inputs
      
      presentation/
        components/
          BinarySearchSimulator.tsx    # Componente principal
          ArrayVisualization.tsx       # Visualização do array
          ControlPanel.tsx            # Botões de controle
          StatePanel.tsx              # Painel de estado (L, R, Q)
          CallStackPanel.tsx          # Pilha de chamadas
        hooks/
          useStepNavigation.ts         # Navegação (prev, next, current)
          useSimulatorConfig.ts        # Configuração (array, searchValue)
          useStepGenerator.ts          # Gera steps (usa usecase)
          useBinarySearchSimulator.ts  # Orquestrador (compõe tudo)
      
      __tests__/
        unit/
          domain/
            usecases/
              GenerateSteps.usecase.test.ts
          data/
            algorithms/
              BinarySearchAlgorithm.test.ts
            stepGenerators/
              BinarySearchStepGenerator.test.ts
            validators/
              ArrayValidator.test.ts
          presentation/
            hooks/
              useStepNavigation.test.ts
              useSimulatorConfig.test.ts
        integration/
          BinarySearchSimulator.test.tsx
      
      index.ts                        # Public API: export { BinarySearchSimulator }
```

## Responsabilidades por Camada

### Domain Layer (Regras de Negócio)

**entities/BinarySearchStep.ts**

- Define interface `BinarySearchStep`
- Tipos: 'init' | 'focus' | 'calculate_pivot' | 'compare' | 'go_left' | 'go_right' | 'found' | 'not_found'
- Propriedades: type, l, r, q?, value?, message, callStack

**entities/BinarySearchConfig.ts**

- Define interface `BinarySearchConfig`
- Propriedades: array: number[], searchValue: number

**usecases/GenerateSteps.usecase.ts**

- Classe/função: `GenerateStepsUseCase`
- Método: `execute(config: BinarySearchConfig): BinarySearchStep[]`
- Orquestra: validator → algorithm → step generator
- Retorna: array de steps

**errors/InvalidArrayError.ts**

- Erro customizado para array inválido
- Erro customizado para valor de busca inválido

### Data Layer (Implementações)

**algorithms/BinarySearchAlgorithm.ts**

- Função pura: `binarySearch(arr: number[], x: number, l: number, r: number): { found: boolean, index?: number }`
- Sem side effects, sem logs
- Apenas lógica do algoritmo

**stepGenerators/BinarySearchStepGenerator.ts**

- Função: `generateSteps(arr: number[], x: number): BinarySearchStep[]`
- Executa algoritmo e captura cada passo
- Monta callStack recursivamente
- Retorna array completo de steps

**validators/ArrayValidator.ts**

- Função: `validateArray(arr: number[]): void` (throws se inválido)
- Função: `validateSearchValue(value: number): void`
- Validações: array não vazio, números válidos, ordenado

### Presentation Layer (UI + Estado React)

**hooks/useStepNavigation.ts**

```typescript
// Responsabilidade: Gerenciar navegação entre steps
interface UseStepNavigationProps {
  steps: Step[];
  initialIndex?: number;
}

interface UseStepNavigationReturn {
  currentStepIndex: number;
  currentStep: Step | null;
  canGoNext: boolean;
  canGoPrevious: boolean;
  next: () => void;
  previous: () => void;
  goToStep: (index: number) => void;
  reset: () => void;
}

export function useStepNavigation(props: UseStepNavigationProps): UseStepNavigationReturn
```

**hooks/useSimulatorConfig.ts**

```typescript
// Responsabilidade: Gerenciar configuração do simulador
interface UseSimulatorConfigProps {
  initialArray?: number[];
  initialSearchValue?: number;
}

interface UseSimulatorConfigReturn {
  array: number[];
  searchValue: number;
  customArray: string;
  customSearch: string;
  setCustomArray: (value: string) => void;
  setCustomSearch: (value: string) => void;
  applyCustomConfig: () => void;
  isRunning: boolean;
  setIsRunning: (value: boolean) => void;
}

export function useSimulatorConfig(props: UseSimulatorConfigProps): UseSimulatorConfigReturn
```

**hooks/useStepGenerator.ts**

```typescript
// Responsabilidade: Gerar steps usando o use case
interface UseStepGeneratorProps {
  array: number[];
  searchValue: number;
}

interface UseStepGeneratorReturn {
  steps: Step[];
  generateSteps: () => void;
  error: Error | null;
  isGenerating: boolean;
}

export function useStepGenerator(props: UseStepGeneratorProps): UseStepGeneratorReturn
```

**hooks/useBinarySearchSimulator.ts**

```typescript
// Responsabilidade: Orquestrar todos os hooks e expor API unificada
interface UseBinarySearchSimulatorProps {
  initialArray?: number[];
  initialSearchValue?: number;
}

interface UseBinarySearchSimulatorReturn {
  // Config
  array: number[];
  searchValue: number;
  customArray: string;
  customSearch: string;
  setCustomArray: (value: string) => void;
  setCustomSearch: (value: string) => void;
  applyCustomConfig: () => void;
  
  // Navigation
  currentStepIndex: number;
  currentStep: Step | null;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  
  // Actions
  start: () => void;
  reset: () => void;
  next: () => void;
  previous: () => void;
  
  // State
  isRunning: boolean;
  error: Error | null;
}

export function useBinarySearchSimulator(props: UseBinarySearchSimulatorProps): UseBinarySearchSimulatorReturn
```

**components/BinarySearchSimulator.tsx**

- Componente principal
- Usa apenas `useBinarySearchSimulator`
- Renderiza sub-componentes
- ZERO lógica de negócio

**components/ArrayVisualization.tsx**

- Recebe: `array`, `currentStep`
- Renderiza: células do array com estilos baseados no step
- Função auxiliar: `getCellStyle(index: number): string`
- Função auxiliar: `getPointerLabel(index: number): string[]`

**components/ControlPanel.tsx**

- Recebe: callbacks (onStart, onReset, etc) e estados (isRunning, canGoNext)
- Renderiza: botões de controle e configuração
- Sem lógica, apenas UI

**components/StatePanel.tsx**

- Recebe: `currentStep`, `searchValue`
- Renderiza: valores de L, R, Q, v[q]
- Sem lógica, apenas apresentação

**components/CallStackPanel.tsx**

- Recebe: `callStack: string[]`
- Renderiza: pilha de chamadas recursivas
- Sem lógica, apenas apresentação

## Fluxo de Dados

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

## Regras de Dependência (Clean Architecture)

1. **Domain** não depende de nada (core)
2. **Data** depende apenas de Domain
3. **Presentation** depende de Domain e Data
4. Fluxo sempre: Presentation → UseCase → Data
5. Nunca: Data → Presentation ou UseCase → Presentation

## Estratégia de Testes

### Unit Tests (Jest puro)

**Domain:**

- `GenerateSteps.usecase.test.ts`:
  - ✓ Deve gerar steps corretamente para array válido
  - ✓ Deve lançar erro para array inválido
  - ✓ Deve lançar erro para array não ordenado

**Data:**

- `BinarySearchAlgorithm.test.ts`:
  - ✓ Encontra valor presente
  - ✓ Não encontra valor ausente
  - ✓ Funciona com array de 1 elemento
  - ✓ Funciona com array vazio

- `BinarySearchStepGenerator.test.ts`:
  - ✓ Gera step inicial
  - ✓ Gera steps de comparação
  - ✓ Gera step de found
  - ✓ Gera step de not_found
  - ✓ Monta callStack corretamente

- `ArrayValidator.test.ts`:
  - ✓ Aceita array válido
  - ✓ Rejeita array vazio
  - ✓ Rejeita array não ordenado
  - ✓ Rejeita valores inválidos

**Presentation Hooks:**

- `useStepNavigation.test.ts` (React Hooks Testing Library):
  - ✓ Navega para próximo step
  - ✓ Navega para step anterior
  - ✓ Não passa do último step
  - ✓ Não volta antes do primeiro
  - ✓ Reset volta para índice -1

- `useSimulatorConfig.test.ts`:
  - ✓ Aplica configuração customizada
  - ✓ Valida entrada antes de aplicar
  - ✓ Ordena array automaticamente

### Integration Tests (React Testing Library)

**BinarySearchSimulator.test.tsx:**

- ✓ Renderiza com configuração padrão
- ✓ Permite aplicar configuração customizada
- ✓ Inicia simulação e mostra primeiro step
- ✓ Navega entre steps e atualiza UI
- ✓ Mostra estado correto em cada step
- ✓ Destaca célula correta (L, R, Q)
- ✓ Mostra mensagem do step
- ✓ Mostra callStack
- ✓ Reset limpa tudo
- ✓ Botões desabilitados nos momentos corretos

**Coverage Goal:**

- Domain/Data: > 90%
- Presentation: > 70%

## Garantia de Zero Mudanças

**Estratégia de Validação:**

1. **Manter simulador original temporariamente:**

   - `src/components/BinarySearchSimulator.tsx` (original)
   - `src/features/binary-search/` (refatorado)

2. **Criar modo comparação em App.tsx:**
   ```typescript
   // Temporário para validação
   const [showComparison] = useState(true);
   
   if (showComparison) {
     return (
       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
         <div>
           <h2>Original</h2>
           <BinarySearchSimulatorOriginal />
         </div>
         <div>
           <h2>Refatorado</h2>
           <BinarySearchSimulatorRefactored />
         </div>
       </div>
     );
   }
   ```

3. **Testes de regressão:**

   - Mesma sequência de steps
   - Mesmas mensagens
   - Mesmos estilos de células
   - Mesmo callStack

4. **Validação manual:**

   - Rodar lado a lado
   - Fazer mesmas ações em ambos
   - Comparar visualmente
   - Testar edge cases (array vazio, valor não encontrado, etc)

## Considerações Create React App

**tsconfig.json:**

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

**Imports absolutos:**

```typescript
// Em vez de:
import { GenerateStepsUseCase } from '../../../domain/usecases/GenerateSteps.usecase';

// Usar:
import { GenerateStepsUseCase } from '@features/binary-search/domain/usecases/GenerateSteps.usecase';
```

**Jest configuração (já vem com CRA):**

- Nenhuma configuração extra necessária
- `npm run test` roda todos os testes
- Coverage: `npm run test -- --coverage`

## Futuro: Shared/Common

**Após validar o PoC, extrair para shared:**

- `shared/domain/entities/SimulatorStep.ts` (interface base)
- `shared/presentation/hooks/useStepNavigation.ts` (genérico)
- `shared/presentation/components/ControlPanel.tsx` (genérico)
- `shared/presentation/components/StepIndicator.tsx`

**Mas por enquanto:** manter tudo isolado em `features/binary-search/` para validar padrão.

## Ordem de Implementação

1. **Setup:** Criar estrutura de pastas
2. **Domain (Inside-Out):** Entities → Errors → UseCase
3. **Data:** Algorithm → Validator → StepGenerator
4. **Tests (Domain + Data):** Garantir que lógica está correta
5. **Presentation:** Hooks (navigation → config → generator → orchestrator)
6. **Tests (Hooks):** Validar comportamento dos hooks
7. **Presentation:** Components (small → big)
8. **Tests (Integration):** Full flow
9. **Validation:** Side-by-side comparison
10. **Cleanup:** Remover original após 100% validação

## Resultado Esperado

- ✅ Código organizado por feature
- ✅ Separação clara de responsabilidades
- ✅ Lógica de negócio testável sem React
- ✅ Hooks focados e reutilizáveis
- ✅ Componentes puros (apenas UI)
- ✅ > 80% test coverage
- ✅ Zero mudanças visuais/comportamentais
- ✅ Facilidade de adicionar novos simuladores
- ✅ Padrão claro para escalar