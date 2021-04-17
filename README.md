# nfty-feed

Beginnings of a Social Network for NFTs.

This project is starting off using [Ben Awad](https://github.com/benawad)'s YouTube tutorial on [JWT and React](https://www.youtube.com/watch?v=25GS0MLT8JU&ab_channel=BenAwad). The starter code can be found [here](https://github.com/benawad/jwt-auth-example).

#### Technologies

- Typescript
- GraphQL (query/mutation layer)
- TypeGraphQL (for integrating GQL and backend in TS)
- PostgreSQL (for storing users)
- TypeORM (interface with PostgreSQL)
- React (frontend)
- Apollo (to make requests in React)
- Express (server)
- Docker

#### Backend Setup

- [x] Setup a GraphQL Server using TypeGraphQL and TypeORM
- [x] Register a user/add them to DB
- [x] Login users and create access and refresh tokens
- [x] Make authenticated (protected) mutations and queries in GQL
- [x] Refresh token if it expires
- [x] Revoke tokens for a user if user logs out, deletes there account, or if their account gets hacked
- [x] Put yarn workspace in a docker image

#### Frontend SetUp

- [x] Setup Apollo and GraphQL via Code Generator
- [x] Create some routes using react router
- [x] Register and Login form
- [x] Protecting routes/persisting session on refresh
- [x] Handling expired tokens
- [x] Fetching current user in headers, etc...
- [x] Logging out a user
- [x] Add nav bar

#### Active Scrum

- [ ] fix message for routes that don't exist
- [ ] profile menu image instead of text

Website: https://nftyfeed.com/
