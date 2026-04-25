# Stage 1: Build
FROM node:22-alpine AS builder

# Install build dependencies required by Prisma and other native modules
RUN apk add --no-cache libc6-compat openssl

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy dependency definition files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for the build step)
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/
RUN pnpm prisma generate

COPY . .
COPY proto ./proto

RUN pnpm run build

# Stage 2: Production
FROM node:22-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

# Copy built artifacts from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/proto ./proto
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Security: Create and run as a non-root user
RUN addgroup -S ordergroup && adduser -S orderuser -G ordergroup
USER orderuser

EXPOSE 3001

CMD ["node", "dist/main.js"]
