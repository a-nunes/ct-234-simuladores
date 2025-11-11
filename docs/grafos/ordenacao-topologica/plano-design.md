## Plano de Design: Simulador de Ordenação Topológica (Kahn's Algorithm)

**1. Objetivo Pedagógico:**
Permitir que o estudante entenda como a remoção sucessiva de vértices com "grau de entrada" (indegree) zero, auxiliada por uma fila, resulta em uma ordenação linear válida de um grafo acíclico dirigido (DAG).

**2. Componentes da Interface (UI):**
* **Visualização do Grafo:** Uma área principal de desenho onde os vértices (círculos) e as arestas (setas dirigidas) são exibidos.
* **Rótulo de Grau de Entrada:** Um contador numérico (ex: `grau = 2`) posicionado visivelmente dentro ou ao lado de cada vértice. Este valor será atualizado dinamicamente.
* **Visualização da Fila (`q`):** Um componente explícito (ex: um retângulo horizontal) que mostra os vértices sendo enfileirados (`enqueue`) em uma extremidade e desenfileirados (`dequeue`) da outra.
* **Lista de Saída Ordenada:** Uma área separada (ex: caixas numeradas de 1 a *n*) onde os vértices são colocados à medida que são "visitados" (removidos da fila), formando a ordenação final.
* **Destaque de Vértice:** Vértices devem mudar de cor para indicar seu estado:
    * `Amarelo`: Vértice com grau 0, pronto para ser enfileirado.
    * `Azul`: Vértice atualmente na fila.
    * `Verde`: Vértice sendo processado (recém-saído da fila).
    * `Cinza`: Vértice concluído (já na lista de saída).


**3. Controles de Interação:**
* "Resetar" (Recarrega o grafo com os graus de entrada iniciais)
* "Passo Anterior" (Reverte a última ação de processamento)
* "Próximo Passo"

**4. Lógica do Simulador (Passo a Passo):**
O simulador é inicializado com o grafo e os graus de entrada de todos os vértices já calculados e exibidos.

* **"Próximo Passo" (Início - Enfileirar Iniciais):** O simulador varre todos os vértices. Cada vértice `v` com `indegree(v) == 0` é destacado (Amarelo) e, em seguida, anima sua entrada na "Visualização da Fila".
* **"Próximo Passo" (Dequeue):** O vértice na frente da fila é destacado, removido da "Visualização da Fila" (animação `dequeue`) e se torna o vértice `v` "ativo" (destacado em Verde).
* **"Próximo Passo" (Processar `v`):**
    1.  O `counter` no "Painel de Estado" é incrementado.
    2.  O vértice `v` é movido para a próxima posição aberta na "Lista de Saída Ordenada".
    3.  O vértice `v` no grafo principal muda de cor para "Concluído" (Cinza).
* **"Próximo Passo" (Analisar Sucessor 1):** O simulador destaca a primeira aresta que sai de `v` para um sucessor `w`.
* **"Próximo Passo" (Decrementar Grau de `w`):**
    1.  O "Rótulo de Grau de Entrada" em `w` é visivelmente decrementado (ex: o número "2" é riscado e "1" aparece).
    2.  O simulador verifica se o novo grau é 0.
* **"Próximo Passo" (Verificar `w`):**
    * **Se `indegree(w) == 0`:** O vértice `w` é destacado (Amarelo) e, em seguida, anima sua entrada no final da "Visualização da Fila".
    * **Se `indegree(w) != 0`:** O destaque da aresta para `w` desaparece.
* **"Próximo Passo" (Próximo Sucessor):** O simulador repete os três passos anteriores para o próximo sucessor de `v`.
* **"Próximo Passo" (Fim dos Sucessores):** Quando todos os sucessores de `v` forem processados, o vértice `v` é "des-destacado". O loop repete (volta para "Dequeue").
* **Fim (Fila Vazia):** Quando a fila se torna vazia, o simulador executa o passo final.
* **"Próximo Passo" (Verificação de Ciclo):** O simulador compara o `counter` (vértices processados) com `n` (total de vértices).
    * Se `counter == n`: Exibe a mensagem "Ordenação Topológica Concluída!".
    * Se `counter != n`: Exibe "ERRO: Grafo é cíclico!". Os vértices que não foram processados (ainda com `grau > 0`) são destacados em vermelho.

**5. Painel de Estado:**
* **`counter`:** [Valor atual do contador (número de vértices processados)]
* **`n` (Total de Vértices):** [Número total de vértices no grafo]
* **Fila (`q`):** [Lista de vértices atualmente na fila, ex: `[C, F]`]
* **Vértice Atual (`v`):** [Vértice que acabou de ser desenfileirado, ex: `B`]
* **Sucessor Atual (`w`):** [Sucessor de `v` sendo analisado, ex: `D`]
* **Tabela de Graus de Entrada:**
    | Vértice | Grau Inicial | Grau Atual |
    | :--- | :--- | :--- |
    | A | 0 | 0 |
    | B | 1 | 0 |
    | C | 1 | 1 |
    | ... | ... | ... |
* **Ordenação Parcial:** [Lista de vértices na "Lista de Saída", ex: `A, B`]