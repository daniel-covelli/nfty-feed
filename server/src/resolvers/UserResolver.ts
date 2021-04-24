import {
  Resolver,
  Query,
  Arg,
  Mutation,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  Int
} from 'type-graphql';
import { User } from '../entity/User';
import { compare, hash } from 'bcryptjs';
import { MyContext } from '../migration/MyContext';
import { createAccessToken, createRefreshToken } from '../auth';
import { isAuth } from '../isAuth';
import { sendRefreshToken } from '../sendRefreshToken';
import { getConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';
import { Profile } from '../entity/Profile';
const cloudinary = require('cloudinary');

@ObjectType()
class RegisterResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
  @Field(() => User, { nullable: true })
  user: User;
}

@ObjectType()
class GenericResponse {
  @Field()
  res: Boolean;
  @Field()
  message: String;
}

@ObjectType()
class UserResponse {
  @Field()
  me: Boolean;
  @Field()
  user: User;
}

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
  @Field(() => User)
  user: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi!';
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    return `your user id is: ${payload!.userId}`;
  }

  @Query(() => [User])
  async users() {
    const users = await User.find();

    return users;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers['authorization'];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(' ')[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Query(() => UserResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async getUser(@Ctx() { payload }: MyContext, @Arg('path') path: string) {
    const userIdOrUsername = path.split('/')[path.split('/').length - 1];

    let user;
    let profile;
    if (userIdOrUsername.match(/^[0-9]*$/)) {
      user = await User.findOne({
        where: { id: userIdOrUsername },
        relations: ['profile']
      });
      if (!user) {
        throw new Error('could not find user');
      }
    } else {
      profile = await Profile.findOne({
        where: { username: userIdOrUsername },
        relations: ['user']
      });
      if (!profile) {
        throw new Error('could not find user');
      }
      user = profile.user;
    }

    const isMe = payload!.userId == `${user!.id}`;

    return { me: isMe, user };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({
      where: { email },
      relations: ['profile']
    });

    if (!user) {
      throw new Error('could not find user');
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error('invalid password');
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user
    };
  }

  @Mutation(() => GenericResponse)
  async checkEmail(@Arg('email') email: string) {
    try {
      const existing = await User.findOne({ where: { email } });

      if (existing) {
        return {
          res: false,
          message: 'Looks like this email already taken...'
        };
      }

      return { res: true, message: `Congrats, you're registered!` };
    } catch (err) {
      console.log(err);
      return {
        res: false,
        message: 'Internal server error. Try again later...'
      };
    }
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('username') username: string,
    @Arg('phone') phone: string,
    @Arg('first') first: string,
    @Arg('last') last: string,
    @Arg('bio') bio: string,
    @Arg('profileImage') profileImage: string
  ) {
    if (!username) {
      return {
        res: false,
        message: 'Please enter a valid username...',
        user: null
      };
    }

    if (!phone) {
      return {
        res: false,
        message: 'Please enter a valid phone number...',
        user: null
      };
    }

    if (!first) {
      return {
        res: false,
        message: 'Please enter your first name...',
        user: null
      };
    }

    if (!last) {
      return {
        res: false,
        message: 'Please enter your last name...',
        user: null
      };
    }

    const usernameLength = username.length;

    if (usernameLength > 40) {
      return {
        res: false,
        message: 'Username over 40 characters...',
        user: null
      };
    }

    const noSpaces = username.match(/^\S+$/);

    if (!noSpaces) {
      return {
        res: false,
        message: 'Please enter a username with no spaces...',
        user: null
      };
    }

    const validCharacters = username.match(/^[\.a-zA-Z0-9]*$/);

    if (!validCharacters) {
      return {
        res: false,
        message:
          'Please enter valid username. Only letters, numbers, and periods allowed...',
        user: null
      };
    }

    const notJustAllNumbers = username.match(/^[0-9]*$/);

    if (notJustAllNumbers) {
      return {
        res: false,
        message: 'Please enter valid username that includes letters...',
        user: null
      };
    }

    const valid = phone.match(/^[0-9]{10}$/);

    if (!valid) {
      return {
        res: false,
        message: 'Please enter valid phone number, ex. 1234567890',
        user: null
      };
    }

    const existing = await Profile.findOne({ where: { username } });

    if (existing) {
      return {
        res: false,
        message: 'Looks like someone already has that username... ',
        user: null
      };
    }

    const bioLength = bio.length;

    if (bioLength > 145) {
      return {
        res: false,
        message: 'Bio over 145 characters...',
        user: null
      };
    }

    let result: any;
    if (profileImage) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });

      try {
        result = await cloudinary.v2.uploader.upload(profileImage, {
          allowed_formats: ['jpg', 'png'],
          public_id: ''
        });
      } catch (e) {
        return {
          res: false,
          message: `Image could not be uploaded:${e.message}`,
          user: null
        };
      }
      console.log(`Successful-Photo URL: ${result.url}`);
      // try {
      //   response = await axios({
      //     url: "http://localhost:4000",
      //     method: "post",
      //     `https://api.cloudinary.com/${process.env.CLOUD_NAME}/image/upload`,
      //     formData

      //   });
      // } catch (e) {
      //   throw new Error('unable to process post');
      // }
    }

    const hashedPassword = await hash(password, 12);

    let user;
    try {
      const profile = new Profile();
      profile.username = username;
      profile.phone = phone;
      profile.first = first;
      profile.last = last;
      profile.bio = bio;
      profile.profileImageId = `${result ? result.url : ''}`;
      await Profile.save(profile);

      user = new User();
      user.email = email;
      user.password = hashedPassword;
      user.profile = profile;
      await User.save(user);
    } catch (err) {
      console.log(err);
      return {
        res: false,
        message: 'Internal server error. Try again later...',
        user: null
      };
    }

    return { res: true, message: `Congrats, you're registered!`, user };
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, 'tokenVersion', 1);
    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, '');
    return true;
  }
}
