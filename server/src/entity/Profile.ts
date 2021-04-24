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

  @Field({ nullable: true })
  @Column({ nullable: true })
  profileImageId?: string;

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
}
