# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy source files
COPY . .

# Build the application
RUN pnpm build --filter=api

# Final stage
FROM debian:bookworm-slim

# Create a non-root user
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Copy only the compiled binary
COPY --from=builder /app/apps/api/dist/server ./server

# Set ownership to non-root user
RUN chown appuser:appuser /app/server

# Switch to non-root user
USER appuser

# Expose the port Railway expects
ENV PORT=3000
EXPOSE ${PORT}

# Run the binary
CMD ["./server"]