import { Resolver, Query, Arg, Mutation } from 'type-graphql';
import { User } from './entity/User';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi!';
  }

  @Mutation()
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    await User.insert({ email, password });
    return;
  }
}
