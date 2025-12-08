#### Módulo 1: Ordenação Elementar (O Básico)

Foco na manipulação direta de índices e trocas adjacentes.

  * **Bubble Sort:**
      * [cite\_start]*Lógica:* Comparação de vizinhos e "flutuação" do maior elemento[cite: 787].
      * [cite\_start]*Visualização Crítica:* Destacar o par `(j, j+1)` e a região "já ordenada" no final do vetor (`n-i`)[cite: 848].
  * **Selection Sort:**
      * [cite\_start]*Lógica:* Busca do menor elemento (`min`) e troca com a posição inicial `i`[cite: 856].
      * [cite\_start]*Visualização Crítica:* Manter um ponteiro fixo em `i`, um ponteiro de varredura `j`, e um destaque especial para o índice `min` atual[cite: 864].
  * **Insertion Sort:**
      * *Lógica:* Comparação com o "baralho" à esquerda. [cite\_start]O elemento "sai" do vetor (copia para `x`) e os maiores deslizam para a direita[cite: 878].
      * [cite\_start]*Visualização Crítica:* Visualizar o valor `x` (pivô de inserção) "flutuando" acima do array enquanto o loop interno `j` desloca os elementos[cite: 1021].

#### Módulo 2: Estruturas de Heap (Árvores em Vetores)

Este é o mais complexo visualmente, pois exige dupla representação.

  * **Heap Sort:**
      * [cite\_start]*Lógica:* `Build` (construção via `Sift` da metade para o início) + Remoção sucessiva da raiz[cite: 241, 97].
      * *Visualização Crítica:*
        1.  **View Dupla:** Mostrar o Vetor Linear e a Árvore Binária simultaneamente. [cite\_start]As interações na árvore devem refletir no vetor[cite: 21, 51].
        2.  [cite\_start]**Sift (Peneira):** Destacar o caminho de descida de um nó que perdeu a propriedade estrutural (troca com o maior filho)[cite: 68].

#### Módulo 3: Divisão e Conquista (Recursividade)

O desafio aqui é visualizar a pilha de chamadas (Call Stack).

  * **Merge Sort:**
      * [cite\_start]*Lógica:* Divisão recursiva até `n=1`, seguida de `Intercalação (Merge)` usando vetor auxiliar[cite: 1084].
      * *Visualização Crítica:* Mostrar a árvore de recursão ou "quebrar" o array visualmente em sub-blocos. [cite\_start]Na fase de conquista, animar os elementos indo para um "Vetor Auxiliar" e voltando ordenados[cite: 1113].
  * **Quick Sort:**
      * [cite\_start]*Lógica:* Escolha do Pivô e Particionamento (`v1 < p` e `v2 >= p`)[cite: 302].
      * *Visualização Crítica:* Destacar claramente o **Pivô**. [cite\_start]Mostrar os ponteiros `esq` (left) e `dir` (right) se aproximando até a troca[cite: 346].

#### Módulo 4: Ordenação por Distribuição

  * **Radix Sort:**
      * [cite\_start]*Lógica:* Ordenação por dígitos (LSD - Least Significant Digit), estável[cite: 1201].
      * *Visualização Crítica:* Não usar apenas barras. Usar "Baldes" (Buckets/Queues) numerados de 0-9. [cite\_start]Os elementos saem do array, entram nos baldes, e voltam para o array[cite: 1282].

#### Módulo 5: Redes de Ordenação (Avançado/Bônus)

  * **Bitonic Sort:**
      * [cite\_start]*Lógica:* Redes de comparação, sequências bitônicas e meio-limpadores[cite: 461, 501].
      * *Visualização Crítica:* Diagrama de "fios" (circuitos) onde os comparadores conectam linhas. [cite\_start]É uma visualização 2D (Fios Horizontais x Estágios de Tempo) diferente das barras verticais[cite: 638].