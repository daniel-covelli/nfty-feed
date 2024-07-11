import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "@apollo/server";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { ProfileResolver } from "./resolvers/ProfileResolver";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import cors from "cors";
import { User } from "./entity/User";
import { createAccessToken, createRefreshToken } from "./auth";
import { sendRefreshToken } from "./sendRefreshToken";
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
import { MyContext } from "./migration/MyContext";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// server set up
(async () => {
  var corsOptions = {
    credentials: true,
    origin: process.env.FRONTEND_HOST,
  };

  const app = express();
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "50mb" }));

  app.get("/", (_req, res) => res.send("Hello World"));

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }

    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  const createTypeOrmConn = async () => {
    const connectionOptions: any = await getConnectionOptions(process.env.NODE_ENV);

    return process.env.NODE_ENV === "production"
      ? createConnection({
          ...connectionOptions,
          url: process.env.DATABASE_URL,
          entities: [User, Profile, Sub, Post, Like, Invitation],
          name: "default",
        })
      : createConnection({ ...connectionOptions, name: "default" });
  };

  await createTypeOrmConn();

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

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<MyContext> => {
        return {
          req,
          res,
          ...(typeof req.headers.userId === "string"
            ? {
                payload: {
                  userId: req.headers.userId,
                },
              }
            : {}),
        };
      },
    }),
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: process.env.PORT || 4000 }, resolve),
  );

  console.log(`🚀 Server ready at ${process.env.PORT ? process.env.PORT : 4000} `);
})();
