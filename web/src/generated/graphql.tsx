import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: any;
};


export type AdminInvitationResponse = {
  __typename?: 'AdminInvitationResponse';
  res: Scalars['Boolean'];
  message: Scalars['String'];
  invitation?: Maybe<Invitation>;
};


export type EditResponse = {
  __typename?: 'EditResponse';
  res: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type FollowersResponse = {
  __typename?: 'FollowersResponse';
  profile: Profile;
  following: Scalars['Boolean'];
  me: Scalars['Boolean'];
  userId: Scalars['Float'];
};

export type GenericResponse = {
  __typename?: 'GenericResponse';
  res: Scalars['Boolean'];
  message: Scalars['String'];
};

export type Invitation = {
  __typename?: 'Invitation';
  id: Scalars['Int'];
  ownerId: Scalars['Float'];
  number: Scalars['String'];
  verificationCode: Scalars['Float'];
  active: Scalars['Float'];
  createdAt: Scalars['DateTimeISO'];
};

export type InvitationResponse = {
  __typename?: 'InvitationResponse';
  res: Scalars['Boolean'];
  message: Scalars['String'];
  invitation?: Maybe<Invitation>;
  user?: Maybe<User>;
};

export type Like = {
  __typename?: 'Like';
  id: Scalars['Int'];
  owner?: Maybe<Profile>;
  post?: Maybe<Post>;
  createdAt: Scalars['DateTimeISO'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: User;
  checkEmail: GenericResponse;
  register: RegisterResponse;
  logout: Scalars['Boolean'];
  editProfile: EditResponse;
  subscribe: Subscription;
  unSubscribe: Subscription;
  like: Post;
  unlike: Post;
  invisible: PostResponse;
  visible: PostResponse;
  remove: PostResponse;
  readd: PostResponse;
  createPost: PostResponse;
  setAllLikes: Array<Post>;
  checkInvitation: VerificationResponse;
  sendAdminInvitation: AdminInvitationResponse;
  sendInvitation: InvitationResponse;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationCheckEmailArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  ogProfileImage: Scalars['String'];
  profileImage: Scalars['String'];
  verificationCode: Scalars['String'];
  bio: Scalars['String'];
  last: Scalars['String'];
  first: Scalars['String'];
  phone: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationEditProfileArgs = {
  ogProfileImage: Scalars['String'];
  profileImage: Scalars['String'];
  bio: Scalars['String'];
  last: Scalars['String'];
  first: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSubscribeArgs = {
  userIdWhoIsBeingFollowed: Scalars['Float'];
};


export type MutationUnSubscribeArgs = {
  userId: Scalars['Float'];
};


export type MutationLikeArgs = {
  postId: Scalars['Float'];
};


export type MutationUnlikeArgs = {
  postId: Scalars['Float'];
};


export type MutationInvisibleArgs = {
  postId: Scalars['Float'];
};


export type MutationVisibleArgs = {
  postId: Scalars['Float'];
};


export type MutationRemoveArgs = {
  postId: Scalars['Float'];
};


export type MutationReaddArgs = {
  postId: Scalars['Float'];
};


export type MutationCreatePostArgs = {
  type?: Maybe<Scalars['Float']>;
  title: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  artist?: Maybe<Scalars['String']>;
  media: Scalars['String'];
  profileId: Scalars['Float'];
};


export type MutationCheckInvitationArgs = {
  verificationCode: Scalars['String'];
  number: Scalars['String'];
};


export type MutationSendAdminInvitationArgs = {
  code: Scalars['String'];
  number: Scalars['String'];
};


export type MutationSendInvitationArgs = {
  number: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['Int'];
  owner: Profile;
  media: Scalars['String'];
  artist?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  type: Scalars['Float'];
  visibility: Scalars['Float'];
  removed: Scalars['Float'];
  numberOfLikes: Scalars['Float'];
  likes: Array<Like>;
  createdAt: Scalars['DateTimeISO'];
};

export type PostResponse = {
  __typename?: 'PostResponse';
  res: Scalars['Boolean'];
  message: Scalars['String'];
  post?: Maybe<Post>;
};

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['Int'];
  profileImageId?: Maybe<Scalars['String']>;
  ogProfileImageId?: Maybe<Scalars['String']>;
  username: Scalars['String'];
  phone: Scalars['String'];
  first: Scalars['String'];
  last: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  user: User;
  posts: Array<Post>;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  users: Array<User>;
  me?: Maybe<User>;
  getUser?: Maybe<UserResponse>;
  getFollowersData: Array<FollowersResponse>;
  getFollowingData: Array<User>;
  subscriptions: Array<Subscription>;
  getActiveFollowers: Array<Subscription>;
  getActiveFollowing: Array<Subscription>;
  existingSubscription: Scalars['Boolean'];
  posts: Array<Post>;
  getUsersPosts: Array<Post>;
  getTopPosts: Array<Post>;
  getTopPostsAdmin: Array<Post>;
  likes: Array<Like>;
  likedByCurrentProfile: Scalars['Boolean'];
  getLikes: Array<Like>;
  invitations: Array<Invitation>;
};


export type QueryGetUserArgs = {
  path: Scalars['String'];
};


export type QueryGetFollowersDataArgs = {
  userId: Scalars['Float'];
};


export type QueryGetFollowingDataArgs = {
  userId: Scalars['Float'];
};


export type QueryGetActiveFollowersArgs = {
  userId: Scalars['Float'];
};


export type QueryGetActiveFollowingArgs = {
  userId: Scalars['Float'];
};


export type QueryExistingSubscriptionArgs = {
  userId: Scalars['Float'];
};


export type QueryGetUsersPostsArgs = {
  profileId: Scalars['Float'];
};


export type QueryGetTopPostsArgs = {
  page: Scalars['Float'];
};


export type QueryGetTopPostsAdminArgs = {
  page: Scalars['Float'];
};


export type QueryLikedByCurrentProfileArgs = {
  postId: Scalars['Float'];
  profileId: Scalars['Float'];
};


export type QueryGetLikesArgs = {
  postId: Scalars['Float'];
};

export type RegisterResponse = {
  __typename?: 'RegisterResponse';
  res: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  id: Scalars['Int'];
  userId: Scalars['Float'];
  followingId: Scalars['Float'];
  active: Scalars['Float'];
  createdAt: Scalars['DateTimeISO'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email?: Maybe<Scalars['String']>;
  invitations: Scalars['Float'];
  admin: Scalars['Float'];
  profile?: Maybe<Profile>;
  createdAt: Scalars['DateTimeISO'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  me: Scalars['Boolean'];
  user: User;
};

export type VerificationResponse = {
  __typename?: 'VerificationResponse';
  res: Scalars['Boolean'];
  message: Scalars['String'];
};

export type CheckEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type CheckEmailMutation = (
  { __typename?: 'Mutation' }
  & { checkEmail: (
    { __typename?: 'GenericResponse' }
    & Pick<GenericResponse, 'res' | 'message'>
  ) }
);

export type CheckInvitationMutationVariables = Exact<{
  number: Scalars['String'];
  verificationCode: Scalars['String'];
}>;


export type CheckInvitationMutation = (
  { __typename?: 'Mutation' }
  & { checkInvitation: (
    { __typename?: 'VerificationResponse' }
    & Pick<VerificationResponse, 'res' | 'message'>
  ) }
);

export type CreatePostMutationVariables = Exact<{
  profileId: Scalars['Float'];
  media: Scalars['String'];
  artist: Scalars['String'];
  title: Scalars['String'];
  link: Scalars['String'];
  type: Scalars['Float'];
}>;


export type CreatePostMutation = (
  { __typename?: 'Mutation' }
  & { createPost: (
    { __typename?: 'PostResponse' }
    & Pick<PostResponse, 'res' | 'message'>
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed' | 'numberOfLikes' | 'createdAt'>
      & { owner: (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
      ) }
    )> }
  ) }
);

export type EditProfileMutationVariables = Exact<{
  username: Scalars['String'];
  first: Scalars['String'];
  last: Scalars['String'];
  bio: Scalars['String'];
  profileImage: Scalars['String'];
  ogProfileImage: Scalars['String'];
}>;


export type EditProfileMutation = (
  { __typename?: 'Mutation' }
  & { editProfile: (
    { __typename?: 'EditResponse' }
    & Pick<EditResponse, 'res' | 'message'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
      & { profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'username' | 'phone' | 'first' | 'last' | 'bio' | 'profileImageId' | 'ogProfileImageId'>
      )> }
    )> }
  ) }
);

