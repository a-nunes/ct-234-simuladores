## 🏛️ Estrutura dos Simuladores: Paradigmas de Programação

[cite_start]Aqui está uma proposta de divisão baseada nos algoritmos do seu material[cite: 5, 6].

### 1. Divisão-e-Conquista (Divide-and-Conquer)

[cite_start]Este paradigma divide o problema em subproblemas *análogos* e *disjuntos* (não sobrepostos), resolve-os recursivamente e combina os resultados[cite: 9, 13]. Os simuladores devem focar em visualizar essa divisão, as chamadas recursivas e a combinação.

#### 1.1. Busca Binária
* [cite_start]**Objetivo do Simulador:** Visualizar a redução do espaço de busca em um vetor ordenado[cite: 20, 21].
* **Componentes Principais (Input):** Um vetor ordenado `v` e um valor de busca `x`.
* **Passos da Simulação (Visualização):**
    1.  Mostrar o vetor completo.
    2.  [cite_start]Destacar os ponteiros `l`, `r` e o pivô `q = floor((l+r)/2)`[cite: 31].
    3.  [cite_start]Mostrar a comparação (`v[q] == x`, `v[q] > x`, ou `v[q] < x`)[cite: 32, 33].
    4.  "Desbotar" ou "riscar" a metade do vetor que foi descartada.
    5.  [cite_start]Repetir, mostrando os novos `l`, `r` e `q` na metade restante, até que `x` seja encontrado ou `r < l`[cite: 30, 34].

#### 1.2. Preenchimento com Treminós
* [cite_start]**Objetivo do Simulador:** Visualizar o preenchimento recursivo de um tabuleiro $2^n \times 2^n$ com um espaço vago[cite: 52, 53].
* **Componentes Principais (Input):** O tamanho `n` e a posição `(x, y)` do espaço vago.
* **Passos da Simulação (Visualização):**
    1.  Mostrar o grid $2^n \times 2^n$ com o espaço vago.
    2.  [cite_start]Mostrar a primeira divisão em 4 quadrantes[cite: 60, 61].
    3.  [cite_start]Visualizar a colocação do primeiro treminó no centro, "ocupando" um espaço em cada um dos 3 quadrantes que *não* tinham o espaço vago original[cite: 64, 67].
    4.  [cite_start]Agora, o simulador deve mostrar 4 subproblemas análogos (4 quadrantes menores, cada um com 1 espaço vago)[cite: 65, 66].
    5.  [cite_start]Repetir o processo visualmente (dividir e colocar o treminó central) em cada quadrante, até atingir o caso trivial $2 \times 2$[cite: 55, 69].

#### 1.3. Multiplicação de Inteiros (Karatsuba)
* [cite_start]**Objetivo do Simulador:** Comparar a abordagem padrão $\Theta(n^2)$ [cite: 88] [cite_start]com a otimização de Karatsuba $\Theta(n^{1.585})$[cite: 90, 106].
* **Componentes Principais (Input):** Dois números inteiros, `I` e `J`.
* **Passos da Simulação (Visualização):**
    1.  Mostrar `I` e `J`.
    2.  [cite_start]Mostrar a divisão em $I_h, I_l, J_h, J_l$[cite: 83, 84].
    3.  [cite_start]**Abordagem Padrão:** Mostrar as 4 multiplicações recursivas necessárias ($I_hJ_h$, $I_hJ_l$, $I_lJ_h$, $I_lJ_l$)[cite: 85].
    4.  [cite_start]**Abordagem Karatsuba:** Mostrar as 3 multiplicações recursivas[cite: 94]:
        * [cite_start]`X = Ih.Jh` [cite: 92]
        * [cite_start]`Y = Il.Jl` [cite: 92]
        * [cite_start]`Z = (Ih + Il).(Jh + Jl) - X - Y` [cite: 92]
    5.  [cite_start]Visualizar a combinação final: $I.J = X.2^n + Z.2^{n/2} + Y$ [cite: 93][cite_start], usando o exemplo da página 17 como guia [cite: 107-114].

#### 1.4. Multiplicação de Matrizes (Strassen)
* [cite_start]**Objetivo do Simulador:** Visualizar o cálculo das 7 multiplicações recursivas de Strassen, em vez das 8 da abordagem padrão[cite: 138, 161].
* **Componentes Principais (Input):** Duas matrizes $n \times n$, `A` e `B`.
* **Passos da Simulação (Visualização):**
    1.  Mostrar `A` e `B`.
    2.  Mostrar a divisão em 4 sub-matrizes cada ($A_{11}, A_{12} ... B_{22}$).
    3.  [cite_start]Mostrar o cálculo de cada uma das 7 matrizes intermediárias (P, Q, R, S, T, U, V), destacando as adições/subtrações de blocos necessárias *antes* das chamadas recursivas [cite: 150-165].
    4.  [cite_start]Mostrar a combinação final para formar as 4 matrizes de resultado ($C_{11}, C_{12}, C_{21}, C_{22}$) usando adições/subtrações de P a V[cite: 158, 160, 163, 166].

