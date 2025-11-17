Aqui está o plano de design visual detalhado para cada simulador, seguindo a estrutura que você solicitou.

---

## 1. Divisão-e-Conquista

### 1.1. Simulador: Busca Binária

1.  **Objetivo Pedagógico:** Compreender como a divisão-e-conquista reduz o espaço de busca pela metade a cada passo recursivo.
2.  **Componentes da Interface (UI):**
    * **Visualização do Array:** Uma fileira de caixas, cada uma contendo um número do vetor ordenado `v`.
    * **Ponteiros:** Marcadores visuais (setas ou colchetes) para `l` (limite esquerdo), `r` (limite direito) e `q` (pivô).
    * **Input:** Campo para o valor `x` a ser buscado.
    * **Janela de Recursão (Call Stack):** Mostra a pilha de chamadas (ex: `BinarySearch(l=0, r=7, x=10)`).
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * **Início:** O array `v` é exibido. A chamada `BinarySearch(0, n-1, x)` é adicionada à Call Stack. Ponteiros `l` e `r` apontam para os extremos do array.
    * [cite_start]**Próximo Passo:** O ponteiro `q` é calculado e aponta para `floor((l+r)/2)`[cite: 31]. A caixa `v[q]` é destacada.
    * [cite_start]**Próximo Passo:** O valor `v[q]` é comparado com `x`[cite: 32]. A comparação é exibida (ex: "Comparando `v[q]=15` com `x=10`").
    * **Próximo Passo (Se `v[q] > x`):** A metade direita (`q` até `r`) do array é "esmaecida" (fade-out). [cite_start]O ponteiro `r` se move para `q-1`[cite: 33]. Uma nova chamada `BinarySearch(l, q-1, x)` é "puxada" para o topo da Call Stack (ou a atual é atualizada).
    * **Próximo Passo (Se `v[q] < x`):** A metade esquerda (`l` até `q`) é esmaecida. [cite_start]O ponteiro `l` se move para `q+1`[cite: 34]. Uma nova chamada `BinarySearch(q+1, r, x)` é iniciada.
    * **Próximo Passo (Se `v[q] == x`):** A caixa `q` é destacada em verde. Fim da simulação.
    * **Próximo Passo (Se `r < l`):** O array inteiro é destacado em vermelho. [cite_start]Fim da simulação (não encontrado)[cite: 30].
5.  **Painel de Estado:**
    * `l`: (valor atual)
    * `r`: (valor atual)
    * `q`: (valor atual)
    * `v[q]`: (valor do pivô)
    * `x`: (valor buscado)
    * Pilha de Chamadas (Call Stack)

---

### 1.2. Simulador: Preenchimento com Treminós

1.  **Objetivo Pedagógico:** Visualizar como um problema de divisão-e-conquista transforma um problema em 4 subproblemas análogos menores.
2.  **Componentes da Interface (UI):**
    * **Visualização do Tabuleiro:** Uma grade $2^n \times 2^n$ (ex: $8 \times 8$). A célula vaga é destacada.
    * **Janela de Recursão (Call Stack):** Essencial para mostrar a profundidade das chamadas.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * **Início:** Um tabuleiro $2^n \times 2^n$ é mostrado com uma célula vaga destacada.
    * [cite_start]**Próximo Passo:** O tabuleiro é dividido visualmente em 4 quadrantes (linhas tracejadas aparecem)[cite: 60].
    * [cite_start]**Próximo Passo:** Um treminó é colocado no centro, "criando" uma vaga em cada um dos 3 quadrantes que não tinham a vaga original[cite: 64]. O treminó central é destacado.
    * **Próximo Passo:** O simulador "dá zoom" ou destaca o primeiro quadrante (Q1). Uma nova chamada `SolveTromino(n-1, ...)` é adicionada à Call Stack.
    * **Próximo Passo:** O processo se repete: Q1 é dividido em 4 sub-quadrantes.
    * **Próximo Passo:** Um treminó central é colocado em Q1.
    * **... (Repete recursivamente) ...**
    * [cite_start]**Próximo Passo (Caso Base n=1):** O simulador foca num quadrante $2 \times 2$ com 1 vaga[cite: 55]. Um único treminó é colocado para preenchê-lo.
    * **Próximo Passo:** A chamada da Call Stack é "desempilhada" (pop). O simulador foca no próximo quadrante pendente (ex: Q2) e repete o processo.
