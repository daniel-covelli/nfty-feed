import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity('profile')
export class Profile extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  username: string;

  @Column()
  phone: string;

  @Column()
  first: string;

  @Column()
  last: string;

  @Column()
  bio: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
