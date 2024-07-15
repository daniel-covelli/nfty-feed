FROM --platform=linux/amd64 node:21

WORKDIR /nfty-feed

# COPY ./package.json .
# COPY ./server/yarn.lock ./server/
# COPY ./server/package.json ./server/

# RUN npm install yarn
# RUN yarn install --production

# COPY ./server/dist ./server/dist
# COPY ./server/.env.prod ./server/.env
# COPY ./server/ormconfig.json ./server

# WORKDIR ./server

# ENV NODE_ENV production

# RUN yarn

# EXPOSE 4000

# CMD ["node", "dist/server/src/index.js"]

# Copy root package.json and yarn.lock
COPY package.json yarn.lock ./

# Copy server package.json
COPY server/package.json ./server/

# Install dependencies
RUN yarn install --frozen-lockfile --production

# Copy built server files
COPY server/dist ./server/dist

# Copy server configuration files
COPY server/.env.prod ./server/.env
COPY server/ormconfig.json ./server/

# Set working directory to server
WORKDIR ./server

# Set environment to production
ENV NODE_ENV production

# Expose the port your app runs on
EXPOSE 4000

# Start the server
CMD ["node", "dist/index.js"]