#### 1.5. Seleção do k-ésimo Elemento (Mediana das Medianas)
* [cite_start]**Objetivo do Simulador:** Visualizar o algoritmo de tempo linear $\Theta(n)$ para encontrar o k-ésimo menor elemento[cite: 219, 232].
* [cite_start]**Componentes Principais (Input):** Um vetor não ordenado e um valor `k`[cite: 180, 181].
* **Passos da Simulação (Visualização):**
    1.  Mostrar o vetor.
    2.  [cite_start]**Divisão:** Visualizar a divisão do vetor em grupos de 5 elementos[cite: 183, 206].
    3.  **Conquista (Medianas):** Mostrar o cálculo da mediana de cada grupo de 5.
    4.  [cite_start]**Conquista (Recursão):** Criar um novo vetor com essas medianas e chamar *recursivamente* o algoritmo para encontrar a mediana delas (o pivô `X`)[cite: 184, 189, 207].
    5.  [cite_start]**Partição:** Mostrar o vetor original sendo particionado em "menores que X" e "maiores que X" usando `X` como pivô[cite: 185, 210].
    6.  [cite_start]**Seleção:** Mostrar a verificação da posição `m` do pivô e a decisão de qual partição (a da esquerda, a da direita, ou o próprio pivô) contém o k-ésimo elemento, e então repetir o processo *apenas* nessa partição [cite: 215-217].

---

### 2. Método Guloso (Greedy)

[cite_start]Este paradigma faz escolhas locais que parecem ótimas no momento, na esperança de encontrar uma solução ótima global[cite: 10, 236]. [cite_start]Os simuladores devem focar na "escolha gulosa" em cada passo e, quando aplicável, mostrar os contraexemplos que falham[cite: 238].

#### 2.1. Seleção de Atividades
* [cite_start]**Objetivo do Simulador:** Encontrar o número máximo de atividades compatíveis[cite: 254].
* [cite_start]**Componentes Principais (Input):** Uma lista de atividades com tempo de início ($s_i$) e fim ($f_i$)[cite: 251].
* **Passos da Simulação (Visualização):**
    1.  Mostrar todas as atividades, talvez em um gráfico de tempo.
    2.  [cite_start]**Escolha Gulosa:** Selecionar a atividade com o **menor tempo de término ($f_i$)** [cite: 307-329].
    3.  [cite_start]Mostrar a ordenação das atividades por $f_i$[cite: 332].
    4.  Iterar pela lista ordenada:
        * [cite_start]Selecionar a primeira (atividade `j=1`)[cite: 332].
        * [cite_start]Para cada atividade `i` seguinte, verificar se $s_i \ge f_j$[cite: 334].
        * [cite_start]Se sim, selecionar `i`, marcá-la como a nova `j`, e destacá-la[cite: 337].
        * Se não, "ignorar" a atividade `i`.
    5.  No final, mostrar o subconjunto de atividades selecionadas.
    6.  [cite_start]*(Opcional, mas recomendado)* Ter abas para mostrar por que as outras escolhas gulosas (menor tempo de início, menor duração) falham, usando os contraexemplos dos slides [cite: 280-306].

#### 2.2. Intercalação Ótima de Arquivos / Codificação de Huffman
* [cite_start]**Objetivo do Simulador:** Construir a árvore binária ótima para minimizar o custo (seja de intercalação ou de bits)[cite: 393, 475]. [cite_start]A lógica é idêntica[cite: 474].
* [cite_start]**Componentes Principais (Input):** Uma lista de tamanhos de arquivos (ou frequências de caracteres)[cite: 392, 481].
* **Passos da Simulação (Visualização):**
    1.  Mostrar os nós (folhas) iniciais, cada um com seu "peso" (tamanho/frequência).
    2.  [cite_start]**Estrutura de Dados:** Mostrar uma "Fila de Prioridade (Min-Heap)" sendo populada com esses nós[cite: 396, 434, 435].
    3.  [cite_start]**Loop Guloso:** Em cada passo (repetir $k-1$ vezes)[cite: 436]:
        * [cite_start]`ExtractMin()`: Mostrar os dois nós com *menor* peso saindo da heap[cite: 438, 439].
        * [cite_start]`Merge`: Mostrar um novo nó "pai" sendo criado, com o peso sendo a soma dos filhos ($n_x + n_y$)[cite: 440, 483].
        * [cite_start]`Insert()`: Mostrar o novo nó "pai" sendo inserido de volta na heap[cite: 440].
    4.  [cite_start]O simulador deve mostrar a árvore sendo construída passo a passo, e o estado da heap a cada iteração, exatamente como no exemplo da página 39[cite: 397].
    5.  [cite_start]*(Para Huffman)*: Mostrar a árvore final com arestas rotuladas (0 para esquerda, 1 para direita) e a tabela de códigos resultante [cite: 484-487, 541].

