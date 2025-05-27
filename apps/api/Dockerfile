# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy rest of the files
COPY . ./

# Build the binary using the package.json script
RUN bun run build

# Final stage
FROM debian:bookworm-slim

# Create a non-root user
RUN useradd -m -u 1000 appuser

WORKDIR /app

# Copy only the compiled binary
COPY --from=builder /app/server ./server

# Set ownership to non-root user
RUN chown appuser:appuser /app/server

# Switch to non-root user
USER appuser

# Expose the port Railway expects
ENV PORT=3000
EXPOSE ${PORT}

# Run the binary
CMD ["./server"]