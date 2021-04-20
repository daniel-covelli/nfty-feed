import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { SubStatus } from '../enums';

@ObjectType()
@Entity()
export class Subscription extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  userId: number;

  @Field()
  @Column()
  followingId: number;

  @Field()
  @Column()
  active: SubStatus;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
