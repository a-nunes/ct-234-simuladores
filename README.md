<div align="center">

# 🎓 CT-234 - Simuladores de Algoritmos

### Instituto Tecnológico de Aeronáutica (ITA)

**Plataforma Interativa de Visualização de Algoritmos**

[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[🚀 Demo ao Vivo](#) • [📖 Documentação](docs/) • [🐛 Reportar Bug](../../issues) • [💡 Solicitar Feature](../../issues)

</div>

---

## 📋 Sobre o Projeto

Este projeto foi desenvolvido para auxiliar estudantes de pós-graduação do **Instituto Tecnológico de Aeronáutica (ITA)** no estudo e compreensão de algoritmos fundamentais em Ciência da Computação. A plataforma oferece **simuladores interativos** que permitem visualizar, passo a passo, o funcionamento de algoritmos clássicos de:

- 🔍 **Busca de Padrões** (String Matching)
- 📊 **Teoria dos Grafos** (Graph Theory)
- 🌳 **Árvores e Estruturas de Dados**

### 🎯 Objetivos

- ✅ Facilitar o aprendizado através de visualização interativa
- ✅ Permitir experimentação com diferentes entradas e parâmetros
- ✅ Demonstrar a execução passo a passo dos algoritmos
- ✅ Fornecer feedback visual sobre estados e transições
- ✅ Servir como material de apoio para disciplinas de Algoritmos

---

## ✨ Simuladores Disponíveis

### 🔍 Algoritmos de Busca de Padrões

<table>
<tr>
<td width="50%">

#### 🤖 Autômato Finito

Construtor interativo de autômatos finitos para reconhecimento de padrões em strings.

**Funcionalidades:**
- Construção passo a passo do autômato
- Tabela de transição de estados
- Teste de sufixos e reconhecimento de padrões
- Visualização do estado atual durante a busca

</td>
<td width="50%">

#### 🔎 Algoritmo KMP

Simulador do algoritmo Knuth-Morris-Pratt para busca eficiente de padrões.

**Funcionalidades:**
- Pré-processamento da função de falha
- Busca otimizada com visualização
- Comparação de caracteres passo a passo
- Análise de complexidade

</td>
</tr>
<tr>
<td width="50%">

#### 🎯 Algoritmo Boyer-Moore

Implementação do clássico algoritmo Boyer-Moore com heurísticas.

**Funcionalidades:**
- Heurística de caracteres ruins
- Tabela de última ocorrência
- Comparações da direita para esquerda
- Visualização de saltos otimizados

</td>
<td width="50%">
</td>
</tr>
</table>

### 📊 Algoritmos de Grafos

<table>
<tr>
<td width="50%">

#### 🔀 Ordenação Topológica

Compare os algoritmos de ordenação topológica usando Fila (Kahn) e Pilha (DFS).

**Funcionalidades:**
- Algoritmo de Kahn (baseado em fila)
- DFS com pilha
- Detecção de ciclos em grafos direcionados
- Visualização da ordem topológica

</td>
<td width="50%">

#### 🌐 Tarjan - Classificação de Arcos

Visualize a Busca em Profundidade (DFS) e a classificação de arcos.

**Funcionalidades:**
- DFS passo a passo
- Classificação de arcos: Árvore, Retorno, Avanço e Cruzamento
- Pilha de chamadas recursivas
- Tempos de descoberta e finalização

</td>
</tr>
<tr>
<td width="50%">

#### 🔗 Aplicações de Grafos

Explore algoritmos avançados em grafos direcionados.

**Funcionalidades:**
- Teste de aciclidade (DAG)
- Ordenação topológica
- Componentes fortemente conexas
- Análise estrutural de grafos

</td>
<td width="50%">

#### ⚡ Grafos Não-Orientados

Algoritmos específicos para grafos não-direcionados.

**Funcionalidades:**
- Teste de bipartição (2-coloração)
- Identificação de vértices de corte
- Detecção de arestas de corte (pontes)
- Análise de conectividade

</td>
</tr>
<tr>
<td width="50%">

#### 🧭 Algoritmo de Dijkstra

Encontra os caminhos mínimos de uma origem para todos os vértices.

**Funcionalidades:**
- Caminhos mínimos com pesos não-negativos
- Fila de prioridade
- Relaxamento de arestas
- Visualização do caminho mínimo

</td>
<td width="50%">

#### 🌳 Árvore Geradora Mínima (MST)

Encontra a árvore geradora de custo mínimo.

**Funcionalidades:**
- Algoritmo de Kruskal (Union-Find)
- Algoritmo de Prim (Crescimento)
- Comparação entre abordagens
- Visualização da MST resultante

</td>
</tr>
</table>

### 🛠️ Ferramentas Auxiliares

#### ✏️ Editor de Grafos

Crie e edite grafos de forma visual ou textual para testar nos simuladores.

**Funcionalidades:**
- Editor visual interativo com arrastar e soltar
- Editor de texto para definição rápida
- Exemplos pré-definidos de grafos clássicos
- Exportação/importação de grafos personalizados
- Integração com todos os simuladores de grafos

---

## 🚀 Começando

### 📋 Pré-requisitos

- **Node.js** >= 22.12 (recomendado: 24 LTS)
- **npm** >= 11 (o `.npmrc` usa `min-release-age` e `strict-allow-scripts`)

### 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/a-nunes/ct-234-simuladores.git
   cd ct-234-simuladores
   ```

2. **Instale as dependências** (exatamente as do lockfile)
   ```bash
   npm ci
   ```

3. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

   Acesse [http://localhost:3000](http://localhost:3000). O servidor de desenvolvimento só escuta em `127.0.0.1`.

### 📦 Scripts Disponíveis

- **`npm run dev`** (ou `npm start`) - Servidor de desenvolvimento Vite
- **`npm test`** - Executa todos os testes (Vitest) uma vez
- **`npm run test:watch`** - Testes em modo interativo
- **`npm run typecheck`** - Verificação de tipos (TypeScript)
- **`npm run build`** - Typecheck + build otimizado para produção (sem source maps)
- **`npm run preview`** - Serve o build localmente para conferência
- **`npm run audit`** - Auditoria das dependências de runtime (deve estar sempre limpa)
- **`npm run audit:all`** - Auditoria incluindo ferramentas de build (veja riscos aceitos em [SECURITY.md](SECURITY.md))

### 🏗️ Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados estarão na pasta `build/` e estarão prontos para deploy.

---

## 🐳 Deploy com Docker

O projeto inclui configuração Docker para facilitar o deploy em servidores.

A imagem final é um nginx **sem root** (uid 101, porta 8080) com CSP estrita e
cabeçalhos de segurança. O jeito mais simples de rodar localmente, já com as
restrições de produção (filesystem somente leitura, sem capabilities, limites de memória/PIDs):

```bash
docker compose up -d --build
```

Acesse em [http://localhost:8080](http://localhost:8080).

### Deploy

O deploy em produção usa **Kamal** no VPS da Oracle Cloud (arm64), atrás do
`kamal-proxy` com HTTPS automático. Veja [DEPLOY.md](DEPLOY.md). Os controles de
segurança e os riscos aceitos estão em [SECURITY.md](SECURITY.md).

---

## 📁 Estrutura do Projeto

```
ct-234-simuladores/
├── index.html                  # Entry HTML (Vite)
├── public/                     # Arquivos públicos estáticos
│   └── manifest.json
├── src/
│   ├── components/             # Componentes React dos simuladores
│   │   ├── AutomatonSimulator.tsx
│   │   ├── BoyerMooreSimulator.tsx
│   │   ├── KMPSimulator.tsx
│   │   ├── TarjanSimulator.tsx
│   │   ├── TopologicalSortSimulator.tsx
│   │   ├── GraphApplicationsSimulator.tsx
│   │   ├── UndirectedGraphSimulator.tsx
│   │   ├── DijkstraSimulator.tsx
│   │   ├── MSTSimulator.tsx
│   │   └── GraphEditor.tsx
│   ├── contexts/               # Context API para gerenciamento de estado
│   │   └── GraphContext.tsx
│   ├── hooks/                  # Custom React Hooks
│   │   └── useDragNodes.ts
│   ├── utils/                  # Funções utilitárias
│   │   └── graphConverter.ts
│   ├── App.tsx                 # Componente principal
│   └── index.tsx               # Entry point
├── docs/                       # Documentação adicional
│   ├── SIMULADORES.md
│   ├── CUSTOM_GRAPHS.md
│   └── bizus/
├── config/deploy.yml           # Configuração do Kamal (deploy)
├── Dockerfile                  # Build multi-stage → nginx sem root
├── compose.yaml                # Execução local endurecida
├── nginx.conf                  # Servidor + cabeçalhos de segurança
├── vite.config.ts              # Build e testes (Vite + Vitest)
├── DEPLOY.md                   # Guia de deploy
├── SECURITY.md                 # Modelo de ameaças e controles
├── package.json
└── README.md
```

---

## 🎨 Tecnologias Utilizadas

### Core

- **[React](https://react.dev/)** `19.3` - Biblioteca JavaScript para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** `7.0` - Superset tipado de JavaScript
- **[TailwindCSS](https://tailwindcss.com/)** `3.4.19` - Framework CSS utilitário

### UI/UX

- **[Lucide React](https://lucide.dev/)** - Ícones modernos e consistentes
- **CSS Grid & Flexbox** - Layout responsivo

### Tooling

- **[Vite](https://vite.dev/)** `8` - Build e servidor de desenvolvimento
- **[Vitest](https://vitest.dev/)** `5` + Testing Library - Testes
- **[PostCSS](https://postcss.org/)** - Transformação de CSS
- **[Docker](https://www.docker.com/)** - Containerização
- **[Nginx](https://nginx.org/)** - Servidor web para produção

---

## 📚 Documentação Adicional

- **[Guia de Simuladores](docs/SIMULADORES.md)** - Detalhes sobre cada simulador
- **[Grafos Customizados](docs/CUSTOM_GRAPHS.md)** - Como criar grafos personalizados
- **[Guia de Deploy](DEPLOY.md)** - Instruções para deploy em produção
- **[Como Contribuir](CONTRIBUTING.md)** - Diretrizes para contribuidores

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Este projeto é mantido para a comunidade acadêmica do ITA.

### Como Contribuir

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovoSimulador`)
3. Commit suas mudanças (`git commit -m 'Adiciona simulador de algoritmo X'`)
4. Push para a branch (`git push origin feature/NovoSimulador`)
5. Abra um Pull Request

### Diretrizes

- Mantenha o código limpo e bem documentado
- Siga os padrões de código TypeScript/React
- Adicione testes quando aplicável
- Atualize a documentação conforme necessário

Para mais detalhes, consulte [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📖 Uso Acadêmico

Este projeto foi desenvolvido com propósitos educacionais para o **Instituto Tecnológico de Aeronáutica (ITA)**. É livre para uso em:

- ✅ Estudos individuais
- ✅ Apresentações em sala de aula
- ✅ Trabalhos acadêmicos
- ✅ Pesquisa educacional

### Citação Sugerida

```
CT-234 Simuladores de Algoritmos. Instituto Tecnológico de Aeronáutica (ITA).
Disponível em: https://github.com/a-nunes/ct-234-simuladores
```

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autores e Colaboradores

Desenvolvido por Artur Ligieri Nunes, utilizando o material fornecido pelo **Instituto Tecnológico de Aeronáutica (ITA)**, para a comunidade acadêmica.

---

## 📧 Contato

Para dúvidas, sugestões ou contribuições, entre em contato:

- 🐛 Issues: [GitHub Issues](../../issues)
- 💬 Discussions: [GitHub Discussions](../../discussions)

---

## 🙏 Agradecimentos

- **Instituto Tecnológico de Aeronáutica (ITA)** - Pela excelência acadêmica
- **Professores e Alunos** - Pelas contribuições e feedback
- **Comunidade Open Source** - Pelas ferramentas e bibliotecas utilizadas

---

<div align="center">

**Desenvolvido com ❤️ no ITA**

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>
