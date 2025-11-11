# Deploy no Easypanel

Este guia mostra como fazer o deploy da aplicação React no Easypanel usando Docker.

## Pré-requisitos

- Conta no Easypanel configurada
- Acesso à sua VPS
- Repositório Git (GitHub, GitLab, etc.) com o código

## Opção 1: Deploy via Git (Recomendado)

### 1. Preparar o Repositório

Certifique-se de que todos os arquivos necessários estão commitados:

```bash
git add .
git commit -m "Add Docker configuration"
git push
```

### 2. Criar Aplicação no Easypanel

1. Acesse o painel do Easypanel
2. Clique em **"Create Application"** ou **"New App"**
3. Escolha **"Deploy from GitHub"** (ou seu provedor Git)
4. Selecione o repositório do projeto
5. Configure as seguintes opções:

**Build Settings:**
- Build Method: `Dockerfile`
- Dockerfile Path: `./Dockerfile` (padrão)
- Build Context: `./` (padrão)

**Port Configuration:**
- Container Port: `80`
- Public Port: `80` ou `443` (se usar HTTPS)

**Environment Variables:**
Não é necessário adicionar variáveis de ambiente, a menos que você tenha configurações específicas.

### 3. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build e deploy completarem
3. O Easypanel fornecerá uma URL para acessar sua aplicação

### 4. Configurar Domínio (Opcional)

1. No painel da aplicação, vá em **"Domains"**
2. Adicione seu domínio customizado
3. Configure o DNS do seu domínio para apontar para o IP da VPS
4. O Easypanel pode configurar SSL/HTTPS automaticamente

## Opção 2: Deploy Manual via Docker

Se preferir fazer deploy manual:

### 1. Build da Imagem

```bash
# Na pasta do projeto
docker build -t ct-234-simuladores .
```

### 2. Testar Localmente

```bash
docker run -p 8080:80 ct-234-simuladores
```

Acesse `http://localhost:8080` para verificar se está funcionando.

### 3. Push para Registry

```bash
# Tag a imagem
docker tag ct-234-simuladores seu-usuario/ct-234-simuladores:latest

# Push para Docker Hub (ou seu registry)
docker push seu-usuario/ct-234-simuladores:latest
```

### 4. Deploy no Easypanel

1. No Easypanel, crie uma nova aplicação
2. Escolha **"Deploy from Docker Registry"**
3. Informe: `seu-usuario/ct-234-simuladores:latest`
4. Configure a porta: `80`
5. Faça o deploy

## Configurações Avançadas

### Variáveis de Ambiente

Se precisar adicionar variáveis de ambiente para a aplicação React, você pode fazer isso de duas formas:

**1. Durante o build (recomendado para React):**

Adicione um arquivo `.env.production` na raiz do projeto:

```env
REACT_APP_API_URL=https://sua-api.com
REACT_APP_ENV=production
```

**2. No Easypanel:**

Vá em **"Environment Variables"** e adicione as variáveis necessárias.

**Importante:** Variáveis React devem começar com `REACT_APP_` para serem incluídas no build.

### Resources (CPU/Memória)

Configurações recomendadas no Easypanel:

- **Memory:** 512MB - 1GB
- **CPU:** 0.5 - 1 vCPU

Ajuste conforme a necessidade e tamanho da aplicação.

### Logs

Para visualizar logs da aplicação:

1. No Easypanel, vá na sua aplicação
2. Clique em **"Logs"**
3. Você verá os logs do Nginx e do container

### Health Checks

O Easypanel pode configurar health checks automaticamente. Se precisar customizar:

- **Health Check Path:** `/`
- **Port:** `80`
- **Interval:** `30s`

## Troubleshooting

### Build falha

1. Verifique se o `Dockerfile` está na raiz do projeto
2. Confira os logs de build no Easypanel
3. Teste o build localmente primeiro

### Aplicação não carrega

1. Verifique se a porta está correta (80)
2. Confira os logs da aplicação
3. Teste se o container funciona localmente

### Erro 404 ao navegar

Se você usa React Router e recebe erro 404 ao acessar rotas diretamente:

1. O arquivo `nginx.conf` já inclui a configuração necessária
2. Verifique se o arquivo está sendo copiado corretamente no Dockerfile

### Rebuild/Redeploy

Para fazer redeploy após mudanças:

1. Faça commit e push das alterações
2. No Easypanel, clique em **"Rebuild"** ou **"Redeploy"**
3. Ou configure **Auto Deploy** para deploy automático em cada push

## Otimizações

### Cache de Layers

O Dockerfile já está otimizado para cache de layers do Docker:
- Dependências são instaladas antes de copiar o código fonte
- Isso acelera builds subsequentes

### Compressão

O nginx.conf já inclui compressão gzip para assets.

### Build Performance

Se o build estiver lento, você pode:

1. Usar `npm ci` em vez de `npm install` (já configurado)
2. Configurar cache de build no Easypanel (se disponível)
3. Otimizar dependências removendo pacotes não utilizados

## Segurança

### HTTPS

O Easypanel geralmente fornece HTTPS automático via Let's Encrypt. Se não:

1. Vá em **"Domains"**
2. Ative **"Enable SSL"**

### Headers de Segurança

O `nginx.conf` já inclui headers de segurança básicos:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

## Monitoramento

No painel do Easypanel você pode monitorar:

- CPU e memória utilizados
- Status da aplicação
- Logs em tempo real
- Uptime

## Suporte

Para problemas específicos do Easypanel, consulte:
- [Documentação oficial do Easypanel](https://easypanel.io/docs)
- Comunidade Discord do Easypanel

---

## Resumo Rápido

```bash
# 1. Commit e push do código
git add .
git commit -m "Add Docker configuration"
git push

# 2. No Easypanel:
# - Create Application
# - Deploy from GitHub
# - Select repository
# - Deploy method: Dockerfile
# - Port: 80
# - Deploy!
```

Pronto! Sua aplicação estará no ar. 🚀