5.  **Painel de Estado:**
    * `n` (tamanho atual do sub-problema)
    * `Posição da Vaga`: (x, y)
    * Pilha de Chamadas (Call Stack)

---

### 1.3. Simulador: Multiplicação de Karatsuba

1.  [cite_start]**Objetivo Pedagógico:** Compreender como Karatsuba reduz de 4 para 3 o número de multiplicações recursivas necessárias[cite: 94].
2.  **Componentes da Interface (UI):**
    * **Inputs:** `I` e `J` (os dois números).
    * **Área de Cálculo:** Mostra os valores intermediários.
    * **Janela de Recursão (Call Stack):** Mostra as chamadas recursivas.
    * [cite_start]**Abas (Opcional):** Uma aba para "Algoritmo $\Theta(n^2)$" [cite: 88] [cite_start]e outra para "Karatsuba $\Theta(n^{1.585})$" [cite: 106] para comparação.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo) - (Foco em Karatsuba):**
    * **Início:** Números `I` e `J` são exibidos.
    * [cite_start]**Próximo Passo:** `I` e `J` são divididos em `Ih`, `Il`, `Jh`, `Jl`[cite: 83]. Ex: $I = 5791 \rightarrow Ih=57, Il=91$.
    * **Próximo Passo:** Inicia o cálculo de `X = Ih * Jh`. Uma chamada `Karatsuba(Ih, Jh)` é adicionada à Call Stack.
    * **... (Após recursão) ...**
    * [cite_start]**Próximo Passo:** O valor de `X` é exibido na Área de Cálculo[cite: 110].
    * **Próximo Passo:** Inicia o cálculo de `Y = Il * Jl`. Uma chamada `Karatsuba(Il, Jl)` é adicionada à Call Stack.
    * **... (Após recursão) ...**
    * [cite_start]**Próximo Passo:** O valor de `Y` é exibido[cite: 111].
    * **Próximo Passo:** Calcula `(Ih + Il)` e `(Jh + Jl)`.
    * **Próximo Passo:** Inicia o cálculo de `Z_temp = (Ih + Il) * (Jh + Jl)`. Uma chamada `Karatsuba(...)` é adicionada à Call Stack.
    * **... (Após recursão) ...**
    * [cite_start]**Próximo Passo:** Calcula `Z = Z_temp - X - Y`[cite: 92].
    * [cite_start]**Próximo Passo:** Mostra a combinação final: `Resultado = X.2^n + Z.2^(n/2) + Y`[cite: 93, 114].
5.  **Painel de Estado:**
    * `Ih`, `Il`, `Jh`, `Jl`
    * `X` (calculado)
    * `Y` (calculado)
    * `Z` (calculado)
    * Pilha de Chamadas

---

### 1.4. Simulador: Multiplicação de Strassen

