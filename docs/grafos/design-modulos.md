## Módulo 1: O Motor - Busca em Profundidade (DFS) e Tarjan

Este é o simulador base. Quase tudo na primeira metade dos slides é uma variação dele.

* **Objetivo:** Visualizar a exploração em profundidade (DFS) e como o Tarjan atribui os números de exploração e complementação.
* **Simulador Base (Tarjan):**
    * **Entrada:** Um grafo (direcionado ou não).
    * **Visualização:**
        * O usuário clica em "Próximo Passo" para avançar na exploração.
        * Nós devem ter estados visuais (Não visitado, Em exploração, Terminado) [950-952].
        * Mostrar os vetores `expl[v]` e `comp[v]` sendo preenchidos em tempo real [956-957].
* **Sub-módulo 1.1: Classificação de Arcos**
    * **Lógica:** Sobre o simulador base, ao visitar um arco `<v, u>`, aplicar as regras do slide 5 [971-983]:
        * **Árvore (T):** Se `expl[u] == 0`.
        * **Retorno (B):** Se `expl[u] < expl[v]` e `comp[u] == 0`.
        * **Avanço (F):** Se `expl[u] > expl[v]`.
        * **Cruzamento (C):** Se `expl[u] < expl[v]` e `comp[u] > 0`.
    * **Visualização:** Colorir os arcos no grafo com cores diferentes para T, B, F, C, assim como no diagrama do slide 5.

---

## Módulo 2: Aplicações do Tarjan (Grafos Direcionados)

Estes simuladores usam o Módulo 1 como base ou lógica central.

* **Sub-módulo 2.1: Teste de Aciclidade (DAG)**
    * **Lógica:** É o simulador 1.1 (Classificação de Arcos) simplificado.
    * **Objetivo:** Rodar a DFS e parar assim que um **Arco de Retorno (B)** for encontrado [1023].
    * **Visualização:** Ao encontrar um arco de retorno, destacá-lo (ex: piscar em vermelho) e exibir a mensagem "Ciclo detectado!".
* **Sub-módulo 2.2: Ordenação Topológica**
    * **Lógica:** Requer um DAG (pode usar o 2.1 para verificar).
    * **Objetivo:** Executar o DFS completo [1114-1140]. A ordenação topológica é a lista de vértices ordenada de forma decrescente pelo tempo de término (`comp[v]`).
    * **Visualização:** Após a simulação do DFS, mostrar a lista final de `comp[v]` e, ao lado, a lista de vértices ordenada por esse valor.
* **Sub-módulo 2.3: Componentes Fortemente Conexas (SCC)**
    * **Lógica:** Uma variação mais complexa do Tarjan [1183-1190].
    * **Dados-chave:** Além de `expl[v]`, precisa de uma **Pilha (P)** e um vetor `CFC[v]` (ou "low-link").
    * **Visualização:** Mostrar o estado da Pilha `P` a cada passo. Mostrar os valores de `expl[v]` e `CFC[v]` para cada nó. Quando `expl[v] == CFC[v]`, destacar os nós sendo desempilhados como uma nova componente (ex: pintando-os da mesma cor) [1190, 1234-1236].

---

## Módulo 3: Aplicações (Grafos Não-Orientados)

Estes são para grafos não-orientados, mas ainda usam DFS como base.

* **Sub-módulo 3.1: Teste de Bipartição (Bicoloração)**
    * **Lógica:** Variação do DFS que tenta colorir o grafo [1141-1156].
    * **Objetivo:** Atribuir cores (1 ou 2) aos vértices. Um vértice `v` tem cor `c` e todos os seus vizinhos `u` devem ter a outra cor.
    * **Visualização:** Colorir os nós com (ex: Vermelho/Azul) durante a exploração. Se um arco for visitado e levar a um nó que já tem a mesma cor do nó atual, destacar esse arco como a "prova" de que o grafo não é bipartido (pois encontrou um ciclo ímpar) [1154].
