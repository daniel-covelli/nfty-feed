import {
  Resolver,
  Query,
  Arg,
  Mutation,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int
} from 'type-graphql';
import { User } from '../entity/User';
import { compare, hash } from 'bcryptjs';
import { MyContext } from '../migration/MyContext';
import { createAccessToken, createRefreshToken } from '../auth';
import { isAuth } from '../isAuth';
import { sendRefreshToken } from '../sendRefreshToken';
import { getConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';
import { Profile } from '../entity/Profile';

@ObjectType()
class RegisterResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
  @Field(() => User)
  user: User;
}

@ObjectType()
class GenericResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
}

@ObjectType()
class UserResponse {
  @Field()
  me: Boolean;
  @Field()
  user: User;
}

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi!';
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `your user id is: ${payload!.userId}`;
  }

  @Query(() => [User])
  async users() {
    const users = await User.find();

    return users;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers['authorization'];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Query(() => UserResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async getUser(@Ctx() { payload }: MyContext, @Arg('path') path: string) {
    const userId = path.split('/')[path.split('/').length - 1];

    const isMe = payload!.userId == userId;

    const user = await User.findOne({
      where: { id: userId },
      relations: ['profile']
    });

    if (!user) {
      throw new Error('could not find user');
    }

    return { me: isMe, user };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      throw new Error('could not find user');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error('invalid password');
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user
    };
  }

  @Mutation(() => GenericResponse)
  async checkEmail(@Arg('email') email: string) {
    try {
      const existing = await User.findOne({ where: { email } });

      if (existing) {
        return {
          res: false,
          message: 'Looks like this email already taken...'
        };
      }

      return { res: true, message: `Congrats, you're registered!` };
    } catch (err) {
      console.log(err);
      return {
        res: false,
        message: 'Internal server error. Try again later...'
      };
    }
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('username') username: string,
    @Arg('phone') phone: string,
    @Arg('first') first: string,
    @Arg('last') last: string,
    @Arg('bio') bio: string
  ) {
    if (!username) {
      return {
        res: false,
        message: 'Please enter a valid username...',
        user: null
      };
    }

    if (!phone) {
      return {
        res: false,
        message: 'Please enter a valid phone number...',
        user: null
      };
    }

    if (!first) {
      return {
        res: false,
        message: 'Please enter a valid first name...',
        user: null
      };
    }

    if (!last) {
      return {
        res: false,
        message: 'Please enter a valid last name...',
        user: null
      };
    }

    const valid = phone.match(/^[0-9]{10}$/);

    if (!valid) {
      return {
        res: false,
        message: 'Please enter valid phone number, ex. 1234567890',
        user: null
      };
    }

    const existing = await Profile.findOne({ where: { username } });

    if (existing) {
      return {
        res: false,
        message: 'Looks like someone already has that username... '
      };
    }

    const hashedPassword = await hash(password, 12);

    let user;
    try {
      const profile = new Profile();
      profile.username = username;
      profile.phone = phone;
      profile.first = first;
      profile.last = last;
      profile.bio = bio;
      await Profile.save(profile);

      user = new User();
      user.email = email;
      user.password = hashedPassword;
      user.profile = profile;
      await User.save(user);
    } catch (err) {
      console.log(err);
      return {
        res: false,
        message: 'Internal server error. Try again later...',
        user: null
      };
    }

    return { res: true, message: `Congrats, you're registered!`, user };
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);
    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, '');
    return true;
  }
}
