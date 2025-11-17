# Módulo 1: Paradigmas de Programação - Divisão-e-Conquista

Este módulo contém 5 simuladores interativos que demonstram algoritmos baseados no paradigma **Divisão-e-Conquista**.

## Simuladores Implementados

### 1. **Busca Binária** (`BinarySearchSimulator.tsx`)
- **Objetivo:** Demonstrar como a busca binária divide o espaço de busca pela metade a cada iteração
- **Características:**
  - Visualização do array com destaque para o intervalo atual (L, R)
  - Cálculo e exibição do pivô (Q)
  - Pilha de chamadas recursivas
  - Comparação visual entre `v[q]` e o valor buscado
  - Estados: foco, cálculo do pivô, comparação, ir à esquerda/direita, encontrado/não encontrado

### 2. **Preenchimento com Treminós** (`TrominoSimulator.tsx`)
- **Objetivo:** Visualizar como preencher um tabuleiro 2^n × 2^n com treminós (peças em L)
- **Características:**
  - Visualização do tabuleiro com células coloridas por treminó
  - Divisão em 4 quadrantes
  - Destaque do treminó central que cria "vagas" nos 3 quadrantes
  - Suporte para tabuleiros 2×2, 4×4, 8×8, 16×16
  - Pilha de chamadas recursivas mostrando a profundidade
  - Cores diferentes para cada treminó colocado

### 3. **Multiplicação de Karatsuba** (`KaratsubaSimulator.tsx`)
- **Objetivo:** Demonstrar como multiplicar inteiros grandes com apenas 3 multiplicações recursivas
- **Características:**
  - Divisão dos números em partes alta (Ih, Jh) e baixa (Il, Jl)
  - Visualização das 3 multiplicações: X, Y, Z_temp
  - Cálculo de Z = Z_temp - X - Y
  - Combinação final: X×10^n + Z×10^(n/2) + Y
  - Pilha de chamadas recursivas
  - Comparação com algoritmo tradicional O(n²) vs Karatsuba O(n^1.585)

### 4. **Multiplicação de Strassen** (`StrassenSimulator.tsx`)
- **Objetivo:** Multiplicar matrizes usando 7 multiplicações recursivas em vez de 8
- **Características:**
  - Divisão de matrizes A e B em 4 sub-matrizes cada
  - Visualização das 7 matrizes intermediárias (P, Q, R, S, T, U, V)
  - Cálculo das sub-matrizes do resultado (C11, C12, C21, C22)
  - Combinação final da matriz resultado
  - Suporte para matrizes 2×2 e 4×4
  - Geração de matrizes aleatórias
  - Fórmulas visuais para cada cálculo

### 5. **Seleção do k-ésimo Elemento** (`SelectSimulator.tsx`)
- **Objetivo:** Encontrar o k-ésimo menor elemento em tempo linear O(n)
- **Características:**
  - Divisão do array em grupos de 5 elementos
  - Visualização das medianas de cada grupo
  - Cálculo da "mediana das medianas" (pivô X)
  - Particionamento em: menores que X, X, maiores que X
  - Contagem de elementos menores (m)
  - Decisão recursiva baseada em k vs m
  - Destaque visual para cada partição

## Conceitos Pedagógicos

Todos os simuladores implementam os seguintes recursos pedagógicos:

1. **Visualização Passo a Passo:** Botões de navegação (Anterior/Próximo) permitem revisitar qualquer etapa
2. **Pilha de Chamadas:** Mostra a recursão em tempo real com indentação
3. **Mensagens Explicativas:** Cada passo tem uma descrição do que está acontecendo
4. **Painel de Estado:** Exibe variáveis relevantes (l, r, q, k, m, etc.)
5. **Configuração Customizável:** Usuário pode inserir seus próprios dados de teste
6. **Cores e Destaques:** Elementos visuais facilitam o acompanhamento do algoritmo

## Estrutura dos Simuladores

Cada simulador segue o mesmo padrão:

```typescript
interface Step {
  type: string;           // Tipo do passo (init, divide, combine, etc.)
  message: string;        // Mensagem explicativa
  callStack: string[];    // Pilha de chamadas
  // ... variáveis específicas do algoritmo
}
```

### Controles Padrão
- **Iniciar:** Gera todos os passos do algoritmo
- **Resetar:** Volta ao estado inicial
- **Anterior:** Volta um passo
- **Próximo:** Avança um passo

## Integração no App.tsx

Os 5 simuladores foram adicionados ao menu principal com:
- Ícones específicos (Binary, Grid3x3, Calculator, Grid, Target)
- Cores temáticas para cada simulador
- Descrições pedagógicas
- Agrupamento no início da lista como "Módulo 1: Divisão-e-Conquista"

## Como Usar

1. Na página inicial, clique em um dos simuladores de Divisão-e-Conquista
2. Configure os parâmetros de entrada (array, número, matriz, etc.)
3. Clique em "Iniciar" para gerar os passos
4. Use "Próximo" e "Anterior" para navegar
5. Observe a pilha de chamadas e o painel de estado
6. Clique em "Resetar" para tentar novos valores

## Tecnologias Utilizadas

- **React 19** com TypeScript
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- Hooks: `useState`, `useCallback`

## Próximos Passos

Os próximos módulos a serem implementados incluem:
- **Módulo 2:** Método Guloso
- **Módulo 3:** Programação Dinâmica
- **Módulo 4:** Memoization

## Referências

Implementação baseada nos pseudocódigos do material didático de CT-234, conforme documentado em:
- `docs/paradigmas-programacao/pseudo-codigos.md`
- `docs/paradigmas-programacao/design-ui.md`
- `docs/paradigmas-programacao/design-modulos.md`
