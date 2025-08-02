FROM oven/bun:1.1.4 as builder

WORKDIR /app

COPY . .
RUN bun install && bun run build

# 🧊 Stage 2: Production
FROM oven/bun:1.1.4 as runner

WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000

CMD ["bun", "start"]


