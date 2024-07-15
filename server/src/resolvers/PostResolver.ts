import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, Authorized } from "type-graphql";
import { Post } from "../entity/Post";
import { validUrl, PostStatus, VisStatus, GlobalStatus, AdminStatus } from "../enums";
import { Profile } from "../entity/Profile";
import { User } from "../entity/User";
import { Like } from "../entity/Like";
import { MyContext } from "src/context";
import { uploadMedia } from "src/utils/bytescale";
import { UploadResult } from "@bytescale/sdk";

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

  @Authorized()
  @Mutation(() => Post)
  async like(@Ctx() ctx: MyContext, @Arg("postId") postId: number) {
    const user = await User.findOne(ctx.user?.id);

    if (!user) {
      throw new Error(`Unable to find user`);
    }

    const profile = await Profile.findOne(user.profile!.id);

    if (!profile) {
      throw new Error(`Unable to find profile`);
    }

    const post = await Post.findOne(postId, { relations: ["likes"] });

    if (!post) {
      throw new Error(`Unable to find post`);
    }

    const existingLike = await Like.findOne({
      where: { post, owner: profile },
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

  @Authorized()
  @Mutation(() => Post)
  async unlike(@Ctx() ctx: MyContext, @Arg("postId") postId: number) {
    const user = await User.findOne(ctx.user?.id);

    if (!user) {
      throw new Error(`Unable to find user`);
    }

    const profile = await Profile.findOne(user.profile!.id);

    if (!profile) {
      throw new Error(`Unable to find profile`);
    }

    const post = await Post.findOne(postId, { relations: ["likes"] });

    if (!post) {
      throw new Error(`Unable to find post`);
    }

    const existingLike = await Like.findOne({
      where: { post, owner: profile },
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

  @Authorized()
  @Query(() => [Post])
  async getUsersPosts(@Arg("profileId") profileId: number) {
    const posts = await Post.find({
      where: { owner: { id: profileId }, removed: GlobalStatus.VISIBLE },
    });

    if (!posts) {
      throw new Error("No posts found");
    }

    return posts;
  }

  @Authorized()
  @Mutation(() => PostResponse)
  async invisible(@Ctx() ctx: MyContext, @Arg("postId") postId: number) {
    const user = await User.findOne(ctx.user?.id);

    if (!user || user.admin === AdminStatus.NORMY) {
      return {
        res: false,
        message: "Invalid credentials...",
        post: null,
      };
    }

    const post = await Post.findOne({ id: postId });

    if (!post) {
      return {
        res: false,
        message: "Unable to find post...",
        post: null,
      };
    }

    post.visibility = VisStatus.HIDDEN;
    await Post.save(post);

    return {
      res: true,
      message: `Post ${postId} has been made invisible...`,
      post: post,
    };
  }

  @Authorized()
  @Mutation(() => PostResponse)
  async visible(@Ctx() ctx: MyContext, @Arg("postId") postId: number) {
    const user = await User.findOne(ctx.user?.id);

    if (!user || user.admin === AdminStatus.NORMY) {
      return {
        res: false,
        message: "Invalid credentials...",
        post: null,
      };
    }

    const post = await Post.findOne({ id: postId });

    if (!post) {
      return {
        res: false,
        message: "Unable to find post...",
        post: null,
      };
    }

    post.visibility = VisStatus.VISIBLE;
    await Post.save(post);

    return {
      res: true,
      message: `Post ${postId} has been made visible...`,
      post: post,
    };
  }

  @Authorized()
  @Mutation(() => PostResponse)
  async remove(@Ctx() ctx: MyContext, @Arg("postId") postId: number) {
    const user = await User.findOne(ctx.user?.id);

    if (!user || user.admin === AdminStatus.NORMY) {
      return {
        res: false,
        message: "Invalid credentials...",
        post: null,
      };
    }

    const post = await Post.findOne({ id: postId });

    if (!post) {
      return {
        res: false,
        message: "Unable to find post...",
        post: null,
      };
    }

    post.removed = GlobalStatus.REMOVED;
    await Post.save(post);

    return {
      res: true,
      message: `Post ${postId} has been made invisible...`,
      post: post,
    };
  }

  @Authorized()
  @Mutation(() => PostResponse)
  async readd(@Ctx() ctx: MyContext, @Arg("postId") postId: number) {
    const user = await User.findOne(ctx.user?.id);

    if (!user || user.admin === AdminStatus.NORMY) {
      return {
        res: false,
        message: "Invalid credentials...",
        post: null,
      };
    }

    const post = await Post.findOne({ id: postId });

    if (!post) {
      return {
        res: false,
        message: "Unable to find post...",
        post: null,
      };
    }

    post.removed = GlobalStatus.VISIBLE;
    await Post.save(post);

    return {
      res: true,
      message: `Post ${postId} has been made invisible...`,
      post: post,
    };
  }

  @Query(() => [Post])
  async getTopPosts(@Arg("page") page: number) {
    const posts = await Post.find({
      where: { visibility: VisStatus.VISIBLE, removed: GlobalStatus.VISIBLE },
      order: {
        createdAt: "DESC",
      },
      take: 4,
      skip: 4 * (page - 1),
      relations: ["owner"],
    });
    return posts;
  }

  @Query(() => [Post])
  async getTopPostsAdmin(@Arg("page") page: number) {
    const posts = await Post.find({
      order: {
        createdAt: "DESC",
      },
      take: 4,
      skip: 4 * (page - 1),
      relations: ["likes", "likes.owner"],
    });
    return [...posts];
  }

  @Authorized()
  @Mutation(() => PostResponse)
  async createPost(
    @Arg("profileId") profileId: number,
    @Arg("media") media: string,
    @Arg("artist", { nullable: true }) artist: string,
    @Arg("link", { nullable: true }) link: string,
    @Arg("title") title: string,
    @Arg("type", { nullable: true }) type: PostStatus,
  ) {
    if (link) {
      const validLink = link.match(validUrl);

      if (!validLink) {
        return {
          res: false,
          message: "Provide valid url...",
          post: null,
        };
      }
    }

    if (artist) {
      const validArtist = artist.match(/(?=\S)[^\\]/);

      if (!validArtist) {
        return {
          res: false,
          message: "Provide valid artist name...",
          post: null,
        };
      }
    }

    let profile: any;
    try {
      profile = await Profile.findOne({ id: profileId });

      if (!profile) {
        throw new Error("could not find profile");
      }
    } catch (e) {
      console.log(e);
      return {
        res: false,
        message: "Internal server error please try again...",
        post: null,
      };
    }

    let postMedia: UploadResult | undefined = undefined;
    try {
      postMedia = await uploadMedia(media);
    } catch (e) {
      return {
        res: false,
        message: `Image could not be uploaded`,
        post: null,
      };
    }

    const post = new Post();
    post.owner = profile;
    post.media = postMedia?.fileUrl ?? "";
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
      message: "Post successful...",
      post: post,
    };
  }
}
