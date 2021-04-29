import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { VisStatus, GlobalStatus } from '../enums';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  ownerId: number;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  visibility: VisStatus;

  @Field()
  @Column()
  removed: GlobalStatus;

  @Field()
  @Column()
  likes: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
