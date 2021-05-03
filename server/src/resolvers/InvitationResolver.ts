import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
  ObjectType,
  Field
} from 'type-graphql';

import { Invitation } from '../entity/Invitation';
import { isAuth } from '../isAuth';
import { MyContext } from '../migration/MyContext';

@ObjectType()
class InvitationResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
  @Field(() => Invitation, { nullable: true })
  invitation: Invitation;
}

@Resolver()
export class InvitationResolver {
  @Query(() => [Invitation])
  async invitations() {
    const invitations = await Invitation.find();
    return invitations;
  }

  @Mutation(() => InvitationResponse)
  @UseMiddleware(isAuth)
  async sendInvitation(
    @Ctx() { payload }: MyContext,
    @Arg('number') number: number
  ) {
    console.log('OWNER ID', payload?.userId);
    console.log('number', number);
    console.log('SEND INVITATION MUTATION');
    return {
      res: true,
      message: 'Invitation successfully sent!',
      invitation: null
    };
  }
}
