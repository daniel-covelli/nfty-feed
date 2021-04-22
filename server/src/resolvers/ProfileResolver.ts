import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Field,
  UseMiddleware
} from 'type-graphql';
import { MyContext } from '../migration/MyContext';
import { User } from '../entity/User';
import { isAuth } from '../isAuth';
import { Profile } from '../entity/Profile';

@ObjectType()
class EditResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
  @Field(() => User, { nullable: true })
  user: User;
}

@Resolver()
export class ProfileResolver {
  @Mutation(() => EditResponse)
  @UseMiddleware(isAuth)
  async editProfile(
    @Ctx() { payload }: MyContext,
    @Arg('username') username: string,
    @Arg('first') first: string,
    @Arg('last') last: string,
    @Arg('bio') bio: string
  ) {
    const existingUser = await User.findOne({
      where: { id: payload?.userId }
    });

    if (!existingUser) {
      throw new Error('could not find user');
    }

    if (!username) {
      return {
        res: false,
        message: 'Please enter a valid username...',
        user: existingUser
      };
    }

    if (!first) {
      return {
        res: false,
        message: 'Please enter a first name...',
        user: existingUser
      };
    }

    if (!last) {
      return {
        res: false,
        message: 'Please enter a last name...',
        user: existingUser
      };
    }

    const usernameLength = username.length;

    if (usernameLength > 40) {
      return {
        res: false,
        message: 'Username over 40 characters...',
        user: existingUser
      };
    }

    const noSpaces = username.match(/^\S+$/);

    if (!noSpaces) {
      return {
        res: false,
        message: 'Please enter a username with no spaces...',
        user: existingUser
      };
    }

    const validCharacters = username.match(/^[\.a-zA-Z0-9]*$/);

    if (!validCharacters) {
      return {
        res: false,
        message:
          'Please enter valid username. Only letters, numbers, and periods allowed...',
        user: existingUser
      };
    }

    const notJustAllNumbers = username.match(/^[0-9]*$/);

    if (notJustAllNumbers) {
      return {
        res: false,
        message: 'Please enter valid username that includes letters...',
        user: existingUser
      };
    }

    const bioLength = bio.length;

    if (bioLength > 145) {
      return {
        res: false,
        message: 'Bio over 145 characters...',
        user: existingUser
      };
    }

    if (existingUser.profile) {
      existingUser.profile.first = first;
      existingUser.profile.last = last;
      existingUser.profile.bio = bio;
      if (existingUser.profile.username !== username) {
        const existing = await Profile.findOne({ where: { username } });

        if (existing) {
          return {
            res: false,
            message: 'Looks like someone already has that username... ',
            user: existingUser
          };
        }

        existingUser.profile.username = username;
        await existingUser.save();
        return { res: true, message: 'refresh', user: existingUser };
      }
      await existingUser.save();
    } else {
      // edge case: if user doesnt have profile
      const profile = new Profile();
      profile.username = username;
      profile.first = first;
      profile.last = last;
      profile.bio = bio;
      await profile.save();
      existingUser.profile = profile;
      await existingUser.save();
      return { res: true, message: 'refresh', user: existingUser };
    }

    return { res: true, message: 'success', user: existingUser };
  }
  // @Mutation(() => RegisterProfileResponse)
  // registerProfile(
  //   @Arg('username') username: string,
  //   @Arg('phone') phone: string,
  //   @Arg('first') first: string,
  //   @Arg('last') last: string,
  //   @Arg('bio') bio: string,
  //   @Ctx() { payload }: MyContext
  // ) {
  //   console.log('PAYLOAD', payload);
  //   console.log('USERNAME', username);
  //   console.log('PHONE', phone);
  //   console.log('FIRST', first);
  //   console.log('LAST', last);
  //   console.log('BIO', bio);
  //   return { response: false, message: 'nah bruh' };
  // }
  //   @Query(() => String)
  //   hello() {
  //     return 'hi!';
  //   }
  //   @Query(() => String)
  //   @UseMiddleware(isAuth)
  //   bye(@Ctx() { payload }: MyContext) {
  //     return `your user id is: ${payload!.userId}`;
  //   }
  //   @Query(() => [User])
  //   users() {
  //     return User.find();
  //   }
  //   @Query(() => User, { nullable: true })
  //   me(@Ctx() context: MyContext) {
  //     const authorization = context.req.headers['authorization'];
  //     if (!authorization) {
  //       return null;
  //     }
  //     try {
  //       const token = authorization.split(' ')[1];
  //       const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
  //       return User.findOne(payload.userId);
  //     } catch (err) {
  //       console.log(err);
  //       return null;
  //     }
  //   }
  //   @Query(() => UserResponse, { nullable: true })
  //   @UseMiddleware(isAuth)
  //   async getUser(@Ctx() { payload }: MyContext, @Arg('path') path: string) {
  //     const userId = path.split('/')[path.split('/').length - 1];
  //     const isMe = payload!.userId == userId;
  //     const user = await User.findOne({ where: { id: userId } });
  //     if (!user) {
  //       throw new Error('could not find user');
  //     }
  //     return { me: isMe, user };
  //   }
  //   @Mutation(() => LoginResponse)
  //   async login(
  //     @Arg('email') email: string,
  //     @Arg('password') password: string,
  //     @Ctx() { res }: MyContext
  //   ): Promise<LoginResponse> {
  //     const user = await User.findOne({ where: { email } });
  //     if (!user) {
  //       throw new Error('could not find user');
  //     }
  //     const valid = await compare(password, user.password);
  //     if (!valid) {
  //       throw new Error('invalid password');
  //     }
  //     sendRefreshToken(res, createRefreshToken(user));
  //     return {
  //       accessToken: createAccessToken(user),
  //       user
  //     };
  //   }
  //   @Mutation(() => RegisterResponse)
  //   async register(
  //     @Arg('email') email: string,
  //     @Arg('password') password: string
  //   ) {
  //     const valid = email.match(/^\S+@\S+\.\S+$/g);
  //     if (!valid) {
  //       return {
  //         res: false,
  //         message: 'Please enter a valid email address...'
  //       };
  //     }
  //     if (!password) {
  //       return {
  //         res: false,
  //         message: 'Please enter a valid password...'
  //       };
  //     }
  //     const existing = await User.findOne({ where: { email } });
  //     if (existing) {
  //       return {
  //         res: false,
  //         message: 'Looks like this email already taken. Please try again...'
  //       };
  //     }
  //     const hashedPassword = await hash(password, 12);
  //     try {
  //       await User.insert({ email, password: hashedPassword });
  //     } catch (err) {
  //       console.log(err);
  //       return {
  //         res: false,
  //         message: 'Internal server error. Try again later...'
  //       };
  //     }
  //     return { res: true, message: `Congrats, you're registered!` };
  //   }
  //   @Mutation(() => Boolean)
  //   async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
  //     await getConnection()
  //       .getRepository(User)
  //       .increment({ id: userId }, 'tokenVersion', 1);
  //     return true;
  //   }
  //   @Mutation(() => Boolean)
  //   async logout(@Ctx() { res }: MyContext) {
  //     sendRefreshToken(res, '');
  //     return true;
  //   }
}
