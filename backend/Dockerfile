# ---- Base Node ----
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci

# ---- Build ----
FROM dependencies AS build
COPY . .
RUN npm run build

# ---- Production ----
FROM node:18-alpine AS release
WORKDIR /app

# Set Node Env to Production
ENV NODE_ENV=production

# Copy built code and dependencies
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

# Optional: Add dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

EXPOSE 5000

# Start server
CMD ["dumb-init", "node", "dist/index.js"]
