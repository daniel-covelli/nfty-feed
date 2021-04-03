FROM node

WORKDIR /nfty-feed

COPY ./server/package.json ./server/ 

RUN npm install -g npm@7.8.0
RUN yarn install --production

COPY ./server/dist ./server/dist
COPY ./server/.env.prod ./server/.env
COPY ./server/ormconfig.json ./server

WORKDIR ./server

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "dist/index.js"]