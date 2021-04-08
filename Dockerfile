FROM node

WORKDIR /nfty-feed

COPY ./package.json .

RUN npm install yarn
RUN yarn install --production

COPY ./server/package.json ./server/
COPY ./server/yarn.lock ./server 

COPY ./server/dist ./server/dist
COPY ./server/.env.prod ./server/.env
COPY ./server/ormconfig.json ./server

WORKDIR ./server

RUN yarn

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "dist/index.js"]