# Tests Guideline - CT-234 Simuladores

**Versão:** 1.0  
**Status:** Implementado  
**Última Atualização:** Nov 2025  
**Propósito:** Guiar a criação e manutenção de testes no projeto

---

## 1. Visão Geral

Este documento define a estratégia e padrões de testes para o projeto CT-234 Simuladores. Seguimos uma abordagem de testes em camadas que reflete a arquitetura Feature-Based + Clean Architecture do projeto.

### 1.1 Princípios de Testes

- ✅ **Testes co-localizados:** Testes ficam próximos ao código que testam
- ✅ **Testes independentes:** Cada teste pode rodar isoladamente
- ✅ **Testes determinísticos:** Mesmo input sempre produz mesmo output
- ✅ **Testes rápidos:** Feedback rápido durante desenvolvimento
- ✅ **Testes legíveis:** Servem como documentação do comportamento

---

## 2. Estrutura de Testes

### 2.1 Organização por Feature

Cada feature tem sua própria pasta de testes seguindo a estrutura de camadas:

```
src/features/{feature-name}/
  __tests__/
    unit/
      domain/           # Testes de entidades, use cases, erros
        usecases/
          GenerateSteps.usecase.test.ts
      data/             # Testes de algoritmos, validators, generators
        algorithms/
          Algorithm.test.ts
        stepGenerators/
          StepGenerator.test.ts
        validators/
          InputValidator.test.ts
      presentation/     # Testes de hooks
        hooks/
          useStepNavigation.test.ts
          useSimulatorConfig.test.ts
          useStepGenerator.test.ts
    integration/        # Testes do fluxo completo
      Simulator.test.tsx
```

### 2.2 Nomenclatura de Arquivos

- **Testes unitários:** `{NomeDoArquivo}.test.ts`
- **Testes de componentes:** `{NomeDoComponente}.test.tsx`
- **Testes de integração:** `{NomeDoSimulador}.test.tsx`

---

## 3. Estratégia de Testes por Camada

### 3.1 Domain Layer

**O que testar:**
- Use cases (fluxo de orquestração)
- Validação de erros customizados
- Type guards (se houver)

**Ferramentas:** Jest puro (sem React)

**Exemplo:**

```typescript
// __tests__/unit/domain/usecases/GenerateSteps.usecase.test.ts
import { GenerateStepsUseCase } from '@features/feature/domain/usecases/GenerateSteps.usecase';
import { InvalidInputError } from '@features/feature/domain/errors/InvalidInputError';

describe('GenerateStepsUseCase', () => {
  let useCase: GenerateStepsUseCase;

  beforeEach(() => {
    useCase = new GenerateStepsUseCase();
  });

  describe('execute', () => {
    it('should generate steps for valid input', () => {
      const result = useCase.execute({
        text: 'valid text',
        pattern: 'valid'
      });

      expect(result.steps).toBeDefined();
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('should throw InvalidInputError for empty input', () => {
      expect(() => useCase.execute({
        text: '',
        pattern: 'pattern'
      })).toThrow(InvalidInputError);
    });
  });
});
```

### 3.2 Data Layer

**O que testar:**
- Algoritmos puros (funções matemáticas/lógicas)
- Geradores de steps (conversão de execução em visualização)
- Validadores (validação de inputs)

**Ferramentas:** Jest puro (sem React)

**Exemplo - Algoritmo:**

```typescript
// __tests__/unit/data/algorithms/Algorithm.test.ts
import { algorithm, buildTable } from '@features/feature/data/algorithms/Algorithm';

describe('Algorithm', () => {
  describe('buildTable', () => {
    it('should build correct table for input', () => {
      const table = buildTable('input');
      expect(table).toEqual([/* expected values */]);
    });

    it('should handle edge case', () => {
      const table = buildTable('a');
      expect(table).toEqual([0]);
    });
  });

  describe('algorithm', () => {
    it('should find target at beginning', () => {
      const result = algorithm('target at start', 'target');
      expect(result).toBe(0);
    });

    it('should return -1 when not found', () => {
      const result = algorithm('text', 'xyz');
      expect(result).toBe(-1);
    });
  });
});
```

**Exemplo - Validator:**