#### 2.3. Moedas de Troco (Contraexemplo Guloso)
* **Objetivo do Simulador:** Demonstrar como o método guloso (nem sempre) falha.
* **Componentes Principais (Input):** Um conjunto de moedas e um valor de troco.
* **Passos da Simulação (Visualização):**
    1.  [cite_start]Usar o conjunto de moedas {1, 10, 25, 50} e troco de 30[cite: 571, 572].
    2.  **Simulação Gulosa:**
        * [cite_start]Escolher 25 (maior moeda $\le$ 30)[cite: 573]. Troco restante: 5.
        * Escolher 1 (maior moeda $\le$ 5). Troco restante: 4.
        * ... (Escolher 1, 1, 1, 1).
        * [cite_start]Resultado Guloso: 6 moedas (25, 1, 1, 1, 1, 1)[cite: 573].
    3.  [cite_start]Mostrar a Solução Ótima (que seria 10, 10, 10) para provar que a gulosa falhou[cite: 574].

---

### 3. Programação Dinâmica (Dynamic Programming)

[cite_start]Resolve subproblemas *análogos* e *sobrepostos*, armazenando suas soluções em uma tabela para evitar recálculo [cite: 11, 578-580]. [cite_start]Os simuladores *devem* focar no preenchimento da tabela, célula por célula, em ordem crescente (bottom-up)[cite: 579].

#### 3.1. Moedas de Troco (PD)
* **Objetivo do Simulador:** Encontrar a quantidade *mínima* de moedas usando PD.
* **Componentes Principais (Input):** Um conjunto de moedas e um valor de troco.
* **Passos da Simulação (Visualização):**
    1.  [cite_start]Mostrar os dois vetores: `quant[0..troco]` e `ultima[0..troco]`[cite: 617].
    2.  [cite_start]Inicializar `quant[0] = 0`[cite: 620].
    3.  [cite_start]**Loop Principal (Bottom-Up):** Iterar `cents` de 1 até `troco`[cite: 623].
        * [cite_start]Para cada `cents`, mostrar o loop interno `j` que testa cada moeda[cite: 628].
        * [cite_start]Mostrar a checagem: `quant[cents - moedas[j]] + 1`[cite: 630].
        * [cite_start]Mostrar o `quant[cents]` e `ultima[cents]` sendo preenchidos com a melhor opção encontrada[cite: 639].
    4.  [cite_start]O simulador deve permitir ao usuário avançar "célula por célula" da tabela, vendo o cálculo que levou àquele valor (ex: simulação da pág. 53 [cite: 617]).

#### 3.2. Encadeamento do Produto de Matrizes
* [cite_start]**Objetivo do Simulador:** Encontrar a "parentisação" ótima para minimizar o número de multiplicações [cite: 663-665].
* [cite_start]**Componentes Principais (Input):** Um vetor de dimensões `d` (onde $A_i$ é $d_i \times d_{i+1}$)[cite: 699, 738].
* **Passos da Simulação (Visualização):**
    1.  [cite_start]Mostrar as duas matrizes $n \times n$: `N` (custo) e `T` (índice `k` da divisão)[cite: 739, 740].
    2.  [cite_start]Inicializar a diagonal principal de `N` com 0s[cite: 745].
    3.  [cite_start]**Loop Principal:** A simulação *deve* preencher a matriz `N` *pelas diagonais* (controlado pelo loop `b=1..n-1`, o "tamanho" do subproblema)[cite: 721, 746].
    4.  [cite_start]Para cada célula `N[i, j]`, mostrar o loop interno `k=i..j-1` que testa todas as divisões possíveis[cite: 748].
    5.  [cite_start]Mostrar o cálculo $x = N[i, k] + N[k+1, j] + d_i d_{k+1} d_{j+1}$ para cada `k`[cite: 749].
    6.  [cite_start]Destacar o valor `x` mínimo, que é inserido em `N[i, j]`, e o `k` correspondente, inserido em `T[i, j]`[cite: 750, 751].

