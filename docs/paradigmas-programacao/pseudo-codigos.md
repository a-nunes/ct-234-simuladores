Com certeza. Aqui estão os pseudocódigos para cada simulador, baseados estritamente nos algoritmos do material em anexo.

Eles estão formatados para serem guias claros para o Copilot, com comentários (`//`) indicando os pontos-chave para a visualização e armazenamento do "passo a passo".

-----

## 1\. Divisão-e-Conquista

### 1.1. Busca Binária

[cite\_start]Baseado no algoritmo da página 6 [cite: 29-35].

```pseudocode
// v: vetor ordenado
// l: índice esquerdo
// r: índice direito
// x: valor buscado
FUNCTION BinarySearch(v, l, r, x):
    // Armazena o passo: Focando no sub-vetor v[l...r]

    IF r < l THEN
        // Armazena o passo: Não encontrado
        RETURN false
    
    q = floor((l + r) / 2)
    // Armazena o passo: Pivô 'q' calculado, v[q] = v[q]

    IF v[q] == x THEN
        // Armazena o passo: Valor 'x' encontrado no índice 'q'
        RETURN true
    
    IF v[q] > x THEN
        // Armazena o passo: v[q] > x, buscando na metade esquerda
        RETURN BinarySearch(v, l, q - 1, x)
    ELSE
        // Armazena o passo: v[q] < x, buscando na metade direita
        RETURN BinarySearch(v, q + 1, r, x)
END FUNCTION
```

-----

### 1.2. Preenchimento com Treminós

[cite\_start]Baseado no algoritmo das páginas 9-12 [cite: 55, 69-74].

```pseudocode
// n: tamanho do tabuleiro é 2^n x 2^n
// pos_vaga: (x, y) do espaço vago
// pos_tabuleiro: canto superior esquerdo do tabuleiro atual
FUNCTION SolveTromino(n, pos_vaga, pos_tabuleiro):
    
    IF n == 1 THEN // Caso trivial: tabuleiro 2x2
        // Armazena o passo: Resolvendo caso trivial 2x2
        Coloca 1 treminó no tabuleiro 2x2
        RETURN

    // Divide o tabuleiro 2^n em 4 quadrantes 2^(n-1)
    Divide em Q1, Q2, Q3, Q4
    Identifica pos_vaga_centro (o canto central)
    Identifica qual quadrante (Q_vago) contém 'pos_vaga'
    
    // Armazena o passo: Divisão em 4 quadrantes
    // Armazena o passo: Colocando treminó central
    Coloca 1 treminó no centro, nos 3 quadrantes que NÃO são Q_vago
    
    // Define as novas posições vagas para as chamadas recursivas
    nova_vaga_1 = (se Q1 == Q_vago, usa 'pos_vaga', senão usa célula central de Q1)
    nova_vaga_2 = (se Q2 == Q_vago, usa 'pos_vaga', senão usa célula central de Q2)
    ... (etc. para Q3, Q4)

    // Conquista: Resolve recursivamente
    // Armazena o passo: Chamada recursiva para Q1
    SolveTromino(n - 1, nova_vaga_1, pos_Q1)
    // Armazena o passo: Chamada recursiva para Q2
    SolveTromino(n - 1, nova_vaga_2, pos_Q2)
    // Armazena o passo: Chamada recursiva para Q3
    SolveTromino(n - 1, nova_vaga_3, pos_Q3)
    // Armazena o passo: Chamada recursiva para Q4
    SolveTromino(n - 1, nova_vaga_4, pos_Q4)
    
END FUNCTION
```

-----

### 1.3. Multiplicação de Inteiros (Karatsuba)

[cite\_start]Baseado no algoritmo da página 15 [cite: 91-93].