```typescript
// __tests__/unit/data/validators/InputValidator.test.ts
import { validateInput } from '@features/feature/data/validators/InputValidator';
import { InvalidInputError } from '@features/feature/domain/errors/InvalidInputError';

describe('InputValidator', () => {
  describe('validateInput', () => {
    it('should not throw for valid input', () => {
      expect(() => validateInput({
        text: 'some text',
        pattern: 'text'
      })).not.toThrow();
    });

    it('should throw InvalidInputError for empty text', () => {
      expect(() => validateInput({
        text: '',
        pattern: 'pattern'
      })).toThrow(InvalidInputError);
    });

    it('should throw with correct error message', () => {
      expect(() => validateInput({
        text: '',
        pattern: 'pattern'
      })).toThrow('O texto não pode estar vazio.');
    });
  });
});
```

**Exemplo - Step Generator:**

```typescript
// __tests__/unit/data/stepGenerators/StepGenerator.test.ts
import { generateSteps } from '@features/feature/data/stepGenerators/StepGenerator';

describe('StepGenerator', () => {
  describe('generateSteps', () => {
    it('should generate steps for found scenario', () => {
      const steps = generateSteps('text', 'tex', table);
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[steps.length - 1].found).toBe(true);
    });

    it('should generate steps for not found scenario', () => {
      const steps = generateSteps('text', 'xyz', table);
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[steps.length - 1].found).toBe(false);
    });

    it('should track comparison count correctly', () => {
      const steps = generateSteps('abcdef', 'abc', table);
      
      let lastCount = 0;
      steps.forEach(step => {
        expect(step.comparisonCount).toBeGreaterThanOrEqual(lastCount);
        lastCount = step.comparisonCount;
      });
    });
  });
});
```

### 3.3 Presentation Layer (Hooks)

**O que testar:**
- Hooks de navegação (next, previous, goToStep)
- Hooks de configuração (estado, setters, reset)
- Hooks de geração (generateSteps, clearSteps, error handling)
- Hook orquestrador (composição e ações)

**Ferramentas:** Jest + React Testing Library (`@testing-library/react`)

**Exemplo - Hook de Navegação:**

```typescript
// __tests__/unit/presentation/hooks/useStepNavigation.test.ts
import { renderHook, act } from '@testing-library/react';
import { useStepNavigation } from '@features/feature/presentation/hooks/useStepNavigation';

describe('useStepNavigation', () => {
  const mockSteps = [
    { type: 'init', message: 'Step 1' },
    { type: 'process', message: 'Step 2' },
    { type: 'done', message: 'Step 3' }
  ];

  it('should initialize with initialIndex', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.currentStep).toEqual(mockSteps[0]);
  });

  it('should navigate to next step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    act(() => {
      result.current.next();
    });

    expect(result.current.currentStepIndex).toBe(1);
  });

  it('should not go beyond last step', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: mockSteps.length - 1 })
    );

    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.next();
    });

    expect(result.current.currentStepIndex).toBe(mockSteps.length - 1);
  });

  it('should reset to initial index', () => {
    const { result } = renderHook(() =>
      useStepNavigation({ steps: mockSteps, initialIndex: 0 })
    );

    act(() => {
      result.current.goToStep(2);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.currentStepIndex).toBe(0);
  });
});
```

**Exemplo - Hook de Configuração:**

```typescript
// __tests__/unit/presentation/hooks/useSimulatorConfig.test.ts
import { renderHook, act } from '@testing-library/react';
import { useSimulatorConfig } from '@features/feature/presentation/hooks/useSimulatorConfig';

describe('useSimulatorConfig', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSimulatorConfig());

    expect(result.current.text).toBeDefined();
    expect(result.current.pattern).toBeDefined();
  });

  it('should initialize with custom values', () => {
    const { result } = renderHook(() =>
      useSimulatorConfig({
        initialText: 'custom text',
        initialPattern: 'custom'
      })
    );

    expect(result.current.text).toBe('custom text');
    expect(result.current.pattern).toBe('custom');
  });

  it('should update text', () => {
    const { result } = renderHook(() => useSimulatorConfig());

    act(() => {
      result.current.setText('new text');
    });

    expect(result.current.text).toBe('new text');
  });

  it('should reset to initial values', () => {
    const { result } = renderHook(() =>
      useSimulatorConfig({
        initialText: 'initial',
        initialPattern: 'init'
      })
    );

    act(() => {
      result.current.setText('modified');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.text).toBe('initial');
  });
});
```

**Exemplo - Hook de Geração:**

