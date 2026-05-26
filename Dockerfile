FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile --production

COPY app.js ./

EXPOSE 3001

CMD ["node", "app.js"]