export type ExistingSubscriptionQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type ExistingSubscriptionQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'existingSubscription'>
);

export type GetActiveFollowersQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type GetActiveFollowersQuery = (
  { __typename?: 'Query' }
  & { getActiveFollowers: Array<(
    { __typename?: 'Subscription' }
    & Pick<Subscription, 'id' | 'userId' | 'followingId' | 'active'>
  )> }
);

export type GetActiveFollowingQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type GetActiveFollowingQuery = (
  { __typename?: 'Query' }
  & { getActiveFollowing: Array<(
    { __typename?: 'Subscription' }
    & Pick<Subscription, 'id' | 'userId' | 'followingId' | 'active'>
  )> }
);

export type GetFollowersDataQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type GetFollowersDataQuery = (
  { __typename?: 'Query' }
  & { getFollowersData: Array<(
    { __typename?: 'FollowersResponse' }
    & Pick<FollowersResponse, 'following' | 'me' | 'userId'>
    & { profile: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
    ) }
  )> }
);

export type GetFollowingDataQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type GetFollowingDataQuery = (
  { __typename?: 'Query' }
  & { getFollowingData: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id'>
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
    )> }
  )> }
);

export type GetLikesQueryVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type GetLikesQuery = (
  { __typename?: 'Query' }
  & { getLikes: Array<(
    { __typename?: 'Like' }
    & Pick<Like, 'id' | 'createdAt'>
    & { owner?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'profileImageId' | 'username' | 'first' | 'last'>
    )> }
  )> }
);

export type GetTopPostsQueryVariables = Exact<{
  page: Scalars['Float'];
}>;


export type GetTopPostsQuery = (
  { __typename?: 'Query' }
  & { getTopPosts: Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed' | 'numberOfLikes' | 'createdAt'>
    & { owner: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
    ) }
  )> }
);

export type GetTopPostsAdminQueryVariables = Exact<{
  page: Scalars['Float'];
}>;


export type GetTopPostsAdminQuery = (
  { __typename?: 'Query' }
  & { getTopPostsAdmin: Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed' | 'numberOfLikes' | 'createdAt'>
    & { owner: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
    ) }
  )> }
);

export type GetUserQueryVariables = Exact<{
  path: Scalars['String'];
}>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { getUser?: Maybe<(
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'me'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
      & { profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'username' | 'phone' | 'first' | 'last' | 'bio' | 'profileImageId' | 'ogProfileImageId'>
      )> }
    ) }
  )> }
);

export type GetUsersPostsQueryVariables = Exact<{
  profileId: Scalars['Float'];
}>;


export type GetUsersPostsQuery = (
  { __typename?: 'Query' }
  & { getUsersPosts: Array<(
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed' | 'numberOfLikes' | 'createdAt'>
    & { owner: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
    ) }
  )> }
);

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'hello'>
);

export type InvisibleMutationVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type InvisibleMutation = (
  { __typename?: 'Mutation' }
  & { invisible: (
    { __typename?: 'PostResponse' }
    & Pick<PostResponse, 'res' | 'message'>
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed' | 'numberOfLikes' | 'createdAt'>
      & { owner: (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
      ) }
    )> }
  ) }
);

