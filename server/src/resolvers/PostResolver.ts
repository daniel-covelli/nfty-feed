import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  ObjectType,
  Field,
  Ctx
} from 'type-graphql';

import { Post } from '../entity/Post';
import { isAuth } from '../isAuth';
import {
  validUrl,
  PostStatus,
  VisStatus,
  GlobalStatus,
  AdminStatus
} from '../enums';
import { Profile } from '../entity/Profile';
import { MyContext } from 'src/migration/MyContext';
import { User } from '../entity/User';
import { Like } from '../entity/Like';
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

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async like(@Ctx() { payload }: MyContext, @Arg('postId') postId: number) {
    const user = await User.findOne(payload!.userId);

    if (!user) {
      throw new Error(`Unable to find user`);
    }

    const profile = await Profile.findOne(user.profile!.id);

    if (!profile) {
      throw new Error(`Unable to find profile`);
    }

    const post = await Post.findOne(postId, { relations: ['likes'] });

    if (!post) {
      throw new Error(`Unable to find post`);
    }

    const existingLike = await Like.findOne({
      where: { post, owner: profile }
    });

    if (existingLike) {
      throw new Error(`You can't like a post twice`);
    }

    const like = new Like();
    like.owner = profile;
    like.post = post;

    await Like.save(like);

    post.likes = [...post.likes, like];
    post.numberOfLikes = post.likes.length;

    await Post.save(post);

    // console.log('LIKE', like);
    return post;
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async unlike(@Ctx() { payload }: MyContext, @Arg('postId') postId: number) {
    const user = await User.findOne(payload!.userId);

    if (!user) {
      throw new Error(`Unable to find user`);
    }

    const profile = await Profile.findOne(user.profile!.id);

    if (!profile) {
      throw new Error(`Unable to find profile`);
    }

    const post = await Post.findOne(postId, { relations: ['likes'] });

    if (!post) {
      throw new Error(`Unable to find post`);
    }

    const existingLike = await Like.findOne({
      where: { post, owner: profile }
    });

    if (!existingLike) {
      throw new Error(`You can't unlike a post you haven't liked`);
    }

    const index = post.likes.findIndex((like) => like.id === existingLike.id);

    post.likes.splice(index, 1);

    post.numberOfLikes = post.numberOfLikes - 1;

    await Post.save(post);

    await Like.delete(existingLike?.id);

    return post;
  }

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getUsersPosts(@Arg('profileId') profileId: number) {
    const posts = await Post.find({
      where: { owner: { id: profileId }, removed: GlobalStatus.VISIBLE }
    });

    if (!posts) {
      throw new Error('No posts found');
    }

    return posts;
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async invisible(
    @Ctx() { payload }: MyContext,
    @Arg('postId') postId: number
  ) {
    const user = await User.findOne(payload!.userId);

    if (!user || user.admin === AdminStatus.NORMY) {
      return {
        res: false,
        message: 'Invalid credentials...',
        post: null
      };
    }

    const post = await Post.findOne({ id: postId });

    if (!post) {
      return {
        res: false,
        message: 'Unable to find post...',
        post: null
      };
    }

    post.visibility = VisStatus.HIDDEN;
    await Post.save(post);

    return {
      res: true,
      message: `Post ${postId} has been made invisible...`,
      post: post
    };
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async visible(@Ctx() { payload }: MyContext, @Arg('postId') postId: number) {
    const user = await User.findOne(payload!.userId);

    if (!user || user.admin === AdminStatus.NORMY) {
      return {
        res: false,
        message: 'Invalid credentials...',
        post: null
      };
    }

    const post = await Post.findOne({ id: postId });

    if (!post) {
      return {
        res: false,
        message: 'Unable to find post...',
        post: null
      };
    }

    post.visibility = VisStatus.VISIBLE;
    await Post.save(post);

    return {
      res: true,
      message: `Post ${postId} has been made visible...`,
      post: post
    };
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async remove(@Ctx() { payload }: MyContext, @Arg('postId') postId: number) {
    const user = await User.findOne(payload!.userId);

    if (!user || user.admin === AdminStatus.NORMY) {
      return {
        res: false,
        message: 'Invalid credentials...',
        post: null
      };
    }

    const post = await Post.findOne({ id: postId });

    if (!post) {
      return {
        res: false,
        message: 'Unable to find post...',
        post: null
      };
    }

    post.removed = GlobalStatus.REMOVED;
    await Post.save(post);

    return {
      res: true,
      message: `Post ${postId} has been made invisible...`,
      post: post
    };
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async readd(@Ctx() { payload }: MyContext, @Arg('postId') postId: number) {
    const user = await User.findOne(payload!.userId);

    if (!user || user.admin === AdminStatus.NORMY) {
      return {
        res: false,
        message: 'Invalid credentials...',
        post: null
      };
    }

    const post = await Post.findOne({ id: postId });

    if (!post) {
      return {
        res: false,
        message: 'Unable to find post...',
        post: null
      };
    }

    post.removed = GlobalStatus.VISIBLE;
    await Post.save(post);

    return {
      res: true,
      message: `Post ${postId} has been made invisible...`,
      post: post
    };
  }

  @Query(() => [Post])
  async getTopPosts(@Arg('page') page: number) {
    const posts = await Post.find({
      where: { visibility: VisStatus.VISIBLE, removed: GlobalStatus.VISIBLE },
      order: {
        createdAt: 'DESC'
      },
      take: 4,
      skip: 4 * (page - 1),
      relations: ['owner']
    });
    return posts;
  }

  @Query(() => [Post])
  async getTopPostsAdmin(@Arg('page') page: number) {
    const posts = await Post.find({
      order: {
        createdAt: 'DESC'
      },
      take: 4,
      skip: 4 * (page - 1),
      relations: ['likes', 'likes.owner']
    });
    return [...posts];
  }

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('profileId') profileId: number,
    @Arg('media') media: string,
    @Arg('artist', { nullable: true }) artist: string,
    @Arg('link', { nullable: true }) link: string,
    @Arg('title') title: string,
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
