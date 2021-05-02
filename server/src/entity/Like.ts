import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Post } from './Post';
import { Profile } from './Profile';

@ObjectType()
@Entity()
export class Like extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Profile, { nullable: true })
  @ManyToOne(() => Profile, (profile) => profile.likes, {
    eager: true
  })
  owner: Profile;

  @Field(() => Post, { nullable: true })
  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
