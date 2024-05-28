import { Request, Response } from 'express';
import User from '../models/User';

export const getUserProfile = async (req: Request, res: Response) => {
  res.json(req.params);
};

export const getUserHistory = async (req: Request, res: Response) => {
  const user: any = await User.findById(req.params._id);
  res.json({
    results: user.history,
    totalDocs: user.history.length,
    hasNext: false,
    hasPrev: false,
  });
};

export const getUserFavorites = async (req: Request, res: Response) => {
  const user: any = await User.findById(req.params._id);
  res.json({
    results: user.favorites.map((word: any) => ({ word, added: new Date() })),
    totalDocs: user.favorites.length,
    hasNext: false,
    hasPrev: false,
  });
};