export type LikeMutationVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type LikeMutation = (
  { __typename?: 'Mutation' }
  & { like: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed'>
    & { owner: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
    ), likes: Array<(
      { __typename?: 'Like' }
      & Pick<Like, 'id' | 'createdAt'>
      & { owner?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'profileImageId' | 'username' | 'first' | 'last'>
      )> }
    )> }
  ) }
);

export type LikedByCurrentProfileQueryVariables = Exact<{
  profileId: Scalars['Float'];
  postId: Scalars['Float'];
}>;


export type LikedByCurrentProfileQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'likedByCurrentProfile'>
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'admin' | 'invitations'>
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'username' | 'first' | 'last' | 'profileImageId'>
    )> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email' | 'admin' | 'invitations'>
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'first' | 'last' | 'username' | 'profileImageId'>
    )> }
  )> }
);

export type ReaddMutationVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type ReaddMutation = (
  { __typename?: 'Mutation' }
  & { readd: (
    { __typename?: 'PostResponse' }
    & Pick<PostResponse, 'res' | 'message'>
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed' | 'numberOfLikes' | 'createdAt'>
      & { owner: (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
      ) }
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
  phone: Scalars['String'];
  verificationCode: Scalars['String'];
  first: Scalars['String'];
  last: Scalars['String'];
  bio: Scalars['String'];
  profileImage: Scalars['String'];
  ogProfileImage: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'RegisterResponse' }
    & Pick<RegisterResponse, 'res' | 'message'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
      & { profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'first' | 'last' | 'username' | 'profileImageId'>
      )> }
    )> }
  ) }
);

export type RemoveMutationVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type RemoveMutation = (
  { __typename?: 'Mutation' }
  & { remove: (
    { __typename?: 'PostResponse' }
    & Pick<PostResponse, 'res' | 'message'>
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed' | 'numberOfLikes' | 'createdAt'>
      & { owner: (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
      ) }
    )> }
  ) }
);

export type SendAdminInvitationMutationVariables = Exact<{
  number: Scalars['String'];
  code: Scalars['String'];
}>;


export type SendAdminInvitationMutation = (
  { __typename?: 'Mutation' }
  & { sendAdminInvitation: (
    { __typename?: 'AdminInvitationResponse' }
    & Pick<AdminInvitationResponse, 'res' | 'message'>
    & { invitation?: Maybe<(
      { __typename?: 'Invitation' }
      & Pick<Invitation, 'id' | 'ownerId' | 'number' | 'verificationCode' | 'active' | 'createdAt'>
    )> }
  ) }
);

export type SendInvitationMutationVariables = Exact<{
  number: Scalars['String'];
}>;


export type SendInvitationMutation = (
  { __typename?: 'Mutation' }
  & { sendInvitation: (
    { __typename?: 'InvitationResponse' }
    & Pick<InvitationResponse, 'res' | 'message'>
    & { invitation?: Maybe<(
      { __typename?: 'Invitation' }
      & Pick<Invitation, 'id' | 'ownerId' | 'number' | 'verificationCode' | 'active' | 'createdAt'>
    )>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'admin' | 'invitations'>
      & { profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'first' | 'last' | 'username' | 'profileImageId'>
      )> }
    )> }
  ) }
);

export type SubscribeMutationVariables = Exact<{
  userIdWhoIsBeingFollowed: Scalars['Float'];
}>;


export type SubscribeMutation = (
  { __typename?: 'Mutation' }
  & { subscribe: (
    { __typename?: 'Subscription' }
    & Pick<Subscription, 'id' | 'userId' | 'followingId' | 'active'>
  ) }
);

export type UnlikeMutationVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type UnlikeMutation = (
  { __typename?: 'Mutation' }
  & { unlike: (
    { __typename?: 'Post' }
    & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed'>
    & { owner: (
      { __typename?: 'Profile' }
      & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
    ), likes: Array<(
      { __typename?: 'Like' }
      & Pick<Like, 'id' | 'createdAt'>
      & { owner?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'profileImageId' | 'username' | 'first' | 'last'>
      )> }
    )> }
  ) }
);

export type UnSubscribeMutationVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type UnSubscribeMutation = (
  { __typename?: 'Mutation' }
  & { unSubscribe: (
    { __typename?: 'Subscription' }
    & Pick<Subscription, 'id' | 'userId' | 'followingId' | 'active'>
  ) }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'first' | 'last' | 'username' | 'profileImageId' | 'ogProfileImageId'>
    )> }
  )> }
);

export type VisibleMutationVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type VisibleMutation = (
  { __typename?: 'Mutation' }
  & { visible: (
    { __typename?: 'PostResponse' }
    & Pick<PostResponse, 'res' | 'message'>
    & { post?: Maybe<(
      { __typename?: 'Post' }
      & Pick<Post, 'id' | 'media' | 'title' | 'artist' | 'link' | 'type' | 'visibility' | 'removed' | 'numberOfLikes' | 'createdAt'>
      & { owner: (
        { __typename?: 'Profile' }
        & Pick<Profile, 'id' | 'username' | 'profileImageId' | 'first' | 'last'>
      ) }
    )> }
  ) }
);


export const CheckEmailDocument = gql`
    mutation CheckEmail($email: String!) {
  checkEmail(email: $email) {
    res
    message
  }
}
    `;
export type CheckEmailMutationFn = Apollo.MutationFunction<CheckEmailMutation, CheckEmailMutationVariables>;

