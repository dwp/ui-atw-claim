#ARG NODE_VERSION
ARG PORT

FROM node:22-alpine@sha256:9fcc1a6da2b9eee38638df75c5f826e06e9c79f6a0f97f16ed98fe0ebb0725c0 AS builder
RUN apk --no-cache update && apk upgrade
ARG GITLAB_REGISTRY_TOKEN
ENV PORT=${PORT}
WORKDIR /
COPY . .

RUN npm install && mkdir -p ./static/ && npm run build && npm prune --production

FROM node:22-alpine@sha256:9fcc1a6da2b9eee38638df75c5f826e06e9c79f6a0f97f16ed98fe0ebb0725c0
RUN apk upgrade libssl3 libcrypto3 && apk --no-cache add aws-cli=2.15.57-r0 jq=1.7.1-r0 curl=8.11.0-r2 && rm -rf /var/cache/apk/*
WORKDIR /
COPY --from=builder app.js .
COPY --from=builder /app/ /app/
COPY --from=builder /config/ /config/
COPY --from=builder /static/ /static/
COPY --from=builder /node_modules/ /node_modules/
COPY --from=builder package.json .
COPY --from=builder allowedNinos.txt .
COPY setupEnvAndStartService.sh /setupEnvAndStartService.sh
RUN mkdir -p /certs && chmod -R 755 /certs && chmod +x /setupEnvAndStartService.sh
RUN mkdir /sessions && chown -R node /sessions /static /certs /allowedNinos.txt
EXPOSE ${PORT}

COPY --from=pik94420.live.dynatrace.com/linux/oneagent-codemodules-musl:nodejs / /
ENV LD_PRELOAD /opt/dynatrace/oneagent/agent/lib64/liboneagentproc.so

CMD ["/setupEnvAndStartService.sh"]
USER node