1.  [cite_start]**Objetivo Pedagógico:** Visualizar as 7 multiplicações recursivas e as 18 adições/subtrações que compõem o algoritmo de Strassen[cite: 161, 164].
2.  **Componentes da Interface (UI):**
    * **Matrizes de Input:** Duas grades $n \times n$ para `A` e `B`.
    * **Matrizes de Resultado:** Quatro grades $n/2 \times n/2$ para `C11`, `C12`, `C21`, `C22`.
    * **Área de Cálculo (P-V):** Sete grades $n/2 \times n/2$ para $P, Q, R, S, T, U, V$.
    * **Janela de Recursão (Call Stack):** Essencial para as 7 chamadas.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * **Início:** Mostra `A` e `B`.
    * **Próximo Passo:** Mostra a divisão de `A` e `B` em sub-matrizes ($A_{11}$, $A_{12}$, etc.).
    * **Próximo Passo:** Inicia o cálculo de `P`. Mostra a adição `(A11 + A22)` e `(B11 + B22)`.
    * [cite_start]**Próximo Passo:** Adiciona `Strassen(A11+A22, B11+B22)` à Call Stack[cite: 150].
    * **... (Após recursão) ...**
    * **Próximo Passo:** A matriz `P` é preenchida na Área de Cálculo.
    * **Próximo Passo:** Inicia o cálculo de `Q`. Mostra a adição `(A21 + A22)`.
    * [cite_start]**Próximo Passo:** Adiciona `Strassen(A21+A22, B11)` à Call Stack[cite: 153].
    * **... (Repete para Q, R, S, T, U, V) ...**
    * **Próximo Passo:** Após todas as 7 matrizes $P-V$ serem calculadas, inicia a combinação.
    * [cite_start]**Próximo Passo:** Mostra o cálculo de `C11 = P + S - T + V`[cite: 158]. A matriz `C11` é preenchida.
    * [cite_start]**Próximo Passo:** Mostra o cálculo de `C12 = R + T`[cite: 160]. A matriz `C12` é preenchida.
    * [cite_start]**Próximo Passo:** Mostra o cálculo de `C21 = Q + S`[cite: 163]. A matriz `C21` é preenchida.
    * [cite_start]**Próximo Passo:** Mostra o cálculo de `C22 = P + R - Q + U`[cite: 166]. A matriz `C22` é preenchida.
5.  **Painel de Estado:**
    * Pilha de Chamadas
    * Matrizes $P, Q, R, S, T, U, V$ (com status: pendente ou calculado)
    * Matrizes $C_{11}, C_{12}, C_{21}, C_{22}$

---

### 1.5. Simulador: Seleção do k-ésimo Elemento

1.  [cite_start]**Objetivo Pedagógico:** Entender como a escolha de um "bom" pivô (Mediana das Medianas) garante desempenho linear[cite: 232].
2.  **Componentes da Interface (UI):**
    * **Visualização do Array:** Um array `V` de caixas.
    * **Área de Grupos:** Mostra os grupos de 5 elementos.
    * **Array de Medianas:** Um novo array menor para as medianas.
    * **Janela de Recursão (Call Stack):** Mostra as chamadas `Select(...)`.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * **Início:** Mostra o array `V` e o valor `k`. Adiciona `Select(V, k)` à Call Stack.
    * [cite_start]**Próximo Passo:** Divide o array `V` em grupos de 5. Caixas visuais são desenhadas ao redor deles[cite: 206].
    * [cite_start]**Próximo Passo:** Encontra a mediana do primeiro grupo (ex: ordenando-o visualmente) e a move para o "Array de Medianas"[cite: 206].
    * **... (Repete para todos os grupos) ...**
    * [cite_start]**Próximo Passo:** Adiciona uma nova chamada `Select(Array_Medianas, ...)` à Call Stack para encontrar o pivô `X`[cite: 207].
    * **... (Após recursão) ...**
    * **Próximo Passo:** O valor do pivô `X` é retornado e exibido.
    * [cite_start]**Próximo Passo:** O array `V` original é particionado em "Menores que X", "X" e "Maiores que X"[cite: 210].
    * [cite_start]**Próximo Passo:** O tamanho `m` da partição "Menores" é contado[cite: 212].
    * **Próximo Passo (Se `k <= m`):** A partição "Maiores" e "X" são esmaecidas. [cite_start]Adiciona `Select(Menores, k)` à Call Stack[cite: 215].
    * **Próximo Passo (Se `k > m+1`):** A partição "Menores" e "X" são esmaecidas. [cite_start]Adiciona `Select(Maiores, k-m-1)` à Call Stack[cite: 217].
    * **Próximo Passo (Se `k == m+1`):** O pivô `X` é destacado em verde. [cite_start]Fim da simulação[cite: 216].
