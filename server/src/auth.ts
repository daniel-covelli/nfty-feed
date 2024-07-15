import "dotenv/config";
import { MyContext } from "./context";
import { AuthChecker } from "type-graphql";

export const customAuthChecker: AuthChecker<MyContext> = ({ context }) => {
  return Boolean(context.user);
};