/**
 * __useCheckEmailMutation__
 *
 * To run a mutation, you first call `useCheckEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkEmailMutation, { data, loading, error }] = useCheckEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCheckEmailMutation(baseOptions?: Apollo.MutationHookOptions<CheckEmailMutation, CheckEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckEmailMutation, CheckEmailMutationVariables>(CheckEmailDocument, options);
      }
export type CheckEmailMutationHookResult = ReturnType<typeof useCheckEmailMutation>;
export type CheckEmailMutationResult = Apollo.MutationResult<CheckEmailMutation>;
export type CheckEmailMutationOptions = Apollo.BaseMutationOptions<CheckEmailMutation, CheckEmailMutationVariables>;
export const CheckInvitationDocument = gql`
    mutation CheckInvitation($number: String!, $verificationCode: String!) {
  checkInvitation(number: $number, verificationCode: $verificationCode) {
    res
    message
  }
}
    `;
export type CheckInvitationMutationFn = Apollo.MutationFunction<CheckInvitationMutation, CheckInvitationMutationVariables>;

/**
 * __useCheckInvitationMutation__
 *
 * To run a mutation, you first call `useCheckInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkInvitationMutation, { data, loading, error }] = useCheckInvitationMutation({
 *   variables: {
 *      number: // value for 'number'
 *      verificationCode: // value for 'verificationCode'
 *   },
 * });
 */
export function useCheckInvitationMutation(baseOptions?: Apollo.MutationHookOptions<CheckInvitationMutation, CheckInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckInvitationMutation, CheckInvitationMutationVariables>(CheckInvitationDocument, options);
      }