```pseudocode
// I, J: inteiros a multiplicar
// n: número de bits/dígitos (assumir potência de 2)
FUNCTION Karatsuba(I, J, n):
    
    IF n == 1 THEN // Caso base
        RETURN I * J
    
    // Divide os números
    Ih = (I / 2^(n/2)) // bits/dígitos altos de I
    Il = (I % 2^(n/2)) // bits/dígitos baixos de I
    Jh = (J / 2^(n/2))
    Jl = (J % 2^(n/2))
    // Armazena o passo: Divisão em Ih, Il, Jh, Jl

    // 3 chamadas recursivas
    X = Karatsuba(Ih, Jh, n/2)
    // Armazena o passo: X = Ih * Jh
    Y = Karatsuba(Il, Jl, n/2)
    // Armazena o passo: Y = Il * Jl
    Z_temp = Karatsuba(Ih + Il, Jh + Jl, n/2)
    Z = Z_temp - X - Y
    // Armazena o passo: Z = (Ih+Il)(Jh+Jl) - X - Y

    // Combinação
    Resultado = (X * 2^n) + (Z * 2^(n/2)) + Y
    // Armazena o passo: Combinação final X.2^n + Z.2^(n/2) + Y
    RETURN Resultado
    
END FUNCTION
```

-----

### 1.4. Multiplicação de Matrizes (Strassen)

[cite\_start]Baseado no algoritmo da página 20 [cite: 150-166].

```pseudocode
// A, B: matrizes n x n
FUNCTION Strassen(A, B):

    IF n == 1 THEN // Caso base
        RETURN A[0][0] * B[0][0]

    // Divide A e B em 4 sub-matrizes (A11, A12... B22)
    // Armazena o passo: Divisão das matrizes

    // 1. Calcula P
    P = Strassen(A11 + A22, B11 + B22)
    // Armazena o passo: P = (A11+A22).(B11+B22)

    // 2. Calcula Q
    Q = Strassen(A21 + A22, B11)
    // Armazena o passo: Q = (A21+A22).B11
    
    // 3. Calcula R
    R = Strassen(A11, B12 - B22)
    // Armazena o passo: R = A11.(B12-B22)

    // 4. Calcula S
    S = Strassen(A22, B21 - B11)
    // Armazena o passo: S = A22.(B21-B11)

    // 5. Calcula T
    T = Strassen(A11 + A12, B22)
    // Armazena o passo: T = (A11+A12).B22

    // 6. Calcula U
    U = Strassen(A21 - A11, B11 + B12)
    // Armazena o passo: U = (A21-A11).(B11+B12)

    // 7. Calcula V
    V = Strassen(A12 - A22, B21 + B22)
    // Armazena o passo: V = (A12-A22).(B21+B22)

    // Combinação
    C11 = P + S - T + V
    C12 = R + T
    C21 = Q + S
    C22 = P + R - Q + U
    // Armazena o passo: Combinação final de C11, C12, C21, C22

    RETURN C (matriz combinada)
    
END FUNCTION
```

-----

### 1.5. Seleção do k-ésimo Elemento

[cite\_start]Baseado no algoritmo das páginas 22-24 [cite: 206-217].

```pseudocode
// V: vetor de elementos
// k: k-ésimo menor elemento a ser encontrado
FUNCTION Select(V, k):

    // 1. Divisão
    Divide V em n/5 grupos de 5 elementos
    // Armazena o passo: Grupos de 5 formados
    
    // 2. Encontrar medianas
    PARA CADA grupo:
        Encontra a mediana (ex: ordenando o grupo)
    Cria Vetor_Medianas com as n/5 medianas
    // Armazena o passo: Medianas de cada grupo encontradas
    
    // 3. Encontrar Mediana das Medianas (Pivô X)
    X = Select(Vetor_Medianas, floor(n/10))
    // Armazena o passo: Pivô X (mediana das medianas) encontrado
    
    // 4. Particionar
    Particiona V em V_Menores, V_Maiores usando X
    m = tamanho(V_Menores)
    // Armazena o passo: Vetor original particionado por X
    
    // 5. Selecionar partição
    IF k == m + 1 THEN // X é o k-ésimo
        // Armazena o passo: Pivô X é o k-ésimo elemento
        RETURN X
    
    IF k <= m THEN // Busca na esquerda
        // Armazena o passo: k-ésimo está em V_Menores
        RETURN Select(V_Menores, k)
        
    IF k > m + 1 THEN // Busca na direita
        // Armazena o passo: k-ésimo está em V_Maiores
        RETURN Select(V_Maiores, k - m - 1)
        
END FUNCTION
```

