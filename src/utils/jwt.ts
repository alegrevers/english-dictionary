import { IUser } from '@src/interfaces/IUser';
import jwt from 'jsonwebtoken';

export const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
};