5.  **Painel de Estado:**
    * `k` (k-ésimo buscado)
    * Pilha de Chamadas
    * `Array_Medianas` (construído)
    * `X` (Pivô/Mediana das Medianas)
    * `m` (Tamanho da partição dos menores)

---

## 2. Método Guloso

### 2.1. Simulador: Seleção de Atividades

1.  [cite_start]**Objetivo Pedagógico:** Compreender que a escolha gulosa "menor tempo de término" sempre produz uma solução ótima [cite: 341-359].
2.  **Componentes da Interface (UI):**
    * **Lista de Atividades:** Uma tabela (id, $s_i$, $f_i$).
    * **Visualização em Timeline:** Um gráfico de barras horizontais mostrando a duração de cada atividade.
    * **Conjunto Solução `A`:** Uma lista para as atividades selecionadas.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * **Início:** Mostra a lista de atividades e a timeline.
    * [cite_start]**Próximo Passo:** A lista de atividades é reordenada pela coluna $f_i$ (tempo de término)[cite: 332].
    * **Próximo Passo:** A primeira atividade da lista ordenada (a que termina mais cedo) é selecionada. É adicionada à "Solução `A`" e destacada na timeline. [cite_start]`j` é definido para esta atividade[cite: 332].
    * **Próximo Passo:** O simulador avança para a próxima atividade `i` na lista.
    * **Próximo Passo:** Mostra a verificação: `s_i >= f_j`? (Ex: "Verificando se `s_i=5` é $\ge$ `f_j=4`") [cite_start][cite: 334].
    * **Próximo Passo (Se Verdadeiro):** A atividade `i` é compatível. [cite_start]Ela é adicionada à "Solução `A`" [cite: 337] e destacada na timeline. [cite_start]O ponteiro `j` agora aponta para `i`[cite: 337].
    * **Próximo Passo (Se Falso):** A atividade `i` não é compatível. Ela é esmaecida na lista e na timeline.
    * **... (Repete para todas as atividades `i`) ...**
    * **Próximo Passo:** A "Solução `A`" final é exibida.
5.  **Painel de Estado:**
    * `j` (Índice da última atividade adicionada)
    * `i` (Índice da atividade sendo testada)
    * `f_j` (Tempo de término da última selecionada)
    * `s_i` (Tempo de início da atividade testada)
    * `A` (Conjunto de atividades na solução)

---

### 2.2. Simulador: Intercalação Ótima / Cod. Huffman

1.  [cite_start]**Objetivo Pedagógico:** Visualizar como a combinação gulosa dos dois menores elementos (usando uma heap) constrói uma árvore de custo mínimo[cite: 395].
2.  **Componentes da Interface (UI):**
    * **Visualização da Heap:** Uma `Min-Heap` (fila de prioridade) mostrando os nós e seus pesos/frequências.
    * **Área de Construção da Árvore:** Espaço onde a árvore binária será montada.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * [cite_start]**Início:** Os nós (folhas) iniciais são mostrados (ex: 5, 10, 20, 30, 30) [cite: 398-401].
    * [cite_start]**Próximo Passo:** Todos os nós são inseridos na `Min-Heap`[cite: 435].
    * **Próximo Passo:** `h.ExtractMin()` é chamado. [cite_start]O nó com menor valor (ex: 5) é removido da heap e movido para a Área de Construção[cite: 438].
    * **Próximo Passo:** `h.ExtractMin()` é chamado. [cite_start]O nó com o próximo menor valor (ex: 10) é removido da heap e movido[cite: 439].
    * **Próximo Passo:** Um novo nó pai é criado. [cite_start]Seu valor é a soma dos filhos (ex: $5+10=15$)[cite: 440]. O novo nó é ligado aos seus filhos na Área de Construção.
    * [cite_start]**Próximo Passo:** O novo nó pai (15) é inserido de volta na `Min-Heap`[cite: 440].
    * **... (Repete o processo) ...**
    * **Próximo Passo:** `h.ExtractMin()` (ex: 15), `h.ExtractMin()` (ex: 20).
    * **Próximo Passo:** Cria nó pai (35).
    * **Próximo Passo:** Insere (35) na heap.
    * **... (Até que reste apenas 1 nó na heap) ...**
    * [cite_start]**Próximo Passo:** `h.ExtractMin()` é chamado pela última vez[cite: 441]. Esta é a raiz da árvore. A árvore final é destacada.
