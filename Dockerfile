ARG NODE_VERSION=22.7.0

# Builder stage
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/app

COPY --chown=node:node prisma ./prisma/
COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm install --frozen-lockfile --no-cache

COPY --chown=node:node . .

RUN pnpm build

# Production stage
FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./

EXPOSE 3000

USER node

CMD ["pnpm", "start"]