* **Sub-módulo 3.2: Vértices de Corte (Articulação)**
    * **Lógica:** Variação do Tarjan para grafos não-orientados [1240-1247].
    * **Dados-chave:** `expl[v]` e um novo vetor `m[v]` (similar ao `CFC[v]`).
    * **Regras:**
        1.  Raiz da DFS é de corte se tiver `nfilhos[r] > 1` [1244, 1313].
        2.  Um nó `v` (que não é raiz) é de corte se tiver um filho `u` tal que `m[u] >= expl[v]` [1247, 1311].
    * **Visualização:** Mostrar os vetores `expl` e `m` sendo calculados. Ao final, destacar os vértices `v` que foram marcados como `VC[v] = true`.
* **Sub-módulo 3.3: Arestas de Corte (Pontes)**
    * **Lógica:** Muito similar ao anterior, usa os mesmos dados [1319-1323].
    * **Regra:** Um arco de árvore `<v, u>` (onde `v` é pai de `u`) é uma ponte se `m[u] == expl[u]` [1323, 1373].
    * **Visualização:** Durante a DFS, quando a recursão de `DFSAC(u)` retorna para `v`, verificar a condição. Se for verdadeira, pintar a aresta `<v, u>` de forma distinta.

---

## Módulo 4: Caminhos Mais Curtos (Dijkstra)

Este é um novo grande módulo. A lógica é diferente do Tarjan.

* **Objetivo:** Encontrar o caminho mais curto de uma origem `u` para todos os outros vértices em um grafo ponderado (com custos não-negativos) [1570-1588].
* **Lógica:** Algoritmo guloso que usa um conjunto de vértices "provisórios" (S) e relaxamento de arestas.
* **Dados-chave:** Vetor de distâncias `d[v]`, vetor de predecessores `pred[v]`. O conjunto `S` é (hoje) implementado como uma **Fila de Prioridade (Heap)** [1591].
* **Visualização:**
    * Mostrar os vetores `d` e `pred`.
    * Destacar o nó `j` selecionado (com `min(d[j])`) a cada iteração [1579].
    * Destacar as arestas `<j, w>` que estão sendo "relaxadas" (quando `d[w]` é atualizado) [1581].
    * Os slides da página 26 [1445-1569] são o *storyboard* perfeito para este simulador.

---

## Módulo 5: Árvore Geradora de Custo Mínimo (MST)

Módulo final com dois algoritmos clássicos.

* **Sub-módulo 5.1: Algoritmo de Kruskal**
    * **Lógica:** Abordagem gulosa focada nas arestas [1671-1678].
    * **Dados-chave:** Uma lista de *todas as arestas* ordenada por custo [1770]. Uma estrutura de dados **Union-Find** (ou "componentes") para detectar ciclos [1774].
    * **Visualização:**
        1.  Mostrar a lista de arestas ordenada.
        2.  Mostrar o grafo apenas com os vértices.
        3.  Iterar pela lista:
            * Destacar a aresta `<u, v>` sendo considerada.
            * Se `find(u) != find(v)`: desenhar a aresta (ela entra na MST).
            * Se `find(u) == find(v)`: pintar a aresta de vermelho e descartá-la (forma ciclo).
        * Mostrar o estado das componentes (quais vértices estão em qual conjunto).
* **Sub-módulo 5.2: Algoritmo de Prim**
    * **Lógica:** Abordagem gulosa focada nos vértices. "Cresce" uma árvore a partir de um nó inicial `r` [1801-1807].
    * **Dados-chave:** Uma **Fila de Prioridade (Heap)** que armazena *arestas* (ou vértices) acessíveis a partir da árvore já construída (`U`) [1847-1848].
    * **Visualização:**
        1.  Destacar os nós que já estão na árvore (`U`).
        2.  Mostrar o estado da Fila de Prioridade.
        3.  A cada passo, destacar a aresta de custo mínimo `<u, v>` (onde `u` está em `U` e `v` não está) [1844].
        4.  Pintar o nó `v` e a aresta `<u, v>` para mostrá-los entrando na árvore.