FROM node:18-alpine AS builder

RUN apk add --no-cache curl bash

# Fix: Current Prisma version failed to detect the libssl/openssl version to use
RUN apk add --no-cache openssl1.1 \
  && ln -s /usr/lib/libssl.so.1.1 /lib/libssl.so.1.1

# Create app directory
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

COPY prisma ./prisma/

# Install app dependencies
RUN yarn

COPY . .

RUN yarn build

FROM node:18-alpine

RUN apk add --no-cache openssl1.1 \
  && ln -s /usr/lib/libssl.so.1.1 /lib/libssl.so.1.1

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD [ "npm", "run", "start:migrate:prod" ]