#### 3.3. Maior Subsequência Comum (LCS)
* [cite_start]**Objetivo do Simulador:** Encontrar o tamanho da LCS e reconstruir a subsequência[cite: 759].
* [cite_start]**Componentes Principais (Input):** Duas strings, `X` e `Y`[cite: 759].
* **Passos da Simulação (Visualização):**
    1.  [cite_start]Mostrar as strings e as duas matrizes: `c` (tamanho) e `trace` (setas)[cite: 778, 782].
    2.  [cite_start]Inicializar a linha 0 e coluna 0 com 0s [cite: 784-789].
    3.  [cite_start]**Loop Principal (Bottom-Up):** Iterar `i=1..m` e `j=1..n` [cite: 790-792].
        * Para cada célula `c[i, j]`:
        * [cite_start]Mostrar a comparação `x[i] == y[j]`[cite: 793].
        * [cite_start]**Se igual:** Mostrar o valor vindo da diagonal `c[i-1, j-1] + 1` e a seta "diagonal" sendo preenchida[cite: 794, 800].
        * [cite_start]**Se diferente:** Mostrar a comparação `c[i, j-1]` (esquerda) vs. `c[i-1, j]` (cima), o `max` sendo escolhido, e a seta "esquerda" ou "cima" sendo preenchida [cite: 795-799].
    4.  [cite_start]**Traceback:** Após a tabela `c` estar cheia, mostrar um "marcador" começando em `c[m, n]` e seguindo as setas da matriz `trace` de volta à origem para imprimir a LCS [cite: 805-814].

#### 3.4. Problema da Mochila (0/1 Knapsack)
* [cite_start]**Objetivo do Simulador:** Encontrar o lucro máximo para uma capacidade `c`[cite: 819].
* [cite_start]**Componentes Principais (Input):** Lista de itens (peso $w_i$, lucro $p_i$) e capacidade `c` [cite: 816-818].
* **Passos da Simulação (Visualização):**
    1.  [cite_start]Mostrar a tabela $B[n, c]$ (itens x capacidade)[cite: 826, 837].
    2.  [cite_start]Inicializar linha 0 (0 itens) com 0s[cite: 843].
    3.  [cite_start]**Loop Principal (Bottom-Up):** Iterar `k=1..n` (itens) e `i=0..c` (capacidade)[cite: 844, 846].
        * Para cada célula `B[k, i]`:
        * [cite_start]Mostrar a verificação se o item `k` cabe: `w[k] > i`[cite: 847].
        * [cite_start]**Se não cabe:** Mostrar o valor sendo copiado da linha de cima: $B[k, i] = B[k-1, i]$[cite: 847].
        * [cite_start]**Se cabe:** Mostrar o cálculo do `max`: $max( B[k-1, i]$ (não pegar), $B[k-1, i - w[k]] + p[k]$ (pegar) $)$[cite: 848].
    4.  [cite_start]O simulador deve preencher a tabela linha por linha, como no exemplo da página 73[cite: 854].
    5.  [cite_start]**Traceback:** Mostrar o algoritmo da página 75 para encontrar *quais* itens foram selecionados, percorrendo a tabela de `B[n, c]` de volta ao início [cite: 866-878].

---

### 4. Memoization (Técnica)

Para contrastar com PD, você pode ter um simulador que mostra a recursão com tabela.

#### 4.1. Fibonacci (Memoized)
* [cite_start]**Objetivo do Simulador:** Visualizar a recursão *top-down* e como a tabela (memo) evita recálculos [cite: 885-888].
* **Componentes Principais (Input):** Um número `n`.
* **Passos da Simulação (Visualização):**
    1.  [cite_start]Mostrar um vetor `m` (memo) inicializado com `-1` [cite: 893-897].
    2.  [cite_start]Mostrar a árvore de chamadas recursivas, começando por `fib(n)`[cite: 898].
    3.  Quando `fib(k)` é chamado:
        * **Se `m[k] < 0`:** A chamada continua (recursão). [cite_start]Ao retornar, o valor é escrito em `m[k]`[cite: 904, 905].
        * **Se `m[k] >= 0`:** A chamada *para* (poda). [cite_start]O valor de `m[k]` é retornado imediatamente, e essa sub-árvore inteira de recursão é "cortada"[cite: 905, 906].
    4.  O simulador deve destacar quais chamadas foram "puladas" (pruned) graças à memoization.

---

Essa estrutura cobre todos os algoritmos principais dos seus slides e foca no que é crucial para a simulação manual.

Posso ajudar a detalhar ainda mais algum desses algoritmos, se precisar.