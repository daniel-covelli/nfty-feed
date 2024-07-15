import { Resolver, Query, Arg, Mutation, Ctx, Authorized } from "type-graphql";
import { User } from "../entity/User";
import { compare, hash } from "bcryptjs";
import { Profile } from "../entity/Profile";
import { GenericResponse, RegisterResponse, UserResponse } from "../wire/user";
import { MyContext } from "../context";
import { uploadMedia } from "../utils/bytescale";
import { UploadResult } from "@bytescale/sdk";

const INVITATIONS = 2;

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Query(() => [User])
  async users() {
    const users = await User.find();
    return users;
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  me(@Ctx() ctx: MyContext) {
    return ctx.user;
  }

  @Authorized()
  @Query(() => UserResponse, { nullable: true })
  async getUser(@Ctx() context: MyContext, @Arg("path") path: string) {
    const userIdOrUsername = path.split("/")[path.split("/").length - 1];

    let user;
    let profile;
    if (userIdOrUsername.match(/^[0-9]*$/)) {
      user = await User.findOne({
        where: { id: userIdOrUsername },
        relations: ["profile"],
      });
      if (!user) {
        throw new Error("could not find user");
      }
    } else {
      profile = await Profile.findOne({
        where: { username: userIdOrUsername },
        relations: ["user"],
      });
      if (!profile) {
        throw new Error("could not find user");
      }
      user = profile.user;
    }

    const isMe = context?.user?.id === user.id;

    return { me: isMe, user };
  }

  @Mutation(() => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext,
  ): Promise<User> {
    const user = await User.findOne({
      where: { email },
      relations: ["profile"],
    });

    if (!user) {
      throw new Error("Incorrect credentials, please try again.");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Incorrect credentials, please try again.");
    }

    ctx.user = user;
    ctx.req.session.userId = `${user.id}`;

    return user;
  }

  @Mutation(() => GenericResponse)
  async checkEmail(@Arg("email") email: string) {
    try {
      const existing = await User.findOne({ where: { email } });

      if (existing) {
        return {
          res: false,
          message: "Looks like this email already taken...",
        };
      }

      return { res: true, message: `Congrats, you're registered!` };
    } catch (err) {
      return {
        res: false,
        message: "Internal server error. Try again later...",
      };
    }
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Ctx() ctx: MyContext,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("username") username: string,
    @Arg("phone") phone: string,
    @Arg("first") first: string,
    @Arg("last") last: string,
    @Arg("bio") bio: string,
    @Arg("verificationCode") _verificationCode: string,
    @Arg("profileImage") profileImage: string,
    @Arg("ogProfileImage") ogProfileImage: string,
  ) {
    if (!username) {
      return {
        res: false,
        message: "Please enter a valid username...",
        user: null,
      };
    }

    if (!first) {
      return {
        res: false,
        message: "Please enter your first name...",
        user: null,
      };
    }

    if (!last) {
      return {
        res: false,
        message: "Please enter your last name...",
        user: null,
      };
    }

    const usernameLength = username.length;

    if (usernameLength > 40) {
      return {
        res: false,
        message: "Username over 40 characters...",
        user: null,
      };
    }

    const noSpaces = username.match(/^\S+$/);

    if (!noSpaces) {
      return {
        res: false,
        message: "Please enter a username with no spaces...",
        user: null,
      };
    }

    const validCharacters = username.match(/^[.a-zA-Z0-9]*$/);

    if (!validCharacters) {
      return {
        res: false,
        message: "Please enter valid username. Only letters, numbers, and periods allowed...",
        user: null,
      };
    }

    const notJustAllNumbers = username.match(/^[0-9]*$/);

    if (notJustAllNumbers) {
      return {
        res: false,
        message: "Please enter valid username that includes letters...",
        user: null,
      };
    }

    const existing = await Profile.findOne({ where: { username } });

    if (existing) {
      return {
        res: false,
        message: "Looks like someone already has that username... ",
        user: null,
      };
    }

    const bioLength = bio.length;

    if (bioLength > 145) {
      return {
        res: false,
        message: "Bio over 145 characters...",
        user: null,
      };
    }

    // const invitation = await Invitation.findOne({
    //   where: { active: Status.ACTIVE, number: phone, verificationCode },
    // });

    // if (!invitation) {
    //   return {
    //     res: false,
    //     message: "Please enter valid phone number, ex. 1234567890",
    //     user: null,
    //   };
    // }

    let profileImageResult: UploadResult | undefined = undefined;
    let ogProfile: UploadResult | undefined = undefined;
    if (profileImage && ogProfileImage) {
      try {
        profileImageResult = await uploadMedia(profileImage);
      } catch (e) {
        return {
          res: false,
          message: `Image could not be uploaded`,
          post: null,
        };
      }

      try {
        ogProfile = await uploadMedia(ogProfileImage);
      } catch (e) {
        return {
          res: false,
          message: `Image could not be uploaded`,
          post: null,
        };
      }
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
      profile.ogProfileImageId = `${ogProfile?.fileUrl ? ogProfile.fileUrl : ""}`;
      profile.profileImageId = `${profileImageResult?.fileUrl ? profileImageResult.fileUrl : ""}`;
      await Profile.save(profile);

      user = new User();
      user.email = email;
      user.invitations = INVITATIONS;
      user.password = hashedPassword;
      user.profile = profile;
      await User.save(user);

      ctx.user = user;
      ctx.req.session.userId = `${user.id}`;

      // invitation.active = Status.INACTIVE;
      // await Invitation.save(invitation);
    } catch (err) {
      return {
        res: false,
        message: "Internal server error. Try again later...",
        user: null,
      };
    }

    return { res: true, message: `Congrats, you're registered!`, user };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req }: MyContext): Promise<Boolean> {
    return new Promise((resolve) => {
      req.res?.clearCookie("nfty");
      req.session.destroy(() => resolve(true));
    });
  }
}
