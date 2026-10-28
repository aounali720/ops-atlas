FROM node:22-alpine
WORKDIR /app
RUN mkdir -p /data && chown -R node:node /data
COPY --chown=node:node server.mjs ./server.mjs
USER node
EXPOSE 3000
CMD ["node", "server.mjs"]
