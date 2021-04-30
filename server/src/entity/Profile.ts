import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  OneToMany
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';
import { Like } from './Like';
import { Post } from './Post';

@ObjectType()
@Entity('profile')
export class Profile extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileImageId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ogProfileImageId?: string;

  @Field()
  @Column()
  username: string;

  @Field()
  @Column()
  phone: string;

  @Field()
  @Column()
  first: string;

  @Field()
  @Column()
  last: string;

  @Field({ nullable: true })
  @Column()
  bio?: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.owner)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.owner)
  likes: Like[];
}
