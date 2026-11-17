# Deploy na Oracle Cloud (Kamal)

A aplicação é um site estático servido por um nginx **sem root** dentro de um
container. Em produção ela roda no VPS da OCI (Ampere A1, **arm64**) com
[Kamal 2](https://kamal-deploy.org/), atrás do `kamal-proxy`, que ocupa as
portas 80/443 do servidor, roteia por domínio e emite/renova o certificado
Let's Encrypt. O registro DNS no Cloudflare é **DNS-only** (nuvem cinza), como o
dos outros apps do servidor:

```
Navegador ──TLS (Let's Encrypt)──▶ kamal-proxy ──HTTP:8080 (rede docker "kamal")──▶ nginx (uid 101)
```

> **Não ligue o proxy do Cloudflare (nuvem laranja) sem mudar o TLS.** O Let's
> Encrypt do `kamal-proxy` valida pelo desafio TLS-ALPN na porta 443 da origem;
> atrás do proxy do Cloudflare o desafio falha e as renovações param. Para usar o
> proxy é preciso um certificado Cloudflare Origin CA na origem
> (`proxy.ssl.certificate_pem`/`private_key_pem` via `.kamal/secrets`) e modo SSL
> *Full (strict)*. Note também que o Cloudflare Web Analytics injeta um script
> que a CSP bloqueia (desative o RUM para o host).

## Pré-requisitos

- Kamal 2 instalado localmente (`kamal version`).
- Acesso SSH ao VPS com chave (usuário `ubuntu`).
- Um subdomínio com registro **A** (DNS-only) apontando para o IP público do VPS.
  O certificado é emitido na primeira requisição HTTPS depois que o DNS propagar.
- O Kamal faz o build a partir do **último commit** (git), então faça commit antes.

## Configuração

Tudo está em [`config/deploy.yml`](config/deploy.yml). IP e domínio **não** ficam
no repositório; eles vêm de variáveis de ambiente:

| Variável         | Obrigatória | Exemplo             |
|------------------|-------------|---------------------|
| `CT234_HOST`     | sim         | `ct234.seu-dominio` |
| `CT234_SERVER`   | sim         | IP público do VPS   |
| `CT234_SSH_USER` | não         | `ubuntu` (padrão)   |

O registry é o mesmo **registry local** do Kamal usado pelos outros apps
(`localhost:5555`, tunelado por SSH), então não há credenciais de registry.

## Primeiro deploy

```bash
export CT234_HOST=ct234.seu-dominio
export CT234_SERVER=<ip-do-vps>

kamal config     # valida a configuração localmente, sem tocar no servidor
kamal deploy     # build arm64, push, sobe o container e registra no kamal-proxy
```

> O `kamal-proxy` e a rede `kamal` já existem no servidor, por isso `kamal deploy`
> basta. Num servidor novo, use `kamal setup`.

O build da imagem roda a etapa Node na arquitetura da sua máquina (sem emulação)
e só o estágio final é arm64. O único passo emulado é o `apk upgrade` (alguns segundos).

## Verificação pós-deploy

```bash
curl -sI https://$CT234_HOST/ | grep -iE 'HTTP/|content-security|strict-transport|x-frame'
curl -s  https://$CT234_HOST/healthz            # → ok
curl -s -o /dev/null -w '%{http_code}\n' https://$CT234_HOST/.env   # → 404
kamal app details
kamal logs
```

Se o certificado demorar, confira o DNS (`dig +short $CT234_HOST`) e os logs do proxy
(`kamal proxy logs`).

## Operação

| Ação              | Comando                         |
|-------------------|---------------------------------|
| Novo deploy       | `kamal deploy`                  |
| Voltar versão     | `kamal rollback <versão>`       |
| Logs              | `kamal logs`                    |
| Parar / remover   | `kamal app stop` / `kamal remove` |

## Restrições do container em produção

Definidas em `servers.web.options` do `config/deploy.yml` (as mesmas do `compose.yaml`):

- filesystem raiz **somente leitura**; só `/tmp` é gravável (tmpfs `noexec,nosuid,nodev`);
- `--cap-drop ALL` e `no-new-privileges`;
- processo nginx como **uid 101** (sem root);
- limites de **64 MB** de RAM, **0,5** CPU e **64** PIDs (uso real: ~8 MB);
- sem portas publicadas no host: só o `kamal-proxy` alcança o container.

## Execução local

```bash
docker compose up -d --build     # http://localhost:8080 (só em 127.0.0.1)
docker compose down
```

Para testar exatamente a imagem arm64 do servidor:

```bash
docker buildx build --platform linux/arm64 -t ct-234-simuladores:arm64 --load .
```
