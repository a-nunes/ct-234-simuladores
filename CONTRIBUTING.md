# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o projeto CT-234 Simuladores de Algoritmos! Este documento fornece diretrizes para contribuições.

## 📋 Código de Conduta

Este projeto e todos os participantes são regidos por princípios de respeito mútuo e colaboração acadêmica. Ao participar, você concorda em manter um ambiente acolhedor e produtivo.

## 🚀 Como Contribuir

### 1. Reportando Bugs

Se você encontrar um bug, por favor abra uma [issue](../../issues) incluindo:

- **Descrição clara** do problema
- **Passos para reproduzir** o comportamento
- **Comportamento esperado** vs **comportamento atual**
- **Screenshots** se aplicável
- **Ambiente** (navegador, versão do Node.js, etc.)

### 2. Sugerindo Melhorias

Para sugerir novas funcionalidades ou melhorias:

- Abra uma [issue](../../issues) com a tag `enhancement`
- Descreva a funcionalidade desejada
- Explique por que seria útil para a comunidade acadêmica
- Se possível, sugira uma implementação

### 3. Contribuindo com Código

#### Fork e Clone

```bash
# Fork o projeto no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/ct-234-simuladores.git
cd ct-234-simuladores

# Adicione o repositório original como remote
git remote add upstream https://github.com/original-usuario/ct-234-simuladores.git
```

#### Crie uma Branch

```bash
# Crie uma branch para sua feature/fix
git checkout -b feature/nome-da-feature

# Ou para correção de bugs
git checkout -b fix/descricao-do-bug
```

#### Desenvolvimento

1. **Instale as dependências**
   ```bash
   npm ci
   ```
   Para adicionar uma dependência, use `npm install <pacote>`: o `.npmrc` só aceita
   versões publicadas há 14+ dias e bloqueia scripts de instalação não revisados
   (veja [SECURITY.md](SECURITY.md)).

2. **Execute o projeto**
   ```bash
   npm run dev
   ```

3. **Faça suas alterações**
   - Mantenha o código limpo e legível
   - Siga os padrões do TypeScript e React
   - Adicione comentários quando necessário
   - Mantenha a consistência com o código existente

4. **Teste suas alterações**
   ```bash
   npm test
   npm run build   # inclui o typecheck
   npm run audit
   ```

#### Commit

Siga o padrão de commits semânticos:

```bash
# Exemplos de boas mensagens de commit:
git commit -m "feat: adiciona simulador de algoritmo de Bellman-Ford"
git commit -m "fix: corrige bug na visualização do grafo"
git commit -m "docs: atualiza documentação do KMP"
git commit -m "style: ajusta espaçamento no componente Tarjan"
git commit -m "refactor: otimiza função de renderização de grafos"
git commit -m "test: adiciona testes para algoritmo de Dijkstra"
```

**Prefixos de commit:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, espaçamento (sem mudança de lógica)
- `refactor`: Refatoração de código
- `test`: Adição ou modificação de testes
- `chore`: Tarefas de manutenção

#### Pull Request

1. **Atualize sua branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push para seu fork**
   ```bash
   git push origin feature/nome-da-feature
   ```

3. **Abra um Pull Request**
   - Vá para o repositório original no GitHub
   - Clique em "New Pull Request"
   - Selecione sua branch
   - Preencha o template do PR com:
     - Descrição clara das mudanças
     - Referência a issues relacionadas
     - Screenshots se aplicável
     - Checklist de verificação

## 📝 Padrões de Código

### TypeScript

- Use tipagem forte sempre que possível
- Evite `any` - prefira `unknown` ou tipos específicos
- Use interfaces para objetos complexos

```typescript
// ✅ Bom
interface Node {
  id: string;
  label: string;
  position: [number, number];
}

// ❌ Evite
const node: any = { id: "1", label: "A" };
```

### React

- Use componentes funcionais com hooks
- Mantenha componentes pequenos e reutilizáveis
- Use nomes descritivos para variáveis e funções

```typescript
// ✅ Bom
const GraphNode: React.FC<GraphNodeProps> = ({ node, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);
  // ...
};

// ❌ Evite
const Comp = (props) => {
  const x = useState(false);
  // ...
};
```

### CSS/Tailwind

- Prefira classes Tailwind quando possível
- Mantenha consistência de cores e espaçamentos
- Use as cores já definidas no projeto

```tsx
// ✅ Bom
<div className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
  Conteúdo
</div>

// Use as cores do tema existente
```

## 🧪 Testes

- Adicione testes para novas funcionalidades
- Mantenha a cobertura de testes
- Teste edge cases e casos de erro

```bash
# Execute os testes
npm test

# Modo interativo
npm run test:watch
```

## 📚 Documentação

### Comentários no Código

```typescript
/**
 * Calcula o caminho mínimo usando o algoritmo de Dijkstra
 * @param graph - Grafo com pesos não-negativos
 * @param source - Vértice de origem
 * @returns Array com as distâncias mínimas
 */
function dijkstra(graph: Graph, source: string): number[] {
  // Implementação
}
```

### Documentação de Simuladores

Ao adicionar um novo simulador, inclua:

1. **Descrição** no `README.md`
2. **Documentação detalhada** em `docs/`
3. **Exemplos** de uso
4. **Referências** bibliográficas se aplicável

## 🎯 Adicionando Novos Simuladores

Para adicionar um novo simulador:

1. **Crie o componente** em `src/components/`
   ```typescript
   // src/components/NovoSimulador.tsx
   ```

2. **Adicione ao App.tsx**
   ```typescript
   import NovoSimulador from './components/NovoSimulador';
   
   const simulators = [
     // ... outros simuladores
     {
       id: 'novo-simulador',
       title: 'Novo Algoritmo',
       description: 'Descrição do algoritmo...',
       // ...
     }
   ];
   ```

3. **Documente** em `docs/`

4. **Adicione testes**

## 🔍 Checklist do Pull Request

Antes de submeter um PR, verifique:

- [ ] O código compila sem erros (`npm run build`)
- [ ] Todos os testes passam (`npm test`)
- [ ] Não há warnings do TypeScript
- [ ] O código segue os padrões estabelecidos
- [ ] Comentários/documentação foram adicionados
- [ ] README foi atualizado (se necessário)
- [ ] A interface está responsiva
- [ ] Testado em diferentes navegadores

## 💡 Dicas

- **Comunique-se**: Comente nas issues se estiver trabalhando em algo
- **Pequenos PRs**: PRs menores são mais fáceis de revisar
- **Seja paciente**: Reviews podem levar algum tempo
- **Aprenda**: Use como oportunidade de aprendizado

## 📖 Recursos Úteis

- [Documentação do React](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Git Best Practices](https://git-scm.com/book/en/v2)

## 🙏 Agradecimentos

Toda contribuição, grande ou pequena, é valorizada e contribui para a comunidade acadêmica do ITA!

---

**Dúvidas?** Abra uma [issue](../../issues) ou participe das [discussions](../../discussions)!