```typescript
// __tests__/unit/presentation/hooks/useStepGenerator.test.ts
import { renderHook, act } from '@testing-library/react';
import { useStepGenerator } from '@features/feature/presentation/hooks/useStepGenerator';

describe('useStepGenerator', () => {
  const validConfig = {
    text: 'some text',
    pattern: 'text'
  };

  it('should initialize with empty steps', () => {
    const { result } = renderHook(() =>
      useStepGenerator({ config: validConfig })
    );

    expect(result.current.steps).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerated).toBe(false);
  });

  it('should generate steps for valid config', () => {
    const { result } = renderHook(() =>
      useStepGenerator({ config: validConfig })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.steps.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
    expect(result.current.isGenerated).toBe(true);
  });

  it('should set error for invalid config', () => {
    const invalidConfig = { text: '', pattern: 'abc' };
    const { result } = renderHook(() =>
      useStepGenerator({ config: invalidConfig })
    );

    act(() => {
      result.current.generateSteps();
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.steps).toEqual([]);
    expect(result.current.isGenerated).toBe(false);
  });

  it('should clear steps', () => {
    const { result } = renderHook(() =>
      useStepGenerator({ config: validConfig })
    );

    act(() => {
      result.current.generateSteps();
    });

    act(() => {
      result.current.clearSteps();
    });

    expect(result.current.steps).toEqual([]);
    expect(result.current.isGenerated).toBe(false);
  });
});
```

### 3.4 Integration Tests

**O que testar:**
- Fluxo completo do simulador
- Interação usuário → UI → hooks → use case → data
- Cenários reais de uso

**Ferramentas:** Jest + React Testing Library

**Exemplo:**

```typescript
// __tests__/integration/Simulator.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Simulator } from '@features/feature/presentation/components/Simulator';

describe('Simulator Integration', () => {
  it('should complete full simulation flow', async () => {
    render(<Simulator />);

    // Enter input
    const textInput = screen.getByPlaceholderText('Digite o texto');
    fireEvent.change(textInput, { target: { value: 'test text' } });

    const patternInput = screen.getByPlaceholderText('Digite o padrão');
    fireEvent.change(patternInput, { target: { value: 'test' } });

    // Start simulation
    const startButton = screen.getByText('Iniciar Simulação');
    fireEvent.click(startButton);

    // Verify simulation started
    await waitFor(() => {
      expect(screen.getByText(/Passo 1 de/)).toBeInTheDocument();
    });

    // Navigate through steps
    const nextButton = screen.getByTitle('Próximo passo');
    fireEvent.click(nextButton);

    // Verify navigation worked
    await waitFor(() => {
      expect(screen.getByText(/Passo 2 de/)).toBeInTheDocument();
    });
  });

  it('should show error for invalid input', async () => {
    render(<Simulator />);

    const textInput = screen.getByPlaceholderText('Digite o texto');
    fireEvent.change(textInput, { target: { value: '' } });

    const startButton = screen.getByText('Iniciar Simulação');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/não pode estar vazio/)).toBeInTheDocument();
    });
  });

  it('should reset simulation', async () => {
    render(<Simulator />);

    // Start simulation
    const startButton = screen.getByText('Iniciar Simulação');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText(/Passo 1 de/)).toBeInTheDocument();
    });

    // Reset
    const resetButton = screen.getByText('Limpar');
    fireEvent.click(resetButton);

    // Verify reset
    await waitFor(() => {
      expect(screen.queryByText(/Passo 1 de/)).not.toBeInTheDocument();
    });
  });
});
```

---

## 4. Configuração do Projeto

### 4.1 Jest Configuration (craco.config.js)

```javascript
module.exports = {
  jest: {
    configure: {
      moduleNameMapper: {
        '^@features/(.*)$': '<rootDir>/src/features/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1'
      }
    }
  }
};
```

### 4.2 Setup File (setupTests.ts)

```typescript
import '@testing-library/jest-dom';
```

### 4.3 Scripts (package.json)

```json
{
  "scripts": {
    "test": "craco test",
    "test:coverage": "craco test --coverage --watchAll=false",
    "test:ci": "craco test --watchAll=false"
  }
}
```

---

## 5. Imports em Testes

### 5.1 Regra Principal

**SEMPRE** use path aliases `@features/*` e `@shared/*` em testes, nunca imports relativos para acessar código de produção.

### 5.2 Exemplos Corretos

```typescript
// ✅ CORRETO: importando código de produção
import { algorithm } from '@features/feature/data/algorithms/Algorithm';
import { InvalidInputError } from '@features/feature/domain/errors/InvalidInputError';
import { useStepNavigation } from '@features/feature/presentation/hooks/useStepNavigation';

// ✅ CORRETO: importando de shared
import { validateInput } from '@shared/pattern-matching';
```

