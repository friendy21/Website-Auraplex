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
# setting them in the Nomad env{} block does not change an already-built image.
# NEXT_PUBLIC_CHAT_API_URL is safe (the widget falls back to the production URL
# in code); NEXT_PUBLIC_SITE_URL must be correct at build time or passed as a
# build arg. See deploy/website.nomad.hcl.
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
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
