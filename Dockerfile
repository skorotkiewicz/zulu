FROM oven/bun:canary-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY index.html index.js favicon.svg ./
RUN mkdir -p data

ENV NODE_ENV=production
ENV PORT=8765

EXPOSE 8765

CMD ["bun", "start"]