-----

## 2\. Método Guloso

### 2.1. Seleção de Atividades

[cite\_start]Baseado no algoritmo da página 33 [cite: 331-339].

```pseudocode
// S: lista de atividades (com início s_i e fim f_i)
FUNCTION ActivitySelection(S):
    
    // 1. Ordenar por tempo de término (f)
    s_ordenado = Sort(S, por f)
    // Armazena o passo: Atividades ordenadas por término
    
    A = {s_ordenado[0]} // Adiciona a primeira atividade
    j = 0 // Índice da última atividade selecionada
    // Armazena o passo: Selecionada atividade s_ordenado[0]
    
    // 2. Iterar e escolher
    FOR i = 1 TO n-1:
        // Armazena o passo: Verificando atividade s_ordenado[i]
        IF s_ordenado[i].inicio >= s_ordenado[j].fim THEN
            // É compatível
            A = A + {s_ordenado[i]}
            j = i
            // Armazena o passo: Atividade s_ordenado[i] selecionada
        ELSE
            // Armazena o passo: Atividade s_ordenado[i] rejeitada
    
    RETURN A
    
END FUNCTION
```

-----

### 2.2. Intercalação Ótima / Cod. Huffman

[cite\_start]Baseado no algoritmo da página 40 [cite: 432-443]. [cite\_start](A lógica é a mesma para Huffman, pág. 44 [cite: 483]).

```pseudocode
// v: vetor de nós (arquivos/caracteres) com seus tamanhos/frequências
FUNCTION OptimalMerge(v):
    
    h = new HeapMin()
    h.Build(v) // Constrói heap com todos os nós
    // Armazena o passo: Heap inicial construído
    
    // k é o número de nós iniciais
    FOR i = 1 TO k-1:
        no = new TreeNode()
        
        no.esq = h.ExtractMin()
        // Armazena o passo: Extraiu 'no.esq.valor'
        no.dir = h.ExtractMin()
        // Armazena o passo: Extraiu 'no.dir.valor'
        
        no.valor = no.esq.valor + no.dir.valor
        // Armazena o passo: Criou novo nó pai com valor 'no.valor'
        
        h.Insert(no)
        // Armazena o passo: Inseriu 'no.valor' de volta no heap
        
    // A raiz da árvore final é o último elemento no heap
    RETURN h.ExtractMin()
    
END FUNCTION
```

-----

## 3\. Programação Dinâmica

### 3.1. Moedas de Troco (PD)

[cite\_start]Baseado no algoritmo da página 54 [cite: 619-640].

```pseudocode
// moedas: vetor de moedas disponíveis
// troco: valor total
FUNCTION DPMakeChange(moedas, troco):

    quant = new Array(troco + 1)
    ultima = new Array(troco + 1)
    
    quant[0] = 0
    ultima[0] = 0
    // Armazena o passo: Inicialização quant[0] e ultima[0]

    FOR cents = 1 TO troco:
        // Solução provisória (todas de 1 centavo)
        quantProv = cents 
        ultProv = 1
        
        FOR j = 0 TO length(moedas)-1:
            // Tenta usar moeda[j]
            IF moedas[j] <= cents THEN
                // Se a solução usando esta moeda for melhor
                IF quant[cents - moedas[j]] + 1 < quantProv THEN
                    quantProv = quant[cents - moedas[j]] + 1
                    ultProv = moedas[j]

        quant[cents] = quantProv
        ultima[cents] = ultProv
        // Armazena o passo: Preenchida célula 'cents'. quant=quantProv, ultima=ultProv
        
    RETURN quant[troco]
    
END FUNCTION
```

-----

### 3.2. Encadeamento do Produto de Matrizes

[cite\_start]Baseado no algoritmo da página 64 [cite: 743-756].

