# ==========================================
# DUKAAN Atelier — Production Backend API Server Dockerfile
# Node.js 20 Alpine with Non-Root Security & Healthchecks
# ==========================================

FROM node:20-alpine

# Set node environment to production
ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /app

# Install security tools & wget for healthchecks
RUN apk add --no-cache wget

# Leverage caching for npm dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application source code
COPY . .

# Set permissions for unprivileged node user
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Expose backend port
EXPOSE 5000

# Container healthcheck against /health endpoint
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1

# Start the Express API server
CMD ["node", "src/index.js"]