### 5.3 Exemplos Incorretos

```typescript
// ❌ INCORRETO: import relativo para código de produção
import { algorithm } from '../../../../data/algorithms/Algorithm';
```

---

## 6. Coverage Goals

### 6.1 Metas por Camada

| Camada | Cobertura Mínima | Cobertura Ideal |
|--------|------------------|-----------------|
| Domain | 90% | 95%+ |
| Data | 90% | 95%+ |
| Presentation (Hooks) | 70% | 85%+ |
| Integration | Fluxos principais | Cenários críticos |

### 6.2 Gerando Relatório de Coverage

```bash
npm run test:coverage
```

O relatório será gerado em `coverage/lcov-report/index.html`.

---

## 7. Boas Práticas

### 7.1 Estrutura de Testes

```typescript
describe('ModuleName', () => {
  // Setup comum
  beforeEach(() => {
    // Reset estado se necessário
  });

  describe('functionName', () => {
    it('should do something when condition', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionName(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### 7.2 Naming Convention

Use descrições claras que documentam o comportamento:

```typescript
// ✅ BOM
it('should return -1 when pattern is not found in text', () => {});
it('should throw InvalidInputError when text is empty', () => {});
it('should navigate to next step when next() is called', () => {});

// ❌ RUIM
it('test1', () => {});
it('works', () => {});
it('should work correctly', () => {});
```

### 7.3 Isolamento

- Cada teste deve ser independente
- Não compartilhe estado mutável entre testes
- Use `beforeEach` para setup comum

### 7.4 Mock com Moderação

- Prefira testar com implementações reais quando possível
- Mock apenas dependências externas ou lentas
- Para hooks, teste o comportamento, não a implementação

### 7.5 Testes de Snapshot

Use com moderação, apenas para:
- Componentes estáveis com UI complexa
- Dados estruturados que não mudam frequentemente

```typescript
it('should render correctly', () => {
  const { container } = render(<Component />);
  expect(container).toMatchSnapshot();
});
```

---

## 8. Checklist para Novos Testes

### 8.1 Ao Criar Nova Feature

- [ ] Criar pasta `__tests__/unit/domain/usecases/`
- [ ] Criar pasta `__tests__/unit/data/algorithms/`
- [ ] Criar pasta `__tests__/unit/data/stepGenerators/`
- [ ] Criar pasta `__tests__/unit/data/validators/` (se houver)
- [ ] Criar pasta `__tests__/unit/presentation/hooks/`
- [ ] Criar pasta `__tests__/integration/`

### 8.2 Testes Mínimos Obrigatórios

**Domain:**
- [ ] Use case: valid input
- [ ] Use case: invalid input (throw error)
- [ ] Use case: edge cases

**Data:**
- [ ] Algoritmo: casos principais
- [ ] Algoritmo: edge cases
- [ ] Algoritmo: not found scenario
- [ ] Step Generator: found scenario
- [ ] Step Generator: not found scenario
- [ ] Validator: valid input
- [ ] Validator: cada tipo de erro

**Presentation:**
- [ ] Hook navegação: next/previous
- [ ] Hook navegação: boundaries
- [ ] Hook navegação: reset
- [ ] Hook config: initial values
- [ ] Hook config: setters
- [ ] Hook config: reset
- [ ] Hook generator: generate success
- [ ] Hook generator: generate error
- [ ] Hook generator: clear

---

## 9. Rodando Testes

### 9.1 Comandos Úteis

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch (desenvolvimento)
npm test -- --watch

# Rodar testes de uma feature específica
npm test -- --testPathPattern="features/kmp"

# Rodar com coverage
npm test -- --coverage --watchAll=false

# Rodar testes que matcham um padrão
npm test -- --testNamePattern="should find"

# Rodar um arquivo específico
npm test -- src/features/kmp/__tests__/unit/data/algorithms/KMPAlgorithm.test.ts
```

### 9.2 Debug de Testes

```bash
# Rodar com verbose
npm test -- --verbose

# Rodar apenas testes que falharam
npm test -- --onlyFailures
```

---

## 10. Referências

### 10.1 Features com Testes Completos

- `src/features/binary-search/__tests__/`
- `src/features/boyer-moore/__tests__/`
- `src/features/kmp/__tests__/`
- `src/features/dijkstra/__tests__/`

### 10.2 Documentação Externa

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

---

**Última Revisão:** Nov 2025  
**Mantido por:** Equipe de Desenvolvimento CT-234
