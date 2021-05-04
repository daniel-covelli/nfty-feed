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
import { Status, AdminStatus } from '../enums';
import { User } from '../entity/User';
import { Twilio } from 'twilio';

@ObjectType()
class InvitationResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
  @Field(() => Invitation, { nullable: true })
  invitation: Invitation;
  @Field(() => User, { nullable: true })
  user: User;
}

@ObjectType()
class VerificationResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
}

@Resolver()
export class InvitationResolver {
  @Query(() => [Invitation])
  async invitations() {
    const invitations = await Invitation.find();
    return invitations;
  }

  @Mutation(() => VerificationResponse)
  async checkInvitation(
    @Arg('number') number: string,
    @Arg('verificationCode') verificationCode: string
  ) {
    if (!number) {
      return {
        res: false,
        message: 'Please enter valid phone number, ex. 1234567890'
      };
    }

    if (!verificationCode) {
      return {
        res: false,
        message: 'Please enter your verification code'
      };
    }

    const valid = number.match(/^[0-9]{10}$/);

    if (!valid) {
      return {
        res: false,
        message: 'Please enter valid phone number, ex. 1234567890'
      };
    }
    const numberValid = await Invitation.findOne({
      where: { active: Status.ACTIVE, number }
    });

    if (!numberValid) {
      return {
        res: false,
        message: 'No invitation for that number, please try again'
      };
    }

    const codeValid = await Invitation.findOne({
      where: { active: Status.ACTIVE, verificationCode }
    });

    if (!codeValid) {
      return {
        res: false,
        message: 'No invitation for that verification code, please try again'
      };
    }

    const invite = await Invitation.findOne({
      where: { active: Status.ACTIVE, verificationCode, number }
    });

    if (!invite) {
      return {
        res: false,
        message: 'Incorrenct number or verification code, please try again'
      };
    }

    return { res: true, message: 'Success' };
  }

  @Mutation(() => InvitationResponse)
  @UseMiddleware(isAuth)
  async sendInvitation(
    @Ctx() { payload }: MyContext,
    @Arg('number') number: string
  ) {
    if (!number) {
      return {
        res: false,
        message: 'Please enter valid phone number, ex. 1234567890',
        invitation: null,
        user: null
      };
    }

    const valid = number.match(/^[0-9]{10}$/);

    if (!valid) {
      return {
        res: false,
        message: 'Please enter valid phone number, ex. 1234567890',
        invitation: null,
        user: null
      };
    }

    const existingInvitation = await Invitation.findOne({ number });

    if (existingInvitation) {
      return {
        res: false,
        message: `Looks like that they've already been invited`,
        invitation: null,
        user: null
      };
    }

    const owner = await User.findOne(payload?.userId);

    if (!owner) {
      return {
        res: false,
        message: 'User not found...',
        invitation: null,
        user: null
      };
    }

    if (owner.invitations === 0) {
      return {
        res: false,
        message: `Looks like you're all out of invitations...`,
        invitation: null,
        user: null
      };
    }

    const verificationCode = Math.floor(Math.random() * 100000);

    const invitation = new Invitation();
    invitation.ownerId = Number(payload?.userId);
    invitation.number = number;
    invitation.verificationCode = verificationCode;
    invitation.active = Status.ACTIVE;

    try {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioNumber = process.env.TWILIO_NUMBER;
      if (sid && authToken && twilioNumber) {
        const client = new Twilio(sid, authToken);

        client.messages.create({
          body: `Your NftyFeed verification code is: ${verificationCode} https://nftyfeed.com/register`,
          from: `${twilioNumber}`,
          to: `+1${number}`
        });
      } else {
        throw new Error('environment variables not loaded');
      }
    } catch (e) {
      console.error(e);
      return {
        res: true,
        message: 'SMS error: unable to send invitation. Try again later.',
        invitation: null
      };
    }

    if (owner.admin === AdminStatus.NORMY) {
      owner.invitations = owner.invitations - 1;
      await User.save(owner);
    }

    await Invitation.save(invitation);

    return {
      res: true,
      message: 'Invitation successfully sent!',
      invitation: invitation,
      user: owner
    };
  }
}
