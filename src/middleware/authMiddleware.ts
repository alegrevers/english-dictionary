import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

export const authMiddleware = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = await User.findById(decoded.id);
    next();

    return req.user
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });

    return error
  }
};
