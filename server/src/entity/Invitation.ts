import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { Status } from '../enums';

@ObjectType()
@Entity()
export class Invitation extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  ownerId: number;

  @Field()
  @Column()
  number: number;

  @Field()
  @Column()
  verificationCode: number;

  @Field()
  @Column()
  active: Status;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
