import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { buildTypeDefsAndResolvers } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { ProfileResolver } from './resolvers/ProfileResolver';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { User } from './entity/User';
import { getConnectionOptions, createConnection } from 'typeorm';
import { Profile } from './entity/Profile';
import { Subscription as Sub } from './entity/Subscription';
import { SubscriptionResolver } from './resolvers/SubscriptionResolver';
import http from 'http';
import bodyParser from 'body-parser';
import { Post } from './entity/Post';
import { Like } from './entity/Like';
import { PostResolver } from './resolvers/PostResolver';
import { LikeResolver } from './resolvers/LikeResolver';
import { InvitationResolver } from './resolvers/InvitationResolver';
import { Invitation } from './entity/Invitation';

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { getUser, MyContext } from './context';

// server set up
(async () => {
  const corsOptions = {
    credentials: true,
    origin: process.env.FRONTEND_HOST,
  };

  const app = express();
  app.set('trust proxy', 1);
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));

  // app.post("/refresh_token", async (req, res) => {
  //   const token = req.cookies.jid;
  //   if (!token) {
  //     return res.send({ ok: false, accessToken: "" });
  //   }

  //   let payload: any = null;
  //   try {
  //     payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
  //   } catch (err) {
  //     console.log(err);
  //     return res.send({ ok: false, accessToken: "" });
  //   }

  //   const user = await User.findOne({ id: payload.userId });

  //   if (!user) {
  //     return res.send({ ok: false, accessToken: "" });
  //   }

  //   if (user.tokenVersion !== payload.tokenVersion) {
  //     return res.send({ ok: false, accessToken: "" });
  //   }

  //   sendRefreshToken(res, createRefreshToken(user));

  //   return res.send({ ok: true, accessToken: createAccessToken(user) });
  // });

  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  process.env.NODE_ENV === 'production'
    ? await createConnection({
        ...connectionOptions,
        url: process.env.DATABASE_URL ?? '',
        entities: [User, Profile, Sub, Post, Like, Invitation],
        name: 'default',
        type: 'postgres',
        database: 'postgres',
      })
    : await createConnection({ ...connectionOptions, name: 'default' });

  const schema = await buildTypeDefsAndResolvers({
    resolvers: [
      UserResolver,
      ProfileResolver,
      SubscriptionResolver,
      PostResolver,
      LikeResolver,
      InvitationResolver,
    ],
  });

  const httpServer = http.createServer(app);

  const server = new ApolloServer<MyContext>({
    ...schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  const redisClient = createClient();
  redisClient.connect().catch(console.error);

  app.use(
    '/',
    session({
      secret: process.env.SESSION_SECRET ?? '',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      store: new RedisStore({ client: redisClient, prefix: `nfty-app.` }),
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : undefined,
        domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined,
        // 30 days in development, 90 minutes in production
        maxAge: process.env.NODE_ENV === 'development' ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 90,
      },
      name: "nfty"
    }),
  );

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {req, user: await getUser(req)};
      },
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || 4000 }, resolve),
  );

  console.log(`🚀 Server ready at ${process.env.PORT ? process.env.PORT : 4000} `);
})();