```pseudocode
// d: vetor de dimensões (matriz A_i é d[i] x d[i+1])
// n: número de matrizes
FUNCTION MatrixChain(d, n):

    N = new Matrix(n, n) // Custo ótimo
    T = new Matrix(n, n) // Índice k da divisão
    
    FOR i = 0 TO n-1:
        N[i, i] = 0 // Custo de multiplicar uma matriz é 0
    // Armazena o passo: Diagonal principal de N preenchida com 0
    
    // b é o "tamanho" do subproblema (distância da diagonal)
    FOR b = 1 TO n-1:
        FOR i = 0 TO n-b-1:
            j = i + b
            N[i, j] = +infinity // Valor provisório
            
            // Testa todas as divisões k
            FOR k = i TO j-1:
                // Custo de (A_i...A_k) + (A_k+1...A_j) + custo da mult final
                x = N[i, k] + N[k+1, j] + d[i] * d[k+1] * d[j+1]
                
                IF x < N[i, j] THEN
                    N[i, j] = x
                    T[i, j] = k // Armazena o k que deu o melhor resultado
            
            // Armazena o passo: Preenchida célula N[i,j]=N[i,j] e T[i,j]=T[i,j]

    RETURN N[0, n-1]
    
END FUNCTION
```

-----

### 3.3. Maior Subsequência Comum (LCS)

[cite\_start]Baseado nos algoritmos das páginas 68-69 [cite: 783-802, 806-814].

```pseudocode
// X, Y: as duas strings
// m, n: comprimentos de X e Y
FUNCTION LCS(X, Y, m, n):

    c = new Matrix(m + 1, n + 1) // Comprimento
    trace = new Matrix(m + 1, n + 1) // Setas
    
    FOR i = 0 TO m: c[i, 0] = 0
    FOR j = 0 TO n: c[0, j] = 0
    // Armazena o passo: Linha 0 e Coluna 0 inicializadas com 0

    FOR i = 1 TO m:
        FOR j = 1 TO n:
            IF X[i] == Y[j] THEN
                c[i, j] = c[i-1, j-1] + 1
                trace[i, j] = "DIAGONAL"
            ELSE IF c[i-1, j] >= c[i, j-1] THEN
                c[i, j] = c[i-1, j]
                trace[i, j] = "CIMA"
            ELSE
                c[i, j] = c[i, j-1]
                trace[i, j] = "ESQUERDA"
            
            // Armazena o passo: Preenchida célula c[i,j]=c[i,j] e trace[i,j]

    RETURN c, trace
    
END FUNCTION

// Algoritmo para reconstruir a LCS
FUNCTION PrintLCS(trace, X, i, j):
    IF i == 0 OR j == 0 THEN
        RETURN
        
    // Armazena o passo: Verificando trace[i,j]
    IF trace[i, j] == "DIAGONAL" THEN
        PrintLCS(trace, X, i-1, j-1)
        print X[i] // Constrói a string da LCS
    ELSE IF trace[i, j] == "CIMA" THEN
        PrintLCS(trace, X, i-1, j)
    ELSE // "ESQUERDA"
        PrintLCS(trace, X, i, j-1)
END FUNCTION
```

-----

### 3.4. Problema da Mochila 0/1

[cite\_start]Baseado nos algoritmos das páginas 72 e 75 [cite: 841-850, 866-878].

