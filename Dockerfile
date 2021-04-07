FROM node

WORKDIR /nfty-feed
RUN ls
COPY ./package.json .
COPY ./server/package.json ./server/ 

RUN npm install -g npm@7.8.0
RUN npm install -g --force yarn
RUN yarn install --production

COPY ./server/dist ./server/dist/
COPY ./server/.env.prod ./server/.env/
COPY ./ormconfig.json .

WORKDIR ./server

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "dist/index.js"]