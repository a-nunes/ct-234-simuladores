# 🎯 Como Usar Grafos Customizados nos Simuladores

## Fluxo Completo

### 1. **Criar Seu Grafo no Editor**

1. Na página inicial, clique em **"Editor de Grafos"**
2. Configure o tipo de grafo:
   - **Tipo de Direção**: Direcionado ou Não-Direcionado
   - **Tipo de Peso**: Ponderado ou Não-Ponderado
3. Crie seu grafo de 3 formas:

#### Opção A: Editor Visual
- Use a ferramenta **"Adicionar Vértice"** para criar vértices
- Use **"Adicionar Aresta"** para conectá-los
- Use **"Selecionar/Arrastar"** para organizar o layout

#### Opção B: Editor de Texto
- Clique em "Editor de Texto"
- Digite usando a sintaxe:
  ```
  A -> B, C          # Grafo direcionado
  A - B, C           # Grafo não-direcionado  
  A -> B(7), C(5)    # Com pesos
  D                  # Vértice isolado
  ```

#### Opção C: Exemplos Pré-Definidos
- Clique em "Exemplos"
- Escolha um exemplo (Tarjan, DAG, Dijkstra, MST, Bipartição)

### 2. **Salvar o Grafo**

- Clique no botão verde **"Salvar para Simuladores"**
- Você verá uma confirmação de que o grafo foi salvo
- O grafo fica disponível globalmente para todos os simuladores

### 3. **Carregar no Simulador**

1. Volte ao início e escolha um simulador
2. Nos controles, clique em **"Carregar Grafo Customizado"**
3. Se o grafo for compatível, ele será carregado automaticamente
4. Se não for compatível, você verá uma mensagem explicando os requisitos

## 🔍 Compatibilidade por Simulador

| Simulador | Tipo Requerido | Pesos Requeridos |
|-----------|---------------|------------------|
| **Tarjan** | Direcionado | Não |
| **Aplicações de Grafos** (Aciclidade, Topológica, SCC) | Direcionado | Não |
| **Grafos Não-Orientados** (Bipartição, Vértices de Corte, Pontes) | Não-Direcionado | Não |
| **Dijkstra** | Direcionado | Sim (Ponderado) |
| **MST** (Kruskal, Prim) | Não-Direcionado | Sim (Ponderado) |

## 💡 Dicas

### Para Estudar Tarjan
```
// No Editor de Texto (Direcionado, Não-Ponderado):
A -> B, D
B -> C, E
C -> E
D -> E
E -> A
```

### Para Estudar Dijkstra
```
// No Editor de Texto (Direcionado, Ponderado):
A -> B(4), D(3)
B -> C(5), E(9)
C -> E(1)
D -> B(2), E(6)
```

### Para Estudar MST (Prim/Kruskal)
```
// No Editor de Texto (Não-Direcionado, Ponderado):
A - B(4), D(3), E(4)
B - A(4), E(9), C(5)
C - B(5), E(2)
D - A(3), E(6)
E - A(4), B(9), C(2), D(6)
```

## ⚠️ Solução de Problemas

**Problema**: "Nenhum grafo salvo"
- **Solução**: Volte ao Editor de Grafos e clique em "Salvar para Simuladores"

**Problema**: "Grafo incompatível - tipo diferente"
- **Solução**: No Editor, ajuste a configuração de "Tipo de Direção" para o tipo correto

**Problema**: "Grafo incompatível - falta de pesos"
- **Solução**: No Editor, marque "Ponderado" e adicione pesos às arestas

## 🚀 Integração em Outros Simuladores

Para adicionar suporte a grafos customizados em outros simuladores:

1. Importe o hook e componente:
```typescript
import { useGraph } from '../contexts/GraphContext';
import LoadCustomGraphButton from './LoadCustomGraphButton';
import { convertGraphToSimulator } from '../utils/graphConverter';
```

2. Crie a função de carregamento:
```typescript
const { savedGraph } = useGraph();

const loadCustomGraph = useCallback(() => {
  if (!savedGraph) return;
  const { nodes: customNodes, edges: customEdges } = convertGraphToSimulator(savedGraph);
  
  // Converta para os tipos específicos do seu simulador
  const yourNodes: YourNodeType[] = customNodes.map(n => ({
    // ... mapeie as propriedades
  }));
  
  setNodes(yourNodes);
  setEdges(yourEdges);
}, [savedGraph]);
```

3. Adicione o botão na interface:
```tsx
<LoadCustomGraphButton
  onLoadGraph={loadCustomGraph}
  requiredType="directed" // ou "undirected"
  requiresWeights={false} // ou true
  disabled={isSimulating}
/>
```

## 📝 Status de Implementação

- ✅ TarjanSimulator - Implementado
- ⏳ GraphApplicationsSimulator - Pendente
- ⏳ UndirectedGraphSimulator - Pendente
- ⏳ DijkstraSimulator - Pendente
- ⏳ MSTSimulator - Pendente
