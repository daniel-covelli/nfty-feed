import { User } from "../entity/User";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class RegisterResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
  @Field(() => User, { nullable: true })
  user: User;
}

@ObjectType()
export class GenericResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
}

@ObjectType()
export class UserResponse {
  @Field()
  me: Boolean;
  @Field()
  user: User;
}
