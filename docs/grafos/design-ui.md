## Parte 2: Design do Simulador (Módulo 1: Tarjan e Classificação)

Aqui está a especificação de design detalhada para o simulador do **Módulo 1: Tarjan com Classificação de Arcos**, pronta para ser usada como guia.

### 1\. Objetivo Pedagógico

[cite\_start]O estudante deve aprender a visualizar a execução passo a passo da Busca em Profundidade (DFS) recursiva e compreender como os tempos de **descoberta (expl)** e **término (comp)** são usados para classificar cada arco do grafo em **Árvore, Retorno, Avanço ou Cruzamento**[cite: 8, 35].

### 2\. Componentes da Interface (UI)

  * **Visualização do Grafo (Canvas Principal):**

      * **Nós (Vértices):** Círculos com seus rótulos (ex: "A", "B"). Devem ter 3 estados de cor:
          * *Não Visitado* (ex: Cinza claro).
          * *Em Exploração* (ex: Amarelo/Laranja).
          * *Terminado* (ex: Verde escuro).
      * **Arestas (Arcos):** Setas (para grafos direcionados). Devem ter 5 estados de cor:
          * *Não Classificada* (ex: Cinza).
          * *Árvore (T)* (ex: Preto sólido).
          * *Retorno (B)* (ex: Vermelho tracejado).
          * *Avanço (F)* (ex: Verde tracejado).
          * *Cruzamento (C)* (ex: Azul tracejado).
      * **Aresta Ativa:** A aresta `<v, u>` sendo avaliada no passo atual deve "piscar" ou ficar mais espessa.

  * **Pilha de Chamadas (Call Stack):**

      * Uma caixa vertical que mostra o estado da recursão. Novas chamadas (ex: `DFST(B)`) são empilhadas no topo. Quando uma função retorna, ela é removida do topo.

  * **Painel de Legenda:**

      * Um painel estático que explica o que cada cor de nó e aresta significa.

  * **Controles de Interação:**

      * Botões: `Resetar`, `Passo Anterior`, `Próximo Passo`.
      * Input: Uma área para definir o grafo (ex: lista de adjacência ou interface gráfica de "clicar e arrastar").

### 3\. Controles de Interação

  * **Resetar:** Limpa todos os dados (cores, `expl`, `comp`, Pilha de Chamadas) e volta o grafo ao estado inicial. `contador_expl` e `contador_comp` voltam a 0.
  * **Passo Anterior:** Desfaz a última ação. (Ex: Se o "Próximo Passo" foi `DFST(B)`, o "Anterior" remove `DFST(B)` da pilha, `expl[B]` volta a 0, e B volta a ser "Não Visitado").
  * **Próximo Passo:** Executa a próxima linha ou bloco lógico do pseudocódigo.

### 4\. Lógica do Simulador (Passo a Passo)

