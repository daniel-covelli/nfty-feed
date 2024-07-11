import { Response } from "express";
import "dotenv/config";

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    path: "/refresh_token",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? true : "none",
    secure: process.env.NODE_ENV === "development" ? false : true,
  });
};
