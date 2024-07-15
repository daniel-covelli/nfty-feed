import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { ProfileResolver } from "./resolvers/ProfileResolver";
import cookieParser from "cookie-parser";
import cors from "cors";
import { User } from "./entity/User";
import { getConnectionOptions, createConnection } from "typeorm";
import { Profile } from "./entity/Profile";
import { Subscription as Sub } from "./entity/Subscription";
import { SubscriptionResolver } from "./resolvers/SubscriptionResolver";
import http from "http";
import bodyParser from "body-parser";
import { Post } from "./entity/Post";
import { Like } from "./entity/Like";
import { PostResolver } from "./resolvers/PostResolver";
import { LikeResolver } from "./resolvers/LikeResolver";
import { InvitationResolver } from "./resolvers/InvitationResolver";
import { Invitation } from "./entity/Invitation";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient } from "redis";
import { getUser, MyContext } from "./context";
import { customAuthChecker } from "./auth";

// server set up
async function main() {
  const corsOptions = {
    credentials: true,
    origin: process.env.FRONTEND_HOST,
  };

  const app = express();
  app.set("trust proxy", 1);
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "50mb" }));

  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "production") {
    console.log(process.env.DATABASE_URL, "process.env.DATABASE_URL");
    console.log(connectionOptions, "connectionOptions");
    await createConnection({
      ...connectionOptions,
      url: process.env.DATABASE_URL ?? "",
      entities: [User, Profile, Sub, Post, Like, Invitation],
      name: "default",
      type: "postgres",
      database: "postgres",
    });
  } else {
    await createConnection({ ...connectionOptions, name: "default" });
  }

  const schema = await buildTypeDefsAndResolvers({
    resolvers: [
      UserResolver,
      ProfileResolver,
      SubscriptionResolver,
      PostResolver,
      LikeResolver,
      InvitationResolver,
    ],
    authChecker: customAuthChecker,
  });

  const httpServer = http.createServer(app);

  const server = new ApolloServer<MyContext>({
    ...schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  const redisClient = createClient({ url: process.env.REDISCLOUD_URL });
  redisClient.connect();

  app.use(
    "/",
    session({
      secret: process.env.SESSION_SECRET ?? "",
      resave: false,
      saveUninitialized: false,
      rolling: true,
      store: new RedisStore({ client: redisClient, prefix: `nfty-app.` }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
        domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
        // 30 days in development, 90 minutes in production
        maxAge: process.env.NODE_ENV === "development" ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 90,
      },
      name: "nfty",
    }),
  );

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        return { req, user: await getUser(req) };
      },
    }),
  );

  app.get("/hello", (_req, res) => {
    console.log("hello");
    res.send("Hello World!");
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || 4000 }, resolve),
  );

  console.log(`🚀 Server ready at ${process.env.PORT ? process.env.PORT : 4000} `);
}

main();
