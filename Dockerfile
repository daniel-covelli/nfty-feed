FROM node

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

RUN yarn

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "dist/index.js"]