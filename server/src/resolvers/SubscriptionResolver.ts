import {
  Resolver,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
  Query
} from 'type-graphql';

import { isAuth } from '../isAuth';

import { MyContext } from '../migration/MyContext';
import { Subscription } from '../entity/Subscription';
import { SubStatus } from '../enums';
import { getConnection } from 'typeorm';

@Resolver()
export class SubscriptionResolver {
  @Query(() => [Subscription])
  async subscriptions() {
    const subscriptions = await Subscription.find();

    return subscriptions;
  }

  // who is following a user
  @Query(() => [Subscription])
  @UseMiddleware(isAuth)
  async getActiveFollowers(@Arg('userId') userId: number) {
    const subscriptions = await Subscription.find({
      where: { followingId: userId, active: SubStatus.ACTIVE }
    });

    return subscriptions;
  }

  // who a user follows
  @Query(() => [Subscription])
  @UseMiddleware(isAuth)
  async getActiveFollowings(@Arg('userId') userId: number) {
    const subscriptions = await Subscription.find({
      where: { userId, active: SubStatus.ACTIVE }
    });

    return subscriptions;
  }

  @Mutation(() => Subscription)
  @UseMiddleware(isAuth)
  async createSubscription(
    @Ctx() { payload }: MyContext,
    @Arg('userIdWhoIsFolloing') userIdWhoIsFolloing: number,
    @Arg('userIdWhoIsBeingFollowed') userIdWhoIsBeingFollowed: number
  ) {
    if (Number(payload?.userId) != userIdWhoIsFolloing) {
      throw new Error('Invalid subscription');
    }

    if (userIdWhoIsBeingFollowed == userIdWhoIsFolloing) {
      throw new Error(`Users can't follow themselves`);
    }

    const existing = await Subscription.findOne({
      where: {
        userId: userIdWhoIsFolloing,
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.ACTIVE
      }
    });

    if (existing) {
      throw new Error(`Users have existing relationship`);
    }

    const existingInactive = await Subscription.findOne({
      where: {
        userId: userIdWhoIsFolloing,
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.INACTIVE
      }
    });

    if (existingInactive) {
      existingInactive.active = SubStatus.ACTIVE;
      existingInactive.save();
      return existingInactive;
    }

    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Subscription)
      .values({
        userId: userIdWhoIsFolloing,
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.ACTIVE
      })
      .execute();

    console.log('subscription', result.identifiers[0].id);

    const subscription = await Subscription.findOne({
      where: {
        userId: userIdWhoIsFolloing,
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.ACTIVE
      }
    });

    return subscription;
  }

  @Mutation(() => Subscription)
  @UseMiddleware(isAuth)
  async unSubscribe(
    @Ctx() { payload }: MyContext,
    @Arg('userIdWhoIsUnfollowing') userIdWhoIsUnfollowing: number,
    @Arg('userIdWhoIsBeingUnfollowed') userIdWhoIsBeingUnfollowed: number
  ) {
    if (Number(payload?.userId) != userIdWhoIsUnfollowing) {
      throw new Error('Invalid subscription');
    }

    if (userIdWhoIsUnfollowing == userIdWhoIsBeingUnfollowed) {
      throw new Error(`Users can't unfollow themselves`);
    }

    const existingInactive = await Subscription.findOne({
      where: {
        userId: userIdWhoIsUnfollowing,
        followingId: userIdWhoIsBeingUnfollowed,
        active: SubStatus.INACTIVE
      }
    });

    if (existingInactive) {
      throw new Error(
        `Users can't unfollow someone whom they've already unfollowed`
      );
    }

    const existingActive = await Subscription.findOne({
      where: {
        userId: userIdWhoIsUnfollowing,
        followingId: userIdWhoIsBeingUnfollowed,
        active: SubStatus.ACTIVE
      }
    });

    if (!existingActive) {
      throw new Error(`This relationship wasn't found`);
    }

    existingActive.active = SubStatus.INACTIVE;
    existingActive.save();
    return existingActive;
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
