ARG NODE_VERSION=22.7.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml prisma ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]