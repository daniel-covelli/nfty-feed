import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  ObjectType,
  Field
} from 'type-graphql';

import { Post } from '../entity/Post';
import { isAuth } from '../isAuth';
import { validUrl, PostStatus, VisStatus, GlobalStatus } from '../enums';
import { Profile } from '../entity/Profile';
const cloudinary = require('cloudinary');

@ObjectType()
class PostResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
  @Field(() => Post, { nullable: true })
  post: Post;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts() {
    const posts = await Post.find();
    return posts;
  }

  @Query(() => [Post])
  async getTopPosts() {
    const posts = await Post.find({
      where: { visibility: VisStatus.VISIBLE, removed: GlobalStatus.VISIBLE },
      order: {
        createdAt: 'DESC'
      },
      take: 10
    });
    return posts;
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('profileId') profileId: number,
    @Arg('media') media: string,
    @Arg('artist', { nullable: true }) artist: string,
    @Arg('link', { nullable: true }) link: string,
    @Arg('title', { nullable: true }) title: string,
    @Arg('type', { nullable: true }) type: PostStatus
  ) {
    if (link) {
      const validLink = link.match(validUrl);

      if (!validLink) {
        return {
          res: false,
          message: 'Provide valid url...',
          post: null
        };
      }
    }

    if (artist) {
      const validArtist = artist.match(/(?=\S)[^\\]/);

      if (!validArtist) {
        return {
          res: false,
          message: 'Provide valid artist name...',
          post: null
        };
      }
    }

    let profile: any;
    try {
      profile = await Profile.findOne({ id: profileId });

      if (!profile) {
        throw new Error('could not find profile');
      }
    } catch (e) {
      console.log(e);
      return {
        res: false,
        message: 'Internal server error please try again...',
        post: null
      };
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    let postMedia: any;
    try {
      postMedia = await cloudinary.v2.uploader.upload(media, {
        allowed_formats: ['jpg', 'png', 'heic', 'jpeg'],
        public_id: ''
      });
    } catch (e) {
      return {
        res: false,
        message: `Image could not be uploaded:${e.message}`,
        post: null
      };
    }

    const post = new Post();
    post.owner = profile;
    post.media = postMedia.url;
    if (link) {
      post.link = link;
    }
    if (artist) {
      post.artist = artist;
    }
    if (type === PostStatus.ORIGINAL) {
      post.type = PostStatus.ORIGINAL;
    }
    post.title = title;
    post.likes = [];

    await Post.save(post);

    return {
      res: true,
      message: 'Post successful...',
      post: post
    };
  }
}

// who is following a user
//   @Query(() => [Subscription])
//   @UseMiddleware(isAuth)
//   async getActiveFollowers(@Arg('userId') userId: number) {
//     const subscriptions = await Subscription.find({
//       where: { followingId: userId, active: SubStatus.ACTIVE }
//     });

//     return subscriptions;
//   }

//   // who a user follows
//   @Query(() => [Subscription])
//   @UseMiddleware(isAuth)
//   async getActiveFollowing(@Arg('userId') userId: number) {
//     const subscriptions = await Subscription.find({
//       where: { userId: userId, active: SubStatus.ACTIVE }
//     });

//     return subscriptions;
//   }

//   @Query(() => Boolean)
//   @UseMiddleware(isAuth)
//   async existingSubscription(
//     @Ctx() { payload }: MyContext,
//     @Arg('userId') userId: number
//   ) {
//     const existingActive = await Subscription.findOne({
//       where: {
//         userId: Number(payload?.userId),
//         followingId: userId,
//         active: SubStatus.ACTIVE
//       }
//     });

//     if (existingActive) {
//       return true;
//     }
//     return false;
//   }

//   @Mutation(() => Subscription)
//   @UseMiddleware(isAuth)
//   async subscribe(
//     @Ctx() { payload }: MyContext,
//     @Arg('userIdWhoIsBeingFollowed') userIdWhoIsBeingFollowed: number
//   ) {
//     if (userIdWhoIsBeingFollowed == Number(payload?.userId)) {
//       throw new Error(`Users can't follow themselves`);
//     }

//     const existing = await Subscription.findOne({
//       where: {
//         userId: Number(payload?.userId),
//         followingId: userIdWhoIsBeingFollowed,
//         active: SubStatus.ACTIVE
//       }
//     });

//     if (existing) {
//       throw new Error(`Users have existing relationship`);
//     }

//     const existingInactive = await Subscription.findOne({
//       where: {
//         userId: Number(payload?.userId),
//         followingId: userIdWhoIsBeingFollowed,
//         active: SubStatus.INACTIVE
//       }
//     });

//     if (existingInactive) {
//       existingInactive.active = SubStatus.ACTIVE;
//       existingInactive.save();
//       return existingInactive;
//     }

//     await getConnection()
//       .createQueryBuilder()
//       .insert()
//       .into(Subscription)
//       .values({
//         userId: Number(payload?.userId),
//         followingId: userIdWhoIsBeingFollowed,
//         active: SubStatus.ACTIVE
//       })
//       .execute();

//     const subscription = await Subscription.findOne({
//       where: {
//         userId: Number(payload?.userId),
//         followingId: userIdWhoIsBeingFollowed,
//         active: SubStatus.ACTIVE
//       }
//     });

//     return subscription;
//   }

//   @Mutation(() => Subscription)
//   @UseMiddleware(isAuth)
//   async unSubscribe(
//     @Ctx() { payload }: MyContext,
//     @Arg('userId') userId: number
//   ) {
//     if (Number(payload?.userId) == userId) {
//       throw new Error(`Users can't unfollow themselves`);
//     }

//     const existingInactive = await Subscription.findOne({
//       where: {
//         userId: Number(payload?.userId),
//         followingId: userId,
//         active: SubStatus.INACTIVE
//       }
//     });

//     if (existingInactive) {
//       throw new Error(
//         `Users can't unfollow someone whom they've already unfollowed`
//       );
//     }

//     const existingActive = await Subscription.findOne({
//       where: {
//         userId: Number(payload?.userId),
//         followingId: userId,
//         active: SubStatus.ACTIVE
//       }
//     });

//     if (!existingActive) {
//       throw new Error(`This relationship wasn't found`);
//     }

//     existingActive.active = SubStatus.INACTIVE;
//     existingActive.save();
//     return existingActive;
//   }
