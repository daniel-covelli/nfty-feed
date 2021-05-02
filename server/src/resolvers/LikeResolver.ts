import { Resolver, Query } from 'type-graphql';
import { Like } from '../entity/Like';

@Resolver()
export class LikeResolver {
  @Query(() => [Like])
  async likes() {
    const likes = await Like.find({ relations: ['owner', 'post'] });
    return likes;
  }
}
