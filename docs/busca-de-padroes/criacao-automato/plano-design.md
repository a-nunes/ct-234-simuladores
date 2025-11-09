## Plano de Design: Simulador de Construção de Autômato Finito (AFConstruct)

**1. Objetivo Pedagógico:**
Permitir que o estudante visualize como cada célula da tabela de transições AF[s,x] é calculada, compreendendo o processo de busca do maior prefixo válido e a relação entre prefixos e sufixos do padrão.

**2. Componentes da Interface (UI):**

* **Entrada do Padrão:** Campo de texto para inserir o padrão P (ex: "ababaca"), com visualização do tamanho m.
* **Seletor de Alfabeto:** Botões ou input para definir o alfabeto Σ (ex: {a, b, c}).
* **Visualização do Padrão com Índices:** O padrão P exibido como uma sequência de caixas, cada uma mostrando P[0], P[1], ..., P[m-1], com índices visíveis abaixo.
* **Tabela de Estados (Matriz AF):** Grade bidimensional com:
  * Linhas representando estados (s = 0 até m)
  * Colunas representando caracteres do alfabeto
  * Células inicialmente vazias ou com "?"
  * Célula sendo calculada atualmente destacada em cor diferente (ex: amarelo)
* **Área de Prefixos:** Visualização do prefixo P_{s-1} atualmente reconhecido, destacando os caracteres que formam o prefixo.
* **Área de Teste de Sufixo:** Mostra:
  * A string sendo testada: P_{s-1}x (concatenação do prefixo atual com o caractere x)
  * O prefixo candidato P_{k-1} sendo testado
  * Animação visual mostrando se P_{k-1} é sufixo de P_{s-1}x
* **Indicador de Busca:** Mostra o valor atual de k (estado candidato) e a direção da busca (decrescente).
* **Janela de Explicação:** Área de texto que exibe mensagens como:
  * "Calculando AF[2, 'b']..."
  * "Testando se P_3 é sufixo de P_2b..."
  * "Match encontrado! P_1 é sufixo de P_2b"

**3. Controles de Interação:**

* **Resetar:** Limpa a tabela AF e reinicia o algoritmo do estado 0, caractere inicial do alfabeto.
* **Passo Anterior:** Reverte a última célula calculada.
* **Próximo Passo:** Avança para o próximo micro-passo (teste de sufixo) ou macro-passo (célula completa).
* **Modo de Avanço:**
  * "Passo Detalhado" (mostra cada decremento de k)
  * "Passo por Célula" (pula direto para o resultado de AF[s,x])
* **Calcular Tudo:** Preenche a tabela inteira automaticamente (para comparação final).

**4. Lógica do Simulador (Passo a Passo):**

**Macro-estrutura (Loops Aninhados):**
* O algoritmo percorre estado por estado (s = 0 até m)
* Para cada estado, percorre cada caractere do alfabeto

**Micro-passos (Cálculo de uma célula AF[s,x]):**

* **Passo 1 - Inicialização:**
  * Destaca a célula AF[s,x] na tabela
  * Exibe "Calculando AF[s,x] para estado s com caractere 'x'"
  * Mostra P_{s-1} (prefixo reconhecido até o estado s)
  * Mostra P_{s-1}x (concatenação com o caractere lido)
  * Define k = min{s+2, m+1}

* **Passo 2 - Início da Busca:**
  * Exibe "Iniciando busca: k = [valor]"
  * Mostra na área de teste: "Verificando se P_{k-1} é sufixo de P_{s-1}x"

* **Passo 3 - Teste de Sufixo (Repetição):**
  * Decrementa k (k--)
  * Destaca visualmente:
    * P_{k-1} (prefixo candidato) em uma cor
    * Os últimos k caracteres de P_{s-1}x em outra cor
  * Animação de comparação caractere por caractere (da direita para esquerda)
  * Mensagem:
    * Se P_{k-1} ≠ sufixo de P_{s-1}x: "Não é sufixo. Testando k = [k-1]..."
    * Se P_{k-1} = sufixo de P_{s-1}x: "Match! P_{k-1} é sufixo de P_{s-1}x"

* **Passo 4 - Atribuição:**
  * Exibe "AF[s,x] = k"
  * Preenche a célula AF[s,x] com o valor k
  * Célula muda de cor para "preenchida" (ex: verde claro)

* **Passo 5 - Avanço:**
  * Move para a próxima célula (próximo caractere do alfabeto, ou próximo estado)
  * Se terminou uma linha (todos caracteres de um estado): destaca visualmente que o estado s está completo

**5. Painel de Estado:**

* **Estado Atual (s):** [0 até m]
* **Caractere Atual (x):** [caractere do alfabeto sendo processado]
* **Prefixo Reconhecido (P_{s-1}):** [string, ex: "ab"]
* **String de Teste (P_{s-1}x):** [ex: "abb"]
* **Candidato k:** [valor atual de k]
* **Prefixo Candidato (P_{k-1}):** [string, ex: "a"]
* **Resultado do Teste:** ["É sufixo" / "Não é sufixo"]
* **Valor Calculado:** [AF[s,x] = k após o match]
* **Progresso:** [Células preenchidas / Total de células]
* **Complexidade:** [Contador de operações realizadas]

---

**Seção Bônus (Uso do Autômato - AFMatch):**

Se implementada, esta seção deve ter:

* **Entrada de Texto T:** Campo para inserir o texto onde buscar o padrão
* **Visualização do Texto:** Caixas mostrando T[0], T[1], ..., T[n-1]
* **Ponteiro de Leitura:** Seta indicando T[i] (posição atual)
* **Estado Atual do Autômato:** Círculo ou caixa mostrando o estado s
* **Diagrama do Autômato:** (Opcional) Representação gráfica com círculos (estados) e setas (transições), com o estado atual destacado
* **Lógica Passo a Passo:**
  * Ler T[i]
  * Mostrar "Estado s, lê caractere 'T[i]'"
  * Consultar AF[s, T[i]]
  * Transitar para o novo estado (animação)
  * Se s = m: destacar "Padrão encontrado na posição [i-m]!"