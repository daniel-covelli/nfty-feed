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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};


export type EditResponse = {
  __typename?: 'EditResponse';
  res: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type GenericResponse = {
  __typename?: 'GenericResponse';
  res: Scalars['Boolean'];
  message: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponse;
  checkEmail: GenericResponse;
  addProfilePicture: Scalars['Boolean'];
  register: RegisterResponse;
  revokeRefreshTokensForUser: Scalars['Boolean'];
  logout: Scalars['Boolean'];
  editProfile: EditResponse;
  subscribe: Subscription;
  unSubscribe: Subscription;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationCheckEmailArgs = {
  email: Scalars['String'];
};


export type MutationAddProfilePictureArgs = {
  picture: Scalars['Upload'];
};


export type MutationRegisterArgs = {
  ogProfileImage: Scalars['String'];
  profileImage: Scalars['String'];
  bio: Scalars['String'];
  last: Scalars['String'];
  first: Scalars['String'];
  phone: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};


export type MutationRevokeRefreshTokensForUserArgs = {
  userId: Scalars['Int'];
};


export type MutationEditProfileArgs = {
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
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  bye: Scalars['String'];
  users: Array<User>;
  me?: Maybe<User>;
  getUser?: Maybe<UserResponse>;
  subscriptions: Array<Subscription>;
  getActiveFollowers: Array<Subscription>;
  getActiveFollowing: Array<Subscription>;
  existingSubscription: Scalars['Boolean'];
};


export type QueryGetUserArgs = {
  path: Scalars['String'];
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
  createdAt: Scalars['DateTime'];
};


export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  email?: Maybe<Scalars['String']>;
  profile?: Maybe<Profile>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  me: Scalars['Boolean'];
  user: User;
};

export type ByeQueryVariables = Exact<{ [key: string]: never; }>;


export type ByeQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'bye'>
);

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

export type EditProfileMutationVariables = Exact<{
  username: Scalars['String'];
  first: Scalars['String'];
  last: Scalars['String'];
  bio: Scalars['String'];
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
        & Pick<Profile, 'id' | 'username' | 'phone' | 'first' | 'last' | 'bio' | 'profileImageId'>
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
        & Pick<Profile, 'id' | 'username' | 'phone' | 'first' | 'last' | 'bio' | 'profileImageId'>
      )> }
    ) }
  )> }
);

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'hello'>
);

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
      & { profile?: Maybe<(
        { __typename?: 'Profile' }
        & Pick<Profile, 'username' | 'first' | 'last'>
      )> }
    ) }
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
    & Pick<User, 'id' | 'email'>
    & { profile?: Maybe<(
      { __typename?: 'Profile' }
      & Pick<Profile, 'first' | 'last' | 'username'>
    )> }
  )> }
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
  phone: Scalars['String'];
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


export const ByeDocument = gql`
    query Bye {
  bye
}
    `;

/**
 * __useByeQuery__
 *
 * To run a query within a React component, call `useByeQuery` and pass it any options that fit your needs.
 * When your component renders, `useByeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useByeQuery({
 *   variables: {
 *   },
 * });
 */
export function useByeQuery(baseOptions?: Apollo.QueryHookOptions<ByeQuery, ByeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ByeQuery, ByeQueryVariables>(ByeDocument, options);
      }
export function useByeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ByeQuery, ByeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ByeQuery, ByeQueryVariables>(ByeDocument, options);
        }
export type ByeQueryHookResult = ReturnType<typeof useByeQuery>;
export type ByeLazyQueryHookResult = ReturnType<typeof useByeLazyQuery>;
export type ByeQueryResult = Apollo.QueryResult<ByeQuery, ByeQueryVariables>;
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
export const EditProfileDocument = gql`
    mutation EditProfile($username: String!, $first: String!, $last: String!, $bio: String!) {
  editProfile(username: $username, first: $first, last: $last, bio: $bio) {
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
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    user {
      id
      email
      profile {
        username
        first
        last
      }
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
    profile {
      first
      last
      username
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
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $username: String!, $phone: String!, $first: String!, $last: String!, $bio: String!, $profileImage: String!, $ogProfileImage: String!) {
  register(
    email: $email
    password: $password
    username: $username
    phone: $phone
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