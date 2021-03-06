# nfty-feed

Beginnings of a Social Network for NFTs.

This project was started off using [Ben Awad](https://github.com/benawad)'s YouTube tutorial on [JWT and React](https://www.youtube.com/watch?v=25GS0MLT8JU&ab_channel=BenAwad). The starter code can be found [here](https://github.com/benawad/jwt-auth-example).

#### Architecture

![simplified architecture](https://res.cloudinary.com/nftyfeed/image/upload/v1619587135/Screen_Shot_2021-04-27_at_10.16.04_PM_ncgrbn.png)

The project is deployed to Heroku (backend) and Netlify (frontend) with GQL/Apollo as the intermediary API layer.

#### Feature Spotlight

- Infinite Scroll
- Invitations

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

#### Active Scrum

- [ ] fix logout error on reload on mobile
- [ ] add url to profile
- [ ] page not found
- [ ] mobile bottom nav
- [ ] react native
- [ ] video
- [ ] zoom
- [x] remove underline from profile button
- [x] post count on profile
- [ ] followers/following modal

#### Known Technical Debt

- [ ] dropzone/cropper components
- [ ] register/editprofile resolver logic
- [ ] register component

#### Archive

- [x] infinite scroll
- [x] invitations
- [x] make invisible bug
- [x] dropzone only images
- [x] update cache on like
- [x] fix message for routes that don't exist
- [x] profile menu image instead of text
- [x] design profile page
- [x] implement profile editing
- [x] profile image uploading
- [x] cropping
- [x] edit profile photo
- [x] profile photo modal
- [x] following/unfollowing
- [x] posts
- [x] navbar update

- [x] Setup a GraphQL Server using TypeGraphQL and TypeORM
- [x] Register a user/add them to DB
- [x] Login users and create access and refresh tokens
- [x] Make authenticated (protected) mutations and queries in GQL
- [x] Refresh token if it expires
- [x] Revoke tokens for a user if user logs out, deletes there account, or if their account gets hacked
- [x] Put yarn workspace in a docker image
- [x] Setup Apollo and GraphQL via Code Generator
- [x] Create some routes using react router
- [x] Register and Login form
- [x] Protecting routes/persisting session on refresh
- [x] Handling expired tokens
- [x] Fetching current user in headers, etc...
- [x] Logging out a user
- [x] Add nav bar

Website: https://nftyfeed.com/