5.  **Painel de Estado:**
    * Conteúdo da `Min-Heap`
    * Nó extraído 1 (ex: `no.esq`)
    * Nó extraído 2 (ex: `no.dir`)
    * Novo nó pai (ex: `no.valor`)

---

## 3. Programação Dinâmica

### 3.1. Simulador: Moedas de Troco (PD)

1.  **Objetivo Pedagógico:** Compreender o preenchimento *bottom-up* de uma tabela onde cada célula `quant[i]` depende de soluções menores já calculadas.
2.  **Componentes da Interface (UI):**
    * **Array `quant`:** Um array de `0` até `troco`.
    * **Array `ultima`:** Um array de `0` até `troco` (mostra qual moeda foi usada).
    * **Lista de Moedas:** Ex: {1, 5, 10}.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * **Início:** Mostra os arrays `quant` e `ultima`. [cite_start]`quant[0]` é 0[cite: 620].
    * **Próximo Passo:** Foca na célula `cents = 1`.
    * **Próximo Passo:** Inicia o loop `j` (moedas). Testa `moeda=1`. Calcula: `quant[1 - 1] + 1 = quant[0] + 1 = 1`. `quantProv` vira 1. `ultProv` vira 1.
    * **Próximo Passo:** Testa `moeda=5`. `5 > 1`. [cite_start]Ignora[cite: 629].
    * **Próximo Passo:** Testa `moeda=10`. `10 > 1`. Ignora.
    * **Próximo Passo:** Loop `j` termina. `quant[1]` = 1, `ultima[1]` = 1.
    * **... (Repete para `cents = 2, 3, 4`) ...**
    * **Próximo Passo:** Foca na célula `cents = 5`.
    * [cite_start]**Próximo Passo:** `quantProv` inicial é 5 (usando moeda 1)[cite: 625]. `ultProv` = 1.
    * **Próximo Passo:** Testa `moeda=1`. Cálculo: `quant[5 - 1] + 1 = quant[4] + 1`. (Assumindo `quant[4]=4`), o resultado é 5. `quantProv` continua 5.
    * **Próximo Passo:** Testa `moeda=5`. [cite_start]Cálculo: `quant[5 - 5] + 1 = quant[0] + 1 = 1`[cite: 630].
    * **Próximo Passo:** `1 < 5`. [cite_start]Atualiza: `quantProv = 1`, `ultProv = 5` [cite: 632-634].
    * **Próximo Passo:** Testa `moeda=10`. `10 > 5`. Ignora.
    * **Próximo Passo:** Loop `j` termina. `quant[5]` = 1, `ultima[5]` = 5.
    * **... (Repete até `cents = troco`) ...**
5.  **Painel de Estado:**
    * `cents` (Célula atual sendo calculada)
    * `j` (Moeda atual sendo testada)
    * `quantProv` (Melhor valor até agora para `cents`)
    * `ultProv` (Moeda usada para o melhor valor)
    * Array `quant` (preenchido)

---

### 3.2. Simulador: Encadeamento do Produto de Matrizes

