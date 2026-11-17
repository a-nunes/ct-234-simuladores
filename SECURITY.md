# Segurança

## Modelo de ameaças

Os simuladores são uma **SPA 100% estática**: não há backend, banco de dados,
autenticação, cookies, `fetch`, `localStorage` nem dados de usuários. Tudo roda no
navegador de quem acessa. As superfícies relevantes são, portanto:

1. **Cadeia de suprimentos** (dependências npm, imagens base, GitHub Actions);
2. **Servidor HTTP** (nginx) e o **container** que o executa;
3. **Navegador**: injeção de conteúdo (XSS), clickjacking e entradas que travam a aba.

## Controles implementados

### Dependências e build
- Build com **Vite 8 + Vitest 5** (o Create React App foi descontinuado e trazia
  65 vulnerabilidades conhecidas sem correção possível).
- Dependências de runtime: apenas `react`, `react-dom` e `lucide-react`;
  `npm audit --omit=dev` **sem vulnerabilidades**.
- `.npmrc`:
  - `min-release-age=14`: só instala versões publicadas há pelo menos 14 dias, o que
    dá tempo para pacotes comprometidos serem detectados e retirados do registry;
  - `strict-allow-scripts=true`: falha a instalação se algum pacote tiver script de
    instalação não revisado em `allowScripts` (`package.json`);
  - `save-exact=true`: versões exatas.
- Docker e CI instalam com `npm ci --ignore-scripts`; o CI roda `npm audit signatures`.
- **Sem source maps** em produção.

### Imagem e container
- Multi-stage: o Node.js só existe no estágio de build; a imagem final é
  `nginxinc/nginx-unprivileged` (uid 101, porta 8080) com os patches do Alpine aplicados.
- Imagens base **fixadas por digest** do índice multi-arch; o Dependabot as atualiza.
- `.dockerignore` em modo allowlist: nada de `.git`, `.env`, chaves ou testes no contexto de build.
- Em execução: rootfs **somente leitura**, `cap-drop ALL`, `no-new-privileges`,
  `/tmp` em tmpfs `noexec`, limites de memória/CPU/PIDs, sem portas expostas fora do proxy.
- Trivy no CI: falha com CVE HIGH/CRITICAL corrigível, segredo ou misconfiguração.

### nginx
- Cabeçalhos em **todas** as respostas (inclusive assets, 404 e 405):
  - `Content-Security-Policy` estrita: `default-src 'none'`, `script-src 'self'`,
    `style-src 'self'`, sem `unsafe-inline`/`unsafe-eval`, `frame-ancestors 'none'`,
    `base-uri 'none'`, `form-action 'none'`;
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`,
    `Permissions-Policy`, `Cross-Origin-Opener-Policy` e `Cross-Origin-Resource-Policy`;
  - `Strict-Transport-Security` apenas quando a requisição chegou ao proxy via HTTPS.
- Corrigido o bug de herança do `add_header`: antes, os blocos `location` com
  `add_header` apagavam os cabeçalhos de segurança dos assets e do `index.html`.
- Somente `GET`/`HEAD` (demais métodos → 405); arquivos ocultos → 404; caminhos
  inexistentes → 404 (antes devolviam `index.html` com 200); sem listagem de diretórios;
  `server_tokens off`; redirecionamentos relativos; limites de corpo, cabeçalho e timeouts.

### Aplicação (entradas do usuário)
Revisão de todos os pontos onde a entrada do usuário vira estrutura de dados. Não há
sinks de HTML/URL nem `RegExp` construída com entrada do usuário; o React escapa todo
texto renderizado. Os problemas encontrados eram de **negação de serviço da própria
aba** e foram corrigidos com limites e validação (cobertos por testes):

| Simulador | Entrada problemática | Efeito anterior | Correção |
|---|---|---|---|
| Radix Sort | base = 1 | laço infinito até estourar a memória | base inteira entre 2 e 16 |
| Mochila 0/1 | capacidade 5000 | ~40 mil passos com cópia da tabela inteira | capacidade ≤ 20 |
| Troco (PD) | moeda negativa | laço infinito na reconstrução da solução | moedas entre 1 e 100 + guarda no laço |
| Seleção de Atividades | fim = 1e9 | alocação de 5×10⁸ elementos | tempos entre 0 e 100 |
| LCS | strings longas coladas | tabelas (m+1)(n+1) copiadas a cada passo | até 12 letras |
| Autômato | alfabeto com `__proto__` | app inteira desmontada | só símbolos de 1 caractere, sem repetição, até 10 |
| Grafos (editor) | ids com lacunas, grafos enormes | simulação não iniciava / travava | ids renumerados 0..n-1; até 26 vértices, 200 arestas, rótulos de até 8 caracteres |
| KMP / Boyer-Moore / Seleção / Busca Binária / Karatsuba | entradas grandes | lentidão | limites de tamanho |

Além disso, um `ErrorBoundary` evita que um erro inesperado deixe a tela em branco.

## Riscos aceitos

- **`picomatch` (GHSA-fc5q-39xc-vjpf, ReDoS)**: o advisory atinge todas as versões
  publicadas e ainda não há correção. Só é explorável quando um atacante controla
  padrões *glob*; aqui os globs vêm da configuração do próprio projeto e o pacote
  só é usado em build/testes (Vite, Vitest, Tailwind), nunca no bundle do navegador.
  Por isso `npm audit` (dev) aparece como informativo no CI, enquanto o
  `npm audit --omit=dev` é bloqueante. Remover quando sair a correção.
- **Bundle único de ~720 kB (157 kB gzip)**: questão de desempenho, não de segurança.
  Pode ser dividido por simulador com `React.lazy`.

## Reportando vulnerabilidades

Abra uma issue **sem detalhes exploráveis** pedindo um canal privado, ou use o
[reporte privado de vulnerabilidades do GitHub](../../security/advisories/new).
