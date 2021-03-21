import {
  Resolver,
  Query,
  Arg,
  Mutation,
  ObjectType,
  Field,
  Ctx
} from 'type-graphql';
import { User } from './entity/User';
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { MyContext } from './migration/MyContext';

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi!';
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('could not find user');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error('invalid password');
    }

    res.cookie(
      'jid',
      sign({ userId: user.id }, 'jaksndaksjndaksj', {
        expiresIn: '30d'
      }),
      { httpOnly: true }
    );

    // payload, secret, options
    return {
      accessToken: sign({ userId: user.id }, 'kasdakljsdnasjk', {
        expiresIn: '15m'
      })
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    const hashedPassword = await hash(password, 12);
    try {
      await User.insert({ email, password: hashedPassword });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}