A simulação é guiada por um "loop principal" e a "função recursiva" `DFST`.

  * **Estado Inicial:** Todos os nós estão "Não Visitados". `cont_expl = 0`, `cont_comp = 0`. Pilha de Chamadas vazia.

  * **Clique "Próximo Passo" (Loop Principal):**

      * O simulador verifica `PARA cada v em G.V`.
      * Ele encontra o primeiro `v` onde `expl[v] == 0`.
      * **Ação Visual:** Destaca o nó `v`. O Painel de Estado informa: "Procurando nó não visitado. Encontrado: `v`."

  * **Clique "Próximo Passo" (Início da `DFST(v)`):**

      * A função `DFST(v)` é chamada.
      * **Ação Visual 1:** `DFST(v)` é adicionado ao topo da **Pilha de Chamadas**.
      * **Ação Visual 2:** O nó `v` muda de cor para "Em Exploração".
      * **Ação Visual 3:** `contador_expl` é incrementado. O valor é escrito em `expl[v]` no **Painel de Estado**.

  * **Clique "Próximo Passo" (Loop de Arestas `para <v, u>`):**

      * O simulador seleciona a primeira (ou próxima) aresta `<v, u>` que sai de `v`.
      * **Ação Visual:** A aresta `<v, u>` é destacada (ex: pisca). O Painel de Estado informa: "Avaliando aresta `<v, u>`."

  * **Clique "Próximo Passo" (Condição 1: `expl[u] == 0`):**

      * O simulador avalia `u` e vê que `expl[u]` é 0.
      * [cite\_start]**Ação Visual 1:** A aresta `<v, u>` muda de cor para "Árvore (T)"[cite: 60].
      * **Ação Visual 2:** O Painel de Estado informa: "`expl[u] == 0`. Classificado como ÁRVORE. Próximo passo será a chamada recursiva `DFST(u)`."
      * *(O próximo clique "Próximo Passo" iniciará `DFST(u)` recursivamente, voltando ao topo desta seção de lógica).*

  * **Clique "Próximo Passo" (Condição 2: Avanço - `expl[u] > expl[v]`):**

      * O simulador avalia `u` e vê que `expl[u] > expl[v]`.
      * [cite\_start]**Ação Visual 1:** A aresta `<v, u>` muda de cor para "Avanço (F)"[cite: 63].
      * **Ação Visual 2:** O Painel de Estado informa: "`expl[u] > expl[v]`. Classificado como AVANÇO."

  * **Clique "Próximo Passo" (Condição 3: Cruzamento - `comp[u] > 0`):**

      * O simulador avalia `u` e vê que `expl[u] < expl[v]` (implícito) e `comp[u] > 0`.
      * [cite\_start]**Ação Visual 1:** A aresta `<v, u>` muda de cor para "Cruzamento (C)"[cite: 65].
      * **Ação Visual 2:** O Painel de Estado informa: "`expl[u] < expl[v]` e `comp[u] > 0`. Classificado como CRUZAMENTO."

  * **Clique "Próximo Passo" (Condição 4: Retorno - `else`):**

      * O simulador avalia `u` e vê que `expl[u] < expl[v]` e `comp[u] == 0`.
      * [cite\_start]**Ação Visual 1:** A aresta `<v, u>` muda de cor para "Retorno (B)"[cite: 66].
      * **Ação Visual 2:** O Painel de Estado informa: "`expl[u] < expl[v]` e `comp[u] == 0`. Classificado como RETORNO."

  * **Clique "Próximo Passo" (Fim da `DFST(v)`):**

      * O loop `para <v, u>` de `v` terminou. A função está prestes a retornar.
      * **Ação Visual 1:** `contador_comp` é incrementado. O valor é escrito em `comp[v]` no **Painel de Estado**.
      * [cite\_start]**Ação Visual 2:** O nó `v` muda de cor para "Terminado"[cite: 76].
      * **Ação Visual 3:** `DFST(v)` é removido do topo da **Pilha de Chamadas**.
      * **Ação Visual 4:** O Painel de Estado informa: "Exploração de `v` terminada."
      * *(O próximo clique "Próximo Passo" retornará o controle para a função chamadora (ex: `DFST(pai_de_v)`) ou para o loop principal).*

### 5\. Painel de Estado (Variáveis-Chave)

Este painel deve ser uma tabela ou lista sempre visível, mostrando:

  * [cite\_start]**Contador Global `expl` (ce):** [Valor numérico] [cite: 53]
  * [cite\_start]**Contador Global `comp` (cc):** [Valor numérico] [cite: 54, 77]
  * **Tabela de Vértices:**
    | Vértice | Estado | `expl[v]` | `comp[v]` |
    | :--- | :--- | :--- | :--- |
    | A | Em Exploração | 1 | 0 |
    | B | Não Visitado | 0 | 0 |
    | C | Terminado | 2 | 3 |
    | ... | ... | ... | ... |
  * **Pilha de Chamadas (Call Stack):**
      * `DFST(C)` (Topo)
      * `DFST(A)`
  * **Última Ação:** [String descritiva, ex: "Avaliando \<A, C\>. `expl[C] == 0`. Classificado como ÁRVORE."]