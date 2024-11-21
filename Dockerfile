ARG NODE_VERSION=22.7.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

COPY prisma ./prisma/

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

RUN mkdir -p /usr/src/app/node_modules/.vite && chown -R node:node /usr/src/app/node_modules

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD ["curl", "-f", "http://localhost:3000/health"]

EXPOSE 3000

USER node

CMD ["pnpm", "start"]
