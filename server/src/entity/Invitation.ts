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

  @Field(() => Int)
  @Column()
  number: number;

  @Field(() => Int)
  @Column()
  verificationCode: number;

  @Field(() => Int)
  @Column()
  active: Status;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
