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
  async getActiveFollowing(@Arg('userId') userId: number) {
    const subscriptions = await Subscription.find({
      where: { userId: userId, active: SubStatus.ACTIVE }
    });

    return subscriptions;
  }

  @Query(() => Boolean)
  @UseMiddleware(isAuth)
  async existingSubscription(
    @Ctx() { payload }: MyContext,
    @Arg('userId') userId: number
  ) {
    const existingActive = await Subscription.findOne({
      where: {
        userId: Number(payload?.userId),
        followingId: userId,
        active: SubStatus.ACTIVE
      }
    });

    if (existingActive) {
      return true;
    }
    return false;
  }

  @Mutation(() => Subscription)
  @UseMiddleware(isAuth)
  async subscribe(
    @Ctx() { payload }: MyContext,
    @Arg('userIdWhoIsBeingFollowed') userIdWhoIsBeingFollowed: number
  ) {
    if (userIdWhoIsBeingFollowed == Number(payload?.userId)) {
      throw new Error(`Users can't follow themselves`);
    }

    const existing = await Subscription.findOne({
      where: {
        userId: Number(payload?.userId),
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.ACTIVE
      }
    });

    if (existing) {
      throw new Error(`Users have existing relationship`);
    }

    const existingInactive = await Subscription.findOne({
      where: {
        userId: Number(payload?.userId),
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.INACTIVE
      }
    });

    if (existingInactive) {
      existingInactive.active = SubStatus.ACTIVE;
      existingInactive.save();
      return existingInactive;
    }

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Subscription)
      .values({
        userId: Number(payload?.userId),
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.ACTIVE
      })
      .execute();

    const subscription = await Subscription.findOne({
      where: {
        userId: Number(payload?.userId),
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
    @Arg('userId') userId: number
  ) {
    if (Number(payload?.userId) == userId) {
      throw new Error(`Users can't unfollow themselves`);
    }

    const existingInactive = await Subscription.findOne({
      where: {
        userId: Number(payload?.userId),
        followingId: userId,
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
        userId: Number(payload?.userId),
        followingId: userId,
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
}
