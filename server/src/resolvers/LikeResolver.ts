import { Resolver, Query, Arg, Mutation, UseMiddleware } from 'type-graphql';
import { Like } from '../entity/Like';
import { Post } from '../entity/Post';
import { isAuth } from '../isAuth';

@Resolver()
export class LikeResolver {
  @Query(() => [Like])
  async likes() {
    const likes = await Like.find({ relations: ['owner', 'post'] });
    return likes;
  }

  @Query(() => Boolean)
  async likedByCurrentProfile(
    @Arg('profileId') profileId: number,
    @Arg('postId') postId: number
  ) {
    // user logged out case
    if (profileId === -1) {
      return false;
    }

    const post = await Post.findOne(postId, { relations: ['likes'] });

    if (!post) {
      throw new Error('No post found');
    }

    const likedByCurrentProfile = post.likes.some(
      (like) => like.owner.id === profileId
    );

    return likedByCurrentProfile;
  }

  @Query(() => [Like])
  @UseMiddleware(isAuth)
  async getLikes(@Arg('postId') postId: number) {
    const post = await Post.findOne(postId, { relations: ['likes'] });

    if (!post) {
      throw new Error('No post found');
    }

    // const likes = await getRepository(Post)
    //   .createQueryBuilder('post')
    //   .leftJoinAndSelect('post.likes', 'likes')
    //   .leftJoinAndSelect('likes.owner', 'owner')
    //   .where('post.id = :id', { id: postId })
    //   .getMany();

    // console.log('LIKES', likes);

    const orderedLikes = post.likes.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );

    return orderedLikes;
  }

  @Mutation(() => [Post])
  async setAllLikes() {
    const posts = await Post.find({ relations: ['likes'] });

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      post.numberOfLikes = post.likes.length;
      await Post.save(post);
    }
    return posts;
  }
}
