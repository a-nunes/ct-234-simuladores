# 📋 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-11-11

### 🎉 Lançamento Inicial

#### ✨ Adicionado

**Simuladores de Busca de Padrões:**
- Simulador de Autômato Finito com construção passo a passo
- Simulador do Algoritmo KMP (Knuth-Morris-Pratt)
- Simulador do Algoritmo Boyer-Moore

**Simuladores de Grafos Direcionados:**
- Simulador de Ordenação Topológica (Kahn e DFS)
- Simulador Tarjan com Classificação de Arcos
- Simulador de Aplicações de Grafos (DAG, Componentes Fortemente Conexas)

**Simuladores de Grafos Não-Direcionados:**
- Teste de Bipartição
- Identificação de Vértices de Corte
- Detecção de Pontes (Arestas de Corte)

**Algoritmos de Caminhos e Árvores:**
- Simulador do Algoritmo de Dijkstra
- Simulador de Árvore Geradora Mínima (Kruskal e Prim)

**Ferramentas:**
- Editor Visual de Grafos com arrastar e soltar
- Editor de Texto para definição rápida de grafos
- Galeria de grafos pré-definidos
- Context API para compartilhamento de grafos entre simuladores

#### 🎨 Interface
- Design responsivo com TailwindCSS
- Tema com cores institucionais
- Ícones Lucide React
- Navegação intuitiva entre simuladores
- Feedback visual claro

#### 🛠️ Infraestrutura
- Configuração TypeScript
- Setup com Create React App
- Dockerfile para containerização
- Nginx para produção
- Documentação completa de deploy

#### 📚 Documentação
- README.md profissional
- Guia de contribuição (CONTRIBUTING.md)
- Templates de Issues e Pull Requests
- Documentação técnica em `/docs`
- Guia de deploy (DEPLOY.md)

---

## Tipos de Mudanças

- `Added` - Novas funcionalidades
- `Changed` - Mudanças em funcionalidades existentes
- `Deprecated` - Funcionalidades que serão removidas em breve
- `Removed` - Funcionalidades removidas
- `Fixed` - Correções de bugs
- `Security` - Correções de vulnerabilidades

---

## Como Ler Este Changelog

- **[1.0.0] - YYYY-MM-DD** - Versões lançadas com data

---

**Para a história completa de commits, veja:** [GitHub Commits](../../commits/main)
