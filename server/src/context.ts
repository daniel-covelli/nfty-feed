import { createParamDecorator } from "type-graphql";
import { User } from "./entity/User";
import express from "express";

declare module "express-session" {
    export interface SessionData {
      userId?: string;
    }
  }

export interface MyContext {
    req: express.Request;
    user?: User
  }

export const getUser = async (req: Express.Request) => {
    try {
      if (req.session?.userId) {
        const user = await User.findOne(req.session.userId)
        return user
      } else {
        return undefined;
      }
    } catch (err) {

      return undefined;
    }
  };

  export const CurrentEndUser = () => {
    return createParamDecorator<MyContext>(({ context }) => context.user);
  };