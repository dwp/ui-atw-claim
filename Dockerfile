#ARG NODE_VERSION
ARG PORT

FROM node:18-alpine@sha256:982b5b6f07cd9241c9ebb163829067deac8eaefc57cfa8f31927f4b18943d971 AS builder
RUN apk --no-cache update && apk upgrade
ARG GITLAB_REGISTRY_TOKEN
ENV PORT=${PORT}
WORKDIR /
COPY . .

RUN npm install && mkdir -p ./static/ && npm run build && npm prune --production

FROM node:18-alpine@sha256:982b5b6f07cd9241c9ebb163829067deac8eaefc57cfa8f31927f4b18943d971
RUN apk upgrade libssl3 libcrypto3 && apk --no-cache add aws-cli=2.13.5-r0 jq=1.6-r4 curl=8.5.0-r0 && rm -rf /var/cache/apk/*
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
CMD ["/setupEnvAndStartService.sh"]
USER node
