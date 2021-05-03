import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { Profile } from './Profile';
import { AdminStatus } from '../enums';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  password: string;

  @Column('int', { default: 0 })
  tokenVersion: number;

  @Field()
  @Column('int', { default: 2 })
  invitations: number;

  @Field()
  @Column('int', { default: AdminStatus.NORMY })
  admin: AdminStatus;

  @Field({ nullable: true })
  @OneToOne(() => Profile, {
    eager: true,
    nullable: true,
    cascade: true
  })
  @JoinColumn()
  profile?: Profile;
}
