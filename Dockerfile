# syntax=docker/dockerfile:1
#
# Imagens base fixadas por digest do índice multi-arch (amd64 + arm64).
# Tag e digest ficam direto no FROM para o Dependabot conseguir atualizá-los juntos.

# ---------- build ----------
# Roda na arquitetura do host de build: o resultado (HTML/JS/CSS) é independente
# de arquitetura, então "--platform linux/arm64" não precisa de emulação.
FROM --platform=$BUILDPLATFORM node:24.22.3-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS build
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
# --ignore-scripts: nenhum script de instalação de dependência é executado.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --no-audit --no-fund

COPY index.html vite.config.ts tsconfig.json postcss.config.js tailwind.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

# ---------- runtime ----------
# nginx sem root (uid 101), escutando em 8080.
FROM nginxinc/nginx-unprivileged:1.30.6-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03 AS runtime

# A imagem base é publicada com menos frequência que as correções do Alpine:
# aplica os patches de segurança dos pacotes do sistema (musl, zlib, expat...).
# Num build cross-arch (amd64 → arm64) este é o único passo emulado.
USER root
RUN apk upgrade --no-cache

LABEL org.opencontainers.image.title="ct-234-simuladores" \
      org.opencontainers.image.description="Simuladores de algoritmos da disciplina CT-234 (ITA)" \
      org.opencontainers.image.licenses="MIT"

# Conteúdo e config pertencem ao root e são só leitura para o processo nginx.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

USER 101
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
