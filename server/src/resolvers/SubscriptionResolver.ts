import { Resolver, Mutation, Arg, Ctx, Query, Authorized } from "type-graphql";
import { Subscription } from "../entity/Subscription";
import { SubStatus } from "../enums";
import { getConnection } from "typeorm";
import { MyContext } from "../context";

@Resolver()
export class SubscriptionResolver {
  @Query(() => [Subscription])
  async subscriptions() {
    const subscriptions = await Subscription.find();

    return subscriptions;
  }

  // who is following a user
  @Authorized()
  @Query(() => [Subscription])
  async getActiveFollowers(@Arg("userId") userId: number) {
    const subscriptions = await Subscription.find({
      where: { followingId: userId, active: SubStatus.ACTIVE },
    });

    return subscriptions;
  }

  // who a user follows
  @Authorized()
  @Query(() => [Subscription])
  async getActiveFollowing(@Arg("userId") userId: number): Promise<Subscription[]> {
    const subscriptions = await Subscription.find({
      where: { userId: userId, active: SubStatus.ACTIVE },
    });

    return subscriptions;
  }

  @Authorized()
  @Query(() => Boolean)
  async existingSubscription(
    @Ctx() ctx: MyContext,
    @Arg("userId") userId: number,
  ): Promise<Boolean> {
    const existingActive = await Subscription.findOne({
      where: {
        userId: ctx.user?.id,
        followingId: userId,
        active: SubStatus.ACTIVE,
      },
    });

    if (existingActive) {
      return true;
    }
    return false;
  }

  @Authorized()
  @Mutation(() => Subscription)
  async subscribe(
    @Ctx() ctx: MyContext,
    @Arg("userIdWhoIsBeingFollowed") userIdWhoIsBeingFollowed: number,
  ) {
    if (userIdWhoIsBeingFollowed == Number(ctx.user?.id)) {
      throw new Error(`Users can't follow themselves`);
    }

    const existing = await Subscription.findOne({
      where: {
        userId: Number(ctx.user?.id),
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.ACTIVE,
      },
    });

    if (existing) {
      throw new Error(`Users have existing relationship`);
    }

    const existingInactive = await Subscription.findOne({
      where: {
        userId: Number(ctx.user?.id),
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.INACTIVE,
      },
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
        userId: Number(ctx.user?.id),
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.ACTIVE,
      })
      .execute();

    const subscription = await Subscription.findOne({
      where: {
        userId: Number(ctx.user?.id),
        followingId: userIdWhoIsBeingFollowed,
        active: SubStatus.ACTIVE,
      },
    });

    return subscription;
  }

  @Mutation(() => Subscription)
  @Authorized()
  async unSubscribe(@Ctx() ctx: MyContext, @Arg("userId") userId: number) {
    if (Number(ctx.user?.id) == userId) {
      throw new Error(`Users can't unfollow themselves`);
    }

    const existingInactive = await Subscription.findOne({
      where: {
        userId: Number(ctx.user?.id),
        followingId: userId,
        active: SubStatus.INACTIVE,
      },
    });

    if (existingInactive) {
      throw new Error(`Users can't unfollow someone whom they've already unfollowed`);
    }

    const existingActive = await Subscription.findOne({
      where: {
        userId: Number(ctx.user?.id),
        followingId: userId,
        active: SubStatus.ACTIVE,
      },
    });

    if (!existingActive) {
      throw new Error(`This relationship wasn't found`);
    }

    existingActive.active = SubStatus.INACTIVE;
    existingActive.save();
    return existingActive;
  }
}
