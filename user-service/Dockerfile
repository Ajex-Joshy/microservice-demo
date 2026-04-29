# Stage 1: Build
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --no-ignore-scripts

# Copy proto files (Assume relative to build context)
COPY proto ./proto

COPY . .

RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --no-ignore-scripts

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/proto ./proto

RUN addgroup -S usergroup && adduser -S useruser -G usergroup
USER useruser

EXPOSE 5001
EXPOSE 5052

CMD ["node", "dist/src/main.js"]