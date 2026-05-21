# ── Stage 1: build frontend ─────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# ── Stage 2: production server ───────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copia o frontend compilado e o servidor
COPY --from=builder /app/dist ./dist
COPY server ./server

# Diretório de dados persistentes (users.json + access.log)
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "server/index.js"]
