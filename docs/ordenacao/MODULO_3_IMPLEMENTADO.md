# Módulo 3: Divisão e Conquista (Ordenação) - Implementado

**Data de Implementação:** Novembro 2025  
**Status:** ✅ Completo

## Visão Geral

Este módulo implementa os algoritmos de ordenação baseados em Divisão e Conquista:

- **Merge Sort**: Divisão recursiva até n=1, seguida de intercalação usando vetor auxiliar
- **Quick Sort**: Escolha do pivô e particionamento recursivo

## Estrutura de Arquivos

```
src/features/divide-conquer-sort/
├── domain/
│   ├── entities/
│   │   └── DivideConquerSortStep.ts    # Tipos e interfaces
│   ├── errors/
│   │   └── InvalidArrayError.ts        # Erro customizado
│   └── usecases/
│       └── GenerateSteps.usecase.ts    # Orquestrador
├── data/
│   ├── validators/
│   │   └── ArrayValidator.ts           # Validação de input
│   └── stepGenerators/
│       ├── MergeSortStepGenerator.ts   # Gerador de steps do Merge Sort
│       └── QuickSortStepGenerator.ts   # Gerador de steps do Quick Sort
├── presentation/
│   ├── hooks/
│   │   ├── useStepNavigation.ts        # Navegação entre steps
│   │   ├── useSimulatorConfig.ts       # Configuração do simulador
│   │   ├── useStepGenerator.ts         # Geração de steps
│   │   └── useDivideConquerSortSimulator.ts  # Hook orquestrador
│   └── components/
│       ├── ArrayVisualization.tsx      # Visualização do array
│       ├── ControlPanel.tsx            # Controles
│       ├── VariablesPanel.tsx          # Painel de variáveis
│       ├── PseudocodePanel.tsx         # Pseudocódigo interativo
│       ├── RecursionStackPanel.tsx     # Pilha de recursão
│       └── DivideConquerSortSimulator.tsx  # Componente principal
└── index.ts                            # Exportação pública
```

## Funcionalidades Implementadas

### Merge Sort
- ✅ Divisão recursiva do array
- ✅ Visualização das metades esquerda e direita
- ✅ Fase de intercalação (Merge) com vetor auxiliar
- ✅ Cópia de volta para o vetor original
- ✅ Pilha de recursão visual

### Quick Sort
- ✅ Seleção do pivô (primeiro elemento)
- ✅ Particionamento com ponteiros l e r
- ✅ Movimentação dos ponteiros
- ✅ Trocas de elementos
- ✅ Posicionamento final do pivô
- ✅ Chamadas recursivas nos subvetores

### Visualização
- ✅ Barras coloridas por segmento (esquerda/direita/atual)
- ✅ Destaque do pivô em roxo
- ✅ Animação de comparação e troca
- ✅ Vetor auxiliar visível (Merge Sort)
- ✅ Painel de pilha de recursão com profundidade
- ✅ Pseudocódigo com linha ativa destacada
- ✅ Painel de variáveis com valores atuais

### Controles
- ✅ Seleção de algoritmo (Merge/Quick)
- ✅ Input customizado de array
- ✅ Geração de casos (aleatório, melhor, pior)
- ✅ Navegação step-by-step
- ✅ Atalhos de teclado

## Pseudocódigo

### Merge Sort
```plaintext
MergeSort(i, f) {
    if (i < f) {
        m = floor((i + f) / 2);
        MergeSort(i, m);
        MergeSort(m + 1, f);
        Merge(i, m, f);
    }
}

Merge(i, m, f) {
    i1 = i; i2 = m + 1; k = 0;
    while (i1 <= m && i2 <= f) {
        if (v[i1] < v[i2])
            aux[k++] = v[i1++];
        else
            aux[k++] = v[i2++];
    }
    while (i1 <= m)
        aux[k++] = v[i1++];
    while (i2 <= f)
        aux[k++] = v[i2++];
    for (j = i; j <= f; j++)
        v[j] = aux[j - i];
}
```

### Quick Sort
```plaintext
QuickSort(min, max) {
    if (min < max) {
        p = Partition(min, max);
        QuickSort(min, p - 1);
        QuickSort(p + 1, max);
    }
}

Partition(left, right) {
    pivot = v[left];
    l = left + 1;
    r = right;
    while (true) {
        while (l < right && v[l] < pivot) l++;
        while (r > left && v[r] >= pivot) r--;
        if (l >= r) break;
        swap(v[l], v[r]);
    }
    v[left] = v[r]; v[r] = pivot;
    return r;
}
```

## Cores Semânticas

| Cor | Significado |
|-----|-------------|
| 🔵 Índigo | Segmento atual |
| 🔵 Azul | Metade esquerda |
| 🟠 Laranja | Metade direita |
| 🟣 Roxo | Pivô |
| 🔴 Vermelho | Comparando |
| 🟡 Amarelo | Trocando |
| 🟢 Verde | Ordenado |

## Complexidade

| Algoritmo | Melhor | Médio | Pior | Espaço |
|-----------|--------|-------|------|--------|
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |

## Como Usar

```tsx
import { DivideConquerSortSimulator } from '@features/divide-conquer-sort';

// No componente
<DivideConquerSortSimulator />
```

## Testes (TODO)

Os testes devem ser adicionados em:
- `__tests__/unit/data/stepGenerators/MergeSortStepGenerator.test.ts`
- `__tests__/unit/data/stepGenerators/QuickSortStepGenerator.test.ts`
- `__tests__/unit/presentation/hooks/useDivideConquerSortSimulator.test.ts`
