# 📋 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2026-11-17

### 🔒 Security
- Migração do Create React App (descontinuado) para **Vite 8 + Vitest 5**: elimina
  as 65 vulnerabilidades conhecidas do `react-scripts`; dependências de runtime sem vulnerabilidades.
- Política de supply chain no `.npmrc` (`min-release-age=14`, `strict-allow-scripts`, versões exatas).
- Imagem Docker endurecida: nginx sem root (uid 101, porta 8080), imagens base fixadas por
  digest, patches do Alpine aplicados, 0 CVEs no scan do Trivy.
- nginx: CSP estrita e demais cabeçalhos em todas as respostas (corrige a perda dos
  cabeçalhos nos assets por herança do `add_header`), HSTS atrás de HTTPS, apenas GET/HEAD,
  404 para caminhos inexistentes e arquivos ocultos.
- Build de produção sem source maps.
- Limites e validação de entrada contra travamentos da aba (Radix, Mochila, Troco,
  Atividades, LCS, Autômato, editor de grafos, busca de padrões, etc.) e `ErrorBoundary`.

### ✨ Added
- Deploy com Kamal no VPS da OCI (arm64) — `config/deploy.yml`.
- `compose.yaml` com as restrições de produção para execução local.
- CI no GitHub Actions (testes, auditoria, build, smoke test do container e Trivy) e Dependabot.
- `SECURITY.md` com modelo de ameaças, controles e riscos aceitos.

### 🔧 Changed
- React 19.3, TypeScript 7, Tailwind 3.4.19, lucide-react 1.x; Node.js 24 LTS no build.
- Grafos personalizados têm ids renumerados ao entrar nos simuladores (corrige
  falha ao simular depois de apagar vértices no editor).
- `DEPLOY.md` reescrito para Kamal/OCI (substitui o guia do Easypanel).

### 🗑️ Removed
- `craco`, `react-scripts`, `web-vitals` e arquivos do template do CRA.

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
