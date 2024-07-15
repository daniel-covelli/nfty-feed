FROM --platform=linux/amd64 node

WORKDIR /nfty-feed

COPY ./package.json .
COPY ./server/yarn.lock ./server/
COPY ./server/package.json ./server/

RUN npm install yarn
RUN yarn install --production

COPY ./server/dist ./server/dist
COPY ./server/.env.prod ./server/.env
COPY ./server/ormconfig.json ./server

WORKDIR ./server

ENV NODE_ENV production

RUN yarn

EXPOSE 4000

CMD ["node", "dist/index.js"]