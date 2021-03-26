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

#### Backend

- [x] Setup a GraphQL Server using TypeGraphQL and TypeORM
- [x] Register a user/add them to DB
- [x] Login users and create access and refresh tokens
- [x] Make authenticated (protected) mutations and queries in GQL
- [x] Refresh token if it expires
- [x] Revoke tokens for a user if user logs out, deletes there account, or if their account gets hacked

#### Frontend

- [x] Setup Apollo and GraphQL via Code Generator
- [x] Create some routes using react router
- [ ] Register and Login form
- [ ] Protecting routes/persisting session on refresh
- [ ] Handling expired tokens
- [ ] Fetching current user in headers, etc...

Stoping Point: https://youtu.be/25GS0MLT8JU?t=6055