export type CheckInvitationMutationHookResult = ReturnType<typeof useCheckInvitationMutation>;
export type CheckInvitationMutationResult = Apollo.MutationResult<CheckInvitationMutation>;
export type CheckInvitationMutationOptions = Apollo.BaseMutationOptions<CheckInvitationMutation, CheckInvitationMutationVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($profileId: Float!, $media: String!, $artist: String!, $title: String!, $link: String!, $type: Float!) {
  createPost(
    profileId: $profileId
    media: $media
    artist: $artist
    link: $link
    title: $title
    type: $type
  ) {
    res
    message
    post {
      id
      owner {
        id
        username
        profileImageId
        first
        last
      }
      media
      title
      artist
      link
      type
      visibility
      removed
      numberOfLikes
      createdAt
    }
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      profileId: // value for 'profileId'
 *      media: // value for 'media'
 *      artist: // value for 'artist'
 *      title: // value for 'title'
 *      link: // value for 'link'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const EditProfileDocument = gql`
    mutation EditProfile($username: String!, $first: String!, $last: String!, $bio: String!, $profileImage: String!, $ogProfileImage: String!) {
  editProfile(
    username: $username
    first: $first
    last: $last
    bio: $bio
    profileImage: $profileImage
    ogProfileImage: $ogProfileImage
  ) {
    res
    message
    user {
      id
      email
      profile {
        id
        username
        phone
        first
        last
        bio
        profileImageId
        ogProfileImageId
      }
    }
  }
}
    `;
export type EditProfileMutationFn = Apollo.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      username: // value for 'username'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      bio: // value for 'bio'
 *      profileImage: // value for 'profileImage'
 *      ogProfileImage: // value for 'ogProfileImage'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: Apollo.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, options);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = Apollo.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = Apollo.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const ExistingSubscriptionDocument = gql`
    query ExistingSubscription($userId: Float!) {
  existingSubscription(userId: $userId)
}
    `;

/**
 * __useExistingSubscriptionQuery__
 *
 * To run a query within a React component, call `useExistingSubscriptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useExistingSubscriptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExistingSubscriptionQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useExistingSubscriptionQuery(baseOptions: Apollo.QueryHookOptions<ExistingSubscriptionQuery, ExistingSubscriptionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExistingSubscriptionQuery, ExistingSubscriptionQueryVariables>(ExistingSubscriptionDocument, options);
      }
export function useExistingSubscriptionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExistingSubscriptionQuery, ExistingSubscriptionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExistingSubscriptionQuery, ExistingSubscriptionQueryVariables>(ExistingSubscriptionDocument, options);
        }
export type ExistingSubscriptionQueryHookResult = ReturnType<typeof useExistingSubscriptionQuery>;
export type ExistingSubscriptionLazyQueryHookResult = ReturnType<typeof useExistingSubscriptionLazyQuery>;
export type ExistingSubscriptionQueryResult = Apollo.QueryResult<ExistingSubscriptionQuery, ExistingSubscriptionQueryVariables>;
export const GetActiveFollowersDocument = gql`
    query GetActiveFollowers($userId: Float!) {
  getActiveFollowers(userId: $userId) {
    id
    userId
    followingId
    active
  }
}
    `;

/**
 * __useGetActiveFollowersQuery__
 *
 * To run a query within a React component, call `useGetActiveFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveFollowersQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetActiveFollowersQuery(baseOptions: Apollo.QueryHookOptions<GetActiveFollowersQuery, GetActiveFollowersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActiveFollowersQuery, GetActiveFollowersQueryVariables>(GetActiveFollowersDocument, options);
      }
export function useGetActiveFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveFollowersQuery, GetActiveFollowersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActiveFollowersQuery, GetActiveFollowersQueryVariables>(GetActiveFollowersDocument, options);
        }
export type GetActiveFollowersQueryHookResult = ReturnType<typeof useGetActiveFollowersQuery>;
export type GetActiveFollowersLazyQueryHookResult = ReturnType<typeof useGetActiveFollowersLazyQuery>;
export type GetActiveFollowersQueryResult = Apollo.QueryResult<GetActiveFollowersQuery, GetActiveFollowersQueryVariables>;
export const GetActiveFollowingDocument = gql`
    query GetActiveFollowing($userId: Float!) {
  getActiveFollowing(userId: $userId) {
    id
    userId
    followingId
    active
  }
}
    `;

/**
 * __useGetActiveFollowingQuery__
 *
 * To run a query within a React component, call `useGetActiveFollowingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveFollowingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveFollowingQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetActiveFollowingQuery(baseOptions: Apollo.QueryHookOptions<GetActiveFollowingQuery, GetActiveFollowingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActiveFollowingQuery, GetActiveFollowingQueryVariables>(GetActiveFollowingDocument, options);
      }
export function useGetActiveFollowingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveFollowingQuery, GetActiveFollowingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActiveFollowingQuery, GetActiveFollowingQueryVariables>(GetActiveFollowingDocument, options);
        }
export type GetActiveFollowingQueryHookResult = ReturnType<typeof useGetActiveFollowingQuery>;
export type GetActiveFollowingLazyQueryHookResult = ReturnType<typeof useGetActiveFollowingLazyQuery>;
export type GetActiveFollowingQueryResult = Apollo.QueryResult<GetActiveFollowingQuery, GetActiveFollowingQueryVariables>;
export const GetFollowersDataDocument = gql`
    query GetFollowersData($userId: Float!) {
  getFollowersData(userId: $userId) {
    profile {
      id
      username
      profileImageId
      first
      last
    }
    following
    me
    userId
  }
}
    `;

/**
 * __useGetFollowersDataQuery__
 *
 * To run a query within a React component, call `useGetFollowersDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersDataQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFollowersDataQuery(baseOptions: Apollo.QueryHookOptions<GetFollowersDataQuery, GetFollowersDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowersDataQuery, GetFollowersDataQueryVariables>(GetFollowersDataDocument, options);
      }
export function useGetFollowersDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowersDataQuery, GetFollowersDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowersDataQuery, GetFollowersDataQueryVariables>(GetFollowersDataDocument, options);
        }
export type GetFollowersDataQueryHookResult = ReturnType<typeof useGetFollowersDataQuery>;
export type GetFollowersDataLazyQueryHookResult = ReturnType<typeof useGetFollowersDataLazyQuery>;
export type GetFollowersDataQueryResult = Apollo.QueryResult<GetFollowersDataQuery, GetFollowersDataQueryVariables>;
export const GetFollowingDataDocument = gql`
    query GetFollowingData($userId: Float!) {
  getFollowingData(userId: $userId) {
    id
    profile {
      id
      username
      profileImageId
      first
      last
    }
  }
}
    `;

/**
 * __useGetFollowingDataQuery__
 *
 * To run a query within a React component, call `useGetFollowingDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowingDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowingDataQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFollowingDataQuery(baseOptions: Apollo.QueryHookOptions<GetFollowingDataQuery, GetFollowingDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowingDataQuery, GetFollowingDataQueryVariables>(GetFollowingDataDocument, options);
      }
export function useGetFollowingDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowingDataQuery, GetFollowingDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowingDataQuery, GetFollowingDataQueryVariables>(GetFollowingDataDocument, options);
        }
export type GetFollowingDataQueryHookResult = ReturnType<typeof useGetFollowingDataQuery>;
export type GetFollowingDataLazyQueryHookResult = ReturnType<typeof useGetFollowingDataLazyQuery>;
export type GetFollowingDataQueryResult = Apollo.QueryResult<GetFollowingDataQuery, GetFollowingDataQueryVariables>;
export const GetLikesDocument = gql`
    query GetLikes($postId: Float!) {
  getLikes(postId: $postId) {
    id
    owner {
      id
      profileImageId
      username
      first
      last
    }
    createdAt
  }
}
    `;

/**
 * __useGetLikesQuery__
 *
 * To run a query within a React component, call `useGetLikesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLikesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLikesQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetLikesQuery(baseOptions: Apollo.QueryHookOptions<GetLikesQuery, GetLikesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLikesQuery, GetLikesQueryVariables>(GetLikesDocument, options);
      }
export function useGetLikesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLikesQuery, GetLikesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLikesQuery, GetLikesQueryVariables>(GetLikesDocument, options);
        }
export type GetLikesQueryHookResult = ReturnType<typeof useGetLikesQuery>;
export type GetLikesLazyQueryHookResult = ReturnType<typeof useGetLikesLazyQuery>;
export type GetLikesQueryResult = Apollo.QueryResult<GetLikesQuery, GetLikesQueryVariables>;
export const GetTopPostsDocument = gql`
    query GetTopPosts($page: Float!) {
  getTopPosts(page: $page) {
    id
    owner {
      id
      username
      profileImageId
      first
      last
    }
    media
    title
    artist
    link
    type
    visibility
    removed
    numberOfLikes
    createdAt
  }
}
    `;

/**
 * __useGetTopPostsQuery__
 *
 * To run a query within a React component, call `useGetTopPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopPostsQuery({
 *   variables: {
 *      page: // value for 'page'
 *   },
 * });
 */
export function useGetTopPostsQuery(baseOptions: Apollo.QueryHookOptions<GetTopPostsQuery, GetTopPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTopPostsQuery, GetTopPostsQueryVariables>(GetTopPostsDocument, options);
      }
export function useGetTopPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTopPostsQuery, GetTopPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTopPostsQuery, GetTopPostsQueryVariables>(GetTopPostsDocument, options);
        }
export type GetTopPostsQueryHookResult = ReturnType<typeof useGetTopPostsQuery>;
export type GetTopPostsLazyQueryHookResult = ReturnType<typeof useGetTopPostsLazyQuery>;
export type GetTopPostsQueryResult = Apollo.QueryResult<GetTopPostsQuery, GetTopPostsQueryVariables>;
export const GetTopPostsAdminDocument = gql`
    query GetTopPostsAdmin($page: Float!) {
  getTopPostsAdmin(page: $page) {
    id
    owner {
      id
      username
      profileImageId
      first
      last
    }
    media
    title
    artist
    link
    type
    visibility
    removed
    numberOfLikes
    createdAt
  }
}
    `;

/**
 * __useGetTopPostsAdminQuery__
 *
 * To run a query within a React component, call `useGetTopPostsAdminQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTopPostsAdminQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTopPostsAdminQuery({
 *   variables: {
 *      page: // value for 'page'
 *   },
 * });
 */
