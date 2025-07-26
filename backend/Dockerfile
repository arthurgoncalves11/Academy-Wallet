FROM node:20-alpine

RUN apk add --no-cache ca-certificates && \
    update-ca-certificates
 
WORKDIR /app
 
COPY package.json pnpm-lock.yaml ./
 
RUN corepack enable && \
    corepack prepare pnpm@9.15.4 --activate

RUN pnpm install --frozen-lockfile
 
COPY . .
 
EXPOSE 3000
 
CMD ["pnpm", "start:dev"]