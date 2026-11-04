# ==========================================
# DUKAAN Atelier — Production Frontend Dockerfile
# Multi-Stage Build: Node.js 20 Builder -> NGINX Alpine Runtime
# ==========================================

# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for native modules (if any)
RUN apk add --no-cache libc6-compat

# Leverage Docker layer caching for dependencies
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build production bundle with TypeScript check
RUN npm run build

# 2. Production Runtime Stage
FROM nginx:alpine-slim AS runner

# Set metadata
LABEL maintainer="DUKAAN Engineering <priyanshubipin2006@gmail.com>"
LABEL description="Production High-Performance NGINX Image for DUKAAN Luxury E-Commerce Frontend"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled SPA bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy optimized NGINX SPA configuration
COPY nginx/frontend.conf /etc/nginx/conf.d/default.conf

# Add non-root user security hardening permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx

# Switch to non-root user
USER nginx

# Expose standard unprivileged HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]
