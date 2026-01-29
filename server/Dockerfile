# =============================================
# Stage 1: Dependencies
# =============================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Generating Prisma Client
RUN npx prisma generate

# =============================================
# Stage 2: Builder
# =============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from the previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/prisma ./prisma

# Copy the source code
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

# Building the application
RUN npm run build

# =============================================
# Stage 3: Production
# =============================================
FROM node:22-alpine AS production

WORKDIR /app

# Copy only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy the Prisma schema and migrations for runtime
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# Copy the compiled application
COPY --from=builder /app/dist ./dist

# Create an entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
