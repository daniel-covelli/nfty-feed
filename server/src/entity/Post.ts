import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  ManyToOne
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { VisStatus, GlobalStatus, PostStatus } from '../enums';
import { Like } from './Like';
import { Profile } from './Profile';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Profile)
  @ManyToOne(() => Profile, (profile) => profile.posts, {
    eager: true,
    cascade: true
  })
  owner: Profile;

  @Field()
  @Column()
  media: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  artist: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  link: string;

  @Field()
  @Column('int', { default: PostStatus.SHARE })
  type: PostStatus;

  @Field()
  @Column('int', { default: VisStatus.VISIBLE })
  visibility: VisStatus;

  @Field()
  @Column('int', { default: GlobalStatus.VISIBLE })
  removed: GlobalStatus;

  @Field()
  @Column('int', { default: 0 })
  numberOfLikes: number;

  @Field(() => [Like])
  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
