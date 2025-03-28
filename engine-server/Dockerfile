FROM node:18-alpine AS builder

RUN apk add curl bash

# Fix: Current Prisma version failed to detect the libssl/openssl version to use
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3

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

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD [ "npm", "run", "start:migrate:prod" ]