export function useGetTopPostsAdminQuery(baseOptions: Apollo.QueryHookOptions<GetTopPostsAdminQuery, GetTopPostsAdminQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTopPostsAdminQuery, GetTopPostsAdminQueryVariables>(GetTopPostsAdminDocument, options);
      }
export function useGetTopPostsAdminLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTopPostsAdminQuery, GetTopPostsAdminQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTopPostsAdminQuery, GetTopPostsAdminQueryVariables>(GetTopPostsAdminDocument, options);
        }
export type GetTopPostsAdminQueryHookResult = ReturnType<typeof useGetTopPostsAdminQuery>;
export type GetTopPostsAdminLazyQueryHookResult = ReturnType<typeof useGetTopPostsAdminLazyQuery>;
export type GetTopPostsAdminQueryResult = Apollo.QueryResult<GetTopPostsAdminQuery, GetTopPostsAdminQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($path: String!) {
  getUser(path: $path) {
    me
    user {
      id
      email
      profile {
        id
        username
        phone
        first
        last
        bio
        profileImageId
        ogProfileImageId
      }
    }
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      path: // value for 'path'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const GetUsersPostsDocument = gql`
    query GetUsersPosts($profileId: Float!) {
  getUsersPosts(profileId: $profileId) {
    id
    owner {
      id
      username
      profileImageId
      first
      last
    }
    media
    title
    artist
    link
    type
    visibility
    removed
    numberOfLikes
    createdAt
  }
}
    `;

/**
 * __useGetUsersPostsQuery__
 *
 * To run a query within a React component, call `useGetUsersPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersPostsQuery({
 *   variables: {
 *      profileId: // value for 'profileId'
 *   },
 * });
 */
export function useGetUsersPostsQuery(baseOptions: Apollo.QueryHookOptions<GetUsersPostsQuery, GetUsersPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersPostsQuery, GetUsersPostsQueryVariables>(GetUsersPostsDocument, options);
      }
export function useGetUsersPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersPostsQuery, GetUsersPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersPostsQuery, GetUsersPostsQueryVariables>(GetUsersPostsDocument, options);
        }
export type GetUsersPostsQueryHookResult = ReturnType<typeof useGetUsersPostsQuery>;
export type GetUsersPostsLazyQueryHookResult = ReturnType<typeof useGetUsersPostsLazyQuery>;
export type GetUsersPostsQueryResult = Apollo.QueryResult<GetUsersPostsQuery, GetUsersPostsQueryVariables>;
export const HelloDocument = gql`
    query Hello {
  hello
}
    `;

/**
 * __useHelloQuery__
 *
 * To run a query within a React component, call `useHelloQuery` and pass it any options that fit your needs.
 * When your component renders, `useHelloQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHelloQuery({
 *   variables: {
 *   },
 * });
 */
export function useHelloQuery(baseOptions?: Apollo.QueryHookOptions<HelloQuery, HelloQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
      }
export function useHelloLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HelloQuery, HelloQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HelloQuery, HelloQueryVariables>(HelloDocument, options);
        }
export type HelloQueryHookResult = ReturnType<typeof useHelloQuery>;
export type HelloLazyQueryHookResult = ReturnType<typeof useHelloLazyQuery>;
export type HelloQueryResult = Apollo.QueryResult<HelloQuery, HelloQueryVariables>;
export const InvisibleDocument = gql`
    mutation Invisible($postId: Float!) {
  invisible(postId: $postId) {
    res
    message
    post {
      id
      owner {
        id
        username
        profileImageId
        first
        last
      }
      media
      title
      artist
      link
      type
      visibility
      removed
      numberOfLikes
      createdAt
    }
  }
}
    `;
export type InvisibleMutationFn = Apollo.MutationFunction<InvisibleMutation, InvisibleMutationVariables>;

