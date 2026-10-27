FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD npx prisma migrate deploy && npx prisma db seed && node src/index.js