1.  [cite_start]**Objetivo Pedagógico:** Visualizar o preenchimento da tabela de custos `N` pelas diagonais, representando subproblemas de tamanho crescente[cite: 721].
2.  **Componentes da Interface (UI):**
    * **Matriz `N` (Custo):** Uma matriz $n \times n$.
    * [cite_start]**Matriz `T` (Divisão):** Uma matriz $n \times n$ para armazenar o `k` ótimo[cite: 751].
    * **Vetor de Dimensões `d`:** Ex: `d = {5, 4, 1, 3, 7, 2}`.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * **Início:** Mostra as matrizes `N` e `T` e o vetor `d`.
    * [cite_start]**Próximo Passo:** Preenche a diagonal principal `N[i,i]` com 0[cite: 745].
    * **Próximo Passo:** Inicia o loop `b = 1` (tamanho do subproblema).
    * **Próximo Passo:** Foca na célula `N[0, 1]` (onde `i=0, j=1`).
    * **Próximo Passo:** Testa `k = i = 0`. [cite_start]Calcula `x = N[0,0] + N[1,1] + d[0]*d[1]*d[2]`[cite: 749]. (Ex: $0 + 0 + 5*4*1 = 20$).
    * **Próximo Passo:** `N[0,1]` = 20, `T[0,1]` = 0.
    * **Próximo Passo:** Foca na célula `N[1, 2]`. ... (Repete para toda a diagonal `b=1`).
    * **Próximo Passo:** Inicia o loop `b = 2`.
    * **Próximo Passo:** Foca na célula `N[0, 2]` (onde `i=0, j=2`). [cite_start]`N[0,2]` = $\infty$[cite: 747].
    * **Próximo Passo:** Testa `k = 0`. Calcula `x1 = N[0,0] + N[1,2] + d[0]*d[1]*d[3]`. (Ex: $0 + 12 + 5*4*3 = 72$). `N[0,2]` = 72, `T[0,2]` = 0.
    * **Próximo Passo:** Testa `k = 1`. Calcula `x2 = N[0,1] + N[2,2] + d[0]*d[2]*d[3]`. (Ex: $20 + 0 + 5*1*3 = 35$).
    * **Próximo Passo:** `35 < 72`. [cite_start]Atualiza `N[0,2]` = 35, `T[0,2]` = 1 [cite: 750-751].
    * **... (Repete para todas as células, diagonal por diagonal) ...**
    * [cite_start]**Próximo Passo:** A célula `N[0, n-1]` é preenchida e destacada como a solução final[cite: 755].
5.  **Painel de Estado:**
    * `b` (Tamanho do subproblema / Diagonal atual)
    * `(i, j)` (Célula atual)
    * `k` (Divisão `k` sendo testada)
    * `x` (Custo para o `k` atual)
    * `N[i,j]` (Custo mínimo atual para esta célula)

---

### 3.3. Simulador: Maior Subsequência Comum (LCS)

1.  [cite_start]**Objetivo Pedagógico:** Entender como preencher a tabela `c` e `trace` e depois usar o `trace` para reconstruir a solução[cite: 805].
2.  **Componentes da Interface (UI):**
    * **Inputs:** Strings `X` e `Y`.
    * **Matriz `c` (Comprimento):** Grade $(m+1) \times (n+1)$.
    * **Matriz `trace` (Setas):** Grade $(m+1) \times (n+1)$ que conterá setas (↖, ↑, ←).
    * **Visualização da LCS:** Espaço onde a LCS é construída.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * **Início:** Mostra `X` (colunas) e `Y` (linhas) e as matrizes.
    * [cite_start]**Próximo Passo:** Preenche a linha 0 e coluna 0 da matriz `c` com 0s [cite: 784-789].
    * **Próximo Passo:** Foca na célula `c[1, 1]`.
    * **Próximo Passo:** Compara `X[1]` e `Y[1]`.
    * **Próximo Passo (Se `X[1] == Y[1]`):** `c[1,1]` recebe `c[0,0] + 1`. [cite_start]A seta `↖` é desenhada em `trace[1,1]` [cite: 793-794, 800].
    * [cite_start]**Próximo Passo (Se `X[1] != Y[1]`):** Compara `c[0,1]` (cima) e `c[1,0]` (esquerda)[cite: 795].
    * **Próximo Passo (Se `cima >= esquerda`):** `c[1,1]` recebe `c[0,1]`. [cite_start]A seta `↑` é desenhada em `trace[1,1]` [cite: 796-797].
    * **Próximo Passo (Se `esquerda > cima`):** `c[1,1]` recebe `c[1,0]`. [cite_start]A seta `←` é desenhada em `trace[1,1]` [cite: 798-799].
    * **... (Repete para todas as células, preenchendo linha por linha) ...**
    * **Próximo Passo (Início do Traceback):** Um marcador é colocado em `c[m,n]`.
    * **Próximo Passo:** O marcador segue a seta em `trace[m,n]`.
    * [cite_start]**Próximo Passo (Se a seta é `↖`):** O caractere `X[i]` é adicionado ao início da "Visualização da LCS"[cite: 811]. O marcador move-se para `(i-1, j-1)`.
    * [cite_start]**Próximo Passo (Se a seta é `↑`):** O marcador move-se para `(i-1, j)`[cite: 812].
    * **Próximo Passo (Se a seta é `←`):** O marcador move-se para `(i, j-1)`.
    * **... (Repete até o marcador chegar em `[0,0]`) ...**
