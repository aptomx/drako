# Development dependencies stage
FROM node:22 AS dev-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm pkg delete scripts.prepare
RUN npm ci --only=development

# Production dependencies stage
FROM node:22 AS prod-deps
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm pkg delete scripts.prepare
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM node:22 AS development
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY --from=dev-deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN chown -R node:node /usr/src/app
USER node
CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]

# Build stage
FROM node:22 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY --from=dev-deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN chown -R node:node /usr/src/app
USER node

# Production stage
FROM node:22-alpine AS production
RUN apk add --no-cache dumb-init
WORKDIR /usr/src/app
COPY --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./
RUN chown -R node:node /usr/src/app
USER node
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]