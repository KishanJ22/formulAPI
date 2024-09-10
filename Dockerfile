ARG NODE_VERSION=22.7.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm build

RUN mkdir -p /usr/src/app/node_modules/.vite && chown -R node:node /usr/src/app/node_modules

EXPOSE 3000

USER node

CMD ["pnpm", "start"]
