import { User } from './entity/User';
import { sign } from 'jsonwebtoken';

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, 'kasdakljsdnasjk', {
    expiresIn: '15m'
  });
};

export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id }, 'jaksndaksjndaksj', {
    expiresIn: '30d'
  });
};
