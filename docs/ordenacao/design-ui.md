### 1\. A Filosofia do Layout: "Dashboard de Inspeção"

Vamos dividir a tela em três áreas principais, criando um fluxo de leitura em **F** ou **Z**:

1.  **Visualização (O Palco):** Onde a ação acontece.
2.  **Estado & Variáveis (A Tabela de Teste de Mesa):** Onde os dados numéricos mudam.
3.  **Controle & Código (O Maestro):** Onde você comanda o ritmo e vê a lógica.

### 2\. Wireframe Abstrato (Grid System)

Imagine a tela dividida em uma grade CSS Grid:

```text
+---------------------------------------------------------------+
|  HEADER (Título do Algoritmo + Seletor de Input)              |
+---------------------------------------------------------------+
|                                                               |
|                  AREA DE VISUALIZAÇÃO (60%)                   |
|       [Visualização Gráfica: Barras, Árvores ou Fios]         |
|                                                               |
+-----------------------+-------------------+-------------------+
|  CONTROLES (Player)   |   VARIÁVEIS (HUD) |   CÓDIGO (Log)    |
| [<<] [<] [||] [>] [>>]|   i: 2            |   Line 4: active  |
|  Timeline Scrubber    |   j: 3            |   if (v[j] > x)   |
|  Speed Slider         |   aux: 15         |   // Troca v[j].. |
+-----------------------+-------------------+-------------------+
```

-----

### 3\. Detalhamento dos Componentes

#### A. A Área de Visualização (Viewport)

Esta área deve ser limpa. O foco é eliminar o ruído.

  * **Representação:**
      * **Barras (Bubble, Selection, Quick):** Altura = Valor. Largura dinâmica.
      * **Nós/Árvore (Heap):** Círculos conectados por arestas SVG.
      * **Fios (Bitonic):** Linhas horizontais com conectores verticais.
  * **Ponteiros (Crucial para Prova):**
      * Em vez de apenas destacar a barra, use **Setas ("Arrows")** abaixo ou acima das barras rotuladas com as variáveis (`i`, `j`, `pivô`).
      * *Por que?* Nas provas, você desenha setas para indicar onde os índices estão. O simulador deve imitar o papel.
  * **Cores Semânticas:**
      * 🔴 **Vermelho:** Comparação ativa (Hot spot).
      * 🟢 **Verde:** Elemento ordenado/finalizado.
      * 🟡 **Amarelo:** Elemento em memória temporária (ex: variável `x` no Insertion Sort ou `aux`).
      * 🔵 **Azul/Neutro:** Elementos intocados.

#### B. Painel de Variáveis (HUD - Heads Up Display)

Aqui está o diferencial para o seu mestrado. O professor cobra a **simulação**, o que geralmente implica fazer o "Teste de Mesa".

  * **Design:** Cards pequenos ou uma tabela minimalista.
  * **Comportamento:**
      * Mostrar apenas as variáveis do escopo atual.
      * Quando um valor muda, ele deve "piscar" (flash) suavemente para chamar a atenção periférica.
      * *Exemplo:* No `Partition` do QuickSort, mostrar `left`, `right` e `pivot` explicitamente.

#### C. Painel de Código e Narrativa

  * **Pseudocódigo Interativo:**
      * Exibir o pseudocódigo que extraímos no passo anterior.
      * **Highlighter:** Uma barra de cor sólida que se move para a linha que está sendo executada *agora*.
  * **Narrativa (Log):**
      * Uma linha de texto logo acima ou abaixo do código explicando em linguagem natural: *"Trocando 44 com 12 pois 44 \> 12"*.

#### D. Barra de Controle (Timeline)

  * **Scrubber (Barra de Progresso):** Permitir arrastar para frente e para trás. Se você perdeu um movimento, arrasta o vídeo mental para trás.
  * **Step-by-Step:** Botões grandes para "Próximo Passo" e "Passo Anterior". Isso é vital para estudar devagar.

-----

### 4\. Adaptações Específicas de UI por Módulo

Para garantir a ergonomia em algoritmos diferentes, a "Área de Visualização" deve se adaptar:

#### Módulo 1: Elementares (Linear)

  * **Layout:** Barras verticais.
  * **Destaque:** No *Insertion Sort*, puxe a barra que está sendo comparada (`x`) levemente para cima (destacando-a do array), criando a metáfora visual de "segurar a carta na mão".

#### Módulo 2: Heap Sort (Híbrido)

  * **Layout Dividido:**
      * Topo: Representação em Árvore Binária.
      * Base: Representação em Array (Vetor).
  * **Sincronia:** Ao passar o mouse sobre um nó na árvore, destacar o índice correspondente no array e vice-versa. As setas de troca devem aparecer em ambos.

#### Módulo 3: Recursivos (Merge/Quick)

  * **Visualização de Pilha (Call Stack):**
      * Adicionar uma barra lateral fina à direita mostrando a "profundidade" da recursão.
      * No *Merge Sort*, visualmente separar o array em blocos ("fatias") para mostrar a divisão `i` até `m` e `m+1` até `f`.
      * Para o *Merge*, criar uma "Drop Zone" temporária abaixo do array principal para representar o vetor `aux`, animando as peças descendo e subindo.

-----

### 5\. UX e Acessibilidade (O Toque Profissional)

1.  **Atalhos de Teclado (Power User):**

      * `Seta Direita`: Próximo passo.
      * `Seta Esquerda`: Passo anterior.
      * `Espaço`: Play/Pause.
      * Isso permite que você estude sem tirar a mão do teclado, anotando no caderno com a outra mão.

2.  **Input de Dados Personalizado:**

      * Permitir que você digite `[18, 26, 32, 6, 43]` (exatamente o vetor da prova ou slide) para ver como o algoritmo se comporta com aquele caso específico.
      * Botão "Pior Caso" (Gera um array invertido).

3.  **Velocidade Adaptativa:**

      * Algoritmos $O(n^2)$ são lentos. O slider de velocidade deve ser logarítmico, permitindo ir de "muito lento" (para entender a troca) a "instantâneo" (para ver o resultado final).