## Plano de Design: Simulador do Algoritmo KMP (Knuth-Morris-Pratt)

**1. Objetivo Pedagógico:**
Permitir que o estudante visualize como o algoritmo KMP evita comparações redundantes usando a função de falha, compreendendo tanto o pré-processamento do padrão quanto a busca eficiente no texto.

**2. Componentes da Interface (UI):**
* **Visualização do Texto (T):** Uma linha horizontal de caixas, cada uma contendo um caractere do texto, numeradas de 0 a n-1.
* **Visualização do Padrão (P):** Uma linha de caixas abaixo do texto, alinhável horizontalmente, mostrando o padrão sendo comparado, numeradas de 0 a m-1.
* **Ponteiros Visuais:** 
  - Ponteiro "i" (acima do texto): indica a posição atual sendo analisada em T
  - Ponteiro "j" (acima do padrão): indica a posição atual sendo comparada em P
* **Tabela da Função de Falha F[]:** Exibida em formato de tabela com duas linhas:
  - Linha 1: índices j (0 a m-1)
  - Linha 2: valores de F[j]
  - Linha 3: caracteres P[j] (para referência visual)
* **Área de Destaque de Comparação:** As caixas T[i] e P[j] sendo comparadas devem ser destacadas (ex: borda vermelha para falha, verde para sucesso).
* **Histórico de Deslocamentos:** Visualização fantasma (transparente) das posições anteriores do padrão, mostrando os "saltos" realizados.

**3. Controles de Interação:**
* "Resetar" (Reinicia o algoritmo com novo texto/padrão)
* "Passo Anterior" (Reverte a última operação)
* "Próximo Passo"
* **Modo de Visualização:** Toggle entre "Mostrar Pré-processamento" e "Mostrar Busca"

**4. Lógica do Simulador (Passo a Passo):**

### **FASE 1: PRÉ-PROCESSAMENTO (Cálculo da Função de Falha)**
* **Início:** Exibe apenas o padrão P. Tabela F[] vazia exceto F[0] = 0. Ponteiros j=0 e i=1 inicializados.
* **"Próximo Passo" (Comparação):** 
  - Destaca P[i] e P[j]
  - Mensagem: "Comparando P[{i}]='{P[i]}' com P[{j}]='{P[j]}'"
* **"Próximo Passo" (Decisão - Caso Match):**
  - Se P[i] == P[j]: 
    - Mensagem: "Match! F[{i}] = {j+1}"
    - Preenche F[i] com j+1 na tabela
    - Incrementa ambos: i++ e j++
* **"Próximo Passo" (Decisão - Caso Falha):**
  - Se P[i] ≠ P[j] e j > 0:
    - Mensagem: "Falha. Usando F[{j-1}] = {F[j-1]}"
    - Animação mostrando j "saltando" para F[j-1]
    - j = F[j-1]
  - Se P[i] ≠ P[j] e j == 0:
    - Mensagem: "Falha na base. F[{i}] = 0"
    - F[i] = 0, i++
* **Fim da Fase 1:** Quando i == m, exibe "Função de Falha calculada!" e transiciona para Fase 2.

### **FASE 2: BUSCA NO TEXTO**
* **Início:** Exibe texto T e padrão P alinhados. Ponteiros i=0 e j=0. Contador de passos = 0.
* **"Próximo Passo" (Comparação):**
  - **Incrementa contador de passos**
  - Destaca T[i] e P[j] com cores
  - Mensagem: "Passo {contador}: Comparando T[{i}]='{T[i]}' com P[{j}]='{P[j]}'"
* **"Próximo Passo" (Match):**
  - Se T[i] == P[j] e j < m-1:
    - Mensagem: "Match! Avançando..."
    - i++ e j++
    - Caixas correspondentes ficam verdes
  - Se T[i] == P[j] e j == m-1:
    - Mensagem: "**PADRÃO ENCONTRADO na posição {i-j}!**"
    - Todo o padrão fica verde
    - Exibe: "Total de passos até o match: {contador}"
    - Fim da execução
* **"Próximo Passo" (Falha):**
  - Se T[i] ≠ P[j] e j > 0:
    - Mensagem: "Falha. Consultando F[{j-1}] = {F[j-1]}"
    - Destaca a célula F[j-1] na tabela
    - Animação: padrão P desliza para a direita, realinhando P[0] com T[i-F[j-1]]
    - Deixa "rastro fantasma" da posição anterior
    - j = F[j-1]
  - Se T[i] ≠ P[j] e j == 0:
    - Mensagem: "Falha. Avançando no texto..."
    - i++
    - Padrão desliza uma posição para a direita
* **Fim sem Match:** Se i == n e não houve match, exibe "Padrão não encontrado. Total de passos: {contador}"

**5. Painel de Estado:**
* **Fase Atual:** [Pré-processamento | Busca]
* **Contador de Passos:** [Número total de comparações realizadas na busca]
* **Ponteiro i (Texto):** [Valor atual de i]
* **Ponteiro j (Padrão):** [Valor atual de j]
* **Última Comparação:** [Ex: "T[5]='a' vs P[2]='a' → Match"]
* **Última Ação:** [Ex: "Usou F[3]=1, deslocou padrão" ou "Incrementou i e j"]
* **Posição de Alinhamento:** [Onde P[0] está alinhado em relação a T]
* **Tabela F[] Completa:** [Sempre visível após pré-processamento]
* **Deslocamentos Realizados:** [Contador de quantas vezes usou F[j-1]]