/**
 * __useInvisibleMutation__
 *
 * To run a mutation, you first call `useInvisibleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInvisibleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [invisibleMutation, { data, loading, error }] = useInvisibleMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useInvisibleMutation(baseOptions?: Apollo.MutationHookOptions<InvisibleMutation, InvisibleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InvisibleMutation, InvisibleMutationVariables>(InvisibleDocument, options);
      }
export type InvisibleMutationHookResult = ReturnType<typeof useInvisibleMutation>;
export type InvisibleMutationResult = Apollo.MutationResult<InvisibleMutation>;
export type InvisibleMutationOptions = Apollo.BaseMutationOptions<InvisibleMutation, InvisibleMutationVariables>;
export const LikeDocument = gql`
    mutation Like($postId: Float!) {
  like(postId: $postId) {
    id
    owner {
      id
      username
      profileImageId
      first
      last
    }
    media
    title
    artist
    link
    type
    visibility
    removed
    likes {
      id
      owner {
        id
        profileImageId
        username
        first
        last
      }
      createdAt
    }
  }
}
    `;
export type LikeMutationFn = Apollo.MutationFunction<LikeMutation, LikeMutationVariables>;

/**
 * __useLikeMutation__
 *
 * To run a mutation, you first call `useLikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [likeMutation, { data, loading, error }] = useLikeMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useLikeMutation(baseOptions?: Apollo.MutationHookOptions<LikeMutation, LikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LikeMutation, LikeMutationVariables>(LikeDocument, options);
      }
export type LikeMutationHookResult = ReturnType<typeof useLikeMutation>;
export type LikeMutationResult = Apollo.MutationResult<LikeMutation>;
export type LikeMutationOptions = Apollo.BaseMutationOptions<LikeMutation, LikeMutationVariables>;
export const LikedByCurrentProfileDocument = gql`
    query LikedByCurrentProfile($profileId: Float!, $postId: Float!) {
  likedByCurrentProfile(profileId: $profileId, postId: $postId)
}
    `;

/**
 * __useLikedByCurrentProfileQuery__
 *
 * To run a query within a React component, call `useLikedByCurrentProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useLikedByCurrentProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLikedByCurrentProfileQuery({
 *   variables: {
 *      profileId: // value for 'profileId'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useLikedByCurrentProfileQuery(baseOptions: Apollo.QueryHookOptions<LikedByCurrentProfileQuery, LikedByCurrentProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LikedByCurrentProfileQuery, LikedByCurrentProfileQueryVariables>(LikedByCurrentProfileDocument, options);
      }
export function useLikedByCurrentProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LikedByCurrentProfileQuery, LikedByCurrentProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LikedByCurrentProfileQuery, LikedByCurrentProfileQueryVariables>(LikedByCurrentProfileDocument, options);
        }
export type LikedByCurrentProfileQueryHookResult = ReturnType<typeof useLikedByCurrentProfileQuery>;
export type LikedByCurrentProfileLazyQueryHookResult = ReturnType<typeof useLikedByCurrentProfileLazyQuery>;
export type LikedByCurrentProfileQueryResult = Apollo.QueryResult<LikedByCurrentProfileQuery, LikedByCurrentProfileQueryVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    email
    admin
    invitations
    profile {
      id
      username
      first
      last
      profileImageId
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    admin
    invitations
    profile {
      id
      first
      last
      username
      profileImageId
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const ReaddDocument = gql`
    mutation Readd($postId: Float!) {
  readd(postId: $postId) {
    res
    message
    post {
      id
      owner {
        id
        username
        profileImageId
        first
        last
      }
      media
      title
      artist
      link
      type
      visibility
      removed
      numberOfLikes
      createdAt
    }
  }
}
    `;
export type ReaddMutationFn = Apollo.MutationFunction<ReaddMutation, ReaddMutationVariables>;

/**
 * __useReaddMutation__
 *
 * To run a mutation, you first call `useReaddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReaddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readdMutation, { data, loading, error }] = useReaddMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useReaddMutation(baseOptions?: Apollo.MutationHookOptions<ReaddMutation, ReaddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReaddMutation, ReaddMutationVariables>(ReaddDocument, options);
      }
export type ReaddMutationHookResult = ReturnType<typeof useReaddMutation>;
export type ReaddMutationResult = Apollo.MutationResult<ReaddMutation>;
export type ReaddMutationOptions = Apollo.BaseMutationOptions<ReaddMutation, ReaddMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $username: String!, $phone: String!, $verificationCode: String!, $first: String!, $last: String!, $bio: String!, $profileImage: String!, $ogProfileImage: String!) {
  register(
    email: $email
    password: $password
    username: $username
    phone: $phone
    first: $first
    last: $last
    verificationCode: $verificationCode
    bio: $bio
    profileImage: $profileImage
    ogProfileImage: $ogProfileImage
  ) {
    res
    message
    user {
      id
      email
      profile {
        first
        last
        username
        profileImageId
      }
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      username: // value for 'username'
 *      phone: // value for 'phone'
 *      verificationCode: // value for 'verificationCode'
 *      first: // value for 'first'
 *      last: // value for 'last'
 *      bio: // value for 'bio'
 *      profileImage: // value for 'profileImage'
 *      ogProfileImage: // value for 'ogProfileImage'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RemoveDocument = gql`
    mutation Remove($postId: Float!) {
  remove(postId: $postId) {
    res
    message
    post {
      id
      owner {
        id
        username
        profileImageId
        first
        last
      }
      media
      title
      artist
      link
      type
      visibility
      removed
      numberOfLikes
      createdAt
    }
  }
}
    `;
export type RemoveMutationFn = Apollo.MutationFunction<RemoveMutation, RemoveMutationVariables>;

/**
 * __useRemoveMutation__
 *
 * To run a mutation, you first call `useRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMutation, { data, loading, error }] = useRemoveMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useRemoveMutation(baseOptions?: Apollo.MutationHookOptions<RemoveMutation, RemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveMutation, RemoveMutationVariables>(RemoveDocument, options);
      }
export type RemoveMutationHookResult = ReturnType<typeof useRemoveMutation>;
export type RemoveMutationResult = Apollo.MutationResult<RemoveMutation>;
export type RemoveMutationOptions = Apollo.BaseMutationOptions<RemoveMutation, RemoveMutationVariables>;
export const SendAdminInvitationDocument = gql`
    mutation SendAdminInvitation($number: String!, $code: String!) {
  sendAdminInvitation(number: $number, code: $code) {
    res
    message
    invitation {
      id
      ownerId
      number
      verificationCode
      active
      createdAt
    }
  }
}
    `;
export type SendAdminInvitationMutationFn = Apollo.MutationFunction<SendAdminInvitationMutation, SendAdminInvitationMutationVariables>;

/**
 * __useSendAdminInvitationMutation__
 *
 * To run a mutation, you first call `useSendAdminInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendAdminInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendAdminInvitationMutation, { data, loading, error }] = useSendAdminInvitationMutation({
 *   variables: {
 *      number: // value for 'number'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useSendAdminInvitationMutation(baseOptions?: Apollo.MutationHookOptions<SendAdminInvitationMutation, SendAdminInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendAdminInvitationMutation, SendAdminInvitationMutationVariables>(SendAdminInvitationDocument, options);
      }
export type SendAdminInvitationMutationHookResult = ReturnType<typeof useSendAdminInvitationMutation>;
export type SendAdminInvitationMutationResult = Apollo.MutationResult<SendAdminInvitationMutation>;
export type SendAdminInvitationMutationOptions = Apollo.BaseMutationOptions<SendAdminInvitationMutation, SendAdminInvitationMutationVariables>;
export const SendInvitationDocument = gql`
    mutation SendInvitation($number: String!) {
  sendInvitation(number: $number) {
    res
    message
    invitation {
      id
      ownerId
      number
      verificationCode
      active
      createdAt
    }
    user {
      id
      email
      admin
      invitations
      profile {
        id
        first
        last
        username
        profileImageId
      }
    }
  }
}
    `;
export type SendInvitationMutationFn = Apollo.MutationFunction<SendInvitationMutation, SendInvitationMutationVariables>;

/**
 * __useSendInvitationMutation__
 *
 * To run a mutation, you first call `useSendInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendInvitationMutation, { data, loading, error }] = useSendInvitationMutation({
 *   variables: {
 *      number: // value for 'number'
 *   },
 * });
 */