5.  **Painel de Estado:**
    * `(i, j)` (Célula atual)
    * `X[i]` vs `Y[j]` (Comparação)
    * `c[i-1, j-1]`, `c[i-1, j]`, `c[i, j-1]` (Valores consultados)
    * `LCS` (sendo construída)

---

### 3.4. Simulador: Problema da Mochila 0/1

1.  **Objetivo Pedagógico:** Visualizar a construção da tabela de lucro $B[k,w]$, onde cada célula decide se "pegar" o item `k` é melhor do que "não pegar".
2.  **Componentes da Interface (UI):**
    * **Lista de Itens:** Tabela (id, $w_i$, $p_i$).
    * **Input:** Capacidade `c`.
    * **Matriz `B` (Lucro):** Grade $(n+1) \times (c+1)$.
    * **Visualização da Solução:** Lista de itens selecionados.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * **Início:** Mostra a lista de itens, `c`, e a matriz `B`.
    * [cite_start]**Próximo Passo:** Preenche a linha 0 (0 itens) da matriz `B` com 0s[cite: 843].
    * **Próximo Passo:** Inicia o loop `k = 1` (foco no item 1).
    * **Próximo Passo:** Foca na célula `B[1, 0]` (item 1, capacidade 0). `B[1,0] = 0`.
    * **Próximo Passo:** Foca na célula `B[1, 1]` (item 1, capacidade 1).
    * [cite_start]**Próximo Passo:** Verifica se `w[1] > 1` (peso do item 1 > capacidade atual)[cite: 847].
    * [cite_start]**Próximo Passo (Se `w[1] > i` - Não cabe):** `B[1,1]` recebe o valor de cima, `B[0,1]`[cite: 847].
    * [cite_start]**Próximo Passo (Se `w[1] <= i` - Cabe):** Calcula as duas opções[cite: 848]:
        * `lucro_sem_pegar = B[k-1, i]` (valor da célula de cima)
        * `lucro_pegando = B[k-1, i - w[k]] + p[k]`
    * [cite_start]**Próximo Passo:** `B[k,i]` recebe `max(lucro_sem_pegar, lucro_pegando)`[cite: 848].
    * **... (Repete para todas as células, preenchendo linha por linha) ...**
    * **Próximo Passo (Início do Traceback):** Um marcador é colocado em `B[n,c]`. [cite_start]`r=c`, `s=B[n,c]`[cite: 867, 869].
    * [cite_start]**Próximo Passo:** Compara `s` com `B[i-1, r]` (valor de cima)[cite: 870].
    * [cite_start]**Próximo Passo (Se `s == B[i-1, r]`):** Item `i` não foi pego[cite: 871]. O marcador move-se para `(i-1, r)`.
    * [cite_start]**Próximo Passo (Se `s != B[i-1, r]`):** Item `i` foi pego[cite: 873]. É adicionado à "Visualização da Solução". [cite_start]Atualiza `s -= p[i]` e `r -= w[i]`[cite: 874, 875]. O marcador move-se para `(i-1, r)`.
    * **... (Repete até a linha 0) ...**
