# Build Stage
FROM node:22-slim AS builder

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy all files first to ensure workspace integrity
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client (with dummy DB URL)
RUN cd packages/database && DATABASE_URL="postgresql://dummy" npx prisma generate

# Build the server
RUN pnpm --filter server build

# --- Production Stage ---
FROM node:22-slim AS runner
WORKDIR /app

# Install pnpm in runner to handle workspace deps correctly
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy everything from builder (Safe way for monorepo)
COPY --from=builder /app /app

# Set environment to production
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the server using pnpm to handle workspace symlinks
CMD ["pnpm", "--filter", "server", "start:prod"]
