# syntax=docker/dockerfile:1
# Dockerfile for the Auraplex Next.js website. Place at repo root.
#
# ADAPTED FROM THE SUPPLIED pnpm VERSION TO npm. This repo's lockfile is
# package-lock.json and there is no pnpm-lock.yaml, so `pnpm install
# --frozen-lockfile` fails at the deps stage ("headless installation requires a
# pnpm-lock.yaml"). Only the two package-manager lines differ; the three-stage
# layout, the base image and the runner contract are unchanged.
#
# NOTE FOR OPS: NEXT_PUBLIC_* values are inlined by Next at BUILD time, so
# setting them in the Nomad env{} block CANNOT change an already-built image.
# They are therefore build args here, defaulted to the production values — see
# the builder stage below.
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public config. These are baked into the client bundle AND into
# server-rendered metadata (canonical, hreflang, og:url), so they must be
# correct HERE — a Nomad env{} entry set at runtime arrives far too late.
# Defaults are production; override per environment, e.g.
#   docker build --build-arg NEXT_PUBLIC_SITE_URL=https://staging.auraplex.info .
ARG NEXT_PUBLIC_SITE_URL=https://www.auraplex.info
ARG NEXT_PUBLIC_CHAT_API_URL=https://chat-api.auraplex.info
ARG NEXT_PUBLIC_PLAUSIBLE_DOMAIN=auraplex.info
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_CHAT_API_URL=$NEXT_PUBLIC_CHAT_API_URL
ENV NEXT_PUBLIC_PLAUSIBLE_DOMAIN=$NEXT_PUBLIC_PLAUSIBLE_DOMAIN

# `npm run build` also runs prebuild (tsx scripts/build-catalog.ts) and
# postbuild (pagefind), exactly as it does locally.
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# The standalone build brings its own node_modules subset.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