```pseudocode
// w: vetor de pesos
// p: vetor de lucros
// n: número de itens
// c: capacidade da mochila
FUNCTION Knapsack01(w, p, n, c):

    B = new Matrix(n + 1, c + 1) // Lucro máximo
    
    FOR i = 0 TO c: B[0, i] = 0 // Linha 0 (0 itens)
    // Armazena o passo: Linha 0 preenchida com 0
    
    FOR k = 1 TO n: // Para cada item
        FOR i = 0 TO c: // Para cada capacidade
            
            IF w[k] > i THEN // Item k não cabe
                B[k, i] = B[k-1, i]
            ELSE // Item k cabe
                // Decide se é melhor pegar ou não pegar
                lucro_sem_pegar = B[k-1, i]
                lucro_pegando = B[k-1, i - w[k]] + p[k]
                B[k, i] = max(lucro_sem_pegar, lucro_pegando)
            
            // Armazena o passo: Preenchida célula B[k,i] = B[k,i]

    RETURN B[n, c]
    
END FUNCTION

// Algoritmo para encontrar os itens
FUNCTION VetorX(B, w, p, n, c):
    X = new Array(n + 1) // Vetor binário de itens
    r = c // Capacidade restante
    s = B[n, c] // Lucro corrente
    
    FOR i = n DOWNTO 1:
        // Armazena o passo: Verificando item 'i'
        IF B[i-1, r] == s THEN
            // Item 'i' não entrou na solução
            X[i] = 0
            // Armazena o passo: Item 'i' não foi pego
        ELSE
            // Item 'i' entrou
            X[i] = 1
            s = s - p[i]
            r = r - w[i]
            // Armazena o passo: Item 'i' foi pego
    
    RETURN X

END FUNCTION
```

-----

## 4\. Técnica Memoization

### 4.1. Fibonacci (Memoized)

[cite\_start]Baseado no algoritmo da página 78 [cite: 892-907].

```pseudocode
// m: vetor global (ou na classe) para memoization
GLOBAL m = new Array(N)

// Função principal que inicializa
FUNCTION Fibonacci_Setup(n):
    m[0] = 1
    m[1] = 1
    FOR i = 2 TO n:
        m[i] = -1 // Indica "não resolvido"
    
    // Armazena o passo: Vetor 'm' inicializado
    RETURN fib(n)

END FUNCTION

// Função recursiva com memoization
FUNCTION fib(n):
    // Armazena o passo: Chamada fib(n)
    
    IF m[n] < 0 THEN // Se não foi resolvido
        // Armazena o passo: m[n] = -1. Calculando...
        m[n] = fib(n-1) + fib(n-2)
        // Armazena o passo: m[n] calculado e salvo
    ELSE
        // Armazena o passo: m[n] já tem valor. Retornando valor salvo.
        
    RETURN m[n]
    
END FUNCTION
```

```
// Um vetor "caderno" para guardar os resultados.
// Ele será acessível pelas duas funções.
memo[]

//---
// Esta é a função "gerente" que o usuário chamaria.
// Ela prepara o "caderno" (vetor de memoização).
//---
ALGORITMO ResolverTroco(quantia_q, moedas_a)
    
    // 1. Aloca espaço para o caderno (de 0 até q)
    memo = novo_vetor_tamanho(quantia_q + 1)

    // 2. Inicializa o caderno com "não calculado" (-1)
    PARA i = 0 ATE quantia_q:
        memo[i] = -1                 [cite: 895, 897]

    // 3. Chama a função recursiva para fazer o trabalho
    RETORNE troco_recursivo(quantia_q, moedas_a)

//---
// Esta é a função "trabalhadora" recursiva, como pedido no exercício.
// Ela usa o "caderno" (memo) para ser eficiente.
//---
ALGORITMO troco_recursivo(q, a)

    // 4. Já está no caderno? [cite: 903]
    SE memo[q] != -1:
        RETORNE memo[q]              

    // --- Se não está no caderno, vamos calcular ---

    // 5. Caso Base: Troco de 0 é 0 moedas.
    SE q == 0:
        RETORNE 0
    
    // 6. Começa com um valor "infinito"
    quantidade_minima = INFINITO
    
    // 7. Tenta usar cada moeda disponível
    PARA CADA moeda EM a:
        
        // Só tenta se a quantia for maior ou igual à moeda
        SE q >= moeda:
            // 8. Chama recursivamente para o troco restante
            //    (1 moeda de agora + o troco para o que sobrou)
            res = 1 + troco_recursivo(q - moeda, a)
            
            // 9. Achamos um caminho melhor (com menos moedas)?
            SE res < quantidade_minima:
                quantidade_minima = res
    
    // 10. ANOTA no caderno antes de sair! 
    memo[q] = quantidade_minima
    
    // 11. Retorna o resultado encontrado
    RETORNE memo[q]
```