FROM oven/bun:canary as builder

WORKDIR /app

COPY . .
RUN bun install && bun run build

# 🧊 Stage 2: Production
FROM oven/bun:canary as runner

WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000

CMD ["bun", "run","start"]