export function useSendInvitationMutation(baseOptions?: Apollo.MutationHookOptions<SendInvitationMutation, SendInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendInvitationMutation, SendInvitationMutationVariables>(SendInvitationDocument, options);
      }
export type SendInvitationMutationHookResult = ReturnType<typeof useSendInvitationMutation>;
export type SendInvitationMutationResult = Apollo.MutationResult<SendInvitationMutation>;
export type SendInvitationMutationOptions = Apollo.BaseMutationOptions<SendInvitationMutation, SendInvitationMutationVariables>;
export const SubscribeDocument = gql`
    mutation Subscribe($userIdWhoIsBeingFollowed: Float!) {
  subscribe(userIdWhoIsBeingFollowed: $userIdWhoIsBeingFollowed) {
    id
    userId
    followingId
    active
  }
}
    `;
export type SubscribeMutationFn = Apollo.MutationFunction<SubscribeMutation, SubscribeMutationVariables>;

/**
 * __useSubscribeMutation__
 *
 * To run a mutation, you first call `useSubscribeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubscribeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [subscribeMutation, { data, loading, error }] = useSubscribeMutation({
 *   variables: {
 *      userIdWhoIsBeingFollowed: // value for 'userIdWhoIsBeingFollowed'
 *   },
 * });
 */
export function useSubscribeMutation(baseOptions?: Apollo.MutationHookOptions<SubscribeMutation, SubscribeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SubscribeMutation, SubscribeMutationVariables>(SubscribeDocument, options);
      }
export type SubscribeMutationHookResult = ReturnType<typeof useSubscribeMutation>;
export type SubscribeMutationResult = Apollo.MutationResult<SubscribeMutation>;
export type SubscribeMutationOptions = Apollo.BaseMutationOptions<SubscribeMutation, SubscribeMutationVariables>;
export const UnlikeDocument = gql`
    mutation Unlike($postId: Float!) {
  unlike(postId: $postId) {
    id
    owner {
      id
      username
      profileImageId
      first
      last
    }
    media
    title
    artist
    link
    type
    visibility
    removed
    likes {
      id
      owner {
        id
        profileImageId
        username
        first
        last
      }
      createdAt
    }
  }
}
    `;
export type UnlikeMutationFn = Apollo.MutationFunction<UnlikeMutation, UnlikeMutationVariables>;

/**
 * __useUnlikeMutation__
 *
 * To run a mutation, you first call `useUnlikeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlikeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlikeMutation, { data, loading, error }] = useUnlikeMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useUnlikeMutation(baseOptions?: Apollo.MutationHookOptions<UnlikeMutation, UnlikeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnlikeMutation, UnlikeMutationVariables>(UnlikeDocument, options);
      }
export type UnlikeMutationHookResult = ReturnType<typeof useUnlikeMutation>;
export type UnlikeMutationResult = Apollo.MutationResult<UnlikeMutation>;
export type UnlikeMutationOptions = Apollo.BaseMutationOptions<UnlikeMutation, UnlikeMutationVariables>;
export const UnSubscribeDocument = gql`
    mutation UnSubscribe($userId: Float!) {
  unSubscribe(userId: $userId) {
    id
    userId
    followingId
    active
  }
}
    `;
export type UnSubscribeMutationFn = Apollo.MutationFunction<UnSubscribeMutation, UnSubscribeMutationVariables>;

/**
 * __useUnSubscribeMutation__
 *
 * To run a mutation, you first call `useUnSubscribeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnSubscribeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unSubscribeMutation, { data, loading, error }] = useUnSubscribeMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUnSubscribeMutation(baseOptions?: Apollo.MutationHookOptions<UnSubscribeMutation, UnSubscribeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnSubscribeMutation, UnSubscribeMutationVariables>(UnSubscribeDocument, options);
      }
export type UnSubscribeMutationHookResult = ReturnType<typeof useUnSubscribeMutation>;
export type UnSubscribeMutationResult = Apollo.MutationResult<UnSubscribeMutation>;
export type UnSubscribeMutationOptions = Apollo.BaseMutationOptions<UnSubscribeMutation, UnSubscribeMutationVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    id
    email
    profile {
      first
      last
      username
      profileImageId
      ogProfileImageId
    }
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const VisibleDocument = gql`
    mutation Visible($postId: Float!) {
  visible(postId: $postId) {
    res
    message
    post {
      id
      owner {
        id
        username
        profileImageId
        first
        last
      }
      media
      title
      artist
      link
      type
      visibility
      removed
      numberOfLikes
      createdAt
    }
  }
}
    `;
export type VisibleMutationFn = Apollo.MutationFunction<VisibleMutation, VisibleMutationVariables>;

/**
 * __useVisibleMutation__
 *
 * To run a mutation, you first call `useVisibleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVisibleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [visibleMutation, { data, loading, error }] = useVisibleMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useVisibleMutation(baseOptions?: Apollo.MutationHookOptions<VisibleMutation, VisibleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VisibleMutation, VisibleMutationVariables>(VisibleDocument, options);
      }
export type VisibleMutationHookResult = ReturnType<typeof useVisibleMutation>;
export type VisibleMutationResult = Apollo.MutationResult<VisibleMutation>;
export type VisibleMutationOptions = Apollo.BaseMutationOptions<VisibleMutation, VisibleMutationVariables>;