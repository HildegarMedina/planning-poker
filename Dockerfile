# syntax=docker/dockerfile:1.6
# ============================================================
# Planning Poker — Multi-stage Dockerfile (dev + prod)
# ============================================================

# ---------- Stage 1: dev ----------
# Includes all dependencies (incl. nodemon). Used by docker-compose.override.yml
# for local development with live-reload. Source code is mounted as a volume,
# so it doesn't need to be COPY'd here.
FROM node:22-alpine AS dev
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "dev"]


# ---------- Stage 2: prod ----------
# Slim image with production dependencies only. Code is baked into the image.
FROM node:22-alpine AS prod
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "app.js"]