5.  **Painel de Estado:**
    * `(k, i)` (Célula atual [item, capacidade])
    * `w[k]`, `p[k]` (Item sendo considerado)
    * `lucro_sem_pegar` (Valor de `B[k-1, i]`)
    * `lucro_pegando` (Valor de `B[k-1, i-w[k]] + p[k]`)
    * `(r, s)` (Durante o traceback)

---

## 4. Técnica Memoization

### 4.1. Simulador: Fibonacci (Memoized)

1.  [cite_start]**Objetivo Pedagógico:** Diferenciar a recursão pura (com recálculo) da memoization (top-down com cache), que evita recálculo [cite: 887-888].
2.  **Componentes da Interface (UI):**
    * **Array `m` (Memo):** Um array de `0` até `n`, inicializado com -1.
    * **Janela de Recursão (Call Stack):** Mostra a pilha de chamadas `fib(n)`.
3.  **Controles de Interação:** "Resetar", "Passo Anterior", "Próximo Passo".
4.  **Lógica do Simulador (Passo a Passo):**
    * [cite_start]**Início:** Mostra o array `m` com `m[0]=1, m[1]=1` e o resto -1 [cite: 893-895].
    * **Próximo Passo:** `fib(n)` é chamado (ex: `fib(4)`). `fib(4)` é adicionado à Call Stack.
    * **Próximo Passo:** Verifica `m[4]`. [cite_start]É -1 (não resolvido)[cite: 905].
    * **Próximo Passo:** `fib(4)` chama `fib(3)`. `fib(3)` é adicionado à Call Stack.
    * **Próximo Passo:** Verifica `m[3]`. É -1.
    * **Próximo Passo:** `fib(3)` chama `fib(2)`. `fib(2)` é adicionado à Call Stack.
    * **Próximo Passo:** Verifica `m[2]`. É -1.
    * **Próximo Passo:** `fib(2)` chama `fib(1)`. `fib(1)` é adicionado à Call Stack.
    * **Próximo Passo:** Verifica `m[1]`. [cite_start]**É 1!** [cite: 905] (cache hit).
    * **Próximo Passo:** `fib(1)` retorna 1. `fib(1)` é "desempilhado" (pop) da Call Stack.
    * **Próximo Passo:** `fib(2)` chama `fib(0)`. `fib(0)` é adicionado à Call Stack.
    * **Próximo Passo:** Verifica `m[0]`. **É 1!** (cache hit).
    * **Próximo Passo:** `fib(0)` retorna 1. `fib(0)` é desempilhado.
    * **Próximo Passo:** `fib(2)` calcula $1 + 1 = 2$.
    * [cite_start]**Próximo Passo:** `m[2]` é atualizado para 2[cite: 904]. `fib(2)` retorna 2 e é desempilhado.
    * **Próximo Passo:** `fib(3)` chama `fib(1)`. `fib(1)` é adicionado à Call Stack.
    * **Próximo Passo:** Verifica `m[1]`. **É 1!** (cache hit).
    * **Próximo Passo:** `fib(1)` retorna 1 e é desempilhado.
    * **Próximo Passo:** `fib(3)` calcula $2 + 1 = 3$. `m[3]` é atualizado para 3. `fib(3)` é desempilhado.
    * **Próximo Passo:** `fib(4)` chama `fib(2)`. `fib(2)` é adicionado à Call Stack.
    * **Próximo Passo:** Verifica `m[2]`. **É 2!** (GRANDE cache hit, pula toda a sub-árvore `fib(1)+fib(0)`).
    * **Próximo Passo:** `fib(2)` retorna 2 e é desempilhado.
    * **Próximo Passo:** `fib(4)` calcula $3 + 2 = 5$. `m[4]` é atualizado para 5. Fim.
5.  **Painel de Estado:**
    * `n` (sendo calculado)
    * `m[n]` (Valor no cache)
    * Pilha de Chamadas (Call Stack)
    * Array `m` (estado do cache)