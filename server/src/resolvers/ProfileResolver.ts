import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  ObjectType,
  Field,
  UseMiddleware,
  Query
} from 'type-graphql';
import { MyContext } from '../migration/MyContext';
import { User } from '../entity/User';
import { isAuth } from '../isAuth';
import { Profile } from '../entity/Profile';
import { SubStatus } from '../enums';
import { Subscription } from '../entity/Subscription';
import { createQueryBuilder } from 'typeorm';

const cloudinary = require('cloudinary');

@ObjectType()
class EditResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
  @Field(() => User, { nullable: true })
  user: User;
}

@ObjectType()
class FollowersResponse {
  @Field()
  profile: Profile;
  @Field()
  following: boolean;
  @Field()
  me: boolean;
  @Field()
  userId: number;
}

@Resolver()
export class ProfileResolver {
  @Query(() => [FollowersResponse])
  @UseMiddleware(isAuth)
  async getFollowersData(
    @Ctx() { payload }: MyContext,
    @Arg('userId') userId: number
  ) {
    const followers = await Subscription.find({
      where: { followingId: userId, active: SubStatus.ACTIVE }
    });

    const following = await Subscription.find({
      where: { userId: payload?.userId, active: SubStatus.ACTIVE }
    });

    console.log('FOLLOWERS', followers);
    console.log('FOLLOWING', following);

    const followerIds = followers.map((follower) => follower.userId);

    const users = await createQueryBuilder(User, 'user')
      .where('user.id IN (:...followers)', { followers: followerIds })
      .leftJoinAndSelect('user.profile', 'profile')
      .getMany();

    const response = users.map((user) => {
      let isFollowing = false;
      if (following.find((x) => x.followingId === user.id)) {
        isFollowing = true;
      }
      return {
        profile: user.profile,
        following: isFollowing,
        me: user.id === Number(payload?.userId),
        userId: user.id
      };
    });

    return response;
  }

  @Mutation(() => EditResponse)
  @UseMiddleware(isAuth)
  async editProfile(
    @Ctx() { payload }: MyContext,
    @Arg('username') username: string,
    @Arg('first') first: string,
    @Arg('last') last: string,
    @Arg('bio') bio: string,
    @Arg('profileImage') profileImage: string,
    @Arg('ogProfileImage') ogProfileImage: string
  ) {
    const existingUser = await User.findOne({
      where: { id: payload?.userId }
    });

    if (!existingUser) {
      throw new Error('could not find user');
    }

    if (!username) {
      return {
        res: false,
        message: 'Please enter a valid username...',
        user: existingUser
      };
    }

    if (!first) {
      return {
        res: false,
        message: 'Please enter a first name...',
        user: existingUser
      };
    }

    if (!last) {
      return {
        res: false,
        message: 'Please enter a last name...',
        user: existingUser
      };
    }

    const usernameLength = username.length;

    if (usernameLength > 40) {
      return {
        res: false,
        message: 'Username over 40 characters...',
        user: existingUser
      };
    }

    const noSpaces = username.match(/^\S+$/);

    if (!noSpaces) {
      return {
        res: false,
        message: 'Please enter a username with no spaces...',
        user: existingUser
      };
    }

    const validCharacters = username.match(/^[\.a-zA-Z0-9]*$/);

    if (!validCharacters) {
      return {
        res: false,
        message:
          'Please enter valid username. Only letters, numbers, and periods allowed...',
        user: existingUser
      };
    }

    const notJustAllNumbers = username.match(/^[0-9]*$/);

    if (notJustAllNumbers) {
      return {
        res: false,
        message: 'Please enter valid username that includes letters...',
        user: existingUser
      };
    }

    const bioLength = bio.length;

    if (bioLength > 145) {
      return {
        res: false,
        message: 'Bio over 145 characters...',
        user: existingUser
      };
    }

    if (existingUser.profile) {
      existingUser.profile.first = first;
      existingUser.profile.last = last;
      existingUser.profile.bio = bio;

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      if (profileImage !== existingUser.profile.profileImageId) {
        if (profileImage === '') {
          existingUser.profile.profileImageId = '';
        } else {
          try {
            const response = await cloudinary.v2.uploader.upload(profileImage, {
              allowed_formats: ['jpg', 'png', 'heic', 'jpeg'],
              public_id: ''
            });
            existingUser.profile.profileImageId = response.url;
          } catch (e) {
            return {
              res: false,
              message: `Image could not be uploaded:${e.message}`,
              user: null
            };
          }
        }
      }

      if (ogProfileImage !== existingUser.profile.ogProfileImageId) {
        if (ogProfileImage === '') {
          existingUser.profile.ogProfileImageId = '';
        } else {
          try {
            const originalProfileImageResult = await cloudinary.v2.uploader.upload(
              ogProfileImage,
              {
                allowed_formats: ['jpg', 'png', 'heic', 'jpeg'],
                public_id: ''
              }
            );
            existingUser.profile.ogProfileImageId =
              originalProfileImageResult.url;
          } catch (e) {
            return {
              res: false,
              message: `Image could not be uploaded:${e.message}`,
              user: null
            };
          }
        }
      }

      if (existingUser.profile.username !== username) {
        const existing = await Profile.findOne({ where: { username } });

        if (existing) {
          return {
            res: false,
            message: 'Looks like someone already has that username... ',
            user: existingUser
          };
        }

        existingUser.profile.username = username;
        await existingUser.save();
        return { res: true, message: 'refresh', user: existingUser };
      }

      await existingUser.save();
    } else {
      // edge case: if user doesnt have profile
      const profile = new Profile();
      profile.username = username;
      profile.first = first;
      profile.last = last;
      profile.bio = bio;

      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      if (profileImage !== '') {
        try {
          const response = await cloudinary.v2.uploader.upload(profileImage, {
            allowed_formats: ['jpg', 'png', 'heic', 'jpeg'],
            public_id: ''
          });
          profile.profileImageId = response.url;
        } catch (e) {
          return {
            res: false,
            message: `Image could not be uploaded:${e.message}`,
            user: null
          };
        }
      }

      if (ogProfileImage !== 'existingUser.profile.ogProfileImageId') {
        try {
          const originalProfileImageResult = await cloudinary.v2.uploader.upload(
            profileImage,
            {
              allowed_formats: ['jpg', 'png', 'heic', 'jpeg'],
              public_id: ''
            }
          );
          profile.ogProfileImageId = originalProfileImageResult.url;
        } catch (e) {
          return {
            res: false,
            message: `Image could not be uploaded:${e.message}`,
            user: null
          };
        }
      }

      await profile.save();
      existingUser.profile = profile;
      await existingUser.save();
      return { res: true, message: 'refresh', user: existingUser };
    }

    return { res: true, message: 'success', user: existingUser };
